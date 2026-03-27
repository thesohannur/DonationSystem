import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const filterRole = queryParams.get('role');
  const filterStatus = queryParams.get('status');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/admin/users');
        if (data.success) {
          setUsers(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    // Optimistically update the UI
    setUsers(users.map(user => 
      user._id === userId ? { ...user, isActive: newStatus } : user
    ));

    try {
      await api.patch(`/admin/users/${userId}/status`, { isActive: newStatus });
    } catch (error) {
      console.error("Failed to toggle user status", error);
      // Revert if failed
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: currentStatus } : user
      ));
    }
  };

  const toggleUserApproval = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    // Optimistically update
    setUsers(users.map(user => 
      user._id === userId ? { ...user, isProfileApproved: newStatus } : user
    ));

    try {
      await api.patch(`/admin/users/${userId}/approval`, { isApproved: newStatus });
    } catch (error) {
      console.error("Failed to toggle profile approval", error);
      // Revert if failed
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isProfileApproved: currentStatus } : user
      ));
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  // Apply filters
  const filteredUsers = users.filter(user => {
    let match = true;
    if (filterRole && user.role !== filterRole) {
      match = false;
    }
    if (filterStatus) {
      if (filterStatus === 'suspended' && user.isActive !== false) match = false;
      if (filterStatus === 'verified' && user.isProfileApproved !== true) match = false;
      if (filterStatus === 'unverified' && user.isProfileApproved !== false) match = false;
    }
    return match;
  });

  return (
    <div className="user-management">
      <div className="um-header">
        <h1>User Management</h1>
        <div className="um-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <p>
            View and manage {filterStatus ? filterStatus : ''} {filterRole ? `${filterRole}` : 'all system'} users.
          </p>
          {(filterRole || filterStatus) && (
            <button 
              onClick={() => navigate('/admin/users')}
              style={{ padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Access</th>
              <th>Profile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td>
                  {user.role === 'ADMIN' ? (
                    <span className="profile-badge na">N/A</span>
                  ) : (
                    <span className={`profile-badge ${user.isProfileApproved ? 'verified' : 'pending'}`}>
                      {user.isProfileApproved ? 'Verified' : 'Pending'}
                    </span>
                  )}
                </td>
                <td>
                  {user.role === 'ADMIN' ? (
                    <span className="admin-lock">System Admin</span>
                  ) : (
                    <div className="action-buttons">
                      <button 
                        className="toggle-btn btn-sm btn-view"
                        onClick={() => setSelectedUser(user)}
                        title="View Profile Details"
                      >
                        View
                      </button>
                      <button 
                        className={`toggle-btn btn-sm ${user.isActive ? 'btn-deactivate' : 'btn-activate'}`}
                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                        title={user.isActive ? "Suspend System Access" : "Grant System Access"}
                      >
                        {user.isActive ? 'Suspend' : 'Activate'}
                      </button>
                      <button 
                        className={`toggle-btn btn-sm ${user.isProfileApproved ? 'btn-unverify' : 'btn-verify'}`}
                        onClick={() => toggleUserApproval(user._id, user.isProfileApproved)}
                        title={user.isProfileApproved ? "Revoke Verification" : "Verify Profile"}
                      >
                        {user.isProfileApproved ? 'Unverify' : 'Verify'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="6" className="no-data">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="profile-modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedUser.name}</h2>
              <span className={`role-badge role-${selectedUser.role.toLowerCase()}`}>{selectedUser.role}</span>
            </div>
            <div className="modal-body">
              <p><strong>Email:</strong> {selectedUser.email}</p>
              {selectedUser.role === 'NGO' && (
                <>
                  <p><strong>Registration Number:</strong> {selectedUser.profile.registrationNumber}</p>
                  <p><strong>Contact Person:</strong> {selectedUser.profile.contactPerson}</p>
                  <p><strong>Phone:</strong> {selectedUser.profile.phoneNumber || 'N/A'}</p>
                  <p><strong>Website:</strong> {selectedUser.profile.website || 'N/A'}</p>
                  <p><strong>Address:</strong> {selectedUser.profile.address || 'N/A'}</p>
                  <p><strong>Total Received:</strong> ${selectedUser.profile.totalReceived}</p>
                </>
              )}
              {selectedUser.role === 'DONOR' && (
                <>
                  <p><strong>Phone:</strong> {selectedUser.profile.phoneNumber || 'N/A'}</p>
                  <p><strong>Occupation:</strong> {selectedUser.profile.occupation || 'N/A'}</p>
                  <p><strong>Address:</strong> {selectedUser.profile.address || 'N/A'}</p>
                  <p><strong>Total Donated:</strong> ${selectedUser.profile.totalDonated}</p>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-close" onClick={() => setSelectedUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
