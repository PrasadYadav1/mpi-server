const test = require('ava');
const request = require('supertest');
const app = require('../app');
const customerResponse = require('../dtos/customer').CustomerReqParams;
const validate = require('../utils/validations').validateRequest;

test('Customers: Get All', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  t.plan(1);
  const res = await request(app)
    .get('/customers?pageSize=3&pageIndex=0')
    .set(header);
  t.is(res.status, 200);
});

test('Customers: Get By customerAccountId', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  t.plan(1);
  const res = await request(app)
    .get('/customers/:customerAccountId')
    .set(header);
  t.is(res.status, 200);
});

test('Customers: Get By customerAccountName', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  t.plan(1);
  const res = await request(app)
    .get('/customers/customeraccountname/:customerAccountName')
    .set(header);
  t.is(res.status, 200);
});

test('Customer: Create', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  const body = {
    customerAccountName: 'spice',
    customerAddress: 'Indosat Ooredo Jakartha',
    customerType: 'Business',
    ccaId: '123',
    ccaName: 'spice',
    locationId: 'JL.-1',
    location: 'Indonesia',
    longitude: 106.8789081,
    latitude: -6.306792499999998,
    phoneNo: '32321234',
    emailId: 'Ak@spice.com'
  };
  t.plan(2);
  const res = await request(app)
    .post('/customers')
    .set(header)
    .send(body);
  t.is(res.status, 200);
  t.is(validate(res.body, customerResponse).isValid, true);
});

test('Customer: Update', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  const body = {
    customerAccountName: 'spice',
    customerAddress: 'Indosat Ooredo Jakartha',
    customerType: 'orporate',
    ccaId: '1234',
    ccaName: 'spice1',
    locationId: 'Indonesia',
    location: 'Indonesia',
    longitude: 106.8789081,
    latitude: -6.306792499999998,
    phoneNo: '32321234',
    emailId: 'Ak@spice.com'
  };
  t.plan(1);

  const res = await request(app)
    .put('/customers/:id')
    .set(header)
    .send(body);
  t.is(res.status, 200);
});
