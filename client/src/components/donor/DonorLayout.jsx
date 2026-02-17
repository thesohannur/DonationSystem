import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './DonorLayout.css';
import { BarChart3, Home, LogOut, Search, User2 } from "lucide-react";

const DonorLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/donor/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="donor-layout">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">{!isSidebarCollapsed && 'Donor Portal'}</h2>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/donor/dashboard"
            className={`nav-item ${isActive('/donor/dashboard') ? 'active' : ''}`}
            title="Dashboard"
          >
            <Home className="nav-icon" size={24} />
            <span className="nav-text">Dashboard</span>
          </Link>

          <Link
            to="/donor/campaigns"
            className={`nav-item ${isActive('/donor/campaigns') ? 'active' : ''}`}
            title="Browse Campaigns"
          >
            <Search className="nav-icon" size={24} />
            <span className="nav-text">Browse Campaigns</span>
          </Link>

          <Link
            to="/donor/donations"
            className={`nav-item ${isActive('/donor/donations') ? 'active' : ''}`}
            title="Donation History"
          >
            <BarChart3 className="nav-icon" size={24} />
            <span className="nav-text">Donation History</span>
          </Link>

          <Link
            to="/donor/profile"
            className={`nav-item ${isActive('/donor/profile') ? 'active' : ''}`}
            title="My Profile"
          >
            <User2 className="nav-icon" size={24} />
            <span className="nav-text">My Profile</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut className="nav-icon" size={24} />
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
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