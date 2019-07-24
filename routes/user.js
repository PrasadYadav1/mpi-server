const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const userDto = require('../dtos/user');
const users = require('../models').users;
const useractivities = require('../models').useractivities;
const multer = require("multer");
var uuid = require("uuid/v1");
const reqQueryValidate = require('../utils/req_generic_validations').reqqueryvalidation;
const reqpathNewvalidation = require('../utils/req_generic_validations').reqpathNewvalidation;
const reqBodyValidation = require('../utils/req_generic_validations').reqBodyValidation;
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers').asyncErrorHandler;
const userUtils = require('../utils/user');
const authUtils = require('../utils/authorization');
const userlocations = require('../models').userlocations;
const moment = require('moment');
const { groupByArrayOfObjects } = require('../utils/common');
const db = require("../config/config")["development"];
const sequlizeUtils = require('../utils/sequelize_utils');
const { validateRequest } = require('../utils/validations');
const { userPost, userType, userPathParm, managerAssign, userUpdateBody, userTypeQuery } = require('../dtos/user');
const { getJavascriptData } = require('../utils/common');
const bcrypt = require('bcryptjs');
const { verifyRoles } = require('../utils/authorization');

router.get(
    "/",
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const propertyNameDefault =
            req.query.propertyName === undefined ||
            req.query.propertyName === "null" ||
            req.query.propertyName === "";

        const propertyValueDefault =
            req.query.propertyValue === undefined ||
            req.query.propertyValue === "null" ||
            req.query.propertyValue === "";
        const propertyNameData =
            req.query.propertyName != undefined &&
            req.query.propertyName != "null" &&
            req.query.propertyName != "";
        const propertyValueData =
            req.query.propertyValue != undefined &&
            req.query.propertyValue != "null" &&
            req.query.propertyValue != "";
        const propertyName = req.query.propertyName;
        const result =
            (propertyNameDefault || propertyNameData) && propertyValueDefault;
        const result1 = propertyNameData && propertyValueData;
        let whereStatement = {};
        let selectLiteral = (req.user.userRole === 'Admin') ? `select id from "users" where "userRole" != 'Admin'`
            : `select id from "users" where "headUserId" in (select id from "users" where "headUserId" = ${req.user.userId})`

        if (result) {
            whereStatement = {
                isActive: true,
                $or: [
                    {
                        id: {
                            $in: [
                                sequelize.literal(selectLiteral)
                            ]
                        }
                    },
                    {
                        id: {
                            $in: [
                                sequelize.literal(
                                    'select id from "users" where "headUserId" =' +
                                    +
                                    req.user.userId
                                )
                            ]
                        }
                    }
                ]
            };
        } else if (result1) {
            {
                whereStatement = {
                    isActive: true,
                    $or: [
                        {
                            id: {
                                $in: [
                                    sequelize.literal(selectLiteral)
                                ]
                            }
                        },
                        {
                            id: {
                                $in: [
                                    sequelize.literal(
                                        'select id from "users" where "headUserId" =' +
                                        +
                                        req.user.userId
                                    )
                                ]
                            }
                        }
                    ],
                    [propertyName]: {
                        $like: `%${req.query.propertyValue}%`
                    }
                }
            }
        }
        const data = await users.findAll({
            attributes: [
                "id",
                "userName",
                "firstName",
                "lastName",
                "email",
                "userRole",
                "designation",
                "avatar",
                "mobileNumber",
                [sequelize.literal(`(SELECT "firstName" || ' ' || "lastName" from
                 "users" WHERE "users"."id" = "users"."headUserId")`), 'supervisior'],
                [sequelize.literal(`(SELECT "amount" from "targetrevenue" WHERE
                 "targetrevenue"."assigneeId" = "users"."id" AND "targetrevenue"."year" = ${moment().year()}
                 Order By "updatedAt" DESC limit 1)`)
                    , 'target'],
                "headUserId",
                "dateOfJoin",
                "warehouseId",
                [sequelize.literal(`(select name from warehouses where id = users."warehouseId")`), 'warehouseName'],
                "branchId",
                [sequelize.literal(`(select name from warehouses where id = users."branchId")`), 'branchName'],
                "customerIds",
                [sequelize.literal(`(select Array(select name from customers where id = ANY (users."customerIds")))`), 'customerNames']
            ],
            where: whereStatement,
            order: [["createdAt", "DESC"]],
        });
        return res.json(data);
    })
);

