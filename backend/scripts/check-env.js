// scripts/check-env.js
const config = require('../config');

console.log('--- Environment Status Check ---');

// Check for DB variables
const requiredDbVars = ['host', 'user', 'pass', 'name'];
const missingDbVars = requiredDbVars.filter(key => !config.db[key]);

if (missingDbVars.length > 0) {
  console.log('❌ Database Config: Missing required variables ->', missingDbVars.join(', '));
} else {
  console.log('✅ Database Config: All required variables are present.');
}

// Check for Gemini API Key
if (config.isGeminiMock) {
  console.log('🟡 Gemini AI Service: API key is MISSING. Using mock mode.');
  console.log('   To enable real AI features, add your GEMINI_API_KEY to the .env file.');
} else {
  console.log('✅ Gemini AI Service: Ready.');
}

console.log('--------------------------------');
