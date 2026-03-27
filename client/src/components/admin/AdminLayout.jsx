import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, UserCog, Megaphone, LogOut } from "lucide-react";
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/auth/login');
  };

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">{!isSidebarCollapsed && 'Admin Portal'}</h2>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/admin/dashboard"
            className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
            title="Dashboard"
          >
            <LayoutDashboard className="nav-icon" size={24} />
            <span className="nav-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={`nav-item ${isActive('/admin/users') ? 'active' : ''}`}
            title="User Management"
          >
            <Users className="nav-icon" size={24} />
            <span className="nav-text">User Management</span>
          </NavLink>

          <NavLink
            to="/admin/campaigns"
            className={`nav-item ${isActive('/admin/campaigns') ? 'active' : ''}`}
            title="Campaigns"
          >
            <Megaphone className="nav-icon" size={24} />
            <span className="nav-text">Campaigns</span>
          </NavLink>

          <NavLink
            to="/admin/profile"
            className={`nav-item ${isActive('/admin/profile') ? 'active' : ''}`}
            title="My Profile"
          >
            <UserCog className="nav-icon" size={24} />
            <span className="nav-text">My Profile</span>
          </NavLink>
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
            <div className="top-bar-title">System Administration</div>
          </div>
          <div className="top-bar-actions">
            <span className="user-role-badge">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
