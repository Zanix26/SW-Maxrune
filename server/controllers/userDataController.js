const fs = require('fs');
const UserData = require('../models/userData'); // Importieren des Modells

// JSON-Datei hochladen
const uploadJson = async (req, res) => {
  try {
    const jsonData = JSON.parse(fs.readFileSync(req.file.path, 'utf-8'));

    // Daten mit Benutzer-ID speichern
    const userData = new UserData({
      userId: req.userId,
      runes: jsonData.runes || [],
      artifacts: jsonData.artifacts || [],
      monsters: jsonData.monsters || [],
    });

    await userData.save();

    // Temporäre Datei löschen
    fs.unlinkSync(req.file.path);

    res.status(200).json({ message: 'JSON-Datei erfolgreich hochgeladen' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Hochladen der JSON-Datei', error: error.message });
  }
};

// Benutzer-Daten abrufen
const getUserData = async (req, res) => {
  try {
    const userData = await UserData.findOne({ userId: req.userId }).sort({ uploadedAt: -1 });
    if (!userData) {
      return res.status(404).json({ message: 'Keine hochgeladenen Daten gefunden' });
    }

    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Benutzer-Daten', error: error.message });
  }
};

module.exports = { uploadJson, getUserData };