const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const warehouses = require('../models').warehouses;
const reqBodyValidation = require('../utils/req_generic_validations').reqBodyValidation;
const warehouseDTO = require('../dtos/warehouse')
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
            await warehouses.findAndCount({
                attributes: [
                    'id',
                    'name',
                    'email',
                    'phoneNumber',
                    'warehouseType',
                    'primaryWarehouse',
                    'province',
                    'address',
                    'latitude',
                    'longitude',
                    'areaCode',
                    'buildingName',
                    'city',
                    'description',
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
    return res.status(200).json(await warehouses.findAll({
        attributes: ['id', 'name'],
        where: {
            isActive: true
        }
    }));
}));
router.post(
    '/',
    [auth.authenticate(), reqBodyValidation(warehouseDTO.warehousePost)],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const warehouse = await warehouses.create({
            ...req.body,
            createdBy: req.user.userId,
            updatedBy: req.user.userId,
            isActive: true,
        });
        return res.json({
            warehouse,
        });
    })
);

router.get(
    '/:id/details',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const warehouse = await warehouses.findOne({
            attributes: [
                'id',
                'name',
                'email',
                'phoneNumber',
                'warehouseType',
                'primaryWarehouse',
                'province',
                'address',
                'latitude',
                'longitude',
                'areaCode',
                'buildingName',
                'city',
                'description',
                'updatedBy',
                'createdAt',
            ],
            where: {
                isActive: true,
                id: req.params.id,
            },
        });
        return res.json(warehouse);
    })
);

router.put(
    '/:id',
    [auth.authenticate(), reqBodyValidation(warehouseDTO.warehousePost)],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const upa = await warehouses.update(
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
    '/:warehouseId',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const de = await warehouses.update(
            {
                isActive: false,
                updatedBy: req.user.userId,
            },
            {
                where: {
                    id: req.params.warehouseId,
                },
            }
        );
        return res.sendStatus(200);
    })
);

module.exports = router;