const express = require("express");
const router = express.Router();
const auth = require("../authentication/auth")();
const pagination = require("../dtos/pagination").Pagination;
const reqQueryValidate = require("../utils/req_generic_validations")
  .reqqueryvalidation;
const users = require("../models").users;
const customers = require("../models").customers;
const companies = require("../models").companies;
const products = require("../models").products;
const warehouses = require("../models").warehouses;
const preOrders = require("../models").preorders;
const orders = require("../models").orders;
const offers = require("../models").offers;
const uservisitlocations = require("../models").uservisitlocations;
const reqBodyValidate = require("../utils/req_generic_validations")
  .reqBodyValidation;

const sequelize = require("sequelize");
const asyncErrorHandlerMiddleWare = require("../utils/async_custom_handlers")
  .asyncErrorHandler;

router.get(
  "/list",
  [auth.authenticate(), reqQueryValidate(pagination)],
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
    const propertyValue = req.query.propertyValue;

    const result =
      (propertyNameDefault || propertyNameData) && propertyValueDefault;
    const result1 = propertyNameData && propertyValueData;

    if (result) {
      whereStatement = { isActive: true };
    } else if (result1) {
      whereStatement = {
        isActive: true,
        [propertyName]:
          propertyName === "warehouseId"
            ? { $eq: parseInt(propertyValue) }
            : { $iLike: `%${propertyValue}%` }
      };
    }

    const limit = parseInt(req.query.pageSize);
    return res.json(
      await uservisitlocations.findAndCount({
        attributes: [
          "id",
          [
            sequelize.literal(
              '(select name from customers AS cu where cu."warehouseId" @> ARRAY[uservisitlocations."warehouseId"])'
            ),
            "customerName"
          ],
          "warehouseId",
          [
            sequelize.literal(
              '(select name from warehouses AS wa where wa.id = uservisitlocations."warehouseId")'
            ),
            "outletName"
          ],
          "visit",
          "userId",
          [
            sequelize.literal(
              `( select "firstName" || ' ' || "lastName"  from "users" AS u where u.id = uservisitlocations."userId")`
            ),
            "salesAgentName"
          ],
          "latitude",
          "longitude",
          "createdAt"
        ],
        where: whereStatement,
        //  order: [["updatedAt", "DESC"]],
        limit: limit,
        offset: parseInt(limit * req.query.pageIndex)
      })
    );
  })
);
router.get(
  "/",
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const userCount = await users.findAll({
      attributes: ["id"],
      where: { isActive: true, userRole: { $ne: "admin" } }
    });
    const customerCount = await customers.findAll({
      attributes: ["id"],
      where: { isActive: true }
    });
    const companyCount = await companies.findAll({
      attributes: ["id"],
      where: { isActive: true }
    });
    const productCount = await products.findAll({
      attributes: ["id"],
      where: { isActive: true }
    });
    const warehouseCount = await warehouses.findAll({
      attributes: ["id", "warehouseType"],
      where: { warehouseType: "Primary", isActive: true }
    });

    const preOrderCount = await preOrders.findAll({
      attributes: ["id"],
      where: { isActive: true }
    });
    const approvedPreOrderCount = await preOrders.findAll({
      attributes: ["id"],
      where: { preorderConfirmed: true, isActive: true }
    });
    const orderCount = await orders.findAll({
      attributes: ["id"],
      where: { isActive: true }
    });
    const offerCount = await offers.findAll({
      attributes: ["id"],
      where: { isActive: true }
    });
    const data = {
      userCount: userCount.length,
      customerCount: customerCount.length,
      companyCount: companyCount.length,
      productCount: productCount.length,
      warehouseCount: warehouseCount.length,
      preOrderCount: preOrderCount.length,
      approvedPreOrderCount: approvedPreOrderCount.length,
      pendingPreOrderCount: preOrderCount.length - approvedPreOrderCount.length,
      orderCount: orderCount.length,
      offerCount: offerCount.length
    };
    return res.status(200).json(data);
  })
);
router.get(
  "/visit",
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const uservisitlocation = await uservisitlocations.findAll({
      attributes: [
        "id",
        [
          sequelize.literal(
            '(select name from customers AS cu where cu."warehouseId" @> ARRAY[uservisitlocations."warehouseId"])'
          ),
          "customerName"
        ],
        "warehouseId",
        [
          sequelize.literal(
            '(select name from warehouses AS wa where wa.id = uservisitlocations."warehouseId")'
          ),
          "outletName"
        ],
        "visit",
        "userId",
        [
          sequelize.literal(
            `( select "firstName" || ' ' || "lastName"  from "users" AS u where u.id = uservisitlocations."warehouseId")`
          ),
          "salesAgentName"
        ],

        "latitude",
        "longitude",
        "createdAt"
      ],
      where: { isActive: true }
    });

    return res.status(200).json(uservisitlocation);
  })
);

module.exports = router;
