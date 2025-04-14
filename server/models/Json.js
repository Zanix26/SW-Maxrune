const mongoose = require('mongoose');

const JsonSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: Object, required: true },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Json', JsonSchema);