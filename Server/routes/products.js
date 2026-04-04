const express = require('express');
const Product = require('../models/product');
const requireAuth = require('../middleware/requireAuth');
const crypto = require('crypto'); // Import requis pour le hachage

const router = express.Router();
router.use(requireAuth);

// Fonction utilitaire pour calculer le hash du bloc (C26)
const calculateBlockHash = (data, previousHash) => {
  const content = JSON.stringify(data) + previousHash;
  return crypto.createHash('sha256').update(content).digest('hex');
};

router.post('/product', async (req, res) => {
  try {
    const name = (req.body?.name ?? '').toString().trim();
    const type = (req.body?.type ?? '').toString().trim();
    const price = Number(req.body?.price);
    const rating = req.body?.rating !== undefined ? Number(req.body.rating) : undefined;
    const warranty_years = req.body?.warranty_years !== undefined ? Number(req.body.warranty_years) : undefined;
    const available = req.body?.available !== undefined ? Boolean(req.body.available) : undefined;

    if (!name || !type || Number.isNaN(price)) {
      return res.status(400).json({ message: 'Données manquantes ou invalides' });
    }

    // --- LOGIQUE BLOCKCHAIN (C26) ---
    const lastProduct = await Product.findOne().sort({ createdAt: -1 });
    const previousHash = lastProduct?.hash || "0".repeat(64);
    const hash = calculateBlockHash({ name, type, price }, previousHash);
    // --------------------------------

    const product = await Product.create({
      name, type, price, rating, warranty_years, available,
      createdby: req.user.id,
      hash,
      previousHash
    });

    const populated = await Product.findById(product._id)
      .populate({ path: 'createdby', select: 'username' });

    const io = req.app.get('io');
    io?.emit('productCreated', {
      product: populated, 
      actor: { id: req.user.id, username: req.user.username }
    });

    return res.status(201).json(populated);
  } catch (err) {
    console.error('Erreur POST /product :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route d'audit pour vérifier l'intégrité de la chaîne (C26.1)
router.get('/audit', async (req, res) => {
  const products = await Product.find().sort({ createdAt: 1 });
  let isValid = true;
  for (let i = 1; i < products.length; i++) {
    if (products[i].previousHash !== products[i-1].hash) {
      isValid = false; break;
    }
  }
  res.json({ status: isValid ? "✅ Registre intègre" : "🚨 Rupture détectée", isValid });
});

// Routes GET, PATCH, DELETE classiques (inchangées par rapport à ton original)
router.get('/product', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).populate({ path: 'createdby', select: 'username' });
    return res.status(200).json(products);
  } catch (err) { return res.status(500).json({ message: 'Erreur serveur' }); }
});

router.patch('/product/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    const populated = await Product.findById(product._id).populate({ path: 'createdby', select: 'username' });
    const io = req.app.get('io');
    io?.emit('productUpdated', { product: populated, actor: { id: req.user.id, username: req.user.username } });
    return res.status(200).json(populated);
  } catch (err) { return res.status(500).json({ message: 'Erreur serveur' }); }
});

router.delete('/product/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    const io = req.app.get('io');
    io?.emit('productDeleted', { id: req.params.id, actor: { id: req.user.id, username: req.user.username } });
    return res.status(200).json({ message: 'Produit supprimé' });
  } catch (err) { return res.status(500).json({ message: 'Erreur serveur' }); }
});

module.exports = router;