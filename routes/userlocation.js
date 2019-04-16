const express = require('express');
const router = express.Router();
const userlocations = require('../models').userlocations;
const auth = require('../authentication/auth')();
const userLocationBody = require('../dtos/userlocations').userLocation;
const tasks = require('../models').tasks;
const reqBodyValidate = require('../utils/req_generic_validations')
  .reqBodyValidation;
const sequelize = require('sequelize');
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers')
  .asyncErrorHandler;
const moment = require('moment');
const schedule = require('node-schedule');
const fcmtokens = require('../models').fcmtokens;
const notifications = require('../models').notifications;
const notificationusers = require('../models').notificationusers;
const { update } = require('tcomb');
const { sendMessageToUsers } = require('../notifications/fcm');
const { grtOrEqual, lessOrEqual } = require('../utils/sequelize_utils');
const GEO_FENCE_DISTANCE = 500;

const {
  getRelatedUsers
} = require('../utils/user');
function distance(lat1, lon1, lat2, lon2, unit) {
  let radlat1 = Math.PI * lat1 / 180;
  let radlat2 = Math.PI * lat2 / 180;
  let theta = lon1 - lon2;
  let radtheta = Math.PI * theta / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == 'K') {
    dist = dist * 1.609344;
  }
  if (unit == 'N') {
    dist = dist * 0.8684;
  }
  return dist;
}

router.get('/', auth.authenticate(), async (req, res, next) => {
  const limit = parseInt(req.query.pageSize);
  return res.json(
    await userlocations.findAll({
      attributes: ['id', 'userId', 'latitude', 'longitude'],
      limit: limit,
      offset: parseInt(limit * req.query.pageIndex)
    })
  );
});

router.post(
  '/',
  [auth.authenticate(), reqBodyValidate(userLocationBody)],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const location = await userlocations.create({
      userId: req.user.userId,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
      isActive: true
    });
    let userId = req.user.userId;
    let lnt = req.body.longitude;
    let lat = req.body.latitude;
    const today = moment()
      .format('YYYY-MM-DD')
      .toString();
    let whereStatement = {};
    whereStatement = {
      stage: {
        $in: [`Ongoing`, 'Closed']
      },
      isActive: true,
      scheduledDate: today,
      $or: [
        {
          userId: req.user.userId
        },
        {
          assignTo: req.user.userId
        },
      ],
    };
    const getTa = await tasks.findAll({
      attributes: [
        'id',
        'taskTypeId',
        'taskName',
        'taskNumber',
        'stage',
        'opportunityId',
        [
          sequelize.literal(
            '(Select "opportunitNumber" from opportunities where opportunities.id = tasks."opportunityId")'
          ),
          'opportunitNumber',
        ],
        [
          sequelize.literal(
            '(Select name from opportunities where opportunities.id = tasks."opportunityId")'
          ),
          'opportunitName',
        ],
        'customerId',
        [
          sequelize.literal(
            '(Select name from customers where customers.id = tasks."customerId")'
          ),
          'customerName',
        ],
        'userId',
        [
          sequelize.literal(
            '(Select concat("firstName", "lastName")  from "Users" where "Users".id = tasks."userId")'
          ),
          'userName',
        ],
        'assignTo',
        [
          sequelize.literal(
            '(Select concat("firstName", "lastName")  from "Users" where "Users".id = tasks."assignTo")'
          ),
          'assignToName',
        ],
        'scheduledDate',
        'scheduledTime',
        'location',
        'longitude',
        'latitude',
        'taskDescription',
        'checkStatus',
        'status',
        'reason',
        'reasonDescription',
        'checkInTime',
        'checkOutDate',
        'checkOutTime',
        'updatedBy',
        'updatedAt',
        'createdAt',
      ],
      where: whereStatement,

    });
    const dataToJson = getTa.map(x =>
      x.get({
        plain: true
      })
    );
    let t = dataToJson
      .map(x => ({
        ...x,
        distance: distance(
          x.latitude,
          x.longitude,
          lat,
          lnt,
          'K'
        )
      }))
      .filter(t => t.id);

    const data = t.map(x => ({
      id: x.id,
      taskNumber: x.taskNumber,
      taskName: x.taskName,
      stage: x.stage,
      opportunityId: x.opportunityId,
      opportunitNumber: x.opportunitNumber,
      opportunitName: x.opportunitName,
      scheduledDate: x.scheduledDate,
      scheduledTime: x.scheduledTime,
      reason: x.reason,
      location: x.location,
      longitude: x.longitude,
      latitude: x.latitude,
      checkStatus: x.checkStatus,
      status: x.status,
      checkInTime: x.checkInTime,
      checkOutTime: x.checkOutTime,
      assignedTo: x.assignedTo,
      distance: x.distance * 1000
    }));

    let scheduledTimeData = data.filter(
      it =>
        new Date('1970/01/01 ' + it.scheduledTime) >=
        new Date('1970/01/01 ', moment().format('hh:mm:ss'))
    );

    let data1 = scheduledTimeData.sort((a, b) => {
      return (
        new Date('1970/01/01 ' + a.scheduledTime) -
        new Date('1970/01/01 ' + b.scheduledTime)
      );
    });
    console.log(
      data.map(it => it.taskName) +
      'Task Name Distnace' +
      data.map(it => it.taskName)
    );

    let tasksToBeNotifiedToSameUser = data
      .filter(
        it =>
          it.distance <= GEO_FENCE_DISTANCE &&
          it.status != 2
        // && it.createdBy === it.assignTaskId
      )
      .map(x => {
        return {
          type: x.status === 0 ? 'task_checkin' : 'task_checkout',
          typeid: x.id,
          title: x.status === 0 ? 'Check-In' : 'Check-out',
          message:
            x.status === 0
              ? 'You have to Check-in for the task ' + x.taskName
              : 'You have forgotten to check-out from the task ' + x.taskName + ' location',
          createdBy: req.user.userId,
          updatedBy: req.user.userId,
          isRead: false,
          isActive: true,
          notificationusers: [
            {
              receiverId: x.assignedTo,
              isRead: false,
              isActive: true
            }
          ]
        };
      });

    let createdNotificationsforSameUser =
      tasksToBeNotifiedToSameUser.length > 0
        ? await notifications.bulkCreate(tasksToBeNotifiedToSameUser, {
          include: [notificationusers]
        })
        : [];


    if (createdNotificationsforSameUser.length > 0) {
      const notificatUsers = await notificationusers.bulkCreate(
        createdNotificationsforSameUser.map(x => {
          return {
            notificationId: x.id,
            receiverId: x.assignedTo,
            isRead: false,
            isActive: true
          };
        })
      );
      const sameUserfcmTokens = await fcmtokens.findAll({
        attributes: ['fcmToken', 'userId'],
        where: {
          $and: [
            {
              userId: {
                $in: tasksToBeNotifiedToSameUser.map(x => x.assignedTo)
              }
            },
            sequelize.where(
              sequelize.fn('DATE', sequelize.col('createdAt')),
              grtOrEqual(
                moment()
                  .subtract(1, 'days')
                  .format('YYYY-MM-DD')
              )
            ),
            { fcmToken: { $ne: null } }
          ]
        },
        raw: true
      });
      for (let x = 0; x < createdNotificationsforSameUser.length; x++) {
        const tkns = sameUserfcmTokens.filter(
          x => x.userId === createdNotificationsforSameUser[x].assignedTo
        );
        if (tkns.length > 0) {
          await sendMessageToUsers(tkns.map(x => x.fcmToken), {
            id: createdNotificationsforSameUser[x].id,
            title: createdNotificationsforSameUser[x].title,
            type: createdNotificationsforSameUser[x].type,
            typeid: createdNotificationsforSameUser[x].typeid,
            sender_id: req.user.userId,
            receiver_id: createdNotificationsforSameUser[x].assignedTo,
            message: createdNotificationsforSameUser[x].message,
            with_image: 'No',
            dateTime: createdNotificationsforSameUser[x].createdAt,
            image: ''
          });
        }
      }
    }

    //   });
    res.json({
      message: 'OK',
      userId: req.user.userId,
      userName: req.user.userName
    });
  })
);

