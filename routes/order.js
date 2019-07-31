const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const reqQueryValidate = require('../utils/req_generic_validations')
  .reqqueryvalidation;
const reqBodyValidate = require('../utils/req_generic_validations')
  .reqBodyValidation;
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers')
  .asyncErrorHandler;
const orders = require('../models').orders;
const orderProducts = require('../models').orderproducts;
const users = require('../models').users;
router.get(
  '/',
  [auth.authenticate(), reqQueryValidate(pagination)],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const fromDateDefault =
      req.query.fromDate === 'null' ||
      req.query.fromDate === '' ||
      req.query.fromDate === undefined;
    const toDateDefault =
      req.query.toDate === 'null' ||
      req.query.toDate === '' ||
      req.query.toDate === undefined;

    const fromDateData =
      req.query.fromDate != 'null' &&
      req.query.fromDate != '' &&
      req.query.fromDate != undefined;

    const toDateData =
      req.query.toDate != 'null' &&
      req.query.toDate != '' &&
      req.query.toDate != undefined;

    const orderByDefault =
      req.query.orderBy === 'null' &&
      req.query.orderBy === '' &&
      req.query.orderBy === undefined;
    const orderByData =
      req.query.orderBy != 'null' &&
      req.query.orderBy != '' &&
      req.query.orderBy != undefined;
    let orderBy = 'DESC';
    if (orderByDefault) {
      orderBy = req.query.orderBy;
    } else {
      orderBy = 'DESC';
    }
    const propertyNameDefault =
      req.query.propertyName === undefined ||
      req.query.propertyName === 'null' ||
      req.query.propertyName === '';

    const propertyValueDefault =
      req.query.propertyValue === undefined ||
      req.query.propertyValue === 'null' ||
      req.query.propertyValue === '';

    const propertyNameData =
      req.query.propertyName != undefined &&
      req.query.propertyName != 'null' &&
      req.query.propertyName != '';

    const propertyValueData =
      req.query.propertyValue != undefined &&
      req.query.propertyValue != 'null' &&
      req.query.propertyValue != '';

    const propertyName = req.query.propertyName;
    const propertyValue = req.query.propertyValue;

    const result =
      fromDateDefault &&
      toDateDefault &&
      (propertyNameDefault || propertyNameData) &&
      propertyValueDefault;
    const result1 = fromDateData && toDateData && req.query.propertyName;
    const result2 =
      fromDateDefault && toDateDefault && propertyNameData && propertyValueData;
    let whereStatement = {};
    if (result) {
      whereStatement = {
        orderConfirmed: false,
        isActive: true
      };
    } else if (result1) {
      whereStatement = {
        orderConfirmed: false,
        $and: {
          [propertyName]: {
            $between: [req.query.fromDate, req.query.toDate]
          },
          isActive: true
        }
      };
    } else if (result2) {
      whereStatement = {
        orderConfirmed: false,
        isActive: true,
        [propertyName]:
          propertyName === 'customerId'
            ? { $eq: parseInt(propertyValue) }
            : {
                $iLike: `%${propertyValue}%`
              }
      };
    }

    const limit = parseInt(req.query.pageSize);
    return res.json(
      await orders.findAndCount({
        attributes: [
          'id',
          'orderConfirmed',
          'orderNumber',
          'dateOfDelivery',
          'customerId',
          [
            sequelize.literal(
              '(Select name from customers where customers.id = orders."customerId")'
            ),
            'customerName'
          ],
          'discount',
          'amount',
          'totalAmount',
          [
            sequelize.literal(
              '(Select "userRole" from users where users.id = orders."isApprovedBy")'
            ),
            'isApprovedBy'
          ],
          'updatedBy',
          'updatedAt',
          'createdAt'
        ],
        where: whereStatement,
        order: [[propertyName ? propertyName : 'updatedAt', orderBy]],
        limit: limit,
        offset: parseInt(limit * req.query.pageIndex)
      })
    );
  })
);
router.post(
  '/',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const orderCount = await orders.count({
      where: {
        isActive: true
      }
    });
    const order = await orders.create({
      orderConfirmed: req.body.orderConfirmed,
      orderNumber: `ORD0000${(orderCount ? orderCount : 0) + 1}`,
      dateOfDelivery: req.body.dateOfDelivery,
      customerId: req.body.customerId,
      discount: req.body.discount,
      amount: req.body.amount,
      totalAmount: req.body.amount,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
      isActive: true
    });
    if (order) {
      let strc = req.body.orderProducts.map(function(n, i) {
        (n.orderId = order.dataValues.id),
          (n.createdBy = req.user.userId),
          (n.updatedBy = req.user.userId),
          (n.isActive = true);
        return n;
      });

      const strceCreate = await orderProducts.bulkCreate(strc);
    }
    return res.status(200).json({
      mesage: 'success'
    });
  })
);

