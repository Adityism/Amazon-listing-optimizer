require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-pro',
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
  isGeminiMock: !process.env.GEMINI_API_KEY,
  isDemoMode: process.env.DEMO_MODE === 'true',
};

if (config.isDemoMode) {
  config.isGeminiMock = true;
  config.db = {};
}

module.exports = config;
