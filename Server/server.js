// server.js
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const usersRoutes = require('./routes/users');
const productsRoutes = require('./routes/products');

const app = express();

// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors()); // en dev, simple et efficace

// ----- Swagger (si présent) -----
try {
  const swaggerUi = require('swagger-ui-express');
  const swaggerSpec = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'swagger', 'swagger.json'), 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
} catch { /* noop si pas de swagger */ }

// routes
app.get('/', (_req, res) => res.send('API OK'));
app.use('/api/users', usersRoutes);
app.use('/api', productsRoutes);

// ---------- Socket.IO ----------
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET','POST','PATCH','PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

// rendre io accessible dans les routes via req.app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 client connecté', socket.id);
  socket.on('disconnect', () => console.log('🔌 client déconnecté', socket.id));
});

// ---------- Démarrage ----------
mongoose.connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`🚀 Serveur http://localhost:${PORT}  |  Docs: /api-docs`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB:', err);
    process.exit(1);
  });