router.get(
  '/users',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const userData = await getRelatedUsers(req.user, [
      "id",
      "userName"
    ]);
    const userDataResult = update(userData, {
      $push: [{
        id: req.user.userId,
        userName: req.user.userName
      }]
    })
    console.log(req.user)
    let currentDate = moment(new Date()).format('YYYY-MM-DD');
    const data = await userlocations.findAll({
      attributes: [
        'id',
        'userId',
        [
          sequelize.literal(
            '(Select "email"  from "Users" where "Users".id = userlocations."userId")'
          ),
          'email',
        ],
        [
          sequelize.literal(
            '(Select "userName"  from "Users" where "Users".id = userlocations."userId")'
          ),
          'userName',
        ],
        [
          sequelize.literal(
            '(Select "userRole"  from "Users" where "Users".id = userlocations."userId")'
          ),
          'userRole',
        ],
        'longitude',
        'latitude',
        'createdAt'
      ],
      where: {
        $and: [
          { isActive: true },
          sequelize.where(
            sequelize.fn('date', sequelize.col('createdAt')),
            '<=',
            `${currentDate}`
          )
        ],
        $or: [
          {
            userId: {
              $in: userDataResult.map(x => x.id),
            }
          },
        ],
      },
      order: [['createdAt', 'DESC']]
    });

    const t = data.map(x => x.get({ plain: true }));
    var res1 = [];
    for (let obj of t.sort((x, y) => y.id - x.id)) {
      if (!res1.find(x => x.userId === obj.userId)) res1.push(obj);
    }
    return res.json(res1);
  })
);

router.get(
  '/tracking',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const lastLocation =
      req.query.lastLocation != "null" &&
      req.query.lastLocation != "" &&
      req.query.lastLocation != undefined;
    
    let currentDate = moment(new Date()).format('YYYY-MM-DD');
    const data = await userlocations.findAll({
      attributes: [
        'id',
        'userId',
        'longitude',
        'latitude',
        'createdAt'
      ],
      where: {
        $and: [
          { isActive: true },
          sequelize.where(
            sequelize.fn('date', sequelize.col('createdAt')),
            '>=',
            `${currentDate}`
          )
        ],
        $or: [
          {
            userId: req.query.userId
          },
        ],
      },
      order: [['createdAt', 'DESC']]
    });

    const t = data.map(x => x.get({ plain: true }));
    var res1 = [];
    for (let obj of t.sort((x, y) => y.id - x.id)) {
      if (lastLocation) {
        if (!res1.find(x => x.userId === obj.userId)) res1.push(obj);
      } else {
        res1.push(obj);
      }
    }
    return res.json(res1.map(x => ({latitude : x.latitude,longitude: x.longitude,createdAt:x.createdAt})));
  })
);

module.exports = router;
