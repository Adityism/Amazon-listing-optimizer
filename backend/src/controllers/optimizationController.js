const { scrapeAmazonProduct } = require('../services/amazonScraper');
const { generateOptimizedListing } = require('../services/aiClient');
const { saveOptimization, listOptimizations } = require('../db/optimizationHelpers');

async function optimizeListing(req, res) {
  const { asin } = req.body;
  if (!asin) {
    return res.status(400).json({ error: 'ASIN is required.' });
  }

    try {
      // Run scraping and AI generation in parallel
      const scrapePromise = scrapeAmazonProduct(asin);
      const aiPromise = scrapePromise.then(product =>
        generateOptimizedListing({
          title: product.title,
          bullets: product.bullets,
          description: product.description,
        })
      );
      const [product, optimized] = await Promise.all([scrapePromise, aiPromise]);

      // Return response immediately
      res.json({
        asin,
        imageUrl: product.imageUrl || null,
        original: {
          title: product.title || '',
          bullets: Array.isArray(product.bullets) ? product.bullets : [],
          description: product.description || '',
        },
        optimized: {
          title: optimized.optimized_title || '',
          bullets: Array.isArray(optimized.optimized_bullets) ? optimized.optimized_bullets : [],
          description: optimized.optimized_description || '',
          keywords: Array.isArray(optimized.keywords) ? optimized.keywords : [],
        },
        created_at: new Date().toISOString(),
      });

      // Save to DB in background (fire-and-forget)
      saveOptimization({
        asin,
        original_title: product.title,
        original_bullets: product.bullets,
        original_description: product.description,
        optimized_title: optimized.optimized_title,
        optimized_bullets: optimized.optimized_bullets,
        optimized_description: optimized.optimized_description,
        keywords: optimized.keywords,
        imageUrl: product.imageUrl || null,
      }).catch((err) => {
        // Optionally log error
        console.error('Failed to save optimization:', err);
      });
    } catch (err) {
      // Handle scraping or AI errors
      if (err.message && err.message.includes('scrape')) {
        return res.status(422).json({ error: `Failed to scrape product data: ${err.message}` });
      } else if (err.message && err.message.includes('AI')) {
        return res.status(502).json({ error: `AI optimization failed: ${err.message}` });
      } else {
        return res.status(500).json({ error: `Unexpected error: ${err.message}` });
      }
    }
}

async function getAllOptimizationHistory(req, res) {
  try {
    const records = await listOptimizations();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}

async function getOptimizationHistory(req, res) {
  const { asin } = req.params;
  if (!asin) {
    return res.status(400).json({ error: 'ASIN is required.' });
  }
  try {
    const records = await listOptimizations({ asin });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}

module.exports = {
  optimizeListing,
  getOptimizationHistory,
  getAllOptimizationHistory,
};
