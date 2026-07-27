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

router.put('/:id', async (req, res) => {
  try {
    const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!membership) return res.status(404).json({ error: 'Bérlet nem található' });
    res.json(membership);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const membership = await Membership.findByIdAndDelete(req.params.id);
    if (!membership) return res.status(404).json({ error: 'Bérlet nem található' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;