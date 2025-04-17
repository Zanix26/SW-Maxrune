const mongoose = require('mongoose');

const runeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, //zB Energy, Blade etc.
    slot: { type: Number, required: true }, // 1 bis 6
    mainStat: { type: String, required: true}, //zB HP%, ATK%
    subStat: { type: Object, default: {} }, // zb {atk:20, spd:5}
    grade: { type: Number, default: 1}, // zb 1 bis 6 Sterne
});

module.exports = mongoose.model('Rune', runeSchema)