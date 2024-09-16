const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  cart_items: {
    type: Array,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
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

module.exports = mongoose.model('Cart', cartSchema);