const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB kapcsolódva');
  } catch (err) {
    console.error('MongoDB hiba:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;