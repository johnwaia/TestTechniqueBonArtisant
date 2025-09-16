const jwt = require('jsonwebtoken');
const requireAuth = require('../middleware/requireAuth');
const User = require('../models/user');
const { setupDB } = require('./setup');

setupDB();

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const next = jest.fn();

describe('requireAuth middleware', () => {
  test('401 si token manquant', async () => {
    const req = { headers: {} };
    const res = mockRes();
    await requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('401 si token invalide', async () => {
    const req = { headers: { authorization: 'Bearer bad.token' } };
    const res = mockRes();
    await requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('next() si token valide', async () => {
    const user = await User.create({ username: 'm@m.com', passwordHash: 'x' });
    const token = jwt.sign({ id: user._id.toString(), username: user.username }, process.env.JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = mockRes();
    await requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toHaveProperty('id', user._id.toString());
  });
});
