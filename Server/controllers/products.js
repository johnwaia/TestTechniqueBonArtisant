// products.js (contrôleur en mémoire)

// "Base de données" en mémoire
let products = [
  // exemple: { id: 1, name: 'AC1 Phone1', type: 'phone', price: 200.05, rating: 3.8, warranty_years: 1, available: true }
];

// utilitaires
const toNumber = (v) => (v === undefined || v === null || v === '' ? undefined : Number(v));
const toBoolean = (v) => {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v.toLowerCase() === 'true' || v === '1';
  if (typeof v === 'number') return v === 1;
  return undefined;
};
const nextId = () => (products.length ? Math.max(...products.map(p => p.id)) + 1 : 1);

// GET /products
const getProducts = (req, res) => {
  res.json(products);
};

// GET /products/:id
const getProduct = (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) return res.status(404).send('product not found');
  res.json(product);
};

// POST /products
const createProduct = (req, res) => {
  const name = (req.body?.name ?? '').toString().trim();
  const type = (req.body?.type ?? '').toString().trim();
  const price = toNumber(req.body?.price);
  const rating = toNumber(req.body?.rating);
  const warranty_years = toNumber(req.body?.warranty_years);
  const available = toBoolean(req.body?.available);

  if (!name || !type || Number.isNaN(price)) {
    return res.status(400).json({ message: 'name, type et price sont requis (price doit être un nombre)' });
  }

  // unicité simple sur le nom (optionnel)
  if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ message: 'Un produit avec ce nom existe déjà' });
  }

  const newProduct = {
    id: nextId(),
    name,
    type,
    price: Number(price.toFixed?.(2) ?? price), // normalisation 2 décimales si possible
    rating: rating !== undefined && !Number.isNaN(rating) ? rating : undefined,
    warranty_years: warranty_years !== undefined && !Number.isNaN(warranty_years) ? warranty_years : undefined,
    available: available !== undefined ? available : true,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
};

// PATCH /products/:id
const updateProduct = (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).send('product not found');

  const current = products[index];

  // Prépare payload avec fallback sur l’existant
  const name = req.body?.name !== undefined ? req.body.name.toString().trim() : current.name;
  const type = req.body?.type !== undefined ? req.body.type.toString().trim() : current.type;

  const priceRaw = req.body?.price !== undefined ? toNumber(req.body.price) : current.price;
  const ratingRaw = req.body?.rating !== undefined ? toNumber(req.body.rating) : current.rating;
  const warrantyRaw = req.body?.warranty_years !== undefined ? toNumber(req.body.warranty_years) : current.warranty_years;
  const availableRaw = req.body?.available !== undefined ? toBoolean(req.body.available) : current.available;

  if (!name || !type || Number.isNaN(priceRaw)) {
    return res.status(400).json({ message: 'name, type et price sont requis/valides' });
  }

  // Vérifie unicité du nom si modifié
  if (name.toLowerCase() !== current.name.toLowerCase() &&
      products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    return res.status(409).json({ message: 'Un produit avec ce nom existe déjà' });
  }

  const updated = {
    ...current,
    name,
    type,
    price: Number(priceRaw.toFixed?.(2) ?? priceRaw),
    rating: ratingRaw,
    warranty_years: warrantyRaw,
    available: availableRaw,
  };

  products[index] = updated;
  res.status(200).json(updated);
};

// DELETE /products/:id
const deleteProduct = (req, res) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).send('product not found');

  products.splice(index, 1);
  res.status(200).json({ message: 'product deleted' });
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
