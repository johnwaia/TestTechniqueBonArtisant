const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { setupDB } = require('./setup');
const Contact = require('../models/contact');
const User = require('../models/user');

setupDB();

const makeToken = (userId, username='u@test.com') =>
  jwt.sign({ id: userId, username }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Contacts API (secured)', () => {
  let user, token;

  beforeEach(async () => {
    user = await User.create({ username: 'owner@test.com', passwordHash: 'hash' });
    token = makeToken(user._id.toString(), user.username);
  });

  test('POST /api/contact -> 201 crée un contact', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('Authorization', `Bearer ${token}`)
      .send({ contactname: 'Doe', contactFirstname: 'John', contactPhone: '0600000000' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toMatchObject({
      contactname: 'Doe',
      contactFirstname: 'John',
      contactPhone: '0600000000'
    });
  });

  test('GET /api/contact -> 200 liste des contacts de l’utilisateur', async () => {
    await Contact.create({ contactname: 'Ana', contactFirstname: 'AA', contactPhone: '1', createdby: user._id });
    await Contact.create({ contactname: 'Ben', contactFirstname: 'BB', contactPhone: '2', createdby: user._id });

    const res = await request(app)
      .get('/api/contact')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test('GET /api/contact/:id -> 200 retourne le contact', async () => {
    const c = await Contact.create({ contactname: 'Zed', contactFirstname: 'ZZ', contactPhone: '3', createdby: user._id });
    const res = await request(app)
      .get(`/api/contact/${c._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', c._id.toString());
  });

  test('PATCH /api/contact/:id -> 200 met à jour le contact', async () => {
    const c = await Contact.create({ contactname: 'Old', contactFirstname: 'O', contactPhone: '9', createdby: user._id });
    const res = await request(app)
      .patch(`/api/contact/${c._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ contactname: 'New', contactFirstname: 'N', contactPhone: '10' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      contactname: 'New',
      contactFirstname: 'N',
      contactPhone: '10'
    });
  });

  test('DELETE /api/contact/:id -> 200 supprime le contact', async () => {
    const c = await Contact.create({ contactname: 'Xyz', contactFirstname: 'Y', contactPhone: '8', createdby: user._id });
    const res = await request(app)
      .delete(`/api/contact/${c._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Contact supprimé');
    const stillThere = await Contact.findById(c._id);
    expect(stillThere).toBeNull();
  });

  test('401 si token manquant', async () => {
    const res = await request(app).get('/api/contact');
    expect(res.status).toBe(401);
  });
});
