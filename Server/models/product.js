const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    type: { type: String, required: true, trim: true, maxlength: 50 },
    price: { type: Number, required: true, min: 0 },            // DECIMAL(10,2) -> Number
    rating: { type: Number, min: 0, max: 5 },                   // DECIMAL(3,1) -> Number
    warranty_years: { type: Number, min: 0 },
    available: { type: Boolean, default: true },
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  },
  { timestamps: true }
);

productSchema.index({ createdby: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('product', productSchema);
