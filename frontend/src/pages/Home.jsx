import React, { useState, useEffect } from 'react';
import CompareView from './CompareView';
import api from '../utils/api';

const STORAGE_KEY = 'lastOptimizationResult';

function Home() {
  const [asin, setAsin] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const savedResult = localStorage.getItem(STORAGE_KEY);
    if (savedResult) {
      try {
        const parsedResult = JSON.parse(savedResult);
        setResult(parsedResult);
        if (parsedResult.asin) {
          setAsin(parsedResult.asin);
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const handleOptimize = async () => {
    setError('');
    setResult(null);
    localStorage.removeItem(STORAGE_KEY);
    
    if (!asin.trim()) {
      setError('Please enter an ASIN.');
      return;
    }
    
    setLoading(true);
    try {
      const data = await api.optimizeListing(asin.trim());
      setResult(data);
      setImageError(false);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
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

  const handleClearResult = () => {
    setResult(null);
    setAsin('');
    setImageError(false);
    localStorage.removeItem(STORAGE_KEY);
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

      {loading && (
        <div className="results-section">
          <div className="results-container">
            <div className="results-header">
              <h2 className="results-title">Optimization Results</h2>
              <button 
                className="clear-result-button"
                aria-label="Clear results"
                disabled
              >
                Clear
              </button>
            </div>
            <div className="product-image-wrapper skeleton shimmer" style={{height:180, width:180, margin:'0 auto'}}></div>
            <div className="compare-view-wrapper">
              <CompareView loading={true} />
            </div>
          </div>
        </div>
      )}

      {result && !loading && (
        <div className="results-section">
          <div className="results-container">
            <div className="results-header">
              <h2 className="results-title">Optimization Results</h2>
              <button 
                onClick={handleClearResult}
                className="clear-result-button"
                aria-label="Clear results"
              >
                Clear
              </button>
            </div>
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
