const request = require('supertest');
const app = require('../app');
const { setupDB } = require('./setup');
const User = require('../models/user');

setupDB();

describe('Users API', () => {
  test('register -> 201 + body {id, username, createdAt}', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ username: 'test@example.com', password: 'secret123' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('username', 'test@example.com');
    expect(res.body).toHaveProperty('createdAt');
  });

  test('register -> 409 si username déjà pris', async () => {
    await User.create({ username: 'dup@example.com', passwordHash: 'hash' });
    const res = await request(app)
      .post('/api/users/register')
      .send({ username: 'dup@example.com', password: 'secret123' });
    expect(res.status).toBe(409);
  });

  test('login -> 200 + { user, token }', async () => {
    // préparation: créer un user valide
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash('secret123', 10);
    await User.create({ username: 'login@example.com', passwordHash });

    const res = await request(app)
      .post('/api/users/login')
      .send({ username: 'login@example.com', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('username', 'login@example.com');
  });

  test('login -> 401 si bad credentials', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: 'none@example.com', password: 'x' });
    expect(res.status).toBe(401);
  });
});
