const test = require('ava');
const request = require('supertest');
const app = require('../app');

test('TaskTypes: Get All', async t => {
  t.plan(1);
  const res = await request(app)
    .get('/tasktypes')
    .expect([
      {
        id: 1,
        name: 'FaceToFace'
      },
      {
        id: 2,
        name: 'Email'
      },
      {
        id: 3,
        name: 'Call'
      }
    ]);
  t.is(res.status, 200);
});

test('TaskTypes: Get by id', async t => {
  t.plan(1);
  const res = await request(app)
    .get('/tasktypes/1')
    .expect({
      id: 1,
      name: 'FaceToFace'
    });
  t.is(res.status, 200);
});
