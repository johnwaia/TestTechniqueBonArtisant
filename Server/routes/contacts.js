const express = require('express');
const Contact = require('../models/contact');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/contact', async (req, res) => {
  try {
    console.log('[POST /api/contact] headers.authorization =', (req.headers.authorization || '').slice(0, 30) + '...');
    console.log('[POST /api/contact] raw body =', req.body);

    const contactname = (req.body?.contactname ?? '').toString().trim();
    const contactFirstname = (req.body?.contactFirstname ?? '').toString().trim();
    const contactPhone = (req.body?.contactPhone ?? '').toString().trim();

    if (!contactname || !contactFirstname || !contactPhone) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

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

router.delete('/contact/:id', async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Non authentifié' });
    const contact = await Contact.findOneAndDelete({ _id: req.params.ObjectId, createdby: req.user.id });
    if (!contact) return res.status(404).json({ message: 'Contact non trouvé' });
    return res.status(200).json({ message: 'Contact supprimé' });
  }
  catch (err) {
    console.error('Erreur DELETE /contact/id :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
