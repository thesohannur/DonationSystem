import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import CampaignCard from './CampaignCard';
import './BrowseCampaigns.css';

const BrowseCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    acceptsMoney: '',
    acceptsTime: '',
    sortBy: 'recent',
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, campaigns]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await donorService.getActiveCampaigns();
      setCampaigns(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load campaigns');
      console.error('Campaigns error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...campaigns];

    if (filters.acceptsMoney !== '') {
      const acceptsMoney = filters.acceptsMoney === 'true';
      filtered = filtered.filter(c => c.acceptsMoney === acceptsMoney);
    }

    if (filters.acceptsTime !== '') {
      const acceptsTime = filters.acceptsTime === 'true';
      filtered = filtered.filter(c => c.acceptsTime === acceptsTime);
    }

    switch (filters.sortBy) {
      case 'expiring_soon':
        filtered.sort((a, b) => new Date(a.expirationTime) - new Date(b.expirationTime));
        break;
      case 'amount_raised':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));
    }

    setFilteredCampaigns(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      acceptsMoney: '',
      acceptsTime: '',
      sortBy: 'recent',
    });
  };

  if (loading) {
    return (
      <div className="campaigns-container">
        <div className="loading-spinner">Loading campaigns...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="campaigns-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="campaigns-container">
      <div className="campaigns-header">
        <div>
          <h1>Browse Campaigns</h1>
          <p className="subtitle">Support relief efforts and make an impact</p>
        </div>
        <div className="campaigns-count">
          <span className="count-number">{filteredCampaigns.length}</span>
          <span className="count-label">Active Campaigns</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-group">
          <div className="filter-item">
            <label>Accepts Money:</label>
            <select
              value={filters.acceptsMoney}
              onChange={(e) => handleFilterChange('acceptsMoney', e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Accepts Time:</label>
            <select
              value={filters.acceptsTime}
              onChange={(e) => handleFilterChange('acceptsTime', e.target.value)}
            >
              <option value="">All</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Sort By:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="amount_raised">Amount Raised</option>
            </select>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Campaigns Grid */} {/* Dummy not tested */}
      {filteredCampaigns.length > 0 ? (
        <div className="campaigns-grid">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No campaigns found</h3>
          <p>Try adjusting your filters to see more results</p>
          <button className="empty-state-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseCampaigns;