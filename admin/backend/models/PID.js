const mongoose = require('mongoose');
const pidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  frontUrl: String,
  backUrl: String,
  extractedData: {
    fullName: String,
    dob: String
  }
}, { timestamps: true });
module.exports = mongoose.model('PID', pidSchema);