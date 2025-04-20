const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Validierung der Eingabefelder
    if (!username || !email || !password) {
      console.log(`Registrierungsversuch fehlgeschlagen: Alle Felder (username, email, password) sind erforderlich. Eingabe: ${JSON.stringify(req.body)}`);
      return res.status(400).json({ message: 'Alle Felder (username, email, password) sind erforderlich.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Registrierungsversuch fehlgeschlagen: E-Mail ${email} existiert bereits.`);
      return res.status(400).json({ message: 'E-Mail existiert bereits.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    console.log(`Benutzer mit E-Mail ${email} hat sich erfolgreich registriert.`);
    return res.status(201).json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error(`Fehler bei der Registrierung für E-Mail ${email}: ${error.message}`);
    return res.status(500).json({ message: 'Fehler bei der Registrierung', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validierung der Eingabefelder
    if (!email || !password) {
      console.log(`Login-Versuch fehlgeschlagen: E-Mail und Passwort sind erforderlich. Eingabe: ${JSON.stringify(req.body)}`);
      return res.status(400).json({ message: 'E-Mail und Passwort sind erforderlich.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login-Versuch fehlgeschlagen für E-Mail ${email}: Ungültige Anmeldedaten (Benutzer nicht gefunden).`);
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(`Login-Versuch fehlgeschlagen für E-Mail ${email}: Ungültige Anmeldedaten (falsches Passwort).`);
      return res.status(401).json({ message: 'Ungültige Anmeldedaten' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    console.log(`Benutzer mit E-Mail ${email} hat sich erfolgreich eingeloggt.`);
    return res.status(200).json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error(`Fehler beim Login für E-Mail ${email}: ${error.message}`);
    return res.status(500).json({ message: 'Fehler beim Login', error: error.message });
  }
};

module.exports = { register, login };