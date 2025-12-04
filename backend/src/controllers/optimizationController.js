const { scrapeAmazonProduct } = require('../services/amazonScraper');
const { generateOptimizedListing } = require('../services/aiClient');
const { saveOptimization, listOptimizations } = require('../db/optimizationHelpers');

async function optimizeListing(req, res) {
  const { asin } = req.body;
  if (!asin) {
    return res.status(400).json({ error: 'ASIN is required.' });
  }

  let product;
  try {
    product = await scrapeAmazonProduct(asin);
  } catch (err) {
    return res.status(422).json({ error: `Failed to scrape product data: ${err.message}` });
  }

  let optimized;
  try {
    optimized = await generateOptimizedListing({
      title: product.title,
      bullets: product.bullets,
      description: product.description,
    });
  } catch (err) {
    return res.status(502).json({ error: `AI optimization failed: ${err.message}` });
  }

  try {
    const record = await saveOptimization({
      asin,
      original_title: product.title,
      original_bullets: product.bullets,
      original_description: product.description,
      optimized_title: optimized.optimized_title,
      optimized_bullets: optimized.optimized_bullets,
      optimized_description: optimized.optimized_description,
      keywords: optimized.keywords,
      imageUrl: product.imageUrl || null,
    });

    res.json({
      id: record.id,
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
      created_at: record.created_at || new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: `Failed to save optimization: ${err.message}` });
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
