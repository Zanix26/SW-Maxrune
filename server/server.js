// Umgebungsvariablen laden
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const redis = require('redis');
const apiRoutes = require('./routes/api');
const http = require('http'); // Neu: HTTP-Modul für mehr Kontrolle

const app = express();
const PORT = process.env.PORT || 5000;

// Erhöhe die maximale Anfragegröße
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Middleware
app.use(cors({
  origin: 'https://optimizer.stocktropia.com',
  credentials: true,
}));
app.use(express.json());

// MongoDB-Verbindung
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB verbunden'))
  .catch(err => console.error('MongoDB-Verbindungsfehler:', err));

// Redis-Verbindung
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});
redisClient.on('connect', () => console.log('Redis verbunden'));
redisClient.on('error', err => console.error('Redis-Verbindungsfehler:', err));
redisClient.connect();

// Routen
app.use('/api', apiRoutes);

// Server erstellen und explizit an IPv4 binden
const server = http.createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server läuft auf Port ${PORT} (IPv4)`);
});

// Optional: IPv4 explizit erzwingen
server.on('listening', () => {
  const address = server.address();
  console.log(`Server lauscht auf ${address.address}:${address.port} (Family: ${address.family})`);
});