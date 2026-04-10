import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalNGOs: 0,
    totalAdmins: 0,
    approvedDonors: 0,
    verifiedNGOs: 0,
  });
  const [loading, setLoading] = useState(true);

  // Note: We would normally fetch this from '/api/admin/stats'
  // using an interceptor that attaches the token.
  // Mocking stats for frontend layout showcase.
  useEffect(() => {
    const fetchStats = async () => {
      // Simulating API call
      setTimeout(() => {
        setStats({
          totalUsers: 145,
          totalDonors: 100,
          totalNGOs: 40,
          totalAdmins: 5,
          approvedDonors: 100,
          verifiedNGOs: 35,
        });
        setLoading(false);
      }, 500);
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>System Dashboard</h1>
      <p>Overview of platform users and activity.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Donors</h3>
          <p className="stat-number">{stats.totalDonors}</p>
        </div>
        <div className="stat-card">
          <h3>NGOs Registered</h3>
          <p className="stat-number">{stats.totalNGOs}</p>
        </div>
        <div className="stat-card">
          <h3>Verified NGOs</h3>
          <p className="stat-number verified">{stats.verifiedNGOs}</p>
        </div>
        <div className="stat-card">
          <h3>Administrators</h3>
          <p className="stat-number">{stats.totalAdmins}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
