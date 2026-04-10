import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import { formatDate, formatCurrency } from '../../utils/helpers';
import './DonorProfile.css';
import { Calendar, Calendar1Icon, CalendarX2, HeartHandshake, HeartHandshakeIcon, Wallet } from 'lucide-react';

const DonorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    address: '',
    occupation: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileRes, statsRes] = await Promise.all([
        donorService.getMyProfile(),
        donorService.getMyStats(),
      ]);
      
      setProfile(profileRes.data);
      setStats(statsRes.data);
      setFormData({
        phoneNumber: profileRes.data.phoneNumber || '',
        address: profileRes.data.address || '',
        occupation: profileRes.data.occupation || '',
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');
      
      await donorService.updateMyProfile(formData);
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
      
      // Refresh profile data
      await fetchProfile();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      phoneNumber: profile.phoneNumber || '',
      address: profile.address || '',
      occupation: profile.occupation || '',
    });
    setError('');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div>
          <h1>My Profile</h1>
          <p className="subtitle">Manage your personal information</p>
        </div>
        {!editing && (
          <button className="edit-btn" onClick={() => setEditing(true)}>
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="profile-layout">
        {/* Profile Information */}
        <div className="profile-section">
          <h2>Personal Information</h2>
          
          {!editing ? (
            <div className="info-card">
              <div className="info-group">
                <label>First Name</label>
                <p>{profile?.firstName || 'Not provided'}</p>
              </div>

              <div className="info-group">
                <label>Last Name</label>
                <p>{profile?.lastName || 'Not provided'}</p>
              </div>

              <div className="info-group">
                <label>Email</label>
                <p>{profile?.userId?.email || profile?.email || 'Not provided'}</p>
              </div>

              <div className="info-group">
                <label>Phone Number</label>
                <p>{profile?.phoneNumber || 'Not provided'}</p>
              </div>

              <div className="info-group">
                <label>Address</label>
                <p>{profile?.address || 'Not provided'}</p>
              </div>

              <div className="info-group">
                <label>Occupation</label>
                <p>{profile?.occupation || 'Not provided'}</p>
              </div>

              <div className="info-group">
                <label>Member Since</label>
                <p>{profile?.registrationDate ? formatDate(profile.registrationDate) : 'N/A'}</p>
              </div>

              <div className="info-group">
                <label>Account Status</label>
                <span className={`status-badge ${profile?.approved ? 'approved' : 'pending'}`}>
                  {profile?.approved ? '✓ Approved' : '⏳ Pending Approval'}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-row">
                <div className="form-group readonly">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    value={profile?.firstName || ''} 
                    disabled 
                  />
                  <span className="field-hint">Cannot be changed</span>
                </div>

                <div className="form-group readonly">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    value={profile?.lastName || ''} 
                    disabled 
                  />
                  <span className="field-hint">Cannot be changed</span>
                </div>
              </div>

              <div className="form-group readonly">
                <label>Email</label>
                <input 
                  type="email" 
                  value={profile?.userId?.email || profile?.email || ''} 
                  disabled 
                />
                <span className="field-hint">Cannot be changed</span>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder="Enter your occupation"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={handleCancel}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Statistics Section */}
        <div className="stats-section">
          <h2>Your Impact</h2>
          
          <div className="stats-cards">
            <div className="impact-card">
               <Wallet className="stat-icon icon-gold" size={48} />
              <div className="impact-content">
                <h3>Total Donated</h3>
                <p className="impact-value">{formatCurrency(stats?.totalDonated || 0)}</p>
              </div>
            </div>

            <div className="impact-card">
               <HeartHandshakeIcon className="stat-icon icon-red" size={48} />
              <div className="impact-content">
                <h3>Total Donations</h3>
                <p className="impact-value">{stats?.donationCount || 0}</p>
              </div>
            </div>

            <div className="impact-card">
                <Calendar className="stat-icon icon-pink" size={48} />
              <div className="impact-content">
                <h3>Campaigns Supported</h3>
                <p className="impact-value">{stats?.campaignsSupported || 0}</p>
              </div>
            </div>
          </div>

          <div className="account-info-card">
            <h3>Account Information</h3>
            <div className="account-detail">
              <span>Donor ID:</span>
              <span className="detail-value">{profile?._id || 'N/A'}</span>
            </div>
            <div className="account-detail">
              <span>Account Status:</span>
              <span className={`detail-value ${profile?.userId?.approved ? 'active' : 'inactive'}`}>
                {profile?.userId?.approved ? 'Active' : 'Not Approved'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;