const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');           // garde le même export d'app que tes anciens tests
const { setupDB } = require('./setup');
const Product = require('../models/product');
const User = require('../models/user');

setupDB();

const makeToken = (userId, username='u@test.com') =>
  jwt.sign({ id: userId, username }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Products API (secured)', () => {
  let user, token;

  beforeEach(async () => {
    user = await User.create({ username: 'owner@test.com', passwordHash: 'hash' });
    token = makeToken(user._id.toString(), user.username);
  });

  test('POST /api/product -> 201 crée un produit', async () => {
    const res = await request(app)
      .post('/api/product')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'AC1 Phone1',
        type: 'phone',
        price: 200.05,
        rating: 3.8,
        warranty_years: 1,
        available: true
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toMatchObject({
      name: 'AC1 Phone1',
      type: 'phone',
      price: 200.05,
      rating: 3.8,
      warranty_years: 1,
      available: true
    });
  });

  test('GET /api/product -> 200 liste des produits de l’utilisateur', async () => {
    await Product.create({ name: 'A', type: 'phone', price: 1, createdby: user._id });
    await Product.create({ name: 'B', type: 'tablet', price: 2, createdby: user._id });

    const res = await request(app)
      .get('/api/product')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test('GET /api/product/:id -> 200 retourne le produit', async () => {
    const p = await Product.create({ name: 'Z', type: 'phone', price: 3, createdby: user._id });
    const res = await request(app)
      .get(`/api/product/${p._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id', p._id.toString());
  });

  test('PATCH /api/product/:id -> 200 met à jour le produit', async () => {
    const p = await Product.create({ name: 'Old', type: 'phone', price: 9, createdby: user._id });
    const res = await request(app)
      .patch(`/api/product/${p._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New', price: 10, available: false });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      name: 'New',
      price: 10,
      available: false
    });
  });

  test('DELETE /api/product/:id -> 200 supprime le produit', async () => {
    const p = await Product.create({ name: 'X', type: 'phone', price: 8, createdby: user._id });
    const res = await request(app)
      .delete(`/api/product/${p._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message'); // message "Produit supprimé"
    const stillThere = await Product.findById(p._id);
    expect(stillThere).toBeNull();
  });

  test('401 si token manquant', async () => {
    const res = await request(app).get('/api/product');
    expect(res.status).toBe(401);
  });
});
