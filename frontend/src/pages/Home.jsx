import React, { useState } from 'react';
import CompareView from './CompareView';
import api from '../utils/api';

function Home() {
  const [asin, setAsin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleOptimize = async () => {
    setError('');
    setResult(null);
    if (!asin.trim()) {
      setError('Please enter an ASIN.');
      return;
    }
    setLoading(true);
    try {
      const data = await api.optimizeListing(asin.trim());
      setResult(data);
      setImageError(false);
      setTimeout(() => {
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
          resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to optimize listing.');
      setResult(null);
      setImageError(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Amazon Listing Optimizer</h1>
        <p className="hero-subtitle">
          Transform your Amazon product listings with AI-powered optimization for better visibility and sales.
        </p>
        
        <div className="input-card">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter ASIN (e.g., B08XYZ1234)"
              value={asin}
              onChange={e => setAsin(e.target.value)}
              className="text-input"
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleOptimize()}
              disabled={loading}
            />
            <button
              onClick={handleOptimize}
              disabled={loading}
              className="optimize-button"
            >
              {loading ? 'Optimizing...' : 'Optimize Listing'}
            </button>
          </div>
          {error && <div className="error-message" role="alert">{error}</div>}
        </div>
      </div>

      {result && (
        <div className="results-section">
          <div className="results-container">
            {result.imageUrl && !imageError && (
              <div className="product-image-wrapper">
                <div className="product-image-container">
                  <img 
                    src={result.imageUrl} 
                    alt={result.original?.title || 'Product image'} 
                    className="product-image"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                </div>
              </div>
            )}
            
            <div className="compare-view-wrapper">
              <CompareView 
                original={result.original} 
                optimized={result.optimized}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
