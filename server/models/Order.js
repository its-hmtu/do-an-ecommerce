const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_date: {
    type: Date,
    required: true,
    trim: true
  },
  order_status: {
    type: String,
    required: true,
    trim: true
  },
  order_total: {
    type: Number,
    required: true,
    trim: true
  },
  order_items: {
    type: Array,
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

module.exports = mongoose.model('Order', orderSchema);