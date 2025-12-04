import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import History from './pages/History';
import api from './utils/api';
import './styles/app.css';

function App() {
  const [page, setPage] = useState('home');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get('/health');
        setBackendStatus(response.ok ? 'OK' : 'Error');
      } catch (error) {
        setBackendStatus('Error');
      }
    };
    checkBackend();
  }, []);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-links">
          <button 
            onClick={() => setPage('home')} 
            className={`nav-button ${page === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => setPage('history')} 
            className={`nav-button ${page === 'history' ? 'active' : ''}`}
          >
            History
          </button>
        </div>
        <div className="backend-status">
          Backend Status: 
          <span className={backendStatus === 'OK' ? 'text-accent' : 'text-danger'}>
            {` ${backendStatus}`}
          </span>
        </div>
      </nav>
      {page === 'home' && <Home />}
      {page === 'history' && <History />}
    </div>
  );
}

export default App;
