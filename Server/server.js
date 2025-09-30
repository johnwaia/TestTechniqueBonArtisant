// server.js
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');

const app = express(); // ✅ créer app AVANT d'utiliser app.use(...)

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Swagger (dossier à la racine: ../swagger/swagger.json)
let swaggerSpec = {};
try {
  const swaggerPath = path.join(__dirname, '..', 'swagger', 'swagger.json');
  swaggerSpec = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  // Optionnel: servir aussi le JSON brut
  app.get('/api-docs/swagger.json', (_req, res) => res.json(swaggerSpec));
} catch (e) {
  console.warn('⚠️ Swagger non chargé (fichier manquant ?):', e.message);
}

// Routes
app.get('/', (_req, res) => res.send('API OK'));
app.use('/api/users', usersRoutes);
app.use('/api', productsRoutes);

// Démarrage Mongo + serveur
mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
  .then(() => {
    console.log('✅ MongoDB connecté');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT} — Swagger: http://localhost:${PORT}/api-docs`));
  })
  .catch(err => {
    console.error('❌ Erreur connexion MongoDB:', err);
    process.exit(1);
  });
