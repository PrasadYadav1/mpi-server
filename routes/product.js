const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const productPriceCatalogueParams = require('../dtos/products')
  .productPriceCatalogueParams;
const productDTO = require('../dtos/product');
const products = require('../models').products;
const productprices = require('../models').productprices;
const reqQueryValidate = require('../utils/req_generic_validations')
  .reqqueryvalidation;
const reqpathNewvalidation = require('../utils/req_generic_validations')
  .reqpathNewvalidation;
const reqBodyValidation = require('../utils/req_generic_validations')
  .reqBodyValidation;
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers')
  .asyncErrorHandler;
const companies = require('../models').companies;
const categories = require('../models').categories;
const subcategories = require('../models').subcategories;

router.get(
  '/',
  [auth.authenticate(), reqQueryValidate(pagination)],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
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
      (propertyNameDefault || propertyNameData) && propertyValueDefault;
    const result1 = propertyNameData && propertyValueData;

    if (result) {
      whereStatement = {
        isActive: true
      };
    } else if (result1) {
      whereStatement = {
        isActive: true,
        [propertyName]:
          propertyName === 'companyId' ||
          propertyName === 'categoryId' ||
          propertyName === 'subCategoryId'
            ? { $eq: parseInt(propertyValue) }
            : {
                $iLike: `%${propertyValue}%`
              }
      };
    }

    const limit = parseInt(req.query.pageSize);
    return res.json(
      await products.findAndCount({
        attributes: [
          'id',
          'name',
          'productCode',
          [
            sequelize.literal(
              '(Select name from companies where companies.id = products."companyId")'
            ),
            'companyName'
          ],
          'categoryId',
          [
            sequelize.literal(
              '(Select name from categories where categories.id = products."categoryId")'
            ),
            'categoryName'
          ],
          'subCategoryId',
          [
            sequelize.literal(
              '(Select name from subcategories where subcategories.id = products."subCategoryId")'
            ),
            'subCategoryName'
          ],
          'units',
          'unitsofMeasurement',
          'description',
          'classificationName',
          'updatedBy',
          'updatedAt',
          'createdAt'
        ],
        where: whereStatement,
        order: [['updatedAt', 'DESC']],
        limit: limit,
        offset: parseInt(limit * req.query.pageIndex)
      })
    );
  })
);
router.get(
  '/preorder',
  [auth.authenticate(), reqQueryValidate(pagination)],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
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

      const classificationNameDefault =
      req.query.classificationName === undefined ||
      req.query.classificationName === 'null' ||
      req.query.classificationName === '';

    const classificationName = req.query.classificationName
    const propertyName = req.query.propertyName;
    const propertyValue = req.query.propertyValue;

    const result =
    classificationNameDefault && (propertyNameDefault || propertyNameData) && propertyValueDefault
const result1 =
     classificationName && (propertyNameDefault || propertyNameData) && propertyValueDefault;

    const result2 = classificationNameDefault && propertyNameData && propertyValueData;
    const result3 = classificationName && propertyNameData && propertyValueData;
    if (result) {
      whereStatement = {
        isActive: true
      };
    } else  if (result1) {
      whereStatement = {
        isActive: true,
        classificationName: req.query.classificationName
      };
    }
    else if (result2) {
      whereStatement = {
        isActive: true,
        [propertyName]:
          propertyName === 'companyId' ||
          propertyName === 'categoryId' ||
          propertyName === 'subCategoryId'
            ? { $eq: parseInt(propertyValue) }
            : {
                $iLike: `%${propertyValue}%`
              }
      };
    } else if (result3) {
      whereStatement = {
        isActive: true,
        classificationName: req.query.classificationName,
        [propertyName]:
          propertyName === 'companyId' ||
          propertyName === 'categoryId' ||
          propertyName === 'subCategoryId'
            ? { $eq: parseInt(propertyValue) }
            : {
                $iLike: `%${propertyValue}%`
              }
      };
    }

    const limit = parseInt(req.query.pageSize);
    return res.json(
      await products.findAndCount({
        attributes: [
          'id',
          'name',
          'productCode',
          [
            sequelize.literal(
              '(Select name from companies where companies.id = products."companyId")'
            ),
            'companyName'
          ],
          'categoryId',
          [
            sequelize.literal(
              '(Select name from categories where categories.id = products."categoryId")'
            ),
            'categoryName'
          ],
          'subCategoryId',
          [
            sequelize.literal(
              '(Select name from subcategories where subcategories.id = products."subCategoryId")'
            ),
            'subCategoryName'
          ],
          'units',
          [
            sequelize.literal(
              '(Select "unitofMeasurement" from stockreceiveds where stockreceiveds."productId" = products."id" order by stockreceiveds."unitofMeasurement" desc limit 1 )'
            ),
            'unitofMeasurement'
          ],
          [
            sequelize.literal(
              '(Select SUM("receivedQuantity") from stockreceiveds where stockreceiveds."productId" = products."id")'
            ),
            'receivedQuantity'
          ],
          [
            sequelize.literal(
              '(Select "minSalePrice" from stockreceiveds where stockreceiveds."productId" = products."id" order by stockreceiveds."minSalePrice" desc limit 1 )'
            ),
            'minSalePrice'
          ],
          [
            sequelize.literal(
              '(Select "price" from stockreceiveds where stockreceiveds."productId" = products."id" order by stockreceiveds."price" desc limit 1 )'
            ),
            'price'
          ],
          [
            sequelize.literal(
              '(Select "mrp" from stockreceiveds where stockreceiveds."productId" = products."id" order by stockreceiveds."mrp" desc limit 1 )'
            ),
            'mrp'
          ],
          [
            sequelize.literal(
              '(Select "amount" from stockreceiveds where stockreceiveds."productId" = products."id" order by stockreceiveds."amount" desc limit 1 )'
            ),
            'amount'
          ],
          [
            sequelize.literal(
              '(Select "offerType" from offers where offers."productId" = products."id" order by offers."createdAt" desc limit 1)'
            ),
            'offerType'
          ],
          [
            sequelize.literal(
              '(Select discount from offerdiscounts where offerdiscounts."stockReceivedId" in (Select id from stockreceiveds where stockreceiveds."productId" = products."id") order by offerdiscounts."createdAt" desc  limit 1)'
            ),
            'discount'
          ],
          'description',
          'classificationName',
          'updatedBy',
          'updatedAt',
          'createdAt'
        ],
        where: whereStatement,
        order: [['updatedAt', 'DESC']],
        limit: limit,
        offset: parseInt(limit * req.query.pageIndex)
      })
    );
  })
);
router.get(
  '/all',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
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
      (propertyNameDefault || propertyNameData) && propertyValueDefault;
    const result1 = propertyNameData && propertyValueData;
    let whereStatement = {};
    if (result) {
      whereStatement = {
        isActive: true
      };
    } else if (result1) {
      whereStatement = {
        isActive: true,
        [propertyName]: {
          $like: `%${req.query.propertyValue}%`
        }
      };
    }
    return res.json(
      await products.findAll({
        attributes: [
          'id',
          'name',
          'productCode',
          [
            sequelize.literal(
              '(Select name from companies where companies.id = products."companyId")'
            ),
            'companyName'
          ],
          'categoryId',
          [
            sequelize.literal(
              '(Select name from categories where categories.id = products."categoryId")'
            ),
            'categoryName'
          ],
          'subCategoryId',
          [
            sequelize.literal(
              '(Select name from subcategories where subcategories.id = products."subCategoryId")'
            ),
            'subCategoryName'
          ],
          'units',
          'unitsofMeasurement',
          'description',
          'classificationName',
          'updatedBy',
          'updatedAt',
          'createdAt'
        ],
        where: whereStatement
      })
    );
  })
);

