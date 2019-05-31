const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const reqQueryValidate = require('../utils/req_generic_validations').reqqueryvalidation;
const reqBodyValidate = require('../utils/req_generic_validations').reqBodyValidation;
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers').asyncErrorHandler;
const preOrders = require('../models').preorders;

router.post(
	'/',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const preOrderCount = await preOrders.count({
			where: {
				transactionId: req.body.transactionId
			}
		})
		const preOrder = await preOrders.create({
			transactionId: req.body.transactionId,
			preOrderNumber: `ORD${req.body.transactionId}0000${(preOrderCount ? preOrderCount : 0) + 1}`,
			productId: req.body.productId,
			batchNumber: req.body.batchNumber,
			availableQuantity: req.body.availableQuantity,
			orderedQuantity: req.body.orderedQuantity,
			discount: req.body.discount,
			mrp: req.body.mrp,
			amount: req.body.amount,
			createdBy: req.user.userId,
			updatedBy: req.user.userId,
			isActive: true,
		});
		return res.json({
			preOrder,
		});
	})
);

router.put(
	'/:id',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const preOrder = await preOrders.update(
			{
				transactionId: req.body.transactionId,
				productId: req.body.productId,
				batchNumber: req.body.batchNumber,
				availableQuantity: req.body.availableQuantity,
				orderedQuantity: req.body.orderedQuantity,
				discount: req.body.discount,
				mrp: req.body.mrp,
				amount: req.body.amount,
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
