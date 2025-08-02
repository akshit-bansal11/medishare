const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  age: String, // Kept for backward compatibility, can be removed if not needed
  dob: String, // New field for date of birth
  gender: String,
  address: String,
  country: String, // Added country field
  state: String,   // Added state field
  city: String,
  contact: String,
  qualification: String,
  occupation: String,
  profilePic: String,
  verificationStatus: { type: Number, default: 0 }, // 0 = not verified, 1 = GID matched, 2 = full match
  verified: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
