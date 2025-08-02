const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  brand: { 
    type: String, 
    trim: true 
  },
  itemType: {
    type: String,
    trim: true
  },
  itemCategory: {
    type: String,
    trim: true
  },
  expiryDate: { 
    type: Date, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  imageUrl: { 
    type: String, 
    trim: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Medicine', medicineSchema);