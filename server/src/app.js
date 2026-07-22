const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const workoutPlanRoutes = require('./routes/workoutPlanRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', userRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);

module.exports = app;