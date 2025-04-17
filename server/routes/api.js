const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { register, login } = require('../controllers/authController');
const { getRunes, addRune } = require('../controllers/runeController');
const { getMonster, addMonster } = require('../controllers/monsterController');

//Authentifizierung
router.post('/auth/register', register);
router.post('auth/login', login);

//Geschützte Routen
router.get('/runes', authMiddleware, getRunes);
router.post('/runes/add', authMiddleware, addRune);
router.get('/monsters', authMiddleware, getMonster);
router.post('/momsters/add', authMiddleware, addMonster);

module.exports = router;