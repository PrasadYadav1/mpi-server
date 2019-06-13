const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const reqQueryValidate = require('../utils/req_generic_validations').reqqueryvalidation;
const reqBodyValidate = require('../utils/req_generic_validations').reqBodyValidation;
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers').asyncErrorHandler;
const preOrders = require('../models').preorders;
const preorderProducts = require('../models').preorderproducts;

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

		const orderByDefault = req.query.orderBy === 'null' && req.query.orderBy === '' && req.query.orderBy === undefined;
		const orderByData = req.query.orderBy != 'null' && req.query.orderBy != '' && req.query.orderBy != undefined;
		let orderBy = 'DESC';
		if (orderByDefault) {
			orderBy = req.query.orderBy;
		} else {
			orderBy = 'DESC';
		}
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
			toDateData && req.query.propertyName;
		const result2 = fromDateDefault &&
			toDateDefault && propertyNameData && propertyValueData;
		let whereStatement = {};
		if (result) {
			whereStatement = {
				isActive: true,
			};
		} else if (result1) {
			whereStatement = {
				$and: {
					[propertyName]: {
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
			await preOrders.findAndCount({
				attributes: [
					'id',
					'preOrderNumber',
					'dateOfDelivery',
					'customerId',
					[
						sequelize.literal(
							'(Select name from customers where customers.id = preOrders."customerId")'
						),
						'customerName',
					],
					'discount',
					'amount',
					'totalAmount',
					'updatedBy',
					'updatedAt',
					'createdAt',
				],
				where: whereStatement,
				order: [[propertyName ? propertyName : 'updatedAt', orderBy]],
				limit: limit,
				offset: parseInt(limit * req.query.pageIndex),
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
		})
		const preOrder = await preOrders.create({
			preOrderNumber: `PORD0000${(preOrderCount ? preOrderCount : 0) + 1}`,
			dateOfDelivery: req.body.dateOfDelivery,
			customerId: req.body.customerId,
			discount: req.body.discount,
			amount: req.body.amount,
			totalAmount: req.body.amount,
			createdBy: req.user.userId,
			updatedBy: req.user.userId,
			isActive: true,
		});
		if (preOrder) {
			let strc = req.body.preorderProducts.map(function (n, i) {
				(n.preorderId = preOrder.dataValues.id),
					(n.batchNumber = `PORDER${preOrder.dataValues.id}00${i + 1}`),
					(n.createdBy = req.user.userId),
					(n.updatedBy = req.user.userId),
					(n.isActive = true);
				return n;
			});

			const strceCreate = await preorderProducts.bulkCreate(strc)
		}
		return res.status(200).json({
			mesage: 'success',
		})
	})
);

router.get(
	'/:id/details',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const product = await preOrders.findOne({
			attributes: [
				'id',
				'preOrderNumber',
				'dateOfDelivery',
				'customerId',
				[
					sequelize.literal(
						'(Select name from customers where customers.id = preOrders."customerId")'
					),
					'customerName',
				],
				'discount',
				'amount',
				'totalAmount',
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
							'productName',
						],
						'batchNumber',
						'orderQuantity'
					],
				},
			]
		});
		return res.json(product);
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
				updatedBy: req.user.userId,
			},
			{
				where: {
					id: req.params.id,
				},
			}
		);
		return res.status(200).json({
			mesage: 'success',
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
				updatedBy: req.user.userId,
			},
			{
				where: {
					id: req.params.preOrderId,
				},
			}
		);
		return res.sendStatus(200);
	})
);
module.exports = router;
