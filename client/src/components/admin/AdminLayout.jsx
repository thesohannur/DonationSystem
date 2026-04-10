import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/auth/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Shohay Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => (isActive ? 'active-link' : '')}>
            User Management
          </NavLink>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
