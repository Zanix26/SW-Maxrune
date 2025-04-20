const UserData = require('../models/userData');

exports.uploadJson = async (req, res) => {
  try {
    const userId = req.user.id;
    const jsonFile = req.file;

    if (!jsonFile) {
      return res.status(400).json({ message: 'Keine Datei hochgeladen' });
    }

    const jsonData = JSON.parse(jsonFile.buffer.toString());
    if (!jsonData.monsters || !jsonData.runes || !jsonData.artifacts) {
      return res.status(400).json({ message: 'Ungültiges JSON-Format: monsters, runes und artifacts erforderlich' });
    }

    await UserData.findOneAndUpdate(
      { userId },
      { $set: { monsters: jsonData.monsters, runes: jsonData.runes, artifacts: jsonData.artifacts } },
      { upsert: true }
    );

    res.json({ message: 'Daten erfolgreich hochgeladen' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Hochladen der Daten', error: error.message });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await UserData.findOne({ userId });

    if (!userData) {
      return res.status(404).json({ message: 'Keine Daten für diesen Benutzer gefunden' });
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Benutzerdaten', error: error.message });
  }
};