const test = require('ava');
const request = require('supertest');
const app = require('../app');
const newsResponse = require('../dtos/news').newsReqParams;
const validate = require('../utils/validations').validateRequest;

test('News: Get All', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  t.plan(1);
  const res = await request(app)
    .get('/news?pageSize=3&pageIndex=0')
    .set(header);
  t.is(res.status, 200);
});

test('News: Get All news between given dates', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  t.plan(1);
  const res = await request(app)
    .get('/news/toDate/:toDate/fromDate/:fromDate?pageSize=3&pageIndex=0')
    .set(header);
  t.is(res.status, 200);
});

test('News: Create', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  const body = {
    content: 'spice',
    title: 'Indosat Ooredo Jakartha',
    date: '2017-10-27'
  };
  t.plan(2);
  const res = await request(app)
    .post('/news')
    .set(header)
    .send(body);
  t.is(res.status, 200);
  t.is(validate(res.body, newsResponse).isValid, true);
});

test('News: Delete by id', async t => {
  const header = {
    Authorization:
      'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6Mn0.aUb_nRvvc16eD6ZVrHJWVhi0GwjeZpdAIKtHIQa8IpI'
  };
  t.plan(1);
  const res = await request(app)
    .delete('/news/:id')
    .set(header);
  t.is(res.status, 200);
});
