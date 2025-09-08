const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1) validations simples
    if (!username || !password) {
      return res.status(400).json({ message: 'username et password sont requis' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Mot de passe >= 6 caractères' });
    }

    // 2) doublons
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: 'Ce nom d’utilisateur existe déjà' });
    }

    // 3) hash
    const passwordHash = await bcrypt.hash(password, 10);

    // 4) insertion
    const user = await User.create({ username, passwordHash });

    // 5) réponse (ne jamais renvoyer le hash)
    return res.status(201).json({
      id: user._id,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('Erreur /register :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
