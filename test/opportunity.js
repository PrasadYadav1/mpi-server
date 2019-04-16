const test = require('ava');
const request = require('supertest');
const app = require('../app');
const opportunityResponse = require('../dtos/opportunity').OpportunityReqParams;
const validate = require('../utils/validations').validateRequest;

test('Opportunity: Get All', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  t.plan(1);
  const res = await request(app)
    .get('/opportunities?pageSize=3&pageIndex=0')
    .set(header);
  t.is(res.status, 200);
});

test('Opportunity: Get By customerAccountId', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  t.plan(1);
  const res = await request(app)
    .get('/opportunities/:id')
    .set(header);
  t.is(res.status, 200);
});

test('Opportunity: Create', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  const body = {
    opportunityName: 'TRN opty SFA',
    estimatedContractValue: 234.3,
    OTC: 12.2,
    MRC: 11.2,
    annualContractValue: 245.3,
    customerAddress: 'jakartha',
    location: 'jakarta',
    longitude: 1234.4,
    latitude: 1234.5,
    contractPeriod: 2,
    assignedSpvId: '1234',
    assignedAccountExecutiveId: '1235',
    customerId: 4
  };
  t.plan(2);
  const res = await request(app)
    .post('/opportunities')
    .set(header)
    .send(body);
  t.is(res.status, 200);
  t.is(validate(res.body, opportunityResponse).isValid, true);
});

test('Opportunity: Update', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  const body = {
    opportunityName: 'update TRN opty SFA',
    estimatedContractValue: 234.3,
    OTC: 12.2,
    MRC: 11.2,
    annualContractValue: 245.3,
    customerAddress: 'jakartha',
    location: 'jakarta',
    longitude: 1234.4,
    latitude: 1234.5,
    contractPeriod: 2,
    assignedSpvId: '1234',
    assignedAccountExecutiveId: '1235',
    customerId: 4
  };
  t.plan(1);
  const res = await request(app)
    .put('/opportunities/:id')
    .set(header)
    .send(body);
  t.is(res.status, 200);
});