router.get(
  '/all/categories',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const classificationNameDefault =
    req.query.classificationName === undefined ||
    req.query.classificationName === 'null' ||
    req.query.classificationName === '';
    if (classificationNameDefault) {
      whereStatement = {
        isActive: true
      };
    } else{
      whereStatement = {
        isActive: true,
        classificationName: req.query.classificationName
      };
    }
    return res.json(
      await products.findAll({
        group:["categoryId","categoryName"],
        attributes: [
          'categoryId',
          [
            sequelize.literal(
              '(Select name from categories where categories.id = products."categoryId")'
            ),
            'categoryName'
          ],
          [
            sequelize.literal(
              ' count("categoryId")'
            ),
            'productCount'
          ],
        ],
        where: whereStatement
      })
    );
  })
);

router.get(
  '/all/companies',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const classificationNameDefault =
    req.query.classificationName === undefined ||
    req.query.classificationName === 'null' ||
    req.query.classificationName === '';
    if (classificationNameDefault) {
      whereStatement = {
        isActive: true
      };
    } else{
      whereStatement = {
        isActive: true,
        classificationName: req.query.classificationName
      };
    }
    return res.json(
      await products.findAll({
        group:["companyId","companyName"],
        attributes: [
       "companyId",
          [
            sequelize.literal(
              '(Select name from companies where companies.id = products."companyId")'
            ),
            'companyName'
          ],
          [
            sequelize.literal(
              'count("companyId")'
            ),
            'productCount'
          ],
        ],
        where: whereStatement
      })
    );
  })
);


router.post(
  '/',
  [auth.authenticate(), reqBodyValidation(productDTO.productPost)],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const productCount = await products.count({
      where: {
        isActive: true
      }
    });
    const product = await products.create({
      productCode: `PORD0000${(productCount ? productCount : 0) + 1}`,
      ...req.body,
      createdBy: req.user.userId,
      updatedBy: req.user.userId,
      isActive: true
    });
    return res.status(200).json({
      mesage: 'success'
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
        'productCode',
        [
          sequelize.literal(
            '(Select name from companies where companies.id = products."companyId")'
          ),
          'companyName'
        ],
        'categoryId',
        [
          sequelize.literal(
            '(Select name from categories where categories.id = products."categoryId")'
          ),
          'categoryName'
        ],
        'subCategoryId',
        [
          sequelize.literal(
            '(Select name from subcategories where subcategories.id = products."subCategoryId")'
          ),
          'subCategoryName'
        ],
        'units',
        'unitsofMeasurement',
        'description',
        'classificationName',
        'updatedBy',
        'updatedAt',
        'createdAt'
      ],
      where: {
        isActive: true,
        id: req.params.productId
      }
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
        productCode: req.body.productCode,
        companyId: req.body.companyId,
        categoryId: req.body.categoryId,
        subCategoryId: req.body.subCategoryId,
        units: req.body.units,
        unitsofMeasurement: req.body.unitsofMeasurement,
        description: req.body.description,
        classificationName: req.body.classificationName,
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
  '/:productId',
  [auth.authenticate()],
  asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const offer = await products.update(
      {
        isActive: false,
        updatedBy: req.user.userId
      },
      {
        where: {
          id: req.params.productId
        }
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
        [
          sequelize.literal(
            `(select name from products where id = ${req.params.productId})`
          ),
          'productName'
        ],
        'fromRange',
        'toRange',
        'price'
      ],
      where: {
        isActive: true,
        productId: req.params.productId
      }
    });
    return res.json(productPriceCatalogue);
  })
);

module.exports = router;
