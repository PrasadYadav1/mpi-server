const test = require('ava');
const request = require('supertest');
const app = require('../app');

test('FailedVisitReasons: Get rAll', async t => {
  t.plan(1);
  const res = await request(app)
    .get('/failedvisitreasons')
    .expect([
      {
        id: 1,
        name: 'Reschedule'
      },
      {
        id: 2,
        name: 'Traffic jam'
      },
      {
        id: 3,
        name: 'Conflict with other meeting'
      },
      {
        id: 4,
        name: 'Need to revise task'
      },
      {
        id: 5,
        name: 'Customer conflict with other meeting'
      },
      {
        id: 6,
        name: 'Customer is not available'
      },
      {
        id: 7,
        name: 'Customer refuse to meet'
      },
      {
        id: 8,
        name: 'Customer request to reschedule'
      }
    ]);
  t.is(res.status, 200);
});

test('FailedVisitReasons: Get by fid', async t => {
  t.plan(1);
  const res = await request(app)
    .get('/failedvisitreasons/1')
    .expect({
      id: 1,
      name: 'Reschedule'
    });
  t.is(res.status, 200);
});
