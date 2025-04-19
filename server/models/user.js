const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Korrektur: uniquie -> unique
    email: { type: String, required: true, unique: true },    // Korrektur: uniquie -> unique
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);