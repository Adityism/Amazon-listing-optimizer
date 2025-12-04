// scripts/test-scraper.js
const { scrapeAmazonProduct } = require('../src/services/amazonScraper');

async function testScraper() {
  console.log('--- Amazon Scraper Test ---');
  // Use the ASIN for which we have a cached HTML file
  const testAsin = 'B0FWDBH2T2'; 
  
  console.log(`Attempting to scrape ASIN: ${testAsin}`);

  try {
    const productData = await scrapeAmazonProduct(testAsin);
    
    console.log('\n✅ Scrape successful!');
    console.log(`   Source: ${productData.source}`);
    console.log('--- Scraped Data ---');
    console.log(JSON.stringify(productData, null, 2));
    console.log('--------------------');

  } catch (error) {
    console.error('\n❌ An error occurred during the scraper test:');
    console.error(error.message);
  }

  console.log('\n--- Test Complete ---');
}

testScraper();
