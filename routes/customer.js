const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const customers = require('../models').customers;
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
            await customers.findAndCount({
                attributes: [
                    'id',
                    'name',
                    'customerType',
                    'buildingName',
                    'city',
                    'province',
                    'areaCode',
                    'phoneNumber',
                    'primaryContactPerson',
                    'primaryContactNumber',
                    'secondaryContactPerson',
                    'secondaryContactNumber',
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

router.post(
    '/',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const customer = await customers.create({
            name: req.body.name,
            customerType: req.body.customerType,
            buildingName: req.body.buildingName,
            city: req.body.city,
            province: req.body.province,
            areaCode: req.body.areaCode,
            phoneNumber: req.body.phoneNumber,
            primaryContactPerson: req.body.primaryContactPerson,
            primaryContactNumber: req.body.primaryContactNumber,
            secondaryContactPerson: req.body.secondaryContactPerson,
            secondaryContactNumber: req.body.secondaryContactNumber,
            address: req.body.address,
            description: req.body.description ? req.body.description : "",
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            createdBy: req.user.userId,
            updatedBy: req.user.userId,
            isActive: true,
        });
        return res.json({
            customer,
        });
    })
);

router.get(
    '/:id/details',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const customer = await customers.findOne({
            attributes: [
                'id',
                'name',
                'customerType',
                'buildingName',
                'city',
                'province',
                'areaCode',
                'phoneNumber',
                'primaryContactPerson',
                'primaryContactNumber',
                'secondaryContactPerson',
                'secondaryContactNumber',
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
        return res.json(customer);
    })
);

router.put(
    '/:id',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const upa = await customers.update(
            {
                name: req.body.name,
                customerType: req.body.customerType,
                buildingName: req.body.buildingName,
                city: req.body.city,
                province: req.body.province,
                areaCode: req.body.areaCode,
                phoneNumber: req.body.phoneNumber,
                primaryContactPerson: req.body.primaryContactPerson,
                primaryContactNumber: req.body.primaryContactNumber,
                secondaryContactPerson: req.body.secondaryContactPerson,
                secondaryContactNumber: req.body.secondaryContactNumber,
                address: req.body.address,
                description: req.body.description ? req.body.description : "",
                latitude: req.body.latitude,
                longitude: req.body.longitude,
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
    '/:customerId',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const de = await customers.update(
            {
                isActive: false,
                updatedBy: req.user.userId,
            },
            {
                where: {
                    id: req.params.customerId,
                },
            }
        );
        return res.sendStatus(200);
    })
);

module.exports = router;