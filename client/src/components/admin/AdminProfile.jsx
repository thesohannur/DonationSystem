import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminProfile.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/admin/profile');
        setProfile(data.data);
        setFullName(data.data.fullName);
      } catch (err) {
        setError('Failed to load profile. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!fullName.trim()) { setError('Full name cannot be empty.'); return; }
    setSaving(true);
    try {
      const { data } = await api.put('/admin/profile', { fullName });
      setProfile(data.data);
      setFullName(data.data.fullName);
      setEditing(false);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(profile.fullName);
    setEditing(false);
    setError(null);
  };

  if (loading) return <div className="ap-loading">Loading profile...</div>;

  return (
    <div className="admin-profile">
      <div className="ap-page-header">
        <h1>My Profile</h1>
        <p>View and update your administrator account information.</p>
      </div>

      {success && <div className="ap-success">{success}</div>}
      {error   && <div className="ap-error">{error}</div>}

      <div className="ap-card">
        <div className="ap-card-header">
          <h2>Account Details</h2>
          {!editing && (
            <button className="ap-edit-btn" onClick={() => { setEditing(true); setSuccess(null); }}>
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form className="ap-form" onSubmit={handleSave}>
            <div className="ap-field">
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your full name"
                required
                autoFocus
              />
            </div>
            <div className="ap-field">
              <label>Email Address</label>
              <input type="email" value={profile.email} disabled />
              <span className="ap-hint">Email cannot be changed.</span>
            </div>
            <div className="ap-actions">
              <button type="submit" className="ap-save-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" className="ap-cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="ap-info">
            <div className="ap-row">
              <span className="ap-label">Full Name</span>
              <span className="ap-value">{profile.fullName}</span>
            </div>
            <div className="ap-row">
              <span className="ap-label">Email Address</span>
              <span className="ap-value">{profile.email}</span>
            </div>
            <div className="ap-row">
              <span className="ap-label">Role</span>
              <span className="ap-value">
                <span className="ap-role-badge">Administrator</span>
              </span>
            </div>
            <div className="ap-row">
              <span className="ap-label">Registered On</span>
              <span className="ap-value">
                {new Date(profile.registrationDate).toLocaleDateString('en-GB', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
