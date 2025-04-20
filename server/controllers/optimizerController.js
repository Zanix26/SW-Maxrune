const mongoose = require('mongoose');
const { optimizeMonster } = require('../utils/optimizer');
const UserData = mongoose.model('UserData');

const optimizeBuild = async (req, res) => {
  try {
    const { monsterId, targetStats } = req.body;
    const userData = await UserData.findOne({ userId: req.userId }).sort({ uploadedAt: -1 });

    if (!userData) {
      return res.status(404).json({ message: 'Keine hochgeladenen Daten gefunden' });
    }

    const monster = userData.monsters.find(m => m.id === monsterId);
    if (!monster) {
      return res.status(404).json({ message: 'Monster nicht gefunden' });
    }

    const bestCombination = optimizeMonster(monster, userData.runes, userData.artifacts, targetStats);
    if (!bestCombination) {
      return res.status(400).json({ message: 'Keine passende Kombination gefunden' });
    }

    res.status(200).json(bestCombination);
  } catch (error) {
    res.status(500).json({ message: 'Fehler bei der Optimierung', error: error.message });
  }
};

module.exports = { optimizeBuild };