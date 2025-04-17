const mongoose = require('mongoose');

const buildSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    monsterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Monster', required: true },
    runes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rune'}],
    optimizedStats: { type: Object, default: {} }, // Ergebnis der Optimierung
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Build', buildSchema);