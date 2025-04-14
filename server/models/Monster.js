const mongoose = require('mongoose');

const MonsterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    sets: [{ type: String }],
    stats: [{ type: String }],
    goals: { type: Object },
    skills: [{ type: String }],
    awakenLevel: { type: String, default: "Second" },
    element: { type: String }
});

module.exports = mongoose.model('Monster', MonsterSchema);