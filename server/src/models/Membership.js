const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['felnott', 'diak'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

membershipSchema.pre('save', function () {
  if (!this.endDate) {
    const end = new Date(this.startDate);
    end.setDate(end.getDate() + 30);
    this.endDate = end;
  }
});

membershipSchema.virtual('isActive').get(function () {
  return this.endDate > new Date();
});

module.exports = mongoose.model('Membership', membershipSchema);