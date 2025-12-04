// scripts/test-gemini-adapter.js
const { generateOptimizedListing } = require('../src/services/aiClient');

async function testGeminiAdapter() {
  console.log('--- Gemini Adapter Test ---');

  const sampleProduct = {
    title: 'Original Super Duper Widget for All Your Needs',
    bullets: [
      'Easy to use and install.',
      'Made with high-quality, durable materials.',
      'Environmentally friendly.',
    ],
    description: 'This is an amazing product that will revolutionize your daily life. It is perfect for various applications and provides unparalleled convenience.',
  };

  console.log('Attempting to generate optimized listing with sample product data...');
  console.log('Original Product:', JSON.stringify(sampleProduct, null, 2));

  try {
    const optimizedListing = await generateOptimizedListing(sampleProduct);

    console.log('\n✅ Optimized Listing Generated Successfully!');
    console.log('--- Optimized Data ---');
    console.log(JSON.stringify(optimizedListing, null, 2));
    console.log('--------------------');

    // Basic validation
    if (
      optimizedListing.optimized_title &&
      Array.isArray(optimizedListing.optimized_bullets) && optimizedListing.optimized_bullets.length === 5 &&
      optimizedListing.optimized_description &&
      Array.isArray(optimizedListing.keywords) && optimizedListing.keywords.length >= 3 && optimizedListing.keywords.length <= 5
    ) {
      console.log('✅ Response structure is valid.');
    } else {
      console.warn('⚠️ Response structure might be invalid or incomplete.');
    }

  } catch (error) {
    console.error('\n❌ An error occurred during the Gemini adapter test:');
    console.error(error.message);
  }

  console.log('\n--- Test Complete ---');
}

testGeminiAdapter();
