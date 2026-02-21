import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donorService } from '../../services/donorService';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/helpers';
import './DonorDashboard.css';
import { BarChart3, Calendar, Clock, Gift, HeartHandshake, Hourglass, Search, Target, User, Wallet } from 'lucide-react';

const DonorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [profileRes, statsRes, donationsRes] = await Promise.allSettled([
        donorService.getMyProfile(),
        donorService.getMyStats(),
        donorService.getMyDonations(),
      ]);

      if (profileRes.status === 'rejected') throw new Error('Failed to load profile');

      setProfile(profileRes.value.data);
      setStats(statsRes.status === 'fulfilled' ? statsRes.value.data : {
        totalDonated: 0, donationCount: 0, campaignsSupported: 0,
        volunteerCount: 0, totalHoursCommitted: 0,
        registrationDate: profileRes.value.data.registrationDate,
        approved: profileRes.value.data.approved,
      });
      setRecentDonations(
        donationsRes.status === 'fulfilled' ? donationsRes.value.data.slice(0, 5) : []
      );
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="dashboard-container">
      <div className="loading-spinner">
        <div className="spinner-ring" />
        Loading your dashboard...
      </div>
    </div>
  );

  if (error) return (
    <div className="dashboard-container">
      <div className="error-message">{error}</div>
    </div>
  );

  return (
    <div className="dashboard-container">

      {/* â”€â”€ Hero Banner â”€â”€ */}
      <div className="dashboard-hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="hero-content">
          <div>
            <p className="hero-greeting">Welcome back</p>
            <h1 className="hero-name">{profile?.firstName} {profile?.lastName}</h1>
            <p className="hero-sub">Thank you for making a difference</p>
          </div>
          {!stats?.approved && (
            <div className="approval-notice">
              <Hourglass size={16} />
              <span>Account pending approval</span>
            </div>
          )}
        </div>
      </div>

      {/* â”€â”€ Stats Grid â”€â”€ */}
      <div className="stats-grid">
        <div className="stat-card stat-card-primary">
          <div className="stat-card-glow" />
          <div className="stat-card-icon-wrap"><Wallet size={26} /></div>
          <div className="stat-content">
            <p className="stat-label">Total Donated</p>
            <p className="stat-value">{formatCurrency(stats?.totalDonated || 0)}</p>
          </div>
        </div>

        <div className="stat-card stat-card-secondary">
          <div className="stat-card-glow" />
          <div className="stat-card-icon-wrap"><Target size={26} /></div>
          <div className="stat-content">
            <p className="stat-label">Campaigns</p>
            <p className="stat-value">{stats?.campaignsSupported || 0}</p>
          </div>
        </div>

        <div className="stat-card stat-card-tertiary">
          <div className="stat-card-glow" />
          <div className="stat-card-icon-wrap"><HeartHandshake size={26} /></div>
          <div className="stat-content">
            <p className="stat-label">Donations</p>
            <p className="stat-value">{stats?.donationCount || 0}</p>
          </div>
        </div>

        <div className="stat-card stat-card-time">
          <div className="stat-card-glow" />
          <div className="stat-card-icon-wrap"><Clock size={26} /></div>
          <div className="stat-content">
            <p className="stat-label">Hours Volunteered</p>
            <p className="stat-value">
              {stats?.totalHoursCommitted || 0}
              <span className="stat-unit"> hrs</span>
            </p>
          </div>
        </div>

        <div className="stat-card stat-card-info">
          <div className="stat-card-glow" />
          <div className="stat-card-icon-wrap"><Calendar size={26} /></div>
          <div className="stat-content">
            <p className="stat-label">Member Since</p>
            <p className="stat-value-date">
              {stats?.registrationDate ? formatDate(stats.registrationDate) : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* â”€â”€ Quick Actions â”€â”€ */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <button className="action-btn action-btn-primary" onClick={() => navigate('/donor/campaigns')}>
            <div className="action-btn-icon"><Search size={20} /></div>
            <div className="action-btn-text">
              <span className="action-title">Browse Campaigns</span>
              <span className="action-sub">Find causes to support</span>
            </div>
          </button>
          <button className="action-btn action-btn-secondary" onClick={() => navigate('/donor/donations')}>
            <div className="action-btn-icon"><BarChart3 size={20} /></div>
            <div className="action-btn-text">
              <span className="action-title">View History</span>
              <span className="action-sub">Money & time contributions</span>
            </div>
          </button>
          <button className="action-btn action-btn-tertiary" onClick={() => navigate('/donor/profile')}>
            <div className="action-btn-icon"><User size={20} /></div>
            <div className="action-btn-text">
              <span className="action-title">My Profile</span>
              <span className="action-sub">Update your information</span>
            </div>
          </button>
        </div>
      </div>

      {/* â”€â”€ Recent Activity â”€â”€ */}
      {recentDonations.length > 0 ? (
        <div className="recent-section">
          <div className="section-header">
            <h2 className="section-title" style={{ margin: 0 }}>Recent Activity</h2>
            <button className="view-all-btn" onClick={() => navigate('/donor/donations')}>View All</button>
          </div>
          <div className="activity-list">
            {recentDonations.map((item) => (
              <div key={item._id} className="activity-item">
                <div className={`activity-type-dot activity-type-dot--${item.type || 'money'}`}>
                  {item.type === 'time' ? <Clock size={14} /> : <Wallet size={14} />}
                </div>
                <div className="activity-info">
                  <p className="activity-ngo">
                    {item.ngoId?.organizationName || item.ngoId?.name || 'NGO'}
                  </p>
                  <p className="activity-date">{formatDateTime(item.timestamp)}</p>
                </div>
                <div className="activity-right">
                  <span className="activity-value">
                    {item.type === 'time'
                      ? `${item.hoursCommitted} hr${item.hoursCommitted !== 1 ? 's' : ''}`
                      : formatCurrency(item.amount)}
                  </span>
                  <span className={`status-badge activity-status status-${item.status?.toLowerCase()}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon"><Gift size={50} /></div>
          <h3>No contributions yet</h3>
          <p>Start making a difference today</p>
          <button className="empty-state-btn" onClick={() => navigate('/donor/campaigns')}>
            Browse Campaigns
          </button>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;
