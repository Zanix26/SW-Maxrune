const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    jsons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Json' }],
    builds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Build' }]
});

module.exports = mongoose.model('User', UserSchema);