const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const productprices = require('../models').productprices;
const products = require('../models').products;
const reqQueryValidate = require('../utils/req_generic_validations').reqqueryvalidation;
const reqBodyValidate = require('../utils/req_generic_validations').reqBodyValidation;
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers').asyncErrorHandler;

router.get(
	'/',
	[auth.authenticate(), reqQueryValidate(pagination)],
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

		const limit = parseInt(req.query.pageSize);
		return res.json(
			await productprices.findAndCount({
				attributes: ['id', 'productId', 'fromRange', 'toRange', 'price', 'updatedBy', 'createdAt'],
				where: whereStatement,
				order: [['updatedAt', 'DESC']],
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
		const productprice = await productprices.create({
			productId: req.body.productId,
			fromRange: req.body.fromRange,
			toRange: req.body.toRange,
			price: req.body.price,
			createdBy: req.user.userId,
			updatedBy: req.user.userId,
			isActive: true,
		});
		return res.json({
			productprice,
		});
	})
);

router.get(
	'/:id/details',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const productPrice = await productprices.findOne({
			attributes: [
				'id',
				'productId',
				'fromRange',
				'toRange',
				'price',
				'updatedBy',
				'createdAt'],
			include: [
				{
					model: products,
					attributes: ['name'],
					required: true,
				},
			],
			where: {
				isActive: true,
				id: req.params.id,
			},
		});
		if (!productPrice) return res.status(404).json({ message: 'not found' });
		const { product, ...remaining } = productPrice.get({ plain: true });
		return res.json({
			...remaining,
			productName: product.name
		});
	})
);

router.put(
	'/:id',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const pId = req.params.id;
		const updateProductprices = await productprices.update(
			{
				productId: req.body.productId,
				fromRange: req.body.fromRange,
				toRange: req.body.toRange,
				price: req.body.price,
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
	'/:productPriceId',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const deleteProductprices = await productprices.update(
			{
				isActive: false,
				updatedBy: req.user.userId,
			},
			{
				where: {
					id: req.params.productPriceId,
				},
			}
		);
		return res.sendStatus(200);
	})
);
module.exports = router;
