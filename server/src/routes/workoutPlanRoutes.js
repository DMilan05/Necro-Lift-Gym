const express = require('express');
const router = express.Router();
const WorkoutPlan = require('../models/WorkoutPlan');

router.get('/', async (req, res) => {
  try {
    const plans = await WorkoutPlan.find().populate('user', 'name email');
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const plan = await WorkoutPlan.create(req.body);
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;