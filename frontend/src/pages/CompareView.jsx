import React from 'react';
import './CompareView.css';

function SkeletonText({ width = '80%', height = 18 }) {
  return <div className="skeleton shimmer" style={{ width, height, marginBottom: 8 }}></div>;
}

function CompareView({ original, optimized, loading }) {
  if (loading) {
    return (
      <div className="compare-view-container">
        <div className="compare-card">
          <h3 className="compare-card-title original">Original</h3>
          <div className="compare-item-group">
            <span className="compare-item-label">Title</span>
            <SkeletonText width="90%" />
          </div>
          <div className="compare-item-group">
            <span className="compare-item-label">Bullet Points</span>
            <ul className="compare-bullets">
              {[...Array(5)].map((_, i) => <li key={i}><SkeletonText width="95%" /></li>)}
            </ul>
          </div>
          <div className="compare-item-group">
            <span className="compare-item-label">Description</span>
            <SkeletonText width="98%" height={32} />
          </div>
        </div>
        <div className="compare-card optimized">
          <h3 className="compare-card-title optimized">Optimized</h3>
          <div className="compare-item-group">
            <span className="compare-item-label">Title</span>
            <SkeletonText width="90%" />
          </div>
          <div className="compare-item-group">
            <span className="compare-item-label">Bullet Points</span>
            <ul className="compare-bullets">
              {[...Array(5)].map((_, i) => <li key={i}><SkeletonText width="95%" /></li>)}
            </ul>
          </div>
          <div className="compare-item-group">
            <span className="compare-item-label">Description</span>
            <SkeletonText width="98%" height={32} />
          </div>
          <div className="compare-keywords">
            <span className="compare-item-label">Keywords</span>
            <div className="compare-item-value">
              {[...Array(4)].map((_, i) => <SkeletonText key={i} width="60px" height={18} />)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="compare-view-container">
      <div className="compare-card">
        <h3 className="compare-card-title original">Original</h3>
        <div className="compare-item-group">
          <span className="compare-item-label">Title</span>
          <div className="compare-item-value">{original.title}</div>
        </div>
        <div className="compare-item-group">
          <span className="compare-item-label">Bullet Points</span>
          <ul className="compare-bullets">
            {original.bullets && original.bullets.length > 0 ? (
              original.bullets.map((b, i) => <li key={i}>{b}</li>)
            ) : (
              <li className="text-secondary">No bullet points available</li>
            )}
          </ul>
        </div>
        <div className="compare-item-group">
          <span className="compare-item-label">Description</span>
          <div className="compare-item-value">
            {original.description || <span className="text-secondary">No description available</span>}
          </div>
        </div>
      </div>
      <div className="compare-card optimized">
        <h3 className="compare-card-title optimized">Optimized</h3>
        <div className="compare-item-group">
          <span className="compare-item-label">Title</span>
          <div className="compare-item-value">{optimized.title}</div>
        </div>
        <div className="compare-item-group">
          <span className="compare-item-label">Bullet Points</span>
          <ul className="compare-bullets">
            {optimized.bullets && optimized.bullets.length > 0 ? (
              optimized.bullets.map((b, i) => <li key={i}>{b}</li>)
            ) : (
              <li className="text-secondary">No bullet points available</li>
            )}
          </ul>
        </div>
        <div className="compare-item-group">
          <span className="compare-item-label">Description</span>
          <div className="compare-item-value">
            {optimized.description || <span className="text-secondary">No description available</span>}
          </div>
        </div>
        {optimized.keywords && optimized.keywords.length > 0 && (
          <div className="compare-keywords">
            <span className="compare-item-label">Keywords</span>
            <div className="compare-item-value">
              {optimized.keywords.map((keyword, i) => (
                <span key={i} className="keyword-tag">{keyword}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompareView;
