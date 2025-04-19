const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { register, login } = require('../controllers/authController');
const { getRunes, addRune } = require('../controllers/runeController');
const { getMonster, addMonster } = require('../controllers/monsterController');
const { optimizeBuild } = require('../controllers/optimizerController'); // Neu hinzufügen

// Authentifizierung
router.post('/auth/register', register);
router.post('/auth/login', login);

// Geschützte Routen
router.get('/runes', authMiddleware, getRunes);
router.post('/runes/add', authMiddleware, addRune);
router.get('/monsters', authMiddleware, getMonster);
router.post('/monsters/add', authMiddleware, addMonster);
router.post('/optimize', authMiddleware, optimizeBuild); // Neuer Endpunkt

module.exports = router;