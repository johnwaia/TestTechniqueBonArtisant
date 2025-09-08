const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  console.log(`Requête ${req.method} reçue sur ${req.path}`);

  const origin = req.headers.origin;
  const allowedOrigins = ['http://localhost:3000'];

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('Réponse rapide OPTIONS 204');
    return res.sendStatus(204);
  }

  next();
});app.use(express.json());

// log simple pour voir les requêtes
app.use((req, _res, next) => { console.log(req.method, req.path); next(); });

app.get('/', (req, res) => res.send('API OK'));
app.use('/api/users', require('./routes/users')); // <-- ta route

const uri = process.env.MONGO_URI;
if (!uri) { console.error('❌ MONGO_URI manquant'); process.exit(1); }

mongoose.connect(uri, { serverSelectionTimeoutMS: 7000 })
  .then(() => {
    console.log('✅ MongoDB connecté');
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 API sur http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ Erreur connexion MongoDB :', err);
    process.exit(1);
  });
