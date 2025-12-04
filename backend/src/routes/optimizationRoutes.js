const express = require('express');
const router = express.Router();
const { optimizeListing, getOptimizationHistory, getAllOptimizationHistory } = require('../controllers/optimizationController');

router.post('/optimize', optimizeListing);
router.get('/history', getAllOptimizationHistory);
router.get('/history/:asin', getOptimizationHistory);

module.exports = router;
