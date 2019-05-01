const express = require('express');
const router = express.Router();
const auth = require('../authentication/auth')();

const { pathParam } = require('../dtos/formtypes');
const categories = require('../models').categories;
const subcategories = require('../models').subcategories;
const {
    reqpathNewvalidation,
} = require('../utils/req_generic_validations');
const reqBodyValidate = require('../utils/req_generic_validations').reqBodyValidation;

const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers').asyncErrorHandler;



router.post(
    '/',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const category = await categories.create({
            name: req.body.name,
            industry: req.body.industry,
            description: req.body.description,
            createdBy: req.user.userId,
            updatedBy: req.user.userId,
            isActive: true,
        });
        return res.json({
            category,
        });
    })
);

router.get('/all', asyncErrorHandlerMiddleWare(async (req, res, next) => {
    return res.status(200).json(await categories.findAll({
        attributes: ['id', 'name'],
        where: {
            isActive: true
        }
    }));
}));


router.get('/:id/subcategories', [reqpathNewvalidation(pathParam)], asyncErrorHandlerMiddleWare(async (req, res, next) => {
    return res.status(200).json(await subcategories.findAll({
        attributes: ['id', 'name'],
        where: {
            isActive: true,
            categoryId: parseInt(req.params.id)
        }
    }));
}));

router.post(
    '/subcategories',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const category = await subcategories.create({
            categoryId: req.body.categoryId,
            name: req.body.name,
            createdBy: req.user.userId,
            updatedBy: req.user.userId,
            isActive: true,
        });
        return res.json({
            category,
        });
    })
);
module.exports = router;
