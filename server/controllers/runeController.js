const Rune = require('../models/rune');

const getRunes = async (req, res) => {
    try {
        const userId = req.userId; // Wird später aus dem JWT-Token extrahiert
        const runes = await Rune.find({ userId });
        res.status(200).json(runes);
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Abrufen der Runen', error });
    }
};

const addRune = async (req, res) => {
    const { type, slot, mainStat, subStat, grade } = req.body;
    try {
        const userId = req.userId;
        const rune = new Rune({ userId, type, slot, mainStat, subStat, grade }); // Korrektur
        await rune.save();
        res.status(201).json(rune);
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Hinzufügen der Rune!', error });
    }
};

module.exports = { getRunes, addRune };