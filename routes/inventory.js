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
const companies = require('../models').companies;
const inventories = require('../models').inventories;
const stockReceiveds = require('../models').stockreceiveds;

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

		if (result) {
			whereStatement = {
				isActive: true,
			};
		} else if (result1) {
			whereStatement = {
				isActive: true,
				[propertyName]: (propertyName === 'companyId')
					|| (propertyName === 'categoryId') || (propertyName === 'subCategoryId') ? { $eq: parseInt(propertyValue) }
					: {
						$iLike: `%${propertyValue}%`,
					},
			};
		}

		const limit = parseInt(req.query.pageSize);
		return res.json(
			await inventories.findAndCount({
				attributes: [
					'id',
					'grn',
					'isgrn',
					'inventoryDate',
					'warehouseId',
					[
						sequelize.literal(
							'(Select name from warehouses where warehouses.id = inventories."warehouseId")'
						),
						'warehouseName',
					],
					'withPo',
					'orderNumber',
					'companyId',
					[
						sequelize.literal(
							'(Select name from companies where companies.id = inventories."companyId")'
						),
						'companyName',
					],
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
			await inventories.findAll({
				attributes: [
					'id',
					'grn',
					'isgrn',
					'inventoryDate',
					'warehouseId',
					[
						sequelize.literal(
							'(Select name from warehouses where warehouses.id = inventories."warehouseId")'
						),
						'warehouseName',
					],
					'withPo',
					'orderNumber',
					'companyId',
					[
						sequelize.literal(
							'(Select name from companies where companies.id = inventories."companyId")'
						),
						'companyName',
					],
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
		const inventory = await inventories.create({
			grn: "",
			isgrn: false,
			inventoryDate: req.body.inventoryDate,
			warehouseId: req.body.warehouseId,
			withPo: req.body.withPo,
			orderNumber: req.body.orderNumber,
			companyId: req.body.companyId,
			description: req.body.description,
			createdBy: req.user.userId,
			updatedBy: req.user.userId,
			isActive: true,
		});
		if (inventory) {
			let strc = req.body.stockReceiveds.map(function (n) {
				(n.inventoryId = inventory.dataValues.id),
					(n.batchNumber = `MPI${inventory.dataValues.id}00001`),
					(n.createdBy = req.user.userId),
					(n.updatedBy = req.user.userId),
					(n.isActive = true);
				return n;
			});

			const strceCreate = await stockReceiveds.bulkCreate(strc)
		}
		return res.status(200).json({
			mesage: 'success',
		})
	})
);

router.get(
	'/grn/:inventoryId',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const de = await inventories.update(
			{
				grn: `GRN000${req.params.inventoryId}`,
				isgrn: true,
				updatedBy: req.user.userId,
			},
			{
				where: {
					id: req.params.inventoryId,
				},
			}
		);
		return res.status(200).json({
			mesage: 'success',
		});
	})
);

router.get(
	'/:inventoryId/details',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const product = await inventories.findOne({
			attributes: [
				'id',
				'grn',
				'isgrn',
				'inventoryDate',
				'warehouseId',
				[
					sequelize.literal(
						'(Select name from warehouses where warehouses.id = inventories."warehouseId")'
					),
					'warehouseName',
				],
				'withPo',
				'orderNumber',
				'companyId',
				[
					sequelize.literal(
						'(Select name from companies where companies.id = inventories."companyId")'
					),
					'companyName',
				],
				'description',
				'updatedBy',
				'updatedAt',
				'createdAt',
			],
			where: {
				isActive: true,
				id: req.params.inventoryId,
			},
			include: [
				{
					model: stockReceiveds,
					as: 'stockReceiveds',
					attributes: [
						'id',
						'inventoryId',
						'productId',
						[
							sequelize.literal(
								'(Select name from products where products.id = "stockReceiveds"."productId")'
							),
							'productName',
						],
						'batchNumber',
						'unitofMeasurement',
						'dateOfManufacture',
						'expiryDate',
						'receivedQuantity',
						'minSalePrice',
						'price',
						'mrp',
						'amount'
					],
				},
			]
		});
		return res.json(product);
	})
);

router.get(
	'/:inventoryId/stockreceiveds',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const stockReceived = await stockReceiveds.findAll({
			attributes: [
				'id',
				'inventoryId',
				[sequelize.literal(`(select grn from inventories where id = ${req.params.inventoryId})`), 'grn'],
				'productId',
				[
					sequelize.literal(
						'(Select name from products where products.id = stockReceiveds."productId")'
					),
					'productName',
				],
				'batchNumber',
				'unitofMeasurement',
				'dateOfManufacture',
				'expiryDate',
				'receivedQuantity',
				'minSalePrice',
				'price',
				'mrp',
				'amount'
			],
			where: {
				isActive: true,
				inventoryId: req.params.inventoryId,
			}
		});
		return res.json(stockReceived);
	})
);
router.get(
	'/stockreceiveds/:productId',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		console.log(req.params.productId)
		const stockReceived = await stockReceiveds.findAll({
			attributes: [
				'id',
				'inventoryId',
				[sequelize.literal(`(select grn from inventories where id = stockReceiveds."inventoryId")`), 'grn'],
				'productId',
				[
					sequelize.literal(
						'(Select name from products where products.id = stockReceiveds."productId")'
					),
					'productName',
				],
				'batchNumber',
				'unitofMeasurement',
				'dateOfManufacture',
				'expiryDate',
				'receivedQuantity',
				'minSalePrice',
				'price',
				'mrp',
				'amount'
			],
			where: {
				isActive: true,
				productId: req.params.productId,
			}
		});
		return res.json(stockReceived);
	})
);
router.get(
	'/:productId/stockreceiveds/:batchNumber',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const stockReceived = await stockReceiveds.findAll({
			attributes: [
				'id',
				'inventoryId',
				[sequelize.literal(`(select grn from inventories where id = stockReceiveds."inventoryId")`), 'grn'],
				'productId',
				[
					sequelize.literal(
						'(Select name from products where products.id = stockReceiveds."productId")'
					),
					'productName',
				],
				'batchNumber',
				'unitofMeasurement',
				'dateOfManufacture',
				'expiryDate',
				'receivedQuantity',
				'minSalePrice',
				'price',
				'mrp',
				'amount'
			],
			where: {
				isActive: true,
				productId: req.params.productId,
				batchNumber: req.params.batchNumber
			}
		});
		return res.json(stockReceived);
	})
);

module.exports = router;
