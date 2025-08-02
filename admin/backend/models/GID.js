const mongoose = require('mongoose');
const gidSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  frontUrl: String,
  backUrl: String,
  extractedData: {
    fullName: String,
    dob: String
  }
}, { timestamps: true });
module.exports = mongoose.model('GID', gidSchema);  