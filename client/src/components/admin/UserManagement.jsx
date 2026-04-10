import React, { useState, useEffect } from 'react';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock fetching users from the API: `/api/admin/users`
  useEffect(() => {
    const fetchUsers = async () => {
      // Simulate API response
      setTimeout(() => {
        setUsers([
          { _id: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'DONOR', isActive: true },
          { _id: '2', name: 'Bob Jones', email: 'bob@example.com', role: 'DONOR', isActive: false },
          { _id: '3', name: 'Helping Hands', email: 'contact@helpinghands.org', role: 'NGO', isActive: true },
          { _id: '4', name: 'Save The Earth', email: 'info@saveearth.org', role: 'NGO', isActive: true },
          { _id: '5', name: 'Admin One', email: 'admin@shohay.org', role: 'ADMIN', isActive: true },
        ]);
        setLoading(false);
      }, 500);
    };

    fetchUsers();
  }, []);

  const toggleUserStatus = (userId) => {
    // In a real scenario, make a PATCH to /api/admin/users/${userId}/status
    setUsers(users.map(user => {
      if (user._id === userId) {
        return { ...user, isActive: !user.isActive };
      }
      return user;
    }));
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="um-header">
        <h1>User Management</h1>
        <p>View and manage all system users across roles.</p>
      </div>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button 
                    className={`toggle-btn ${user.isActive ? 'btn-deactivate' : 'btn-activate'}`}
                    onClick={() => toggleUserStatus(user._id)}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="no-data">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
