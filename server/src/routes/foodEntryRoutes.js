const express = require('express');
const router = express.Router();
const FoodEntry = require('../models/FoodEntry');
const Membership = require('../models/Membership');
const getErrorMessage = require('../utils/errorMessage');

router.get('/', async (req, res) => {
  try {
    const entries = await FoodEntry.find().populate('user', 'name email').sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: getErrorMessage(err) });
  }
});

router.post('/', async (req, res) => {
  try {
    const hasActiveMembership = await Membership.exists({
      user: req.body.user,
      endDate: { $gt: new Date() },
    });
    if (!hasActiveMembership) {
      return res.status(403).json({ error: 'Nincs aktív bérlete - előbb bérletet kell felvenni.' });
    }
    const entry = await FoodEntry.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const entry = await FoodEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Bejegyzés nem található' });
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: getErrorMessage(err) });
  }
});

module.exports = router;