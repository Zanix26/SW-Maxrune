const mongoose = require('mongoose');

const monsterSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true},
    attributes: {
        hp: { type: Number, required: true },
        atk: { type: Number, required: true },
        def: { type: Number, required: true },
        spd: { type: Number, required: true },
    },
    level: { type: Number, default: 1},
});

module.exports = mongoose.model('Monster', monsterSchema);