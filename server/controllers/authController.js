const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Validierung der Eingabefelder
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Alle Felder (username, email, password) sind erforderlich.' });
    }

    // Prüfen, ob der Benutzer bereits existiert
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'E-Mail existiert bereits.' });
    }

    // Benutzer erstellen (Passwort wird durch Schema-Hook gehasht)
    const user = new User({ username, email, password });
    await user.save();

    // Token generieren
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });
    return res.status(201).json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    return res.status(500).json({ message: 'Fehler bei der Registrierung', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validierung der Eingabefelder
    if (!email || !password) {
      return res.status(400).json({ message: 'E-Mail und Passwort sind erforderlich.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });
    return res.status(200).json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    return res.status(500).json({ message: 'Fehler beim Login', error: error.message });
  }
};

module.exports = { register, login };