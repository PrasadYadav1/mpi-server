const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const companies = require('../models').companies;
const reqBodyValidation = require('../utils/req_generic_validations').reqBodyValidation;
const companyDTO = require('../dtos/company')
const reqQueryValidate = require('../utils/req_generic_validations').reqqueryvalidation;
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
                    $iLike: `%${req.query.propertyValue}%`,
                },
            };
        }

        const limit = parseInt(req.query.pageSize);
        return res.json(
            await companies.findAndCount({
                attributes: [
                    'id',
                    'name',
                    'buildingName',
                    'city',
                    'province',
                    'areaCode',
                    'phoneNumber',
                    'primaryContactPerson',
                    'primaryContactNumber',
                    'primaryEmail',
                    'secondaryContactPerson',
                    'secondaryContactNumber',
                    'secondaryEmail',
                    'address',
                    'description',
                    'latitude',
                    'longitude',
                    'updatedBy',
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
router.get('/all', asyncErrorHandlerMiddleWare(async (req, res, next) => {
    return res.status(200).json(await companies.findAll({
        attributes: ['id', 'name'],
        where: {
            isActive: true
        }
    }));
}));
router.post(
    '/',
    [auth.authenticate(), reqBodyValidation(companyDTO.companyPost)],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const company = await companies.create({
            ...req.body,
            createdBy: req.user.userId,
            updatedBy: req.user.userId,
            isActive: true,
        });
        return res.json({
            company,
        });
    })
);

router.get(
    '/:id/details',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const company = await companies.findOne({
            attributes: [
                'id',
                'name',
                'buildingName',
                'city',
                'province',
                'areaCode',
                'phoneNumber',
                'primaryContactPerson',
                'primaryContactNumber',
                'primaryEmail',
                'secondaryContactPerson',
                'secondaryContactNumber',
                'secondaryEmail',
                'address',
                'description',
                'latitude',
                'longitude',
                'updatedBy',
                'createdAt',
            ],
            where: {
                isActive: true,
                id: req.params.id,
            },
        });
        return res.json(company);
    })
);

router.put(
    '/:id',
    [auth.authenticate(), reqBodyValidation(companyDTO.companyPost)],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const upa = await companies.update(
            {
                ...req.body,
                updatedBy: req.user.userId,
            },
            {
                where: {
                    id: {
                        $eq: req.params.id,
                    },
                },
            }
        );
        return res.status(200).json({
            mesage: 'success',
        });
    })
);

router.delete(
    '/:companyId',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const de = await companies.update(
            {
                isActive: false,
                updatedBy: req.user.userId,
            },
            {
                where: {
                    id: req.params.companyId,
                },
            }
        );
        return res.sendStatus(200);
    })
);

module.exports = router;