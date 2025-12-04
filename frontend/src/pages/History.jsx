import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import CompareView from './CompareView';
import './History.css';

function History() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllHistory = async () => {
      try {
        const data = await api.get('/history');
        const json = await data.json();
        const sortedData = Array.isArray(json) ? json : [];
        setHistory(sortedData);
        setFilteredHistory(sortedData);
      } catch (err) {
        setHistory([]);
        setFilteredHistory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllHistory();
  }, []);

  useEffect(() => {
    const results = history.filter(item => 
      item.asin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.original_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.optimized_title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredHistory(results);
  }, [searchTerm, history]);

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-message">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">History</h2>
          <input
            type="text"
            placeholder="Search by ASIN or Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="history-search-input"
            aria-label="Search by ASIN or Title"
          />
        </div>
        <div className="history-list">
          {filteredHistory.length === 0 ? (
            <div className="no-records">No records found.</div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`history-item ${selectedItem?.id === item.id ? 'active' : ''}`}
                tabIndex={0}
                role="button"
                aria-pressed={selectedItem?.id === item.id}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedItem(item);
                  }
                }}
              >
                {item.imageUrl && (
                  <img 
                    src={item.imageUrl} 
                    alt={item.optimized_title || item.asin}
                    className="history-item-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div className="history-item-content">
                  <div className="history-item-asin">{item.asin}</div>
                  <div className="history-item-title-preview">
                    {item.optimized_title?.substring(0, 60) || 'No title available'}
                    {item.optimized_title && item.optimized_title.length > 60 && '...'}
                  </div>
                  <div className="history-item-date">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="history-detail-pane">
        {selectedItem ? (
          <div className="detail-pane-content">
            <div className="detail-pane-header">
              <h2 className="detail-pane-title">Optimization Details</h2>
              <div className="detail-pane-asin">ASIN: {selectedItem.asin}</div>
            </div>
            {selectedItem.imageUrl && (
              <div className="detail-pane-image-container">
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.optimized_title || selectedItem.asin}
                  className="detail-pane-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <CompareView
              original={{
                title: selectedItem.original_title,
                bullets: selectedItem.original_bullets,
                description: selectedItem.original_description
              }}
              optimized={{
                title: selectedItem.optimized_title,
                bullets: selectedItem.optimized_bullets,
                description: selectedItem.optimized_description,
                keywords: selectedItem.keywords
              }}
            />
          </div>
        ) : (
          <div className="no-selection">
            <div className="no-selection-icon">📋</div>
            <h2 className="no-selection-title">Select an item from the list</h2>
            <p className="no-selection-text">Choose an optimization record to view detailed comparison</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;
