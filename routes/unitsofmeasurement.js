const express = require('express');
const router = express.Router();
const auth = require('../authentication/auth')();
const sequelize = require('sequelize');
const { pathParam } = require('../dtos/formtypes');
const unitsofmeasurements = require('../models').unitsofmeasurements;
const {
    reqpathNewvalidation,
} = require('../utils/req_generic_validations');
const reqBodyValidate = require('../utils/req_generic_validations').reqBodyValidation;

const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers').asyncErrorHandler;

router.post(
    '/',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        let dataCount = await unitsofmeasurements.count(
            {
                where: {
                    $and: [
                        { isActive: true },
                        sequelize.where(sequelize.fn('lower', sequelize.col('name')), {
                            $eq: req.body.name.toLowerCase()
                        })]
                }
            });
        if (dataCount === 0) {
            const unitsofmeasurement = await unitsofmeasurements.create({
                name: req.body.name,
                description: req.body.description,
                createdBy: req.user.userId,
                updatedBy: req.user.userId,
                isActive: true,
            });
            return res.json(unitsofmeasurement);
        } else {
            return res.status(409).json({ message: 'units of measurement already exists with name' })
        }

    })
);

router.get('/all', asyncErrorHandlerMiddleWare(async (req, res, next) => {
    return res.status(200).json(await unitsofmeasurements.findAll({
        attributes: ['id', 'name'],
        where: {
            isActive: true
        }
    }));
}));
router.get(
    '/:id/details',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const unitsofmeasurement = await unitsofmeasurements.findOne({
            attributes: [
                'id',
                'name',
                'description',
                'updatedBy',
                'updatedAt',
                'createdAt',
            ],
            where: {
                isActive: true,
                id: req.params.id,
            },
        });
        return res.json(unitsofmeasurement);
    })
);
router.put(
    '/:id',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        let dataCount = await unitsofmeasurements.count(
            {
                where: {
                    id: { $ne: req.params.id },
                    $and: [
                        {
                            isActive: true
                        },
                        sequelize.where(sequelize.fn('lower', sequelize.col('name')), {
                            $eq: req.body.name.toLowerCase()
                        })],

                }
            });
        if (dataCount === 0) {
            const unitsofmeasurement = await unitsofmeasurements.update(
                {
                    name: req.body.name,
                    description: req.body.description,
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
        } else {
            return res.status(409).json({ message: 'units of measurement already exists with name' })
        }

    })
);

router.delete(
    '/:uId',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const offer = await products.update(
            {
                isActive: false,
                updatedBy: req.user.userId,
            },
            {
                where: {
                    id: req.params.uId,
                },
            }
        );
        return res.sendStatus(200);
    })
);

module.exports = router;
