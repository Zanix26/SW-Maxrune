const express = require('express');
const router = express.Router();
const multer = require('multer'); // Für Datei-Uploads
const authMiddleware = require('../middleware/auth');
const { register, login } = require('../controllers/authController');
const { getRunes, addRune } = require('../controllers/runeController');
const { getMonster, addMonster } = require('../controllers/monsterController');
const { optimizeBuild } = require('../controllers/optimizerController');
const { uploadJson, getUserData } = require('../controllers/userDataController');

// Multer-Konfiguration für Datei-Uploads
const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB Limit
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(json)$/)) {
      return cb(new Error('Bitte lade eine JSON-Datei hoch'));
    }
    cb(null, true);
  },
  storage: multer.memoryStorage(),
});

// Authentifizierung
router.post('/auth/register', register);
router.post('/auth/login', login);

// Geschützte Routen
router.get('/runes', authMiddleware, getRunes);
router.post('/runes/add', authMiddleware, addRune);
router.get('/monsters', authMiddleware, getMonster);
router.post('/monsters/add', authMiddleware, addMonster);
router.post('/optimize', authMiddleware, optimizeBuild);

// Neue Routen für SWEX-Daten
router.post('/upload-json', authMiddleware, upload.single('jsonFile'), uploadJson);
router.get('/user-data', authMiddleware, getUserData);

module.exports = router;