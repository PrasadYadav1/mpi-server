const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');
const auth = require('../authentication/auth')();
const pagination = require('../dtos/pagination').Pagination;
const targetrevenue = require('../models').targetrevenue;
const reqQueryValidate = require('../utils/req_generic_validations').reqqueryvalidation;
const reqpathNewvalidation = require('../utils/req_generic_validations').reqpathNewvalidation;
const reqBodyValidate = require('../utils/req_generic_validations').reqBodyValidation;
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers').asyncErrorHandler;
const dtos = require('../dtos/targetrevenue');
const user = require('../utils/user');

router.post('/', [auth.authenticate(),reqBodyValidate(dtos.targetRevenuePost)],
 asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const sameYearRecord = await targetrevenue.findOne({
        attributes: [
            'id'
        ],
        where: {
            isActive: true,
            assigneeId: req.body.assigneeId, 
            year: req.body.year
        },
        raw: true
    });
    if(sameYearRecord) {
        return res.status(409).json({
            message: 'already record existing'
        });
    }
    const result = await targetrevenue.create({
        ...req.body,
        createdBy: req.user.userId,
        updatedBy: req.user.userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isActive: true
    });
    return res.status(200).json({
         message: "success"
     });

}));
router.get('/', [auth.authenticate(),reqQueryValidate(pagination)],
 asyncErrorHandlerMiddleWare(async (req, res, next) => {
    let relatedUsers = [...(await user.getRelatedUsers(req.user, ['id']))
    .map((usr) => usr.id), ...[req.user.userId]];
    const result = await targetrevenue.findAndCount({
        attributes: [
            'id',
            'amount',
            'year',
            [
                sequelize.literal(
                    `(Select concat("firstName",' ',"lastName")  from "Users" where "Users".id = "targetrevenue"."assigneeId")`
                ),
                'assignedTo',
            ],
            [
                sequelize.literal(
                    `(Select concat("firstName",' ',"lastName")  from "Users" where "Users".id = "targetrevenue"."createdBy")`
                ),
                'assignedBy',
            ]
        ],
        where: {
            isActive: true,
            $or: [
                { assigneeId: {$in: relatedUsers} },
                { createdBy: {$in: relatedUsers} } 
            ]
        },
        limit: parseInt(req.query.pageSize),
        offset: parseInt(req.query.pageSize) * parseInt(req.query.pageIndex)  
    });
    return res.status(200).json(result);
}));

router.get('/:id/details', [auth.authenticate(),
    reqpathNewvalidation(dtos.targetRevenueEditPathParams)],
 asyncErrorHandlerMiddleWare(async (req, res, next) => {
    let relatedUsers = [...(await user.getRelatedUsers(req.user, ['id']))
    .map((usr) => usr.id), ...[req.user.userId]];
    const result = await targetrevenue.findOne({
        attributes: [
            'id',
            'amount',
            'year',
            [
                sequelize.literal(
                    `(Select concat("firstName",' ',"lastName")  from "Users" where "Users".id = "targetrevenue"."assigneeId")`
                ),
                'assignedTo',
            ],
            [
                sequelize.literal(
                    `(Select concat("firstName",' ',"lastName")  from "Users" where "Users".id = "targetrevenue"."createdBy")`
                ),
                'assignedBy',
            ]
        ],
        where: {
            isActive: true,
            id: req.params.id
        }  
    });
    if(result) return res.status(200).json(result);
    return res.status(404).json({message: 'not found'});
}));

router.put('/:id', [auth.authenticate(),
    reqpathNewvalidation(dtos.targetRevenueEditPathParams),
    reqBodyValidate(dtos.targetRevenuePost)],
 asyncErrorHandlerMiddleWare(async (req, res, next) => {
    const record = await targetrevenue.findOne({
        attributes: [
            'id'
        ],
        where: {
            isActive: true,
            id: req.params.id
        },
        raw: true
    });
    if(!record) {
        return res.status(404).json({
            message: 'record not found'
        });
    }
    const result = await targetrevenue.update({
        ...req.body,
        updatedBy: req.user.userId,
        updatedAt: Date.now(),
    },{
        where: {
            id: req.params.id
        }
    });
    return res.status(200).json({
         message: "success"
     });

}));

module.exports = router