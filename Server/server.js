const express = require('express');
const https = require('https');
const mongoose = require('mongoose');
const users_routes = require('./routes/users.js')
const app = express();
const port = 5000;

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI)
    .then((result) => app.listen(5000))
    .catch((err) => console.log(Error))

app.use(express.json())
app.use('/api/users', users_routes)

//gestion des middleware
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
});

app.get('/', (req, res) => {
  res.send('Hello from the Node.js backend!');
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.use(express.json())
app.use('/api/users', users_routes)