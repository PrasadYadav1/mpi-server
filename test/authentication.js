const test = require('ava');
const request = require('supertest');
const app = require('../bin/www');
const LoginResponse = require('../dtos/login').LoginResponse;
const validate = require('../utils/validations').validateRequest;

test('signup:invalid body', async t => {
    t.plan(2);
    const res =  await request(app)
		.post('/token')
		.send({});
    t.is(res.status,400);
    t.deepEqual(res.body,["Invalid value undefined supplied to /userId: String",
                    "Invalid value undefined supplied to /password: String"]);
});

test('signup:invalid model field type', async t => {
    t.plan(2);
    const res =  await request(app)
		.post('/token')
		.send({userId: 1, password: 'sarah123'});
    t.is(res.status,400);
    t.deepEqual(res.body,["Invalid value 1 supplied to /userId: String"]);
});

test('signup:invalid credentials', async t => {
   const res =  await request(app)
		.post('/token')
		.send({userId: "saghjgjgrah", password: 'sarah123'});
    t.is(res.status,401);
});

test('signup:Success', async t => {
    
    const res =  await request(app)
		.post('/token')
		.send({userId: 'AE_GH_001', password: 'Design_25'});

	t.is(res.status, 200);
	
});

test('signup:Success Body', async t => {
    
    const res =  await request(app)
		.post('/token')
		.send({userId: 'AE_GH_001', password: 'Design_25'});

    t.is(res.status, 200);
    t.is(validate(res.body,LoginResponse).isValid,true);
	
});
