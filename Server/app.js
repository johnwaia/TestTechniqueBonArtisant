const express = require('express');
let morgan;
try { morgan = require('morgan'); } catch { morgan = () => (_req, _res, next) => next(); }
const cors = require('cors');

const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');

const app = express();

app.use(morgan('dev'));
app.use(express.json());

app.use(cors());          
app.get('/', (_req, res) => res.send('API OK'));

// Routes
app.use('/api/users', usersRoutes);
app.use('/api', productsRoutes);

module.exports = app;
