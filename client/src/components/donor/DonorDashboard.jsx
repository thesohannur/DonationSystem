import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donorService } from '../../services/donorService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './DonorDashboard.css';

const DonorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes, donationsRes] = await Promise.all([
        donorService.getMyProfile(),
        donorService.getMyStats(),
        donorService.getMyDonations(),
      ]);

      setProfile(profileRes.data);
      setStats(statsRes.data);
      setRecentDonations(donationsRes.data.slice(0, 5)); // Get last 5 donations
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {profile?.firstName}!</h1>
          <p className="subtitle">Thank you for making a difference</p>
        </div>
        {!stats?.approved && (
          <div className="approval-notice">
            <span className="notice-icon">⏳</span>
            <span>Your account is pending approval</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Donated</h3>
            <p className="stat-value">{formatCurrency(stats?.totalDonated || 0)}</p>
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Campaigns Supported</h3>
            <p className="stat-value">{stats?.campaignsSupported || 0}</p>
          </div>
        </div>

        <div className="stat-card stat-card-tertiary">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>Total Donations</h3>
            <p className="stat-value">{stats?.donationCount || 0}</p>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Member Since</h3>
            <p className="stat-value-date">
              {stats?.registrationDate ? formatDate(stats.registrationDate) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="quick-actions-grid">
          <button
            className="action-btn action-btn-primary"
            onClick={() => navigate('/donor/campaigns')}
          >
            <span className="action-icon">🔍</span>
            <span>Browse Campaigns</span>
          </button>
          <button
            className="action-btn action-btn-secondary"
            onClick={() => navigate('/donor/donations')}
          >
            <span className="action-icon">📊</span>
            <span>View History</span>
          </button>
          <button
            className="action-btn action-btn-tertiary"
            onClick={() => navigate('/donor/profile')}
          >
            <span className="action-icon">👤</span>
            <span>Update Profile</span>
          </button>
        </div>
      </div>

      {/* Recent Donations */}
      {recentDonations.length > 0 && (
        <div className="recent-donations-section">
          <div className="section-header">
            <h2>Recent Donations</h2>
            <button
              className="view-all-btn"
              onClick={() => navigate('/donor/donations')}
            >
              View All
            </button>
          </div>
          <div className="donations-list">
            {recentDonations.map((donation) => (
              <div key={donation._id} className="donation-item">
                <div className="donation-info">
                  <h4>{donation.ngoId?.name || 'NGO Name'}</h4>
                  <p className="donation-date">{formatDate(donation.timestamp)}</p>
                </div>
                <div className="donation-amount">
                  <span className="amount-value">{formatCurrency(donation.amount)}</span>
                  <span className={`status-badge status-${donation.status.toLowerCase()}`}>
                    {donation.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {recentDonations.length === 0 && stats?.donationCount === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">💝</div>
          <h3>No donations yet</h3>
          <p>Start making a difference today by donating to a campaign</p>
          <button
            className="empty-state-btn"
            onClick={() => navigate('/donor/campaigns')}
          >
            Browse Campaigns
          </button>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;