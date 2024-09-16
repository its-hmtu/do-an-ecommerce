const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    trim: true
  },
  review_title: {
    type: String,
    required: true,
    trim: true
  }, 
  review_desc: {
    type: String,
    required: true,
    trim: true
  },
  review_images: [
    {
      type: String,
      required: true,
      trim: true
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);