router.get('/locations', [auth.authenticate()],
    reqQueryValidate(userDto.usersearch),
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        if (!userUtils.verifyRole(req.user.userRole, 'ZonalManager'))
            return res.status(403).json({ message: 'you dont have permission to access this resource' });
        const searchByRequired = req.query && req.query.searchBy;
        if (searchByRequired && !req.query.searchByValue)
            return res.status(400).json({ message: 'searchByValue query string missing' });
        const usersData = (req.query && req.query.searchBy) ?
            await userUtils.getRelatedusersBySearch(req.user, [
                "id",
                "userName",
                "firstName",
                "lastName",
                "avatar",
                "email",
                "userRole"],
                req.query.searchBy,
                req.query.searchByValue) :
            await userUtils.getRelatedusers(req.user, [
                "id",
                "userName",
                "firstName",
                "lastName",
                "avatar",
                "email",
                "userRole"
            ]);
        let currentDate = moment(new Date()).format('YYYY-MM-DD');
        const userLocations = groupByArrayOfObjects(await userlocations.findAll({
            attributes: [
                [sequelize.literal('DISTINCT ON ("userId") "userId"'), 'userId'],
                'id',
                'longitude',
                'latitude',
                'createdAt'
            ],
            where: {
                $and: [
                    { isActive: true },
                    sequelize.where(
                        sequelize.fn('date', sequelize.col('createdAt')),
                        '=',
                        `${currentDate}`
                    ),
                    { userId: { $in: usersData.map(x => x.id) } }
                ]
            },
            order: [
                ['userId', 'DESC'],
                ['createdAt', 'DESC']
            ],
            raw: true
        }), 'userId');
        return res.status(200).json(usersData.map((userObj) => {
            const locations = userLocations[userObj.id];
            return { ...userObj, locations: locations ? locations : [] }
        }));
    }));

router.get('/:userId/locations', [auth.authenticate()],
    reqpathNewvalidation(userDto.userPathParm),
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        if (!verifyRoles(['ZonalManager', 'RegionalManager', 'Admin'], req.user.userRole))
            return res.status(403).json({ message: 'you dont have permission to access this resource' });
        const userData = (req.user.userRole === 'Admin') ? { id: parseInt(req.params.userId) }
            : await userUtils.getUserUnderAManager(
                req.user.userId,
                [
                    "id",
                    "userName",
                    "firstName",
                    "lastName",
                    "avatar",
                    "email",
                    "userRole"
                ],
                req.params.userId
            );
        if (!userData) return res.status(404).json({ message: "user not found" });
        let currentDate = moment(new Date()).format('YYYY-MM-DD');
        const userLocations = await userlocations.findAll({
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
                        '=',
                        `${currentDate}`
                    ),
                    { userId: userData.id }
                ]
            },
            raw: true
        });
        return res.status(200).json({
            ...userData,
            locations: userLocations
        });
    }));

router.get('/:userId/last/location', [auth.authenticate()],
    reqpathNewvalidation(userDto.userPathParm),
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        if (!userUtils.verifyRole(req.user.userRole, 'ZonalManager'))
            return res.status(403).json({ message: 'you dont have permission to access this resource' });
        const userData = await userUtils.getUserUnderAManager(
            req.user.userId,
            [
                "id",
                "userName",
            ],
            req.params.userId
        );
        if (!userData) return res.status(404).json({ message: "user not found" });
        const userLocation = await userlocations.findOne({
            attributes: [
                'id',
                'longitude',
                'latitude',
                'createdAt'
            ],
            where: {
                $and: [
                    { isActive: true },
                    { userId: userData.id }
                ]
            },
            limit: 1,
            order: [
                ['createdAt', 'DESC']
            ],
            raw: true
        });
        if (!userLocation) return res.status(404).json({ message: "last location not found" });
        return res.status(200).json(userLocation);
    }));

router.get('/lastLocations', [auth.authenticate()],
    // reqQueryValidate(userDto.usersearch),
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        if (!authUtils.verifyRoles(['ZonalManager', 'RegionalManager', 'Admin'], req.user.userRole))
            return res.status(403).json({ message: 'you dont have permission to access this resource' });
        const searchByRequired = req.query && req.query.searchBy;
        if (searchByRequired && !req.query.searchByValue)
            return res.status(400).json({ message: 'searchByValue query string missing' });
        const dataBase = sequlizeUtils.getSqlize(db);
        const filters = (req.user.userRole === 'Admin') ? {
            query: '', replacements: null
        } : {
                replacements: {
                    userId: req.user.userId,
                },
                query: 'where "users"."headUserId" = :userId'
            }
        const data = await dataBase.query(`select "users"."id","userName",concat("firstName", ' ', "lastName") as "name",
     "latitude", "longitude", "locationDateTime" from "users" join lateral (select "longitude","latitude","createdAt" as "locationDateTime"
      from "userlocations" where "userId" = "users"."id" order by "createdAt" desc limit 1) p on true ${filters.query} order by "users"."id";`, {
                replacements: filters.replacements,
                type: sequelize.QueryTypes.SELECT,
                raw: true
            });
        await dataBase.close();
        return res.status(200).json(data);
    }));

const imagesStorage = multer.diskStorage({
    //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, "./public/images/userimages/");
    },
    filename: function (req, file, cb) {
        let datetimestamp = Date.now();
        cb(
            null,
            file.fieldname +
            "-" +
            uuid() +
            "." +
            file.originalname.split(".")[file.originalname.split(".").length - 1]
        );
    }
});
const uploadProfileImage = multer({
    //multer settings
    storage: imagesStorage,
    fileFilter: function (req, file, callback) {
        //file filter
        if (
            ["jpg", "jpeg", "png"].indexOf(
                file.originalname
                    .split(".")
                [file.originalname.split(".").length - 1].toLowerCase()
            ) === -1
        ) {
            return callback(new Error("only jpg/jpeg/png files allowed"));
        }
        callback(null, true);
    }
}).single("file");

router.put("/profileimage/:userId", [auth.authenticate()], async (req, res) => {
    var exceltojson;
    //const getUser = userPosition.findAndCount();
    uploadProfileImage(req, res, async err => {
        // console.log(req.file);
        if (err) {
            res.status(400).json({ error_code: 1, err_desc: err });
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
        }
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        const filepath = "images/userimages/" + req.file.filename;
        console.log(filepath)
        const updateRes = await users.update(
            {
                avatar: filepath,
                updatedBy: req.user.userId
            },
            {
                where: {
                    id: req.params.userId
                }
            }
        );
        return res.json({ message: "OK" });
    });
});

const uploadProfileImagePost = multer({
    //multer settings
    storage: imagesStorage,
    fileFilter: function (req, file, callback) {
        //file filter
        let bodyRequestValidation = validateRequest(req.body, userPost);
        if (!bodyRequestValidation.isValid)
            return callback(new Error(JSON.stringify({ data: bodyRequestValidation.errors, code: 400 })));
        if (
            ["jpg", "jpeg", "png"].indexOf(
                file.originalname
                    .split(".")
                [file.originalname.split(".").length - 1].toLowerCase()
            ) === -1
        ) {
            return callback(new Error(JSON.stringify({ data: "only jpg/jpeg/png files allowed", code: 405 })));
        }
        callback(null, true);
    }
}).single("file");

