const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const reqQueryValidate = require('../utils/req_generic_validations').reqqueryvalidation;
const reqBodyValidate = require('../utils/req_generic_validations').reqBodyValidation;
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers').asyncErrorHandler;
const stockReceiveds = require('../models').stockreceiveds;

router.post(
	'/',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const stockCount = await stockReceiveds.count({
			where: {
				inventoryId: req.body.inventoryId
			}
		})
		const stockReceived = await stockReceiveds.create({
			inventoryId: req.body.inventoryId,
			productId: req.body.productId,
			batchNumber: `MPI${req.body.inventoryId}0000${(stockCount ? stockCount : 0) + 1}`,
			unitofMeasurement: req.body.unitofMeasurement,
			dateOfManufacture: req.body.dateOfManufacture,
			expiryDate: req.body.expiryDate,
			receivedQuantity: req.body.receivedQuantity,
			price: req.body.price,
			mrp: req.body.mrp,
			amount: req.body.amount,
			createdBy: req.user.userId,
			updatedBy: req.user.userId,
			isActive: true,
		});
		return res.json({
			stockReceived,
		});
	})
);

router.put(
	'/:id',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const updateStockReceiveds = await stockReceiveds.update(
			{
				inventoryId: req.body.inventoryId,
				productId: req.body.productId,
				unitofMeasurement: req.body.unitofMeasurement,
				dateOfManufacture: req.body.dateOfManufacture,
				expiryDate: req.body.expiryDate,
				receivedQuantity: req.body.receivedQuantity,
				price: req.body.price,
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
	'/:stockReceivedId',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const deleteStockReceiveds = await stockReceiveds.update(
			{
				isActive: false,
				updatedBy: req.user.userId,
			},
			{
				where: {
					id: req.params.stockReceivedId,
				},
			}
		);
		return res.sendStatus(200);
	})
);
module.exports = router;
