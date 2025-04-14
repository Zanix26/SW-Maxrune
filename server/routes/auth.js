const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) return done(null, false, { message: 'Benutzer nicht gefunden' });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return done(null, false, { message: 'Falsches Passwort' });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

router.use(require('express-session')({
    secret: 'dein-geheimes-passwort',
    resave: false,
    saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'Benutzer erstellt' });
    } catch (err) {
        res.status(500).json({ error: 'Fehler bei der Registrierung' });
    }
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.json({ message: 'Erfolgreich angemeldet', user: req.user });
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Fehler beim Abmelden' });
        res.json({ message: 'Erfolgreich abgemeldet' });
    });
});

router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ error: 'Nicht angemeldet' });
    }
});

module.exports = router;