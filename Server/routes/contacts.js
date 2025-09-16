// routes/contacts.js
const express = require('express');
const Contact = require('../models/contact');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Protège toutes les routes contacts
router.use(requireAuth);

// POST /api/contact — crée un contact avec createdby auto (depuis le token)
router.post('/contact', async (req, res) => {
  try {
    // LOGS DIAG (supprime après test si tu veux)
    console.log('[POST /api/contact] headers.authorization =', (req.headers.authorization || '').slice(0, 30) + '...');
    console.log('[POST /api/contact] raw body =', req.body);

    // Cast + trim pour éviter undefined/null/numériques etc.
    const contactname = (req.body?.contactname ?? '').toString().trim();
    const contactFirstname = (req.body?.contactFirstname ?? '').toString().trim();
    const contactPhone = (req.body?.contactPhone ?? '').toString().trim();

    if (!contactname || !contactFirstname || !contactPhone) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    // Éviter le doublon pour CET utilisateur
    const exists = await Contact.findOne({ contactname, createdby: req.user.id });
    if (exists) return res.status(409).json({ message: 'Ce contact existe déjà' });

    const contact = await Contact.create({
      contactname,
      contactFirstname,
      contactPhone,
      createdby: req.user.id,
    });

    return res.status(201).json({
      id: contact._id,
      contactname: contact.contactname,
      contactFirstname: contact.contactFirstname,
      contactPhone: contact.contactPhone,
      createdAt: contact.createdAt
    });
  } catch (err) {
    console.error('Erreur /contact :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/contact — liste uniquement MES contacts
router.get('/contact', async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Non authentifié' });
    const contacts = await Contact.find({ createdby: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(contacts);
  } catch (err) {
    console.error('Erreur /contact :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
