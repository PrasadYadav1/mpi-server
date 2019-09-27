const express = require('express');
const router = express.Router();
const auth = require('../authentication/auth')();
const users = require('../models').users;
const customers = require('../models').customers;
const companies = require('../models').companies;
const products = require('../models').products;
const warehouses = require('../models').warehouses;
const preOrders = require('../models').preorders;
const orders = require('../models').orders;
const offers = require('../models').offers;

const reqBodyValidate = require('../utils/req_generic_validations')
  .reqBodyValidation;

const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers')
  .asyncErrorHandler;

router.get(
  '/',
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const userCount = await users.findAll({
      attributes: ['id'],
      where: {
        isActive: true,
        userRole: {
          $ne: 'admin'
        }
      }
    });
    const customerCount = await customers.findAll({
      attributes: ['id'],
      where: {
        isActive: true
      }
    });
    const companyCount = await companies.findAll({
      attributes: ['id'],
      where: {
        isActive: true
      }
    });
    const productCount = await products.findAll({
      attributes: ['id'],
      where: {
        isActive: true
      }
    });
    const warehouseCount = await warehouses.findAll({
      attributes: ['id', 'warehouseType'],
      where: {
        warehouseType: 'Primary',
        isActive: true
      }
    });

    const preOrderCount = await preOrders.findAll({
      attributes: ['id'],
      where: {
        isActive: true
      }
    });
    const orderCount = await orders.findAll({
      attributes: ['id'],
      where: {
        isActive: true
      }
    });
    const offerCount = await offers.findAll({
      attributes: ['id'],
      where: {
        isActive: true
      }
    });
    const data = {
      userCount: userCount.length,
      customerCount: customerCount.length,
      companyCount: companyCount.length,
      productCount: productCount.length,
      warehouseCount: warehouseCount.length,
      preOrderCount: preOrderCount.length,
      orderCount: orderCount.length,
      offerCount: offerCount.length
    };
    return res.status(200).json(data);
  })
);

module.exports = router;
