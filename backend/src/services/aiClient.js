const axios = require('axios');
const config = require('../../config');
const fs = require('fs').promises;
const path = require('path');

const PROMPT_TEMPLATE_PATH = path.join(__dirname, 'prompts', 'gemini_optimization_prompt.txt');

const MOCK_RESPONSE = {
  optimized_title: 'Mock Optimized Title: High-Quality, Durable, and Eco-Friendly Widget Pro',
  optimized_bullets: [
    'Mock Bullet 1: Enhanced performance and reliability for daily use.',
    'Mock Bullet 2: Crafted from 100% sustainable and premium materials.',
    'Mock Bullet 3: User-friendly design ensures effortless operation and maintenance.',
    'Mock Bullet 4: Versatile functionality adapting to various needs.',
    'Mock Bullet 5: Backed by a comprehensive satisfaction guarantee.',
  ],
  optimized_description: 'This is a mock optimized product description that highlights the key features and benefits of the Widget Pro in a compelling way. It is designed for demonstration purposes when the AI service is in mock mode, ensuring all required fields are present and correctly formatted.',
  keywords: ['mock widget', 'test product', 'demo item', 'optimized listing', 'eco-friendly gadget'],
};

let promptTemplate = null;

async function getPromptTemplate() {
  if (!promptTemplate) {
    promptTemplate = await fs.readFile(PROMPT_TEMPLATE_PATH, 'utf8');
  }
  return promptTemplate;
}

function isValidGeminiResponse(response) {
  return (
    response &&
    typeof response.optimized_title === 'string' &&
    Array.isArray(response.optimized_bullets) &&
    response.optimized_bullets.length === 5 &&
    typeof response.optimized_description === 'string' &&
    Array.isArray(response.keywords) &&
    response.keywords.length >= 3 && response.keywords.length <= 5
  );
}

async function generateOptimizedListing(product, retries = 3) {
  if (config.isGeminiMock) {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_RESPONSE), 1000));
  }

  const template = await getPromptTemplate();
  const prompt = template
    .replace('{PRODUCT_TITLE}', product.title)
    .replace('{PRODUCT_BULLETS}', JSON.stringify(product.bullets))
    .replace('{PRODUCT_DESCRIPTION}', product.description);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const response = await axios.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });

    let text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const match = text.match(/\{[\s\S]*\}/);
    
    if (!match) {
      throw new Error('No JSON object found in Gemini response');
    }

    let result;
    try {
      result = JSON.parse(match[0]);
    } catch (e) {
      throw new Error('Malformed JSON response from Gemini');
    }

    if (!isValidGeminiResponse(result)) {
      throw new Error('Gemini response missing required fields');
    }

    return result;

  } catch (err) {
    if (retries > 0) {
      return generateOptimizedListing(product, retries - 1);
    }
    throw new Error(`Failed to generate optimized listing: ${err.message}`);
  }
}

module.exports = { generateOptimizedListing };
