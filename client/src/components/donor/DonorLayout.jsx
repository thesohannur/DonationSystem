import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './DonorLayout.css';

const DonorLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="donor-layout">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h2>Donor Portal</h2>
          <button className="close-menu-btn" onClick={closeMobileMenu}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/donor/dashboard"
            className={`nav-item ${isActive('/donor/dashboard') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </Link>

          <Link
            to="/donor/campaigns"
            className={`nav-item ${isActive('/donor/campaigns') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="nav-icon">🔍</span>
            <span className="nav-text">Browse Campaigns</span>
          </Link>

          <Link
            to="/donor/donations"
            className={`nav-item ${isActive('/donor/donations') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Donation History</span>
          </Link>

          <Link
            to="/donor/profile"
            className={`nav-item ${isActive('/donor/profile') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">My Profile</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            ☰
          </button>
          <div className="top-bar-title">Relief Donation System</div>
          <div className="top-bar-actions">
            <span className="user-role-badge">Donor</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DonorLayout;