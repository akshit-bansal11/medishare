const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const User = require('../models/User');
const Profile = require('../models/Profile');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.get('/profile-status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching profile status:', { userId });
    const profile = await Profile.findOne({ userId });
    
    if (!profile) {
      console.log('Profile not found for user:', { userId });
      return res.status(404).json({ message: 'Profile not found' });
    }

    console.log('Profile found:', {
      userId,
      verificationStatus: profile.verificationStatus,
      verified: profile.verified,
      updatedAt: profile.updatedAt,
    });

    return res.status(200).json({
      verificationStatus: profile.verificationStatus || 0,
      verified: profile.verified || false,
    });
  } catch (err) {
    console.error('Profile status error:', {
      userId: req.user.id,
      message: err.message,
    });
    return res.status(500).json({ message: 'Server error' });
  }
});



router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            status: 1
        });

        await user.save();

        res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        if (user.status === 0) {
            return res.status(403).json({ message: 'Your account has been blocked by admin.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('name email');
        const profile = await Profile.findOne({ userId: req.user.id });
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            email: user.email,
            name: user.name,
            dob: profile?.dob,
            age: profile?.age || '',
            gender: profile?.gender || '',
            address: profile?.address || '',
            country: profile?.country || '',
            state: profile?.state || '',
            city: profile?.city || '',
            contact: profile?.contact || '',
            qualification: profile?.qualification || '',
            occupation: profile?.occupation || '',
            profilePic: profile?.profilePic || '',
            status: user.status
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

router.post('/profile', authenticateToken, upload.single('profilePic'), async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            dob, age, gender, address,
            country, state, city, contact,
            qualification, occupation
        } = req.body;

        // ✅ Format DOB to dd-mm-yyyy
        const formatDate = (isoDate) => {
            const date = new Date(isoDate);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        const formattedDob = dob ? formatDate(dob) : '';

        // ✅ Handle profile picture upload if provided
        let profilePicUrl = '';
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'profile_pics' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            profilePicUrl = result.secure_url;
        }

        // ✅ Construct profile data
        const profileData = {
            userId,
            dob: formattedDob,
            age,
            gender,
            address,
            country,
            state,
            city,
            contact,
            qualification,
            occupation,
            ...(profilePicUrl && { profilePic: profilePicUrl })
        };

        // ✅ Save or update profile
        const profile = await Profile.findOneAndUpdate(
            { userId },
            profileData,
            { upsert: true, new: true }
        );

        res.json({ message: 'Profile updated successfully', profile });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error', details: err.message });
    }
});

module.exports = router;
