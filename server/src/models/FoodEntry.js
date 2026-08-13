const mongoose = require('mongoose');

const foodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  protein: { type: Number },
  carbs: { type: Number },
  fat: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('FoodEntry', foodEntrySchema);