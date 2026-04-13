import React, { useState, useEffect, useCallback } from 'react';
import { donorService } from '../../services/donorService';
import CampaignCard from './CampaignCard';
import './BrowseCampaigns.css';

const BrowseCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isApproved, setIsApproved] = useState(true);
  const [filters, setFilters] = useState({
    donationType: 'all', // 'all' | 'money' | 'time'
    hideExpired: true,
    sortBy: 'expiring_soon',
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const profileResponse = await donorService.getMyProfile();
      const approved = Boolean(profileResponse.data?.approved);
      setIsApproved(approved);

      if (!approved) {
        setCampaigns([]);
        setError('Campaign tab is locked until your account is verified.');
        return;
      }

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

  const applyFilters = useCallback(() => {
    let filtered = [...campaigns];

    if (filters.donationType === 'money') {
      filtered = filtered.filter(c => c.acceptsMoney === true);
    } else if (filters.donationType === 'time') {
      filtered = filtered.filter(c => c.acceptsTime === true);
    }

    if (filters.hideExpired) {
      const now = new Date();
      filtered = filtered.filter(c => new Date(c.expirationTime) > now);
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
  }, [campaigns, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      donationType: 'all',
      hideExpired: true,
      sortBy: 'expiring_soon',
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

  if (!isApproved) {
    return (
      <div className="campaigns-container">
        <div className="error-message">Campaign tab is locked until your account is verified.</div>
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
          <span className="count-label">Displayed Campaigns</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-top-row">
          <span className="filters-title">Filters</span>
          <button className="clear-filters-btn" onClick={clearFilters}>
            ↺ Reset
          </button>
        </div>

        <div className="filters-body">
          {/* Donation Type Pill Selector */}
          <div className="filter-block">
            <span className="filter-block-label">Donation Type</span>
            <div className="pill-group">
              {[
                { value: 'all', icon: '✦', text: 'All' },
                { value: 'money', icon: '💰', text: 'Money' },
                { value: 'time', icon: '⏱', text: 'Time' },
              ].map(({ value, icon, text }) => (
                <button
                  key={value}
                  className={`pill-btn${filters.donationType === value ? ' pill-btn--active' : ''}`}
                  onClick={() => handleFilterChange('donationType', value)}
                >
                  <span className="pill-icon">{icon}</span>
                  {text}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="filter-block">
            <span className="filter-block-label">Sort By</span>
            <select
              className="filter-select"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="expiring_soon">Expiring Soon</option>
              <option value="amount_raised">Amount Raised</option>
            </select>
          </div>

          {/* Hide Expired Toggle */}
          <div className="filter-block filter-block--toggle">
            <span className="filter-block-label">Hide Expired</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={filters.hideExpired}
                onChange={(e) => handleFilterChange('hideExpired', e.target.checked)}
              />
              <span className="toggle-track">
                <span className="toggle-thumb"></span>
              </span>
            </label>
          </div>
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