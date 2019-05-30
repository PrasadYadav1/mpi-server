const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const productPriceCatalogueParams = require('../dtos/products').productPriceCatalogueParams;
const products = require('../models').products;
const productprices = require('../models').productprices;
const reqQueryValidate = require('../utils/req_generic_validations').reqqueryvalidation;
const reqpathNewvalidation = require('../utils/req_generic_validations').reqpathNewvalidation;
const reqBodyValidate = require('../utils/req_generic_validations').reqBodyValidation;
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers').asyncErrorHandler;
const companies = require('../models').companies;
const categories = require('../models').categories;
const subcategories = require('../models').subcategories;

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
			await products.findAndCount({
				attributes: [
					'id',
					'name',
					[
						sequelize.literal(
							'(Select name from companies where companies.id = products."companyId")'
						),
						'companyName',
					],
					'categoryId',
					[
						sequelize.literal(
							'(Select name from categories where categories.id = products."categoryId")'
						),
						'categoryName',
					],
					'subCategoryId',
					[
						sequelize.literal(
							'(Select name from subcategories where subcategories.id = products."subCategoryId")'
						),
						'subCategoryName',
					],
					'units',
					'unitsofMeasurement',
					'description',
					'classificationName',
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
			await products.findAll({
				attributes: [
					'id',
					'name',
					[
						sequelize.literal(
							'(Select name from companies where companies.id = products."companyId")'
						),
						'companyName',
					],
					'categoryId',
					[
						sequelize.literal(
							'(Select name from categories where categories.id = products."categoryId")'
						),
						'categoryName',
					],
					'subCategoryId',
					[
						sequelize.literal(
							'(Select name from subcategories where subcategories.id = products."subCategoryId")'
						),
						'subCategoryName',
					],
					'units',
					'unitsofMeasurement',
					'description',
					'classificationName',
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
		const product = await products.create({
			name: req.body.name,
			companyId: req.body.companyId,
			categoryId: req.body.categoryId,
			subCategoryId: req.body.subCategoryId,
			units: req.body.units,
			unitsofMeasurement: req.body.unitsofMeasurement,
			description: req.body.description,
			classificationName: req.body.classificationName,
			createdBy: req.user.userId,
			updatedBy: req.user.userId,
			isActive: true,
		});
		return res.status(200).json({
			mesage: 'success',
		});
	})
);

router.get(
	'/:productId/details',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const product = await products.findOne({
			attributes: [
				'id',
				'name',
				'companyId',
				[
					sequelize.literal(
						'(Select name from companies where companies.id = products."companyId")'
					),
					'companyName',
				],
				'categoryId',
				[
					sequelize.literal(
						'(Select name from categories where categories.id = products."categoryId")'
					),
					'categoryName',
				],
				'subCategoryId',
				[
					sequelize.literal(
						'(Select name from subcategories where subcategories.id = products."subCategoryId")'
					),
					'subCategoryName',
				],
				'units',
				'unitsofMeasurement',
				'description',
				'classificationName',
				'updatedBy',
				'updatedAt',
				'createdAt',
			],
			where: {
				isActive: true,
				id: req.params.productId,
			},
		});
		return res.json(product);
	})
);


router.put(
	'/:id',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const pId = req.params.id;
		const product = await products.update(
			{
				name: req.body.name,
				companyId: req.body.companyId,
				categoryId: req.body.categoryId,
				subCategoryId: req.body.subCategoryId,
				units: req.body.units,
				unitsofMeasurement: req.body.unitsofMeasurement,
				description: req.body.description,
				classificationName: req.body.classificationName,
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
	'/:productId',
	[auth.authenticate()],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const offer = await products.update(
			{
				isActive: false,
				updatedBy: req.user.userId,
			},
			{
				where: {
					id: req.params.productId,
				},
			}
		);
		return res.sendStatus(200);
	})
);

router.get(
	'/:productId/priceCatalogue',
	[auth.authenticate(), reqpathNewvalidation(productPriceCatalogueParams)],
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const productPriceCatalogue = await productprices.findAll({
			attributes: [
				'id',
				'productId',
				[sequelize.literal(`(select name from products where id = ${req.params.productId})`), 'productName'],
				'fromRange',
				'toRange',
				'price',
			],
			where: {
				isActive: true,
				productId: req.params.productId,
			}
		});
		return res.json(productPriceCatalogue);
	})
);

module.exports = router;
