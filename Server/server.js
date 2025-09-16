const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const usersRoutes = require('./routes/users');
const contactsRoutes = require('./routes/contacts');
const Contact = require('./models/contact'); // pour syncIndexes

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080','https://radiant-alfajores-52e968.netlify.app/'],
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PATCH', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use((req, _res, next) => { console.log(req.method, req.path); next(); });

app.get('/', (req, res) => res.send('API OK'));

app.use('/api/users', usersRoutes);
app.use('/api', contactsRoutes);

const uri = process.env.MONGO_URI;
if (!uri) { 
  console.error('❌ MONGO_URI manquant'); 
  process.exit(1); 
}

mongoose.connect(uri, { serverSelectionTimeoutMS: 7000 })
  .then(async () => {
    console.log('✅ MongoDB connecté');
    await Contact.syncIndexes();
    app.listen(PORT, '0.0.0.0', () =>
      console.log(`🚀 API sur http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ Erreur connexion MongoDB :', err);
    process.exit(1);
  });
