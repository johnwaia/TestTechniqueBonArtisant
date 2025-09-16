// app.js
const express = require('express');
const cors = require('cors');

const usersRoutes = require('./routes/users');
const contactsRoutes = require('./routes/contacts');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.get('/', (_req, res) => res.send('API OK'));

app.use('/api/users', usersRoutes);
app.use('/api', contactsRoutes);

module.exports = app;
