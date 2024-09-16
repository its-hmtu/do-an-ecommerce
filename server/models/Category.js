const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    trim: true
  
  },
  category_description: {
    type: String,
    required: true,
    trim: true
  },
  category_image: {
    type: String,
    required: true,
    trim: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);