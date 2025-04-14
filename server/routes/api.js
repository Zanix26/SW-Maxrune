const express = require('express');
const multer = require('multer');
const router = express.Router();
const { optimizeRunes } = require('../utils/optimizer');
const Json = require('../models/Json');
const Build = require('../models/Build');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-json', upload.single('jsonFile'), async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Nicht angemeldet' });
    }

    try {
        const jsonData = JSON.parse(req.file.buffer.toString());
        const json = new Json({
            userId: req.user._id,
            data: jsonData
        });
        await json.save();

        req.user.jsons.push(json._id);
        await req.user.save();

        res.status(201).json({ message: 'JSON hochgeladen', jsonId: json._id });
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Hochladen der JSON' });
    }
});

router.post('/optimize', upload.single('jsonFile'), async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Nicht angemeldet' });
    }

    try {
        const jsonData = JSON.parse(req.file.buffer.toString());
        const goal = req.body.goal || 'general';
        const weights = JSON.parse(req.body.weights || '{}');

        const results = await optimizeRunes(jsonData, goal, weights);

        for (const result of results) {
            const build = new Build({
                userId: req.user._id,
                monsterName: result.monsterName,
                build: result
            });
            await build.save();
            req.user.builds.push(build._id);
        }
        await req.user.save();

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Verarbeiten der Datei.' });
    }
});

router.get('/my-jsons', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Nicht angemeldet' });
    }

    const jsons = await Json.find({ userId: req.user._id });
    res.json(jsons);
});

router.get('/my-builds', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Nicht angemeldet' });
    }

    const builds = await Build.find({ userId: req.user._id });
    res.json(builds);
});

module.exports = router;