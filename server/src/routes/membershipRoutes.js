const express = require('express');
const router = express.Router();
const Membership = require('../models/Membership');

// Bérletek listája - a User adatait is behúzza (populate)
router.get('/', async (req, res) => {
  try {
    const memberships = await Membership.find().populate('user', 'name email');
    res.json(memberships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Új bérlet felvétele
router.post('/', async (req, res) => {
  try {
    const membership = await Membership.create(req.body);
    res.status(201).json(membership);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;