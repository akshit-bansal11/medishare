const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const PID = require('../models/PID');
const GID = require('../models/GID');
const Profile = require('../models/Profile');
const User = require('../models/User');
const axios = require('axios');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Utility: wrap cloudinary upload_stream in a Promise
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) {
        console.error('Cloudinary Upload Error:', { error: err.message });
        return reject(err);
      }
      console.log('Cloudinary Upload Success:', { url: result.secure_url });
      resolve(result);
    });
    stream.end(buffer);
  });
}

// Gemini Vision API
async function extractDataFromImage(base64Image) {
  try {
    console.log('Extracting data from image:', { base64Length: base64Image.length, base64Preview: base64Image.substring(0, 50) });
    const model = 'gemini-1.5-pro'; // Use a supported model
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
    console.log('Sending API request:', { url, model });

    const result = await axios.post(
      url,
      {
        contents: [
          {
            parts: [
              {
                text: "Extract full name and date of birth from this ID image. Return in JSON format with 'fullName' and 'dob'.",
              },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('API Response Received:', { status: result.status, data: result.data });

    // Extract the text from the API response
    let text = result.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('API Error: No text in response');
      throw new Error('No text returned from API');
    }
    console.log('Raw API Text:', { text });

    // Clean Markdown code fences (e.g., ```json ... ```)
    text = text.replace(/```json\n|\n```/g, '').trim();
    console.log('Cleaned API Text:', { text });

    // Parse the cleaned text as JSON
    const parsedData = JSON.parse(text);
    if (!parsedData.fullName || !parsedData.dob) {
      console.error('API Error: Invalid JSON structure', { parsedData });
      throw new Error('Invalid JSON structure: missing fullName or dob');
    }

    console.log('Extracted Data:', parsedData);
    return parsedData;
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      responseData: error.response?.data,
      responseStatus: error.response?.status,
    });
    throw new Error(`Failed to extract data: ${error.message}`);
  }
}

// Upload endpoint
router.post(
  '/upload',
  authenticateToken,
  upload.fields([
    { name: 'pidFront' },
    { name: 'pidBack' },
    { name: 'gidFront' },
    { name: 'gidBack' },
  ]),
  async (req, res) => {
    try {
      const userId = req.user.id;
      console.log('Starting verification process:', { userId });

      const convertToBase64 = (buffer) => {
        const base64 = buffer.toString('base64');
        console.log('Converted buffer to base64:', { bufferLength: buffer.length, base64Preview: base64.substring(0, 50) });
        return base64;
      };

      // Log uploaded files
      const pidFront = req.files['pidFront']?.[0];
      const pidBack = req.files['pidBack']?.[0];
      const gidFront = req.files['gidFront']?.[0];
      const gidBack = req.files['gidBack']?.[0];
      console.log('Uploaded files:', {
        pidFront: !!pidFront,
        pidBack: !!pidBack,
        gidFront: !!gidFront,
        gidBack: !!gidBack,
      });

      const uploadAndExtract = async (file) => {
        console.log('Uploading file to Cloudinary:', { originalname: file.originalname });
        const uploadRes = await uploadToCloudinary(file.buffer, {
          resource_type: 'image',
          folder: 'verification_uploads',
        });
        const base64 = convertToBase64(file.buffer);
        const extractedData = await extractDataFromImage(base64);
        console.log('Upload and extraction complete:', { url: uploadRes.secure_url, extractedData });
        return { url: uploadRes.secure_url, extractedData };
      };

      const pidFrontData = pidFront ? await uploadAndExtract(pidFront) : null;
      const pidBackData = pidBack ? await uploadAndExtract(pidBack) : null;
      const gidFrontData = gidFront ? await uploadAndExtract(gidFront) : null;
      const gidBackData = gidBack ? await uploadAndExtract(gidBack) : null;
      console.log('Processed files:', {
        pidFrontData: pidFrontData ? { url: pidFrontData.url, extractedData: pidFrontData.extractedData } : null,
        pidBackData: pidBackData ? { url: pidBackData.url, extractedData: pidBackData.extractedData } : null,
        gidFrontData: gidFrontData ? { url: gidFrontData.url, extractedData: gidFrontData.extractedData } : null,
        gidBackData: gidBackData ? { url: gidBackData.url, extractedData: gidBackData.extractedData } : null,
      });

      // Store GID
      console.log('Storing GID data:', { userId });
      const gid = await GID.findOneAndUpdate(
        { userId },
        {
          userId,
          frontUrl: gidFrontData?.url,
          backUrl: gidBackData?.url,
          extractedData: gidFrontData?.extractedData,
        },
        { upsert: true, new: true }
      );
      console.log('GID stored:', { gid });

      // Store PID
      let pid = null;
      if (pidFrontData) {
        console.log('Storing PID data:', { userId });
        pid = await PID.findOneAndUpdate(
          { userId },
          {
            userId,
            frontUrl: pidFrontData?.url,
            backUrl: pidBackData?.url,
            extractedData: pidFrontData?.extractedData,
          },
          { upsert: true, new: true }
        );
        console.log('PID stored:', { pid });
      }

      // Match with User or Profile
      console.log('Fetching user and profile:', { userId });
      const user = await User.findById(userId);
      const profile = await Profile.findOne({ userId });
      console.log('User and profile data:', {
        userName: user?.name,
        profileDob: profile?.dob,
        profileVerificationStatus: profile?.verificationStatus,
        profileVerified: profile?.verified,
      });

      let verificationStatus = 0;
      let verified = false;

      const profileName = user.name?.toLowerCase();
      const profileDob = profile.dob?.toLowerCase(); // Use profile.dob instead of user.age
      const gidName = gid.extractedData?.fullName?.toLowerCase();
      const gidDob = gid.extractedData?.dob?.toLowerCase();
      console.log('Verification comparison:', {
        profileName,
        profileDob,
        gidName,
        gidDob,
        pidName: pid?.extractedData?.fullName?.toLowerCase(),
        pidDob: pid?.extractedData?.dob?.toLowerCase(),
      });

      if (gidName === profileName && gidDob === profileDob) {
        verificationStatus = 1;
        console.log('GID verification passed:', { verificationStatus });
        verified = true;
        if (
          pid &&
          pid.extractedData?.fullName?.toLowerCase() === gidName &&
          pid.extractedData?.dob?.toLowerCase() === gidDob
        ) {
          verificationStatus = 2;
          verified = true;
          console.log('PID verification passed:', { verificationStatus, verified });
        }
      } else {
        console.log('Verification failed: GID data does not match profile');
      }

      profile.verificationStatus = verificationStatus;
      profile.verified = verified;
      await profile.save();
      console.log('Profile updated:', { verificationStatus, verified });

      return res
        .status(200)
        .json({ message: 'Verification complete', verificationStatus, verified });
    } catch (err) {
      console.error('Verification failed:', {
        message: err.message,
        responseData: err.response?.data,
        responseStatus: err.response?.status,
      });
      return res.status(500).json({ message: 'Verification failed', error: err.message });
    }
  }
);

module.exports = router;