// utils/callGeminiAPI.js
const axios = require('axios');

const callGeminiAPI = async (imageUrl) => {
  try {
    const prompt = `Extract relevant structured information from this government or personal ID: ${imageUrl}`;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent',
      {
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: imageUrl } }
          ]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
        }
      }
    );

    // Modify this based on actual Gemini response structure
    const textResponse = response.data.candidates[0]?.content?.parts[0]?.text || 'No data';
    return textResponse;
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    return 'Error extracting data';
  }
};

module.exports = { callGeminiAPI };
