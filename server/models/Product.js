const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  product_description: {
    type: String,
    required: true,
    trim: true
  },
  product_price: {
    type: Number,
    required: true,
    trim: true
  },
  product_quantity: {
    type: Number,
    required: true,
    trim: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  product_images: [
    {
      type: String,
      required: true,
      trim: true
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);