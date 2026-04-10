import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donorService } from '../../services/donorService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import './DonorDashboard.css';
import { BarChart3, Calendar, Gift, HeartHandshake, Hourglass, Search, Target, User, Wallet } from "lucide-react";

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
      setError('');

      // Fetch profile
      let profileRes, statsRes, donationsRes;

      try {
        console.log('Fetching profile...');
        profileRes = await donorService.getMyProfile();
        console.log('Profile loaded:', profileRes);
      } catch (err) {
        console.error('Profile error:', err.response?.data || err.message);
        throw new Error('Failed to load profile: ' + (err.response?.data?.message || err.message));
      }

      try {
        console.log('Fetching stats...');
        statsRes = await donorService.getMyStats();
        console.log('Stats loaded:', statsRes);
      } catch (err) {
        console.error('Stats error:', err.response?.data || err.message);
        statsRes = {
          data: {
            totalDonated: 0,
            donationCount: 0,
            campaignsSupported: 0,
            registrationDate: profileRes.data.registrationDate,
            approved: profileRes.data.approved
          }
        };
      }

      try {
        console.log('Fetching donations...');
        donationsRes = await donorService.getMyDonations();
        console.log('Donations loaded:', donationsRes);
      } catch (err) {
        console.error('Donations error:', err.response?.data || err.message);
        donationsRes = { data: [] };
      }

      setProfile(profileRes.data);
      setStats(statsRes.data);
      setRecentDonations(donationsRes.data.slice(0, 5));

    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
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
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {profile?.firstName}!</h1>
          <p className="subtitle">Thank you for making a difference</p>
        </div>
        {!stats?.approved && (
          <div className="approval-notice">
            <Hourglass className="notice-icon" />
            <span>Your account is pending approval</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <Wallet className="stat-icon" size={40} />
          <div className="stat-content">
            <h3>Total Donated</h3>
            <p className="stat-value">{formatCurrency(stats?.totalDonated || 0)}</p>
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <Target className="stat-icon" size={40} />
          <div className="stat-content">
            <h3>Campaigns Supported</h3>
            <p className="stat-value">{stats?.campaignsSupported || 0}</p>
          </div>
        </div>

        <div className="stat-card stat-card-tertiary">
          <HeartHandshake className="stat-icon" size={40} />
          <div className="stat-content">
            <h3>Total Donations</h3>
            <p className="stat-value">{stats?.donationCount || 0}</p>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <Calendar className="stat-icon" size={40} />
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
            <Search className="action-icon" size={18} />
            <span>Browse Campaigns</span>
          </button>
          <button
            className="action-btn action-btn-secondary"
            onClick={() => navigate('/donor/donations')}
          >
            <BarChart3 className="action-icon icon-purple" size={20} />
            <span>View History</span>
          </button>
          <button
            className="action-btn action-btn-tertiary"
            onClick={() => navigate('/donor/profile')}
          >
            <User className="action-icon" size={18} />
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
          <div className="empty-state-icon">
            <Gift size={50} />
          </div>
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