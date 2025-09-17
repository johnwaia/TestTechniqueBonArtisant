const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const usersRoutes = require('./routes/users');
const contactsRoutes = require('./routes/contacts');
const Contact = require('./models/contact'); // pour syncIndexes()

const app = express();
const PORT = process.env.PORT || 5000;


const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://radiant-alfajores-52e968.netlify.app', // site Netlify
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); 
    try {
      const host = new URL(origin).hostname;
      const isNetlifyPreview = /\.netlify\.app$/.test(host);
      const ok = ALLOWED_ORIGINS.includes(origin) || isNetlifyPreview;
      return ok ? cb(null, true) : cb(new Error('Not allowed by CORS'));
    } catch {
      return cb(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false, 
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/', (_req, res) => res.send('API OK'));

app.use('/api/users', usersRoutes);
app.use('/api', contactsRoutes);

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('❌ MONGO_URI manquant');
  process.exit(1);
}

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 7000 })
  .then(async () => {
    console.log('✅ MongoDB connecté');

    try {
      await Contact.syncIndexes();
      console.log('✅ Indexes synchronisés');
    } catch (e) {
      console.error('⚠️ Échec syncIndexes:', e?.message || e);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 API sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur connexion MongoDB :', err);
    process.exit(1);
  });

module.exports = app;
