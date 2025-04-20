const mongoose = require('mongoose');

const effectSchema = new mongoose.Schema({
  name: { type: String }, // Entferne required: true
  is_buff: { type: Boolean },
  type: { type: String },
  description: { type: String },
  icon_filename: { type: String },
});

const skillSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String },
  multiplier_formula: { type: String },
  effects: [effectSchema],
});

const monsterSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  element: { type: String, enum: ['Water', 'Fire', 'Wind', 'Light', 'Dark'] },
  archetype: { type: String, enum: ['Attack', 'HP', 'Support', 'Defense', 'Material'] },
  base_stars: { type: Number, min: 1, max: 6 },
  skills: [skillSchema],
});

module.exports = mongoose.model('Monster', monsterSchema);