const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  reps: {
    type: Number,
    required: function () {
      return !this.toFailure;
    },
  },
  toFailure: {
    type: Boolean,
    default: false,
  },
}, { _id: false });

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  sets: [setSchema], // minden elem egy önálló szett saját súllyal/ismétléssel
}, { _id: false });

const dayPlanSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  exercises: [exerciseSchema],
}, { _id: false });

const workoutPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  days: [dayPlanSchema],
}, { timestamps: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);