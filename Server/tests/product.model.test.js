const { setupDB } = require('./setup');
const Product = require('../models/product');
const User = require('../models/user');

setupDB();

describe('Product model', () => {
  test('requiert name/type/price', async () => {
    const user = await User.create({ username: 'x@y.z', passwordHash: 'h' });
    const p = new Product({ createdby: user._id });
    await expect(p.validate()).rejects.toBeTruthy();
  });

  test('price doit être un nombre >= 0', async () => {
    const user = await User.create({ username: 'x2@y.z', passwordHash: 'h' });
    const p = new Product({
      name: 'BadPhone',
      type: 'phone',
      price: -1,
      createdby: user._id
    });
    await expect(p.validate()).rejects.toBeTruthy();
  });

  test('index unique (createdby, name)', async () => {
    const user = await User.create({ username: 'uniq@y.z', passwordHash: 'h' });

    await Product.create({ name: 'Dup', type: 'phone', price: 1, createdby: user._id });

    // même createdby + même name -> violation de l’index unique
    await expect(Product.create({
      name: 'Dup', type: 'phone', price: 2, createdby: user._id
    })).rejects.toThrow();
  });
});
