const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const Medicine = require('../models/Medicine');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { body, validationResult } = require('express-validator');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(file.originalname.toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only JPEG/PNG images are allowed'));
  }
});

// Validation middleware
const validateMedicine = [
  body('medicines').isArray({ min: 1 }).withMessage('At least one medicine is required'),
  body('medicines.*.name').trim().notEmpty().withMessage('Medicine name is required'),
  body('medicines.*.brand').trim().optional(),
  body('medicines.*.expiryDate').isISO8601().toDate().withMessage('Valid expiry date is required'),
  body('medicines.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive number')
];

// Middleware to parse medicines from req.body
function parseMedicines(req, res, next) {
  try {
    const rawData = req.body.data;
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed.medicines) || parsed.medicines.length === 0) {
      return res.status(400).json({ errors: [{ msg: 'At least one medicine is required' }] });
    }
    req.body.medicines = parsed.medicines.map(m => ({
      ...m,
      quantity: parseInt(m.quantity, 10),
      expiryDate: new Date(m.expiryDate)
    }));
    next();
  } catch (error) {
    console.error('Parse error:', error);
    return res.status(400).json({ errors: [{ msg: 'Invalid JSON format in medicines field' }] });
  }
}

// Donate route
router.post(
  '/donate',
  authenticateToken,
  upload.any(),
  parseMedicines,
  validateMedicine,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const userId = req.user.id;
      const { medicines } = req.body;

      const imageUrls = await Promise.all(medicines.map(async (_, idx) => {
        const file = req.files.find(f => f.fieldname === `image${idx}`);
        if (!file) return null;

        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: 'medicines' }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });

        return result.secure_url;
      }));

      const entries = medicines.map((med, idx) => {
        if (new Date(med.expiryDate) <= new Date()) {
          throw new Error(`Medicine ${med.name} has expired or invalid expiry date`);
        }
        return {
          userId,
          name: med.name,
          brand: med.brand || '',
          expiryDate: med.expiryDate,
          quantity: med.quantity,
          imageUrl: imageUrls[idx] || ''
        };
      });

      await Medicine.insertMany(entries);
      res.json({ message: 'Medicines donated successfully!' });
    } catch (err) {
      console.error('Donation error:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
);

// Update donation route
router.put(
  '/:id',
  authenticateToken,
  upload.single('image'),
  parseMedicines,
  validateMedicine,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const donation = await Medicine.findById(id);
      if (!donation || donation.userId.toString() !== req.user.id) {
        return res.status(404).json({ error: 'Donation not found or unauthorized' });
      }

      const med = req.body.medicines[0];
      const expiry = new Date(med.expiryDate);
      if (expiry <= new Date()) {
        return res.status(400).json({ error: `Medicine ${med.name} has expired or invalid expiry date` });
      }

      let imageUrl = donation.imageUrl;
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ folder: 'medicines' }, (err, res) => {
            if (res) resolve(res);
            else reject(err);
          });
          streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });
        imageUrl = result.secure_url;
      }

      await Medicine.findByIdAndUpdate(id, {
        name: med.name,
        brand: med.brand || '',
        expiryDate: expiry,
        quantity: med.quantity,
        imageUrl
      });

      res.json({ message: 'Donation updated successfully!' });
    } catch (err) {
      console.error('PUT donation error:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
);

// Delete donation route
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    if (medicine.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this donation' });
    }

    await Medicine.findByIdAndDelete(id);
    res.json({ message: 'Donation deleted successfully!' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get user's donations
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userMedicines = await Medicine.find({ userId }).sort({ createdAt: -1 });
    res.json(userMedicines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Get all donations
router.get('/all', async (req, res) => {
  try {
    const medicines = await Medicine.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(medicines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;