router.post("", async (req, res) => {
    var exceltojson;
    uploadProfileImagePost(req, res, async err => {
        try {
            if (err) {
                let JsonData = getJavascriptData(err.message);
                return res.status(400).json({ message: JsonData.isValid ? JsonData.data.data : err.message });
            }
            const filepath = "images/userimages/" + ((req.file) ? req.file.filename : 'missing.png');
            let userCountWithEmail = await users.count(
                {
                    where: {
                        $and: [
                            { isActive: true },
                            sequelize.where(sequelize.fn('lower', sequelize.col('email')), {
                                $eq: req.body.email.toLowerCase()
                            })]
                    }
                });
            if (userCountWithEmail === 0) {
                const password = await bcrypt.hash(req.body.password, 10);
                const createUser = await users.create({
                    ...req.body, password: password,
                    avatar: filepath, isActive: true, designation: ''
                });
                return res.json({ message: "OK" });
            }
            else {
                return res.status(409).json({ message: 'User already exists with email' })
            }

        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    });
});


router.get("/list",
    [auth.authenticate()],
    async (req, res) => {
        try {
            if (req.user.userRole === 'SalesAgent')
                return res.status(403).json({ message: 'you dont have permission for this resource' })
            let pageIndex = parseInt(req.query.pageIndex);
            let pageSize = parseInt(req.query.pageSize);
            const propertyNameDefault =
                req.query.propertyName === undefined ||
                req.query.propertyName === "null" ||
                req.query.propertyName === "";

            const propertyValueDefault =
                req.query.propertyValue === undefined ||
                req.query.propertyValue === "null" ||
                req.query.propertyValue === "";
            const propertyNameData =
                req.query.propertyName != undefined &&
                req.query.propertyName != "null" &&
                req.query.propertyName != "";
            const propertyValueData =
                req.query.propertyValue != undefined &&
                req.query.propertyValue != "null" &&
                req.query.propertyValue != "";
            const propertyName = req.query.propertyName;
            const result =
                (propertyNameDefault || propertyNameData) && propertyValueDefault;
            const result1 = propertyNameData && propertyValueData;
            let whereStatement = {};
            let selectLiteral = (req.user.userRole === 'Admin') ? `select id from "users" where "userRole" != 'Admin'`
                : `select id from "users" where "headUserId" in (select id from "users" where "headUserId" = ${req.user.userId})`

            if (result) {
                whereStatement = {
                    isActive: true,
                    $or: [
                        {
                            id: {
                                $in: [
                                    sequelize.literal(selectLiteral)
                                ]
                            }
                        },
                        {
                            id: {
                                $in: [
                                    sequelize.literal(
                                        'select id from "users" where "headUserId" =' +
                                        +
                                        req.user.userId
                                    )
                                ]
                            }
                        }
                    ]
                };
            } else if (result1) {
                {
                    whereStatement = {
                        isActive: true,
                        $or: [
                            {
                                id: {
                                    $in: [
                                        sequelize.literal(selectLiteral)
                                    ]
                                }
                            },
                            {
                                id: {
                                    $in: [
                                        sequelize.literal(
                                            'select id from "users" where "headUserId" =' +
                                            +
                                            req.user.userId
                                        )
                                    ]
                                }
                            }
                        ],
                        [propertyName]: {
                            $like: `%${req.query.propertyValue}%`
                        }
                    }
                }
            }
            const resultData = await users.findAndCountAll({
                attributes: [
                    "id",
                    "userName",
                    "firstName",
                    "lastName",
                    "email",
                    "userRole",
                    "designation",
                    "avatar",
                    "mobileNumber",
                    [sequelize.literal(`(SELECT "firstName" || ' ' || "lastName" from
                     "users" WHERE "users"."id" = "users"."headUserId")`), 'supervisior'],
                    [sequelize.literal(`(SELECT "amount" from "targetrevenue" WHERE
                     "targetrevenue"."assigneeId" = "users"."id" AND "targetrevenue"."year" = ${moment().year()}
                     Order By "updatedAt" DESC limit 1)`)
                        , 'target'],
                    "headUserId",
                    "dateOfJoin",
                    "warehouseId",
                    [sequelize.literal(`(select name from warehouses where id = users."warehouseId")`), 'warehouseName'],
                    "branchId",
                    [sequelize.literal(`(select name from warehouses where id = users."branchId")`), 'branchName'],
                    "customerIds",
                    [sequelize.literal(`(select Array(select name from customers where id = ANY (users."customerIds")))`), 'customerNames']
                ],
                where: whereStatement,
                order: [["createdAt", "DESC"]],
                limit: pageSize,
                offset: pageSize * pageIndex
            });

            return res.status(200).json(resultData);

        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }

    });



router.get("/:type", [auth.authenticate(),
reqpathNewvalidation(userType)], reqQueryValidate(userTypeQuery),
    async (req, res) => {
        try {
            if (req.user.userRole === 'SalesAgent')
                return res.status(403).json({ message: 'you dont have permission for this resource' })

            let notIncludeLoggedInUser = { id: { $ne: req.user.userId } };

            let defaultCond = (req.user.userRole === 'Admin') ?
                [notIncludeLoggedInUser] : [notIncludeLoggedInUser, { headUserId: req.user.userId }];

            let searchQuery = [notIncludeLoggedInUser, {
                $or: [{ firstName: { $iLike: `%${req.query.searchText}%` } },
                { lastName: { $iLike: `%${req.query.searchText}%` } }]
            }];

            if (req.query.userstatus === 'Active') {
                defaultCond = [...defaultCond, { isActive: true }]
                searchQuery = [...searchQuery, { isActive: true }]
            } else if (req.query.userstatus === 'Deactive') {
                defaultCond = [...defaultCond, { isActive: false }]
                searchQuery = [...searchQuery, { isActive: false }]
            }


            const filters = {
                Admin: { Search: searchQuery, Default: defaultCond },
                Manager: {
                    Search: [...searchQuery, [{ headUserId: req.user.userId }]]
                    , Default: defaultCond
                }
            }
            return res.status(200).json(await users.findAll({
                attributes: ['id', 'firstName', 'lastName', 'userRole'],
                where: {
                    $and: !req.params.type || req.params.type === 'All' ?
                        filters[req.user.userRole][(req.query.searchText) ? 'Search' : 'Default']
                        : [...filters[req.user.userRole][(req.query.searchText) ? 'Search' : 'Default'],
                        [{ userRole: req.params.type }]]
                }
            }));

        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }

    });

router.get("/headusers/:type", [auth.authenticate(),
reqpathNewvalidation(userType)], reqQueryValidate(userTypeQuery),
    async (req, res) => {
        try {
            let whereStatement = {};
            if (req.params.type === 'SalesAgent') {
                whereStatement = {
                    isActive: true,
                    userRole: 'RegionalManager'
                };
            } else if (req.params.type === 'RegionalManager') {
                whereStatement = {
                    isActive: true,
                    userRole: 'ZonalManager'
                };
            } else if (req.params.type === 'ZonalManager') {
                whereStatement = {
                    isActive: true,
                    userRole: 'Admin'
                };
            }


            return res.status(200).json(await users.findAll({
                attributes: ['id', 'firstName', 'lastName', 'userRole'],
                where: whereStatement
            }));

        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }

    });


router.put("/:userId/assignManager",
    [auth.authenticate(), reqpathNewvalidation(userPathParm),
    reqBodyValidation(managerAssign)], async (req, res) => {
        try {
            if (req.user.userRole !== 'Admin')
                return res.status(403).json({ message: 'you dont have permission for this resource' })
            let salesAgentId = parseInt(req.params.userId);
            let managerId = parseInt(req.body.managerId);
            const usersData = await users.findAll({
                attributes: ['id', 'headUserId', 'userRole'],
                where: {
                    isActive: true,
                    id: { $in: [salesAgentId, managerId] },
                },
                raw: true
            });
            let salesAgent = usersData.find((u) => u.id === salesAgentId && u.userRole === 'SalesAgent');
            let manager = usersData.find((u) => u.id === managerId && u.userRole === 'RegionalManager')
            if (!salesAgent) return res.status(404).json({ message: "sales agent not found" });
            if (!manager) return res.status(404).json({ message: "manager not found" });
            // if(salesAgent.headUserId) return res.status(409).json({ message: "you cannot change manager at this time"});

            const update = await users.update({
                headUserId: manager.id,
                updatedAt: Date.now(),
                updatedBy: req.user.userId
            }, {
                    where: {
                        id: salesAgentId
                    }
                });

            return res.status(200).json({
                message: 'OK'
            });

        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }

    });

router.put("/:userId/changeStatus",
    [auth.authenticate(), reqpathNewvalidation(userDto.userPathParm),
    [reqQueryValidate(userDto.userstatusChangeQueryParams)]]
    , async (req, res) => {
        try {
            if (req.user.userRole !== 'Admin')
                return res.status(403).json({ message: 'you dont have permission for this resource' })
            let userId = parseInt(req.params.userId);
            const userData = await users.findOne({
                attributes: ['id', 'headUserId', 'userRole'],
                where: {
                    id: userId,
                },
                raw: true
            });

            if (!userData) return res.status(404).json({ message: "user not found" });
            const update = await users.update({
                isActive: req.query.status === 'Activate' ? true : false,
                updatedAt: Date.now(),
                updatedBy: req.user.userId
            }, {
                    where: {
                        id: userId
                    }
                });
            const userActivityCreate = await useractivities.create({
                userId: userId,
                activityType: req.query.status,
                createdBy: req.user.userId,
                updatedBy: req.user.userId,
                isActive: true
            });

            return res.status(200).json({
                message: 'OK'
            });

        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }

    });

router.get(
    '/:userId/details', [auth.authenticate()], reqpathNewvalidation(userDto.userPathParm),
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const user = await users.findOne({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'email',
                'userName',
                'userRole',
                'designation',
                [sequelize.literal(`(CASE WHEN "avatar" is null THEN null ELSE 'https://' || '${req.host}/' || "avatar" END)`),
                    'avatar'],
                'mobileNumber',
                'address',
                'dateOfJoin',
                'employeeId',
                "warehouseId",
                [sequelize.literal(`(select name from warehouses where id = users."warehouseId")`), 'branchName'],
                "customerIds",
                [sequelize.literal(`(select Array(select name from customers where id = ANY (users."customerIds")))`), 'customerNames']

            ],
            where: {
                isActive: true,
                id: req.params.userId,
            },
        });
        if (user) {
            return res.status(200).json(user);
        }
        else {
            return res.status(404).json({ message: "user not found" })
        }
    })
);

