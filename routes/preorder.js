const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const multer = require('multer');
const pagination = require('../dtos/pagination').Pagination;
const reqQueryValidate = require('../utils/req_generic_validations')
  .reqqueryvalidation;
const reqBodyValidate = require('../utils/req_generic_validations')
  .reqBodyValidation;
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers')
  .asyncErrorHandler;
const preOrders = require('../models').preorders;
const preorderProducts = require('../models').preorderproducts;
const customers = require('../models').customers;
const users = require('../models').users;
const { fileStorage } = require('../utils/common');

const nodemailer = require('nodemailer');

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
        isActive: true
      };
    } else if (result1) {
      whereStatement = {
        $and: {
          [propertyName]: {
            $between: [req.query.fromDate, req.query.toDate]
          },
          isActive: true
        }
      };
    } else if (result2) {
      whereStatement = {
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
      await preOrders.findAndCount({
        attributes: [
          'id',
          'preorderConfirmed',
          'preOrderNumber',
          'dateOfDelivery',
          'customerId',
          [
            sequelize.literal(
              '(Select name from customers where customers.id = preOrders."customerId")'
            ),
            'customerName'
          ],
          'discount',
          'amount',
          'totalAmount',
          'isApproved',
          [
            sequelize.literal(
              '(Select "firstName" from users where users.id = preOrders."isApprovedBy")'
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
    const preOrderCount = await preOrders.count({
      where: {
        isActive: true
      }
    });
    const customerData = await customers.findOne({
      where: {
        isActive: true,
        id: req.body.customerId
      }
    });

    const preOrder = await preOrders.create({
      preorderConfirmed: false,
      preOrderNumber: `PORD0000${(preOrderCount ? preOrderCount : 0) + 1}`,
      dateOfDelivery: req.body.dateOfDelivery,
      customerId: req.body.customerId,
      discount: req.body.discount,
      amount: req.body.amount,
      totalAmount: req.body.amount,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
      isActive: true
    });
    if (preOrder) {
      let strc = req.body.preorderProducts.map(function(n, i) {
        (n.preorderId = preOrder.dataValues.id),
          (n.createdBy = req.user.userId),
          (n.updatedBy = req.user.userId),
          (n.isActive = true);
        return n;
      });

      const strceCreate = await preorderProducts.bulkCreate(strc);
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'krishnarao.inturi@technoidentity.com',
        pass: 'Design_20'
      }
    });
    const mailOptions = {
      from: 'krishnarao.inturi@technoidentity.com',
      to: `${customerData.dataValues.primaryEmail},${req.user.email}`,
      subject: 'Pre Order',
      html: `<h1>Pre Order Number: ${
        preOrder.dataValues.preOrderNumber
      }</h1><p>Date of Delivery: ${preOrder.dataValues.dateOfDelivery}</p>`
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    return res.status(200).json({
      mesage: 'success'
    });
  })
);

router.get(
  '/:id/details',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const product = await preOrders.findOne({
      attributes: [
        'id',
        'preorderConfirmed',
        'preOrderNumber',
        'dateOfDelivery',
        'customerId',
        [
          sequelize.literal(
            '(Select name from customers where customers.id = preOrders."customerId")'
          ),
          'customerName'
        ],
        'discount',
        'amount',
        'totalAmount',
        'digitalSignature',
        'isApproved',
        [
          sequelize.literal(
            '(Select "firstName" from users where users.id = preOrders."isApprovedBy")'
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
          model: preorderProducts,
          as: 'preorderProducts',
          attributes: [
            'id',
            'preorderId',
            'productId',
            [
              sequelize.literal(
                '(Select name from products where products.id = "preorderProducts"."productId")'
              ),
              'productName'
            ],
            [
              sequelize.literal(
                '(Select "classificationName" from products where products.id = "preorderProducts"."productId")'
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

    var decodedImage = new Buffer(product.digitalSignature, 'base64').toString(
      'binary'
    );
    return res.json(product);
  })
);

router.get(
  '/:prOrderId',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const preOrder = await preOrders.update(
      {
        preorderConfirmed: true,
        updatedBy: req.user.userId
      },
      {
        where: {
          id: req.params.preOrderId
        }
      }
    );
    return res.sendStatus(200);
  })
);

router.put(
  '/:id',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const preOrder = await preOrders.update(
      {
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
    return res.status(200).json({
      mesage: 'success'
    });
  })
);

router.put(
  '/isapproved/:id',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const preOrder = await preOrders.update(
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

// router.put(
// 	'/:id/digitalsignature',
// 	[auth.authenticate()],
// 	asyncErrorHandlerMiddleWare(async (req, res, next) => {
// 		  const upload = multer({
// 			  storage: fileStorage('')
// 		  }).single('digitalSignature');
//      upload(req,res, async() => {

// 	   var encodedImage = new Buffer(req.file.filename, 'binary').toString('base64');
// 	   console.log(encodedImage)
// 	   const preOrder = await preOrders.update(
// 		{
// 			digitalSignature: encodedImage,
// 			updatedBy: req.user.userId,
// 		},
// 		{
// 			where: {
// 				id: req.params.id,
// 			},
// 		}
// 	);
// 	 });

// 		return res.status(200).json({
// 			mesage: 'success',
// 		});
// 	})
// );

router.put(
  '/:id/digitalsignature',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const preOrder = await preOrders.update(
      {
        digitalSignature: req.body.digitalSignature,
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
  '/:preOrderId',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const preOrder = await preOrders.update(
      {
        isActive: false,
        updatedBy: req.user.userId
      },
      {
        where: {
          id: req.params.preOrderId
        }
      }
    );
    return res.sendStatus(200);
  })
);

router.post(
  '/:preorderId/preorderproducts',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const preOrder = await preorderProducts.create({
      preorderId: req.params.preorderId,
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
  '/:id/preorderproducts',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const preOrder = await preorderProducts.update(
      {
        preorderId: req.body.preorderId,
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
  '/:preOrderProductId/preorderproducts',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const preOrder = await preorderProducts.update(
      {
        isActive: false,
        updatedBy: req.user.userId
      },
      {
        where: {
          id: req.params.preOrderProductId
        }
      }
    );
    return res.sendStatus(200);
  })
);
module.exports = router;
