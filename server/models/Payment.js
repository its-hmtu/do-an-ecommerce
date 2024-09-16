const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  payment_date: {
    type: Date,
    required: true,
    trim: true
  },
  payment_method: {
    type: String,
    required: true,
    trim: true
  },
  payment_total: {
    type: Number,
    required: true,
    trim: true
  },
  payment_status: {
    type: String,
    required: true,
    trim: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);