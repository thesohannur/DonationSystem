import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalNGOs: 0,
    totalAdmins: 0,
    approvedDonors: 0,
    verifiedNGOs: 0,
    unapprovedDonors: 0,
    unverifiedNGOs: 0,
    suspendedDonors: 0,
    suspendedNGOs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, profileRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/profile')
        ]);
        if (statsRes.data.success) {
          setStats(statsRes.data.data);
        }
        if (profileRes.data.success) {
          setProfile(profileRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const handleCardClick = (role, status = null) => {
    const query = new URLSearchParams();
    if (role) query.append('role', role);
    if (status) query.append('status', status);
    navigate(`/admin/users?${query.toString()}`);
  };

  return (
    <div className="admin-dashboard">

      {/* ── Hero Banner ── */}
      <div className="dashboard-hero">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="hero-content">
          <div className="hero-copy">
            <p className="hero-greeting">Welcome back</p>
            <h1 className="hero-name">{profile?.fullName || 'Administrator'}</h1>
            <p className="hero-sub">Overseeing platform health and community impact</p>
          </div>
          <div className="hero-profile-card">
            <div className="hero-avatar-ring">
              {profile?.profileImageUrl ? (
                <img src={profile.profileImageUrl} alt="Profile" className="hero-avatar-image" />
              ) : (
                <div className="hero-avatar-fallback">
                  {profile?.fullName?.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
            </div>
            <div className="hero-profile-meta">
              <span className="hero-profile-label">Admin Profile</span>
              <strong className="hero-profile-name">{profile?.fullName || 'System Admin'}</strong>
              <span className="hero-profile-email">{profile?.email || 'admin@shohay.org'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">NGO Overview</h2>
        <div className="stats-grid">
          <div className="stat-card clickable" onClick={() => handleCardClick('NGO')}>
            <h3>Total NGOs</h3>
            <p className="stat-number">{stats.totalNGOs}</p>
          </div>
          <div className="stat-card clickable" onClick={() => handleCardClick('NGO', 'verified')}>
            <h3>Verified NGOs</h3>
            <p className="stat-number verified">{stats.verifiedNGOs}</p>
          </div>
          <div className="stat-card clickable" onClick={() => handleCardClick('NGO', 'unverified')}>
            <h3>Unverified NGOs</h3>
            <p className="stat-number pending">{stats.unverifiedNGOs}</p>
          </div>
          <div className="stat-card clickable" onClick={() => handleCardClick('NGO', 'suspended')}>
            <h3>Suspended NGOs</h3>
            <p className="stat-number suspended">{stats.suspendedNGOs}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Donor Overview</h2>
        <div className="stats-grid">
          <div className="stat-card clickable" onClick={() => handleCardClick('DONOR')}>
            <h3>Total Donors</h3>
            <p className="stat-number">{stats.totalDonors}</p>
          </div>
          <div className="stat-card clickable" onClick={() => handleCardClick('DONOR', 'verified')}>
            <h3>Approved Donors</h3>
            <p className="stat-number verified">{stats.approvedDonors}</p>
          </div>
          <div className="stat-card clickable" onClick={() => handleCardClick('DONOR', 'unverified')}>
            <h3>Unapproved Donors</h3>
            <p className="stat-number pending">{stats.unapprovedDonors}</p>
          </div>
          <div className="stat-card clickable" onClick={() => handleCardClick('DONOR', 'suspended')}>
            <h3>Suspended Donors</h3>
            <p className="stat-number suspended">{stats.suspendedDonors}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Administration</h2>
        <div className="stats-grid">
          <div className="stat-card clickable" onClick={() => handleCardClick('ADMIN')}>
            <h3>Total Administrators</h3>
            <p className="stat-number admin">{stats.totalAdmins}</p>
          </div>
          <div className="stat-card clickable" onClick={() => navigate('/admin/users')}>
            <h3>Total System Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
