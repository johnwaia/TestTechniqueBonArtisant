// models/contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    // pas de unique global ici, on gère l’unicité avec un index composé
    contactname: { type: String, required: true, trim: true, minlength: 3, maxlength: 30 },
    contactFirstname: { type: String, required: true },
    contactPhone: { type: String, required: true },
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  },
  { timestamps: true }
);

// Un contact "Nom" par user
contactSchema.index({ createdby: 1, contactname: 1 }, { unique: true });

module.exports = mongoose.model('contact', contactSchema);