router.get(
  '/:id/details',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const product = await orders.findOne({
      attributes: [
        'id',
        'orderConfirmed',
        'orderNumber',
        'dateOfDelivery',
        'customerId',
        [
          sequelize.literal(
            '(Select name from customers where customers.id = orders."customerId")'
          ),
          'customerName'
        ],
        [
          sequelize.literal(
            `(select name from warehouses where id = (Select "warehouseId" from customers where customers.id = orders."customerId" limit 1))`
          ),
          'branchName'
        ],
        'discount',
        'amount',
        'totalAmount',
        'isApproved',
        [
          sequelize.literal(
            '(Select "userRole" from users where users.id = orders."isApprovedBy")'
          ),
          'isApprovedBy'
        ],
        'updatedBy',
        'updatedAt',
        'createdAt'
      ],
      where: {
        isActive: true,
        id: req.params.id
      },
      include: [
        {
          model: orderProducts,
          as: 'orderProducts',
          attributes: [
            'id',
            'orderId',
            'productId',
            [
              sequelize.literal(
                '(Select name from products where products.id = "orderProducts"."productId")'
              ),
              'productName'
            ],
            [
              sequelize.literal(
                '(Select "classificationName" from products where products.id = "orderProducts"."productId")'
              ),
              'classificationName'
            ],
            'availableQuantity',
            'batchNumber',
            'orderQuantity',
            'minSalePrice',
            'discount',
            'rate',
            'mrp',
            'totalAmount'
          ]
        }
      ]
    });
    return res.json(product);
  })
);

router.put(
  '/:id',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const order = await orders.update(
      {
        orderConfirmed: false,
        dateOfDelivery: req.body.dateOfDelivery,
        productId: req.body.productId,
        discount: req.body.discount,
        amount: req.body.amount,
        totalAmount: req.body.amount,
        updatedBy: req.user.userId
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    if (req.body.orderProducts) {
      const data = req.body.orderProducts[0];
      const orderproducts = await orderProducts.update(
        {
          productId: data.productId,
          batchNumber: data.batchNumber,
          availableQuantity: data.availableQuantity,
          orderQuantity: data.orderQuantity,
          minSalePrice: data.minSalePrice,
          discount: data.discount,
          rate: data.rate,
          mrp: data.mrp,
          totalAmount: data.amount,
          updatedBy: req.user.userId
        },
        {
          where: {
            id: data.id
          }
        }
      );
    }

    return res.status(200).json({
      mesage: 'success'
    });
  })
);

router.put(
  '/isapproved/:id',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const order = await orders.update(
      {
        isApproved: req.body.isApproved,
        isApprovedBy: req.user.userId,
        updatedBy: req.user.userId
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    return res.status(200).json({
      mesage: 'success'
    });
  })
);

router.put(
  '/:id/orderproducts',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const order = await orderProducts.update(
      {
        productId: req.body.productId,
        batchNumber: req.body.batchNumber,
        availableQuantity: req.body.availableQuantity,
        orderQuantity: req.body.orderQuantity,
        minSalePrice: req.body.minSalePrice,
        discount: req.body.discount,
        rate: req.body.rate,
        mrp: req.body.mrp,
        totalAmount: req.body.amount,
        updatedBy: req.user.userId
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    return res.status(200).json({
      mesage: 'success'
    });
  })
);
router.delete(
  '/:orderId',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const order = await orders.update(
      {
        isActive: false,
        updatedBy: req.user.userId
      },
      {
        where: {
          id: req.params.orderId
        }
      }
    );
    return res.sendStatus(200);
  })
);
router.post(
  '/:orderId/orderproducts',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const order = await orderProducts.create({
      orderId: req.params.orderId,
      productId: req.body.productId,
      batchNumber: req.body.batchNumber,
      availableQuantity: req.body.availableQuantity,
      orderQuantity: req.body.orderQuantity,
      minSalePrice: req.body.minSalePrice,
      discount: req.body.discount,
      rate: req.body.rate,
      mrp: req.body.mrp,
      totalAmount: req.body.amount,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
      isActive: true
    });
    return res.status(200).json({
      mesage: 'success'
    });
  })
);

router.put(
  '/:id/orderproducts',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const order = await orderProducts.update(
      {
        productId: req.body.productId,
        batchNumber: req.body.batchNumber,
        availableQuantity: req.body.availableQuantity,
        orderQuantity: req.body.orderQuantity,
        minSalePrice: req.body.minSalePrice,
        discount: req.body.discount,
        rate: req.body.rate,
        mrp: req.body.mrp,
        totalAmount: req.body.amount,
        updatedBy: req.user.userId
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    return res.status(200).json({
      mesage: 'success'
    });
  })
);

router.delete(
  '/:orderProductId/orderproducts',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const order = await orderProducts.update(
      {
        isActive: false,
        updatedBy: req.user.userId
      },
      {
        where: {
          id: req.params.orderProductId
        }
      }
    );
    return res.sendStatus(200);
  })
);

