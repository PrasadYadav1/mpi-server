const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const offers = require('../models').offers;
const products = require('../models').products;
const offerDTO = require('../dtos/offer')
const multer = require('multer');
const reqQueryValidate = require('../utils/req_generic_validations').reqqueryvalidation;
const reqBodyValidation = require('../utils/req_generic_validations').reqBodyValidation;
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
                    $like: `%${req.query.propertyValue}%`,
                },
            };
        }

        const limit = parseInt(req.query.pageSize);
        return res.json(
            await offers.findAndCount({
                attributes: ['id', 'offerDate', 'productId',
                    [
                        sequelize.literal(
                            '(select name from products where id = offers."productId")'
                        ),
                        'productName',
                    ], 'offerType', 'imageUrl', 'updatedBy', 'createdAt'],
                where: whereStatement,
                order: [['updatedAt', 'DESC']],
                limit: limit,
                offset: parseInt(limit * req.query.pageIndex),
            })
        );
    })
);

//upload images
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const dateTime = Date.now();
        callback(null, './public/images/offers');
    },
    filename: function (req, file, cb) {
        let datetimestamp = Date.now();
        cb(
            null,
            file.fieldname +
            '-' +
            datetimestamp +
            '.' +
            file.originalname.split('.')[file.originalname.split('.').length - 1]
        );
    },
});

const upload = multer({
    storage: storage,
}).array('file', 5);
router.post(
    '/images/upload',

    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        upload(req, res, function (err) {
            if (err) {
                return res.end('Error uploading file.');
            }
            let result = req.files.map(function (x) {
                let y = {};

                (y['fileName'] = x.filename), (y['filePath'] = x.path.slice(7)),
                    (y['displayPath'] = "https://" + req.hostname + "/" + x.path.slice(7));
                return y;
            });
            res.json({
                offerImages: result,
            });
        });
    })
);
router.post(
    '/',
    [auth.authenticate(), reqBodyValidation(offerDTO.offerPost)],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const offer = await offers.create({
            ...req.body,
            createdBy: req.user.userId,
            updatedBy: req.user.userId,
            isActive: true,
        });
        return res.json(
            offer,
        );
    })
);


router.get(
    '/:id/details',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const offer = await offers.findOne({
            attributes: [
                'id',
                'offerDate',
                'productId',
                'offerType',
                'imageUrl',
                'updatedBy',
                'createdAt'],
            include: [
                {
                    model: products,
                    attributes: ['name'],
                    required: true,
                },
            ],
            where: {
                isActive: true,
                id: req.params.id,
            },
        });
        if (!offer) return res.status(404).json({ message: 'not found' });
        const { product, ...remaining } = offer.get({ plain: true });
        return res.json({
            ...remaining,
            productName: product.name
        });
    })
);

router.put(
    '/:id',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const pId = req.params.id;
        const offer = await offers.update(
            {
                offerDate: req.body.offerDate,
                productId: req.body.productId,
                offerType: req.body.offerType,
                imageUrl: req.body.imageUrl,
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
    '/:offerId',
    [auth.authenticate()],
    asyncErrorHandlerMiddleWare(async (req, res, next) => {
        const offer = await offers.update(
            {
                isActive: false,
                updatedBy: req.user.userId,
            },
            {
                where: {
                    id: req.params.offerId,
                },
            }
        );
        return res.sendStatus(200);
    })
);
module.exports = router;
