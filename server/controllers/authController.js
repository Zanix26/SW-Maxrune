const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'E-Mail existiert bereits.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User ({ username, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(201).json({ token, user: { id: user._id, username: user.username } });
        } catch (error) {
            res.status(500).json({ message: 'Fehler bei der Registrierung', error});
        }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne ({ email });
        if (!user) return 
        res.status(400).json({ message: 'Benutzer nicht gefunden.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return
        res.status(400).json({ message: 'Ungültiges Passwort.' });

        const token = jwt.sign({ userId: user._id }, 'your_secret_jwt', { expiresIn: '1h'});
        res.status(200).json({ token, user: { id:user._id, username: user.username} });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Login', error });
    }
};

module.exports = {register, login};