router.get(
  '/:id/invoice',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const order = await orders.update(
      {
        orderConfirmed: true
      },
      {
        where: {
          id: req.params.id
        }
      }
    );
    return res.status(200).json({
      mesage: 'success'
    });
  })
);

router.get(
  '/invoice/:id/details',
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const product = await orders.findOne({
      attributes: [
        'id',
        'orderConfirmed',
        'orderNumber',
        'dateOfDelivery',
        'customerId',
        [
          sequelize.literal(
            '(Select name from customers where customers.id = orders."customerId")'
          ),
          'customerName'
        ],
        [
          sequelize.literal(
            `(select name from warehouses where id = (Select "warehouseId" from customers where customers.id = orders."customerId" limit 1))`
          ),
          'branchName'
        ],
        'discount',
        'amount',
        'totalAmount',
        'updatedBy',
        'updatedAt',
        'createdAt'
      ],
      where: {
        isActive: true,
        id: req.params.id
      },
      include: [
        {
          model: orderProducts,
          as: 'orderProducts',
          attributes: [
            'id',
            'orderId',
            'productId',
            [
              sequelize.literal(
                '(Select name from products where products.id = "orderProducts"."productId")'
              ),
              'productName'
            ],
            'availableQuantity',
            'batchNumber',
            'orderQuantity',
            'minSalePrice',
            'discount',
            'rate',
            'mrp',
            'totalAmount'
          ]
        }
      ]
    });
    return res.json(product);
  })
);

router.get(
  '/invoice',
  [auth.authenticate(), reqQueryValidate(pagination)],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const fromDateDefault =
      req.query.fromDate === 'null' ||
      req.query.fromDate === '' ||
      req.query.fromDate === undefined;
    const toDateDefault =
      req.query.toDate === 'null' ||
      req.query.toDate === '' ||
      req.query.toDate === undefined;

    const fromDateData =
      req.query.fromDate != 'null' &&
      req.query.fromDate != '' &&
      req.query.fromDate != undefined;

    const toDateData =
      req.query.toDate != 'null' &&
      req.query.toDate != '' &&
      req.query.toDate != undefined;

    const orderByDefault =
      req.query.orderBy === 'null' &&
      req.query.orderBy === '' &&
      req.query.orderBy === undefined;
    const orderByData =
      req.query.orderBy != 'null' &&
      req.query.orderBy != '' &&
      req.query.orderBy != undefined;
    let orderBy = 'DESC';
    if (orderByDefault) {
      orderBy = req.query.orderBy;
    } else {
      orderBy = 'DESC';
    }
    const propertyNameDefault =
      req.query.propertyName === undefined ||
      req.query.propertyName === 'null' ||
      req.query.propertyName === '';

    const propertyValueDefault =
      req.query.propertyValue === undefined ||
      req.query.propertyValue === 'null' ||
      req.query.propertyValue === '';

    const propertyNameData =
      req.query.propertyName != undefined &&
      req.query.propertyName != 'null' &&
      req.query.propertyName != '';

    const propertyValueData =
      req.query.propertyValue != undefined &&
      req.query.propertyValue != 'null' &&
      req.query.propertyValue != '';

    const propertyName = req.query.propertyName;
    const propertyValue = req.query.propertyValue;

    const result =
      fromDateDefault &&
      toDateDefault &&
      (propertyNameDefault || propertyNameData) &&
      propertyValueDefault;
    const result1 = fromDateData && toDateData && req.query.propertyName;
    const result2 =
      fromDateDefault && toDateDefault && propertyNameData && propertyValueData;
    let whereStatement = {};
    if (result) {
      whereStatement = {
        orderConfirmed: false,
        isActive: true
      };
    } else if (result1) {
      whereStatement = {
        orderConfirmed: false,
        $and: {
          [propertyName]: {
            $between: [req.query.fromDate, req.query.toDate]
          },
          isActive: true
        }
      };
    } else if (result2) {
      whereStatement = {
        orderConfirmed: false,
        isActive: true,
        [propertyName]:
          propertyName === 'customerId'
            ? { $eq: parseInt(propertyValue) }
            : {
                $iLike: `%${propertyValue}%`
              }
      };
    }

    const limit = parseInt(req.query.pageSize);
    return res.json(
      await orders.findAndCount({
        attributes: [
          'id',
          'orderConfirmed',
          'orderNumber',
          'dateOfDelivery',
          'customerId',
          [
            sequelize.literal(
              '(Select name from customers where customers.id = orders."customerId")'
            ),
            'customerName'
          ],
          'discount',
          'amount',
          'totalAmount',
          'updatedBy',
          'updatedAt',
          'createdAt'
        ],
        where: whereStatement,
        order: [[propertyName ? propertyName : 'updatedAt', orderBy]],
        limit: limit,
        offset: parseInt(limit * req.query.pageIndex)
      })
    );
  })
);

module.exports = router;
