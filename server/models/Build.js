const mongoose = require('mongoose');

const BuildSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    monsterName: { type: String, required: true },
    build: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Build', BuildSchema);