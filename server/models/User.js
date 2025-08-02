const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: String,
    age: String,
    gender: String,
    address: String,
    city: String,
    contact: String,
    qualification: String,
    occupation: String,
    verificationStatus: {type: Number, default: 0},
    status: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
