const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  shipping_date: {
    type: Date,
    required: true,
    trim: true
  },
  shipping_total: {
    type: Number,
    required: true,
    trim: true
  },
  shipping_status: {
    type: String,
    required: true,
    trim: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shipping_address: {
    type: String,
    required: true,
    trim: true
  },
  shipped_at: {
    type: Date,
    default: null,
    trim: true
  },
  delivered_at: {
    type: Date,
    default: null,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Shipping', shippingSchema);