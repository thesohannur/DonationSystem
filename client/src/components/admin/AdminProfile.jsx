import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import './AdminProfile.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [fullName, setFullName] = useState('');
  const fileInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/profile');
      setProfile(data.data);
      setFullName(data.data.fullName);
    } catch (err) {
      setError('Failed to load profile. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handlePickImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });

  const compressImageToDataUrl = async (file) => {
    const sourceDataUrl = await fileToDataUrl(file);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const maxSide = 900;
        const ratio = Math.min(maxSide / img.width, maxSide / img.height, 1);
        const width = Math.max(1, Math.round(img.width * ratio));
        const height = Math.max(1, Math.round(img.height * ratio));

        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Failed to process image')); return; }

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => reject(new Error('Failed to process image'));
      img.src = sourceDataUrl;
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      e.target.value = '';
      return;
    }

    try {
      setPictureLoading(true);
      setError(null); setSuccess(null);
      
      const imageBase64 = await compressImageToDataUrl(file);
      await api.patch('/admin/profile/picture', { image: imageBase64 });
      
      await fetchProfile();
      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture. Try a smaller image.');
    } finally {
      setPictureLoading(false);
      e.target.value = '';
    }
  };

  const handleRemovePicture = async () => {
    if (!window.confirm("Remove profile picture?")) return;
    try {
      setPictureLoading(true);
      setError(null); setSuccess(null);
      await api.delete('/admin/profile/picture');
      await fetchProfile();
      setSuccess('Profile picture removed successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove profile picture.');
    } finally {
      setPictureLoading(false);
    }
  };

  if (loading && !profile) return <div className="ap-loading">Loading profile...</div>;
  if (!profile) return <div className="ap-error">{error || 'Failed to load profile data.'}</div>;

  return (
    <div className="admin-profile">
      <div className="ap-page-header">
        <h1>My Profile</h1>
        <p>View and update your administrator account information.</p>
      </div>

      {success && <div className="ap-success">{success}</div>}
      {error   && <div className="ap-error">{error}</div>}

      <div className="ap-layout">
        
        {/* Left column: Picture Card */}
        <div className="ap-picture-card">
          <div className="ap-picture-preview">
            {profile?.profileImageUrl ? (
              <img src={profile.profileImageUrl} alt="Admin Profile" className="ap-picture-image" />
            ) : (
              <div className="ap-picture-fallback">
                {profile?.fullName?.charAt(0).toUpperCase() || 'A'}
              </div>
            )}
            {pictureLoading && <div className="ap-picture-overlay"><span className="ap-spinner"></span></div>}
          </div>

          <div className="ap-picture-info">
            <span className="ap-role-badge">Administrator</span>
            <h3>{profile?.fullName || 'System Admin'}</h3>
            <p>Update your admin profile picture to make your account easily identifiable.</p>
          </div>

          <div className="ap-picture-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button 
              className="ap-pic-btn primary" 
              onClick={handlePickImage} 
              disabled={pictureLoading}
            >
              {profile?.profileImageUrl ? 'Change Photo' : 'Add Photo'}
            </button>
            {profile?.profileImageUrl && (
              <button 
                className="ap-pic-btn danger" 
                onClick={handleRemovePicture} 
                disabled={pictureLoading}
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Right column: Form Card */}
        <div className="ap-card ap-flex-fill">
          <div className="ap-card-header">
            <h2>Account Details</h2>
            {!editing && (
              <button className="ap-edit-btn" onClick={() => { setEditing(true); setSuccess(null); }}>
                Edit Details
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
                <span className="ap-label">Permissions</span>
                <span className="ap-value">System Level</span>
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
    </div>
  );
};

export default AdminProfile;
