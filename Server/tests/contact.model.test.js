const mongoose = require('mongoose');
const { setupDB } = require('./setup');
const Contact = require('../models/contact');
const User = require('../models/user');

setupDB();

describe('Contact model', () => {
  test('requiert contactname/contactFirstname/contactPhone', async () => {
    const user = await User.create({ username: 'x@y.z', passwordHash: 'h' });
    const c = new Contact({ createdby: user._id });
    await expect(c.validate()).rejects.toBeTruthy();
  });

  test('minLength contactname >= 3', async () => {
    const user = await User.create({ username: 'x@y.z', passwordHash: 'h' });
    const c = new Contact({ contactname: 'ab', contactFirstname: 'A', contactPhone: '1', createdby: user._id });
    await expect(c.validate()).rejects.toBeTruthy();
  });

  test('index unique (createdby, contactname)', async () => {
    const user = await User.create({ username: 'uniq@y.z', passwordHash: 'h' });

    await Contact.create({ contactname: 'Dup', contactFirstname: 'AA', contactPhone: '1', createdby: user._id });

    // même createdby + même contactname -> violation de l’index unique
    await expect(Contact.create({
      contactname: 'Dup', contactFirstname: 'BB', contactPhone: '2', createdby: user._id
    })).rejects.toThrow();
  });
});
