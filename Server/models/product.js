const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    type: { type: String, required: true, trim: true, maxlength: 50 },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, min: 0, max: 5 },
    warranty_years: { type: Number, min: 0 },
    available: { type: Boolean, default: true },
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    
    // --- AJOUTS POUR LE CRITÈRE C26 (BLOCKCHAIN) ---
    // Empreinte numérique SHA-256 du produit actuel
    hash: { type: String }, 
    // Empreinte du produit précédent dans la chaîne
    previousHash: { type: String } 
    // -----------------------------------------------
  },
  { timestamps: true }
);

productSchema.index({ createdby: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('product', productSchema);