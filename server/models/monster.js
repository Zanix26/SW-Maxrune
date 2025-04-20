const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  effects: [
    {
      name: String,
      type: String,
      description: String,
    },
  ],
});

const monsterSchema = new mongoose.Schema({
  com2us_id: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true }, // Index für schnellere Suchen
  element: { type: String, required: true },
  skills: [skillSchema],
});

module.exports = mongoose.model('Monster', monsterSchema);