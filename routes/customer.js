const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const customers = require('../models').customers;
const reqBodyValidation =
    require('../utils/req_generic_validations').reqBodyValidation;
const customerDTO = require('../dtos/customer');
const reqQueryValidate =
    require('../utils/req_generic_validations').reqqueryvalidation;
const asyncErrorHandlerMiddleWare =
    require('../utils/async_custom_handlers').asyncErrorHandler;
const warehouses = require('../models').warehouses;
router.get(
    '/', [auth.authenticate(), reqQueryValidate(pagination)],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
      const propertyNameDefault = req.query.propertyName === undefined ||
          req.query.propertyName === 'null' || req.query.propertyName === '';

      const propertyValueDefault = req.query.propertyValue === undefined ||
          req.query.propertyValue === 'null' || req.query.propertyValue === '';

      const propertyNameData = req.query.propertyName != undefined &&
          req.query.propertyName != 'null' && req.query.propertyName != '';

      const propertyValueData = req.query.propertyValue != undefined &&
          req.query.propertyValue != 'null' && req.query.propertyValue != '';

      const propertyName = req.query.propertyName;
      const propertyValue = req.query.propertyValue;

      const result =
          (propertyNameDefault || propertyNameData) && propertyValueDefault;
      const result1 = propertyNameData && propertyValueData;
      let whereStatement = {};
      if (req.user.userRole === 'SalesAgent') {
        if (result) {
          whereStatement = {
            isActive: true,
            warehouseId: req.user.warehouseId,
            id: {$in: req.user.outletIds}
          };
        } else if (result1) {
          whereStatement = {
            isActive: true,
            warehouseId: req.user.warehouseId,
            id: {$in: req.user.outletIds},
            [propertyName]: {$iLike: `%${req.query.propertyValue}%`}
          };
        }
      } else {
        if (result) {
          whereStatement = {isActive: true};
        } else if (result1) {
          whereStatement = {
            isActive: true,
            [propertyName]: {$iLike: `%${req.query.propertyValue}%`}
          };
        }
      }

      const limit = parseInt(req.query.pageSize);
      return res.json(await customers.findAndCount({
        attributes: [
          'id',
          'customerNumber',
          'name',
          'warehouseId',
          [
            sequelize.literal(
                `(select Array(select name from warehouses where id = ANY (customers."warehouseId")))`),
            'warehouseNames'
          ],
          'customerType',
          'buildingName',
          'city',
          'province',
          'areaCode',
          'phoneNumber',
          'primaryContactPerson',
          'primaryContactNumber',
          'primaryEmail',
          'secondaryContactPerson',
          'secondaryContactNumber',
          'secondaryEmail',
          'address',
          'creditLimit',
          'description',
          'latitude',
          'longitude',
          'updatedBy',
          'createdAt'
        ],
        where: whereStatement,
        order: [['updatedAt', 'DESC']],
        limit: limit,
        offset: parseInt(limit * req.query.pageIndex)
      }));
    }));

router.get(
    '/all', [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
      const propertyNameDefault = req.query.propertyName === undefined ||
          req.query.propertyName === 'null' || req.query.propertyName === '';

      const propertyValueDefault = req.query.propertyValue === undefined ||
          req.query.propertyValue === 'null' || req.query.propertyValue === '';

      const propertyNameData = req.query.propertyName != undefined &&
          req.query.propertyName != 'null' && req.query.propertyName != '';

      const propertyValueData = req.query.propertyValue != undefined &&
          req.query.propertyValue != 'null' && req.query.propertyValue != '';

      const propertyName = req.query.propertyName;
      const propertyValue = req.query.propertyValue;

      const result =
          (propertyNameDefault || propertyNameData) && propertyValueDefault;
      const result1 = propertyNameData && propertyValueData;
      let whereStatement = {};
      if (result) {
        whereStatement = {isActive: true};
      } else if (result1) {
        whereStatement = {
          isActive: true,
          [propertyName]: {$like: `%${req.query.propertyValue}%`}
        };
      }
      return res.json(await customers.findAll({
        attributes: [
          'id',
          'customerNumber',
          'name',
          'warehouseId',
          'customerType',
          'buildingName',
          'city',
          'province',
          'areaCode',
          'phoneNumber',
          'primaryContactPerson',
          'primaryContactNumber',
          'primaryEmail',
          'secondaryContactPerson',
          'secondaryContactNumber',
          'secondaryEmail',
          'address',
          'creditLimit',
          'description',
          'latitude',
          'longitude',
          'updatedBy',
          'createdAt'
        ],
        where: whereStatement
      }));
    }));

router.post(
    '/', [auth.authenticate(), reqBodyValidation(customerDTO.customerPost)],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
      const customerCount = await customers.count({where: {isActive: true}});
      const customer = await customers.create({
        customerNumber: `CUS${(customerCount ? customerCount : 0) + 1}`,
        ...req.body,
        createdBy: req.user.userId,
        updatedBy: req.user.userId,
        isActive: true
      });
      return res.json({customer});
    }));

router.get(
    '/:id/details', [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
      const customer = await customers.findOne({
        attributes: [
          'id',
          'customerNumber',
          'name',
          'warehouseId',
          [
            sequelize.literal(
                `(select Array(select name from warehouses where id = ANY (customers."warehouseId")))`),
            'warehouseNames'
          ],
          'customerType',
          'buildingName',
          'city',
          'province',
          'areaCode',
          'phoneNumber',
          'primaryContactPerson',
          'primaryContactNumber',
          'primaryEmail',
          'secondaryContactPerson',
          'secondaryContactNumber',
          'secondaryEmail',
          'address',
          'creditLimit',
          'description',
          'latitude',
          'longitude',
          'updatedBy',
          'createdAt'
        ],
        where: {isActive: true, id: req.params.id}
      });
      return res.json(customer);
    }));

router.put(
    '/:id', [auth.authenticate(), reqBodyValidation(customerDTO.customerPost)],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
      const upa = await customers.update(
          {...req.body, updatedBy: req.user.userId},
          {where: {id: {$eq: req.params.id}}});
      return res.status(200).json({mesage: 'success'});
    }));

router.put(
    '/:id/outlets',
    [auth.authenticate(), reqBodyValidation(customerDTO.branchPost)],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
      const upa = await customers.update(
          {warehouseId: req.body.warehouseId, updatedBy: req.user.userId},
          {where: {id: {$eq: req.params.id}}});
      return res.status(200).json({mesage: 'success'});
    }));

router.get(
    '/:customerId/all', [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
      const customer = await customers.findAll({
        attributes: ['warehouseId'],
        where: {isActive: true, id: req.params.customerId}
      });
      const warehouse = await warehouses.findAll({
        attributes: ['id', 'name'],
        where: {
          warehouseType: 'Teritary',
          isActive: true,
          id: {$in: customer[0].dataValues.warehouseId}
        }
      });
      return res.json(warehouse);
    }));

router.delete(
    '/:customerId', [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
      const de = await customers.update(
          {isActive: false, updatedBy: req.user.userId},
          {where: {id: req.params.customerId}});
      return res.sendStatus(200);
    }));

module.exports = router;
