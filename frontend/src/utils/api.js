const API_BASE = '/api';

const api = {
  async get(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) {
      try {
        const errorData = await res.json();
        throw new Error(errorData.error || `Request failed with status ${res.status}`);
      } catch (e) {
        throw new Error(`Request failed with status ${res.status}`);
      }
    }
    return res;
  },

  async optimizeListing(asin) {
    const res = await fetch(`${API_BASE}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asin }),
    });
    
    if (!res.ok) {
      let errorMessage = 'Request failed';
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        errorMessage = `Request failed with status ${res.status}`;
      }
      throw new Error(errorMessage);
    }
    
    try {
      const text = await res.text();
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from server');
      }
      return JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Failed to parse server response: ${parseError.message}`);
    }
  },
  
  async getHistory(asin) {
    const res = await fetch(`${API_BASE}/history/${asin}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Request failed');
    }
    return res.json();
  },
};

export default api;
