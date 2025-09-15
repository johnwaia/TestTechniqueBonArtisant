const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    contactname: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    contactFirstname: { type: String, required: true },
    contactPhone: { type: String, required: true },
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    },
  { timestamps: true }
);

module.exports = mongoose.model('contact', contactSchema);