router.put(
    '/:userId', [auth.authenticate()],
    reqpathNewvalidation(userDto.userPathParm), reqBodyValidation(userUpdateBody),
    asyncErrorHandlerMiddleWare(async (req, res, next) => {

        if (req.user.userRole !== 'Admin') {
            return res.status(403).json({ message: 'you dont have access to this resource' });
        }
        const userId = req.params.userId;
        const updateUser = await users.update(
            {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                userName: req.body.userName,
                employeeId: req.body.employeeId,
                mobileNumber: req.body.mobileNumber,
                dateOfJoin: req.body.dateOfJoin
            },
            {
                where: {
                    id: {
                        $eq: userId,
                    },
                },
            }
        );

        return res.status(200).json({ message: 'success' });

    })
);

router.put(
    '/assign/manager/:managerId/agentsTo/newManager/:newManagerId',
    [auth.authenticate(), reqpathNewvalidation(userDto.newManagerAssign)],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {

        if (req.user.userRole !== 'Admin') {
            return res.status(403).json({ message: 'you dont have access to this resource' });
        }
        const managerId = parseInt(req.params.managerId);
        const newManagerId = parseInt(req.params.newManagerId);
        if (managerId === newManagerId)
            return res.status(409).json({ message: 'Manager and New Manager should not be same person' });
        const managersAndAgents = await users.findAll({
            attributes: ['id', 'userRole', 'headUserId'],
            where: {
                $or: [{ id: { $in: [managerId, newManagerId] } }, { headUserId: managerId }]
            },
            raw: true
        });
        if (!managersAndAgents.some((m) => m.id === managerId && m.userRole === 'RegionalManager'))
            return res.status(404).json({ message: 'manager not found' });
        if (!managersAndAgents.some((m) => m.id === newManagerId && m.userRole === 'RegionalManager'))
            return res.status(404).json({ message: 'newManager not found' });

        if (managersAndAgents.filter((ma) => ma.headUserId === managerId).length === 0)
            return res.status(404).json({ message: 'sales agents for manager not found' });

        const updateUser = await users.update(
            {
                headUserId: newManagerId
            },
            {
                where: {
                    id: {
                        $in: managersAndAgents.filter((ma) => ma.userRole === 'SalesAgent').map((ma) => ma.id),
                    },
                },
            }
        );
        return res.status(200).json({ message: 'success' });

    })
);

router.put(
    '/:userId/assing/warehouse',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const upa = await users.update(
            {
                warehouseId: req.body.warehouseId,
            },
            {
                where: {
                    id: {
                        $eq: req.params.userId,
                    },
                },
            }
        );
        return res.status(200).json({
            mesage: 'success',
        });
    })
);

router.put(
    '/:userId/assing/branch',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const upa = await users.update(
            {
                warehouseId: req.body.warehouseId,
                branchId: req.body.branchId,
                updatedBy: req.user.userId,
            },
            {
                where: {
                    id: {
                        $eq: req.params.userId,
                    },
                },
            }
        );
        return res.status(200).json({
            mesage: 'success',
        });
    })
);

router.put(
    '/:userId/assing/branch/customer',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const upa = await users.update(
            {
                warehouseId: req.body.warehouseId,
                branchId: req.body.branchId,
                customerIds: req.body.customerIds,
                updatedBy: req.user.userId,
            },
            {
                where: {
                    id: {
                        $eq: req.params.userId,
                    },
                },
            }
        );
        return res.status(200).json({
            mesage: 'success',
        });
    })
);

module.exports = router;