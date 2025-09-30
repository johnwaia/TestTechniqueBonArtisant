const express = require('express');
const Product = require('../models/product');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

router.post('/product', async (req, res) => {
  try {
    const name = (req.body?.name ?? '').toString().trim();
    const type = (req.body?.type ?? '').toString().trim();
    const price = Number(req.body?.price);
    const rating = req.body?.rating !== undefined ? Number(req.body.rating) : undefined;
    const warranty_years = req.body?.warranty_years !== undefined ? Number(req.body.warranty_years) : undefined;
    const available = req.body?.available !== undefined ? Boolean(req.body.available) : undefined;

    if (!name || !type || Number.isNaN(price)) {
      return res.status(400).json({ message: 'Données manquantes ou invalides (name, type, price requis)' });
    }
    if (!req.user?.id) return res.status(401).json({ message: 'Non authentifié' });

    const exists = await Product.findOne({ name, createdby: req.user.id });
    if (exists) return res.status(409).json({ message: 'Ce produit existe déjà' });

    const product = await Product.create({
      name, type, price, rating, warranty_years, available,
      createdby: req.user.id,
    });

    return res.status(201).json({
      id: product._id,
      name: product.name,
      type: product.type,
      price: product.price,
      rating: product.rating,
      warranty_years: product.warranty_years,
      available: product.available,
      createdAt: product.createdAt,
    });
  } catch (err) {
    console.error('Erreur POST /product :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/product', async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Non authentifié' });

    // tri récent d’abord, comme tes contacts
    const products = await Product.find({ createdby: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (err) {
    console.error('Erreur GET /product :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/product/:id', async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Non authentifié' });
    const product = await Product.findOne({ _id: req.params.id, createdby: req.user.id });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    return res.status(200).json(product);
  } catch (err) {
    console.error('Erreur GET /product/:id :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.patch('/product/:id', async (req, res) => {
  try {
    const payload = {};
    if (req.body?.name !== undefined) payload.name = req.body.name.toString().trim();
    if (req.body?.type !== undefined) payload.type = req.body.type.toString().trim();
    if (req.body?.price !== undefined) payload.price = Number(req.body.price);
    if (req.body?.rating !== undefined) payload.rating = Number(req.body.rating);
    if (req.body?.warranty_years !== undefined) payload.warranty_years = Number(req.body.warranty_years);
    if (req.body?.available !== undefined) payload.available = Boolean(req.body.available);

    if (!req.user?.id) return res.status(401).json({ message: 'Non authentifié' });

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, createdby: req.user.id },
      payload,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    return res.status(200).json({
      id: product._id,
      name: product.name,
      type: product.type,
      price: product.price,
      rating: product.rating,
      warranty_years: product.warranty_years,
      available: product.available,
      createdAt: product.createdAt,
    });
  } catch (err) {
    console.error('Erreur PATCH /product/:id :', err);
    if (err?.code === 11000) return res.status(409).json({ message: 'Un produit avec ce nom existe déjà' });
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/product/:id', async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Non authentifié' });
    const product = await Product.findOneAndDelete({ _id: req.params.id, createdby: req.user.id });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    return res.status(200).json({ message: 'Produit supprimé' });
  } catch (err) {
    console.error('Erreur DELETE /product/:id :', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
