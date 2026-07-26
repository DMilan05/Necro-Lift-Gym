const request = require('supertest');
const app = require('../app');
const { connect, closeDatabase, clearDatabase } = require('./testDb');

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('User végpontok', () => {
  it('létrehoz egy usert érvényes adatokkal', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Teszt Elek', email: 'teszt@pelda.hu' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Teszt Elek');
  });

  it('elutasítja a duplikált emailt', async () => {
    await request(app).post('/api/users').send({ name: 'Első', email: 'ugyanaz@pelda.hu' });
    const res = await request(app).post('/api/users').send({ name: 'Második', email: 'ugyanaz@pelda.hu' });

    expect(res.status).toBe(400);
  });
});