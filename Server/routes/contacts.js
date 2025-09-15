const express = require('express');
const Contact = require('../models/contact'); 


const router = express.Router();

router.post('/contact', async (req, res) => {
  try {
    const { contactname, contactFirstname, contactPhone } = req.body;

    if (!contactname || !contactPhone || !contactFirstname) {
      return res.status(400).json({ message: 'contactname et contactPhone sont requis' });
    }
    if (contactPhone.length < 6) {
      return res.status(400).json({ message: 'téléphone invalides' });
    }

    const exists = await Contact.findOne({ contactname });
      if (exists) return res.status(409).json({ message: 'Ce contact existe déjà' });
  

    const contact = await Contact.create({ contactname, contactFirstname, contactPhone });

  
    return res.status(201).json({ id: contact._id, contactname: contact.contactname, contactFirstname: contact.contactFirstname, contactPhone: contact.contactPhone, createdAt: contact.createdAt });
  } catch (err) {
    console.error('Erreur /contact :', err);
    return res.status(500).json({ message: 'Erreur serveur' }); 
  }
});

module.exports = router;
