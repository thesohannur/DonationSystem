import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './DonorLayout.css';
import { BarChart3, Home, LogOut, Search, User2 } from "lucide-react";

const DonorLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/donor/login');
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

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="donor-layout">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">{!isSidebarCollapsed && 'Donor Portal'}</h2>
          <button className="close-menu-btn" onClick={closeMobileMenu}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/donor/dashboard"
            className={`nav-item ${isActive('/donor/dashboard') ? 'active' : ''}`}
            onClick={closeMobileMenu}
            title="Dashboard"
          >
            <Home className="nav-icon" size={30} />
            <span className="nav-text">Dashboard</span>
          </Link>

          <Link
            to="/donor/campaigns"
            className={`nav-item ${isActive('/donor/campaigns') ? 'active' : ''}`}
            onClick={closeMobileMenu}
            title="Browse Campaigns"
          >
           <span className="nav-icon"><Search size={30} /></span>
            <span className="nav-text">Browse Campaigns</span>
          </Link>

          <Link
            to="/donor/donations"
            className={`nav-item ${isActive('/donor/donations') ? 'active' : ''}`}
            onClick={closeMobileMenu}
            title="Donation History"
          >
           <span className="nav-icon"><BarChart3 size={30} /></span>
            <span className="nav-text">Donation History</span>
          </Link>

          <Link
            to="/donor/profile"
            className={`nav-item ${isActive('/donor/profile') ? 'active' : ''}`}
            onClick={closeMobileMenu}
            title="My Profile"
          >
           <span className="nav-icon"><User2 size={30} /></span>
            <span className="nav-text">My Profile</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <span className="nav-icon"><LogOut size={30} /> </span>
            <span className="nav-text">Logout</span>
          </button>
        </div>

        <button className="sidebar-toggle-btn desktop-toggle" onClick={toggleSidebar}>
          <span className="toggle-icon">{isSidebarCollapsed ? '▶' : '◀'}</span>
        </button>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* Main Content */}
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
              ☰
            </button>

            <button className="sidebar-toggle-btn topbar-toggle" onClick={toggleSidebar}>
              <span className="toggle-icon">☰</span>
            </button>
            <div className="top-bar-title">Relief Donation System</div>
          </div>
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