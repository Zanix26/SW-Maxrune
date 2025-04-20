const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  runes: [{ type: Object }],
  artifacts: [{ type: Object }],
  monsters: [{ type: Object }],
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserData', userDataSchema);