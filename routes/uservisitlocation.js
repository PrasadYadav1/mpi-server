const express = require("express");
const router = express.Router();
const uservisitlocations = require("../models").uservisitlocations;
const auth = require("../authentication/auth")();
const pagination = require("../dtos/pagination").Pagination;
const reqQueryValidate = require("../utils/req_generic_validations")
  .reqqueryvalidation;
const userLocationBody = require("../dtos/uservisitlocations")
  .userVisitLocation;
const tasks = require("../models").tasks;
const reqBodyValidate = require("../utils/req_generic_validations")
  .reqBodyValidation;
const sequelize = require("sequelize");
const asyncErrorHandlerMiddleWare = require("../utils/async_custom_handlers")
  .asyncErrorHandler;
const moment = require("moment");
const schedule = require("node-schedule");
const fcmtokens = require("../models").fcmtokens;
const notifications = require("../models").notifications;
const notificationusers = require("../models").notificationusers;
const { update } = require("tcomb");
const { sendMessageToUsers } = require("../notifications/fcm");
const { grtOrEqual, lessOrEqual } = require("../utils/sequelize_utils");
const GEO_FENCE_DISTANCE = 500;

const { getRelatedUsers } = require("../utils/user");
function distance(lat1, lon1, lat2, lon2, unit) {
  let radlat1 = (Math.PI * lat1) / 180;
  let radlat2 = (Math.PI * lat2) / 180;
  let theta = lon1 - lon2;
  let radtheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == "K") {
    dist = dist * 1.609344;
  }
  if (unit == "N") {
    dist = dist * 0.8684;
  }
  return dist;
}

router.get("/", auth.authenticate(), async (req, res, next) => {
  const limit = parseInt(req.query.pageSize);
  return res.json(
    await uservisitlocations.findAll({
      attributes: [
        "id",
        "warehouseId",
        ,
        "visit",
        [
          sequelize.literal(
            `( select "firstName" || ' ' || "lastName"  from "users" AS u where u.id = uservisitlocations."warehouseId")`
          ),
          "salesAgentName"
        ],
        [
          sequelize.literal(
            '(select name from warehouses AS wa where wa.id = "uservisitlocations"."warehouseId")'
          ),
          "outletName"
        ],
        "latitude",
        "longitude"
      ],
      order: [["updatedAt", "DESC"]],
      limit: limit,
      offset: parseInt(limit * req.query.pageIndex)
    })
  );
});

router.post(
  "/",
  [auth.authenticate(), reqBodyValidate(userLocationBody)],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const uservisitlocationData = await uservisitlocations.create({
      userId: req.user.userId,
      warehouseId: req.body.warehouseId,
      visit: req.body.visit,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
      isActive: true
    });
    res.json(uservisitlocationData);
  })
);

module.exports = router;
