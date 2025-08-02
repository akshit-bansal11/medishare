const User = require('../models/User');
const Profile = require('../models/Profile');
const Medicine = require('../models/Medicine');
const GID = require('../models/GID');
const PID = require('../models/PID');

// 🧑 USERS

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// Block user
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 0 },
      { new: true }
    );
    res.json({ message: 'User blocked', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to block user', error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

// Delete user profile
exports.deleteProfile = async (req, res) => {
  try {
    await Profile.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete profile', error: err.message });
  }
};

// 💊 MEDICINES

// Get all medicines
exports.getMedicines = async (req, res) => {
  try {
    const meds = await Medicine.find().populate('userId', 'name email');
    res.json(meds);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch medicines', error: err.message });
  }
};

// Delete a medicine
exports.deleteMedicine = async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medicine deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete medicine', error: err.message });
  }
};

// 📚 COLLECTIONS

// Get collection names
exports.getCollections = async (req, res) => {
  try {
    const collections = await Promise.all([
      User.collection.name,
      Profile.collection.name,
      GID.collection.name,
      PID.collection.name,
      Medicine.collection.name
    ]);
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: 'Failed to list collections', error: err.message });
  }
};

// Clear documents from a collection
exports.clearCollection = async (req, res) => {
  const name = req.params.name;
  try {
    const connection = User.db;
    await connection.collection(name).deleteMany({});
    res.json({ message: `Cleared all documents from ${name}` });
  } catch (err) {
    res.status(500).json({ message: `Failed to clear ${name}`, error: err.message });
  }
};

// Drop (delete) entire collection
exports.deleteCollection = async (req, res) => {
  const name = req.params.name;
  try {
    const connection = User.db;
    await connection.dropCollection(name);
    res.json({ message: `${name} collection deleted` });
  } catch (err) {
    res.status(500).json({ message: `Failed to delete ${name}`, error: err.message });
  }
};
