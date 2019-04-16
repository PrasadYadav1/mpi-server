var express = require('express');
var router = express.Router();
var users = require('../models').users;
const jwt = require('jwt-simple');
const cfg = require('../authentication/jwt_config');
const Login = require('../dtos/login').Login;
const validate = require('../utils/validations').validateRequest;
const asyncErrorHandlerMiddleWare = require('../utils/async_custom_handlers').asyncErrorHandler;
const moment = require('moment');
var config = require(__dirname + '/../config/config.json');
const { sendSampleMail } = require('../notifications/mail');
const path = require('path');

const allowedExt = [
	'.js',
	'.ico',
	'.css',
	'.png',
	'.jpg',
	'.woff2',
	'.woff',
	'.ttf',
	'.svg',
];

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', { title: 'Express' });
});

const reqValidation = (req, res, next) => {
	let validRes = validate(req.body, Login);
	if (validRes.isValid) next();
	else res.status(400).json(validRes.errors);
};
const bcrypt = require('bcryptjs');
router.post(
	'/api/token',
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const hashedPassword = bcrypt.hashSync(req.body.password, 10);
		let user = await users.find({
			attributes: ['id', 'userName', 'password', 'firstName', 'lastName', 'email', 'userRole', 'designation', 'avatar', 'mobileNumber'],
			where: {
				isActive: true,
				email: req.body.email,
			},
			raw: true,
		});
		if (user && await bcrypt.compare(req.body.password, user.password)) {
			res.json({
				token: jwt.encode({ id: user.id, datetime: moment().format('YYYY-MM-DD h:mm:ss a') }, cfg.jwtSecret),
				users: {
					id: user.id,
					userName: user.userName,
					firstName: user.firstName,
					email: user.email,
					userRole: user.userRole,
					designation: user.designation,
					avatar: user.avatar ? 'https://' + req.hostname + '/' + user.avatar : null,
					mobileNumber: user.mobileNumber,
				},
			});
		} else res.sendStatus(401);
	})
);

router.get(
	'/api/sendMail',
	asyncErrorHandlerMiddleWare(async (req, res, next) => {
		const ab = sendSampleMail();
		return res.json({ message: 'success' });
	})
);

module.exports = router;
