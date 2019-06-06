const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const productPriceCatalogueParams = require('../dtos/products').productPriceCatalogueParams;
const reqQueryValidate = require('../utils/req_generic_validations').reqqueryvalidation;
const reqpathNewvalidation = require('../utils/req_generic_validations').reqpathNewvalidation;
const reqBodyValidate = require('../utils/req_generic_validations').reqBodyValidation;
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers').asyncErrorHandler;
const products = require('../models').products;
const customers = require('../models').customers;
const transactions = require('../models').transactions;
const preOrders = require('../models').preorders;

router.get(
	'/',
	[auth.authenticate(), reqQueryValidate(pagination)],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {

		const fromDateDefault =
			req.query.fromDate === 'null' || req.query.fromDate === '' || req.query.fromDate === undefined;
		const toDateDefault = req.query.toDate === 'null' || req.query.toDate === '' || req.query.toDate === undefined;

		const fromDateData =
			req.query.fromDate != 'null' && req.query.fromDate != '' && req.query.fromDate != undefined;

		const toDateData = req.query.toDate != 'null' && req.query.toDate != '' && req.query.toDate != undefined;


		const propertyNameDefault =
			req.query.propertyName === undefined || req.query.propertyName === 'null' || req.query.propertyName === '';

		const propertyValueDefault =
			req.query.propertyValue === undefined ||
			req.query.propertyValue === 'null' ||
			req.query.propertyValue === '';

		const propertyNameData =
			req.query.propertyName != undefined && req.query.propertyName != 'null' && req.query.propertyName != '';

		const propertyValueData =
			req.query.propertyValue != undefined && req.query.propertyValue != 'null' && req.query.propertyValue != '';

		const propertyName = req.query.propertyName;
		const propertyValue = req.query.propertyValue;

		const result =
			fromDateDefault &&
			toDateDefault &&
			(propertyNameDefault || propertyNameData) && propertyValueDefault;
		const result1 = fromDateData &&
			toDateData && propertyNameData && propertyValueData;
		const result2 = fromDateDefault &&
			toDateDefault && propertyNameData && propertyValueData;

		if (result) {
			whereStatement = {
				isActive: true,
			};
		} else if (result1) {
			whereStatement = {
				$and: {
					dateOfDelivery: {
						$between: [req.query.fromDate, req.query.toDate],
					},
					isActive: true
				},
			};
		}
		else if (result2) {
			whereStatement = {
				isActive: true,
				[propertyName]: (propertyName === 'customerId') ? { $eq: parseInt(propertyValue) }
					: {
						$iLike: `%${propertyValue}%`,
					},
			};
		}

		const limit = parseInt(req.query.pageSize);
		return res.json(
			await transactions.findAndCount({
				attributes: [
					'id',
					'transactionNumber',
					'transactionDate',
					'customerId',
					[
						sequelize.literal(
							'(Select name from customers where customers.id = transactions."customerId")'
						),
						'customerName',
					],
					'address',
					'dateOfDelivery',
					'description',
					'updatedBy',
					'updatedAt',
					'createdAt',
				],
				where: whereStatement,
				order: [['updatedAt', 'DESC']],
				limit: limit,
				offset: parseInt(limit * req.query.pageIndex),
			})
		);
	})
);
router.get(
	'/all',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const propertyNameDefault =
			req.query.propertyName === undefined || req.query.propertyName === 'null' || req.query.propertyName === '';

		const propertyValueDefault =
			req.query.propertyValue === undefined ||
			req.query.propertyValue === 'null' ||
			req.query.propertyValue === '';

		const propertyNameData =
			req.query.propertyName != undefined && req.query.propertyName != 'null' && req.query.propertyName != '';

		const propertyValueData =
			req.query.propertyValue != undefined && req.query.propertyValue != 'null' && req.query.propertyValue != '';

		const propertyName = req.query.propertyName;
		const propertyValue = req.query.propertyValue;

		const result = (propertyNameDefault || propertyNameData) && propertyValueDefault;
		const result1 = propertyNameData && propertyValueData;
		let whereStatement = {};
		if (result) {
			whereStatement = {
				isActive: true,
			};
		} else if (result1) {
			whereStatement = {
				isActive: true,
				[propertyName]: {
					$like: `%${req.query.propertyValue}%`,
				},
			};
		}
		return res.json(
			await transactions.findAll({
				attributes: [
					'id',
					'transactionNumber',
					'transactionDate',
					'customerId',
					[
						sequelize.literal(
							'(Select name from customers where customers.id = transactions."customerId")'
						),
						'customerName',
					],
					'address',
					'dateOfDelivery',
					'description',
					'updatedBy',
					'updatedAt',
					'createdAt',
				],
				where: whereStatement
			})
		);
	})
);
router.post(
	'/',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const transaction = await transactions.create({
			transactionDate: req.body.transactionDate,
			customerId: req.body.customerId,
			address: req.body.address,
			dateOfDelivery: req.body.dateOfDelivery,
			description: req.body.description,
			createdBy: req.user.userId,
			updatedBy: req.user.userId,
			isActive: true,
		});
		if (transaction) {
			const trnUp = await transactions.update(
				{
					transactionNumber: `TRAN000${transaction.dataValues.id}`,
					updatedBy: req.user.userId,
				},
				{
					where: {
						id: transaction.dataValues.id,
					},
				}
			);
			let preOrd = req.body.preOrders.map(function (n) {
				(n.transactionId = transaction.dataValues.id),
					(n.preOrderNumber = `ORD${transaction.dataValues.id}00001`),
					(n.createdBy = req.user.userId),
					(n.updatedBy = req.user.userId),
					(n.isActive = true);
				return n;
			});
			const preOrderCreate = await preOrders.bulkCreate(preOrd)
		}
		return res.json(
			transaction,
		);
	})
);

router.get(
	'/:id/details',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const transaction = await transactions.findOne({
			attributes: [
				'id',
				'transactionNumber',
				'transactionDate',
				'customerId',
				[
					sequelize.literal(
						'(Select name from customers where customers.id = transactions."customerId")'
					),
					'customerName',
				],
				'address',
				'dateOfDelivery',
				'description',
				'updatedBy',
				'updatedAt',
				'createdAt',
			],
			where: {
				isActive: true,
				id: req.params.id,
			},
			include: [
				{
					model: preOrders,
					as: 'preOrders',
					attributes: [
						'id',
						'transactionId',
						'preOrderNumber',
						'productId',
						[
							sequelize.literal(
								'(Select name from products where products.id = "preOrders"."productId")'
							),
							'productName',
						],
						'batchNumber',
						'availableQuantity',
						'orderedQuantity',
						'discount',
						'mrp',
						'amount'
					],
				},
			]
		});
		return res.json(transaction);
	})
);

router.get(
	'/:transactionId/preorders',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const preOrder = await preOrders.findAll({
			attributes: [
				'id',
				'transactionId',
				[sequelize.literal(`(select transactionNumber from transactions where id = ${req.params.transactionId})`), 'transactionNumber'],
				'preOrderNumber',
				'productId',
				[
					sequelize.literal(
						'(Select name from products where products.id = "preOrders"."productId")'
					),
					'productName',
				],
				'batchNumber',
				'availableQuantity',
				'orderedQuantity',
				'discount',
				'mrp',
				'amount'
			],
			where: {
				isActive: true,
				inventoryId: req.params.transactionId,
			}
		});
		return res.json(preOrder);
	})
);
module.exports = router;
