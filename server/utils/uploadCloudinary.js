// utils/uploadToCloudinary.js
const cloudinary = require('cloudinary').v2;

// ✅ Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (fileBuffer, publicIdPrefix = 'verification') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'mediShare/verification',
        public_id: `${publicIdPrefix}-${Date.now()}`,
        overwrite: true
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(fileBuffer);
  });
};

module.exports = { uploadToCloudinary };
