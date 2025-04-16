// Umgebungsvariablen laden
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const redis = require('redis');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB-Verbindung
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB verbunden'))
  .catch(err => console.error('MongoDB-Verbindungsfehler:', err));

// Redis-Verbindung
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});
redisClient.on('connect', () => console.log('Redis verbunden'));
redisClient.on('error', err => console.error('Redis-Verbindungsfehler:', err));
redisClient.connect(); // Verbindung explizit herstellen (benötigt für neuere Redis-Versionen)

// Routen
app.use('/api', apiRoutes);

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
