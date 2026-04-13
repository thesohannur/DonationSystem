import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ngoService } from '../../services/ngoService';
import { compressImageToDataUrl } from '../../utils/imageHelpers';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/helpers';
import './NGODashboard.css';
import {
  BadgeCheck,
  Building2,
  Camera,
  CircleDollarSign,
  Clock3,
  HandCoins,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  Megaphone,
  PencilLine,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  Wallet,
  X,
} from 'lucide-react';

const emptyCampaignForm = {
  description: '',
  targetAmount: '',
  expirationTime: '',
  acceptsMoney: true,
  acceptsTime: false,
  imageDataUrl: '',
};

const emptyProfileForm = {
  organizationName: '',
  contactPerson: '',
  phoneNumber: '',
  address: '',
  website: '',
  description: '',
  focusAreas: '',
};

const tabItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { key: 'donations', label: 'Donations', icon: CircleDollarSign },
  { key: 'volunteers', label: 'Volunteers', icon: Users },
  { key: 'profile', label: 'Profile', icon: UserRound },
];

const statusLabel = (campaign) => {
  if (campaign.approved) return 'Approved';
  if (campaign.rejectFlag > 0) return 'Rejected';
  if (campaign.pendingCheckup) return 'Under Review';
  return 'Pending';
};

const statusClass = (campaign) => {
  if (campaign.approved) return 'status-approved';
  if (campaign.rejectFlag > 0) return 'status-rejected';
  if (campaign.pendingCheckup) return 'status-review';
  return 'status-pending';
};

const NGODashboard = () => {
  const navigate = useNavigate();
  const campaignImageInputRef = useRef(null);
  const profileImageInputRef = useRef(null);
  const formAnchorRef = useRef(null);

  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileForm, setProfileForm] = useState(emptyProfileForm);
  const [campaignForm, setCampaignForm] = useState(emptyCampaignForm);
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [campaignSubmitting, setCampaignSubmitting] = useState(false);
  const [profilePictureLoading, setProfilePictureLoading] = useState(false);
  const [campaignImageLoading, setCampaignImageLoading] = useState(false);
  const [volunteerLoadingId, setVolunteerLoadingId] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [profileRes, statsRes, campaignsRes, donationsRes, volunteersRes] = await Promise.allSettled([
        ngoService.getMyProfile(),
        ngoService.getMyStats(),
        ngoService.getMyCampaigns(),
        ngoService.getMyDonations(),
        ngoService.getMyVolunteers(),
      ]);

      if (profileRes.status === 'rejected') {
        throw new Error('Failed to load NGO profile');
      }

      const loadedProfile = profileRes.value.data;
      setProfile(loadedProfile);
      setStats(statsRes.status === 'fulfilled' ? statsRes.value.data : null);
      setCampaigns(campaignsRes.status === 'fulfilled' ? campaignsRes.value.data : []);
      setDonations(donationsRes.status === 'fulfilled' ? donationsRes.value.data : []);
      setVolunteers(volunteersRes.status === 'fulfilled' ? volunteersRes.value.data : []);
      setProfileForm({
        organizationName: loadedProfile.organizationName || '',
        contactPerson: loadedProfile.contactPerson || '',
        phoneNumber: loadedProfile.phoneNumber || '',
        address: loadedProfile.address || '',
        website: loadedProfile.website || '',
        description: loadedProfile.description || '',
        focusAreas: Array.isArray(loadedProfile.focusAreas) ? loadedProfile.focusAreas.join(', ') : '',
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load NGO dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const statsCards = useMemo(() => ([
    { label: 'Campaigns', value: stats?.campaignCount || 0, icon: Megaphone, tone: 'primary' },
    { label: 'Received', value: formatCurrency(stats?.totalReceived || 0), icon: Wallet, tone: 'secondary' },
    { label: 'Donations', value: stats?.donationCount || 0, icon: CircleDollarSign, tone: 'tertiary' },
    { label: 'Volunteer Apps', value: stats?.volunteerApplications || 0, icon: Users, tone: 'quaternary' },
    { label: 'Volunteer Hours', value: `${stats?.totalVolunteerHours || 0} hrs`, icon: Clock3, tone: 'quinary' },
    { label: 'Verified', value: stats?.isVerified ? 'Yes' : 'Pending', icon: BadgeCheck, tone: 'senary' },
  ]), [stats]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/auth/login');
  };

  const resetCampaignForm = () => {
    setCampaignForm(emptyCampaignForm);
    setEditingCampaignId(null);
  };

  const handleCampaignImagePick = () => {
    campaignImageInputRef.current?.click();
  };

  const handleProfileImagePick = () => {
    profileImageInputRef.current?.click();
  };

  const handleCampaignImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid campaign image');
      event.target.value = '';
      return;
    }

    try {
      setCampaignImageLoading(true);
      setError('');
      const compressed = await compressImageToDataUrl(file);
      setCampaignForm((prev) => ({ ...prev, imageDataUrl: compressed }));
    } catch (err) {
      setError(err.message || 'Failed to process campaign image');
    } finally {
      setCampaignImageLoading(false);
      event.target.value = '';
    }
  };

  const handleProfileImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid profile image');
      event.target.value = '';
      return;
    }

    try {
      setProfilePictureLoading(true);
      setError('');
      setSuccess('');
      const compressed = await compressImageToDataUrl(file);
      await ngoService.uploadProfilePicture(compressed);
      await loadDashboardData();
      setSuccess('NGO profile picture updated successfully');
      window.setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setProfilePictureLoading(false);
      event.target.value = '';
    }
  };

  const handleProfilePictureRemove = async () => {
    try {
      setProfilePictureLoading(true);
      setError('');
      setSuccess('');
      await ngoService.removeProfilePicture();
      await loadDashboardData();
      setSuccess('NGO profile picture removed successfully');
      window.setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove profile picture');
    } finally {
      setProfilePictureLoading(false);
    }
  };

  const handleCampaignSubmit = async (event) => {
    event.preventDefault();

    try {
      setCampaignSubmitting(true);
      setError('');
      setSuccess('');

      const payload = {
        description: campaignForm.description,
        targetAmount: campaignForm.targetAmount ? Number(campaignForm.targetAmount) : null,
        expirationTime: campaignForm.expirationTime || null,
        acceptsMoney: campaignForm.acceptsMoney,
        acceptsTime: campaignForm.acceptsTime,
      };

      if (campaignForm.imageDataUrl) {
        payload.image = campaignForm.imageDataUrl;
      }

      if (editingCampaignId) {
        await ngoService.updateCampaign(editingCampaignId, payload);
        setSuccess('Campaign updated successfully');
      } else {
        await ngoService.createCampaign(payload);
        setSuccess('Campaign created successfully');
      }

      resetCampaignForm();
      await loadDashboardData();
      setActiveTab('campaigns');
      window.setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save campaign');
    } finally {
      setCampaignSubmitting(false);
    }
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaignId(campaign._id);
    setCampaignForm({
      description: campaign.description || '',
      targetAmount: campaign.targetAmount || '',
      expirationTime: campaign.expirationTime ? new Date(campaign.expirationTime).toISOString().slice(0, 16) : '',
      acceptsMoney: Boolean(campaign.acceptsMoney),
      acceptsTime: Boolean(campaign.acceptsTime),
      imageDataUrl: '',
    });
    setActiveTab('campaigns');
    window.setTimeout(() => formAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleDeleteCampaign = async (campaignId) => {
    if (!window.confirm('Delete this campaign?')) return;

    try {
      setError('');
      await ngoService.deleteCampaign(campaignId);
      setSuccess('Campaign deleted successfully');
      await loadDashboardData();
      window.setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete campaign');
    }
  };

  const handleVolunteerStatus = async (volunteerId, status, hoursCompleted = null) => {
    try {
      setVolunteerLoadingId(volunteerId);
      setError('');
      await ngoService.updateVolunteerStatus(volunteerId, {
        status,
        ...(hoursCompleted !== null ? { hoursCompleted } : {}),
      });
      await loadDashboardData();
      setSuccess('Volunteer status updated');
      window.setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update volunteer status');
    } finally {
      setVolunteerLoadingId('');
    }
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    try {
      setProfileSubmitting(true);
      setError('');
      setSuccess('');

      await ngoService.updateMyProfile({
        ...profileForm,
        focusAreas: profileForm.focusAreas
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      });

      await loadDashboardData();
      setSuccess('NGO profile updated successfully');
      window.setTimeout(() => setSuccess(''), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update NGO profile');
    } finally {
      setProfileSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="ngo-dashboard-shell ngo-loading-shell">
        <div className="ngo-loading-card">
          <RefreshCw className="spin-icon" size={26} />
          Loading NGO dashboard...
        </div>
      </div>
    );
  }

  const profileAvatar = profile?.profileImageUrl;
  const profileInitials = `${profile?.organizationName?.[0] || 'N'}${profile?.contactPerson?.[0] || ''}`.toUpperCase();
  const editingCampaign = editingCampaignId ? campaigns.find((campaign) => campaign._id === editingCampaignId) : null;
  const campaignImagePreview = campaignForm.imageDataUrl || editingCampaign?.imageUrl || '';
  const profileImagePreview = profileAvatar;

  return (
    <div className="ngo-dashboard-shell">
      <header className="ngo-hero">
        <div className="ngo-hero-copy">
          <div className="ngo-kicker">
            <ShieldCheck size={16} /> NGO Portal
          </div>
          <h1>{profile?.organizationName || 'NGO Dashboard'}</h1>
          <p>
            Manage campaigns, track donations, review volunteer applications, and keep your organization profile polished.
          </p>
          <div className="ngo-hero-actions">
            <button className="primary-btn" onClick={() => setActiveTab('campaigns')}>
              <Plus size={16} /> Create Campaign
            </button>
            <button className="secondary-btn" onClick={handleLogout}>
              <X size={16} /> Logout
            </button>
          </div>
        </div>

        <div className="ngo-hero-card">
          <div className="ngo-avatar-ring">
            {profileAvatar ? (
              <img src={profileAvatar} alt="NGO profile" className="ngo-avatar-image" />
            ) : (
              <div className="ngo-avatar-fallback">{profileInitials}</div>
            )}
          </div>
          <div className="ngo-hero-meta">
            <span className="ngo-meta-label">Verification</span>
            <strong>{profile?.isVerified ? 'Verified NGO' : 'Verification Pending'}</strong>
            <span>{profile?.email || ''}</span>
          </div>
        </div>
      </header>

      {error && <div className="ngo-alert ngo-alert-error">{error}</div>}
      {success && <div className="ngo-alert ngo-alert-success">{success}</div>}

      <section className="ngo-stat-grid">
        {statsCards.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.label} className={`ngo-stat-card tone-${item.tone}`}>
              <div className="ngo-stat-icon"><Icon size={22} /></div>
              <div>
                <span className="ngo-stat-label">{item.label}</span>
                <strong className="ngo-stat-value">{item.value}</strong>
              </div>
            </article>
          );
        })}
      </section>

      <nav className="ngo-tab-bar">
        {tabItems.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              className={`ngo-tab-button ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <main className="ngo-content-grid">
        {activeTab === 'overview' && (
          <>
            <section className="ngo-panel">
              <div className="ngo-panel-header">
                <h2>Recent Campaigns</h2>
                <button className="text-link" onClick={() => setActiveTab('campaigns')}>View all</button>
              </div>

              <div className="ngo-card-list">
                {campaigns.slice(0, 3).map((campaign) => (
                  <article key={campaign._id} className="ngo-mini-card">
                    <div className="ngo-mini-card-main">
                      <h3>{campaign.description}</h3>
                      <div className="ngo-mini-badges">
                        <span className={`status-pill ${statusClass(campaign)}`}>{statusLabel(campaign)}</span>
                        <span className="status-pill light">Money: {campaign.acceptsMoney ? 'Yes' : 'No'}</span>
                        <span className="status-pill light">Time: {campaign.acceptsTime ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                    <div className="ngo-mini-card-side">
                      <strong>{formatCurrency(campaign.amount || 0)}</strong>
                      <span>{campaign.expirationTime ? formatDate(campaign.expirationTime) : 'No expiry'}</span>
                    </div>
                  </article>
                ))}
                {campaigns.length === 0 && <div className="empty-state-inline">No campaigns created yet.</div>}
              </div>
            </section>

            <section className="ngo-panel">
              <div className="ngo-panel-header">
                <h2>Recent Donations</h2>
                <button className="text-link" onClick={() => setActiveTab('donations')}>View all</button>
              </div>

              <div className="ngo-table-wrap">
                <table className="ngo-table">
                  <thead>
                    <tr>
                      <th>Donor</th>
                      <th>Amount</th>
                      <th>Campaign</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.slice(0, 5).map((donation) => (
                      <tr key={donation._id}>
                        <td>{donation.donorId ? `${donation.donorId.firstName} ${donation.donorId.lastName}` : 'N/A'}</td>
                        <td>{formatCurrency(donation.amount || 0)}</td>
                        <td>{donation.campaignId?.description || 'General support'}</td>
                      </tr>
                    ))}
                    {donations.length === 0 && (
                      <tr><td colSpan="3" className="empty-state-inline">No donations received yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === 'campaigns' && (
          <section className="ngo-panel ngo-panel-span">
            <div className="ngo-panel-header">
              <div>
                <h2>Campaign Manager</h2>
                <p>Build and update fundraising drives with cover images and donation modes.</p>
              </div>
              <button className="primary-btn" onClick={() => { resetCampaignForm(); setActiveTab('campaigns'); formAnchorRef.current?.scrollIntoView({ behavior: 'smooth' }); }}>
                <Plus size={16} /> New Campaign
              </button>
            </div>

            <div className="ngo-campaign-grid">
              <div className="ngo-campaign-list">
                {campaigns.map((campaign) => (
                  <article key={campaign._id} className="ngo-campaign-card">
                    <div className="ngo-campaign-image">
                      {campaign.imageUrl ? (
                        <img src={campaign.imageUrl} alt="campaign" />
                      ) : (
                        <div className="ngo-campaign-placeholder"><ImageIcon size={28} /></div>
                      )}
                      <span className={`status-pill ${statusClass(campaign)}`}>{statusLabel(campaign)}</span>
                    </div>
                    <div className="ngo-campaign-body">
                      <h3>{campaign.description}</h3>
                      <div className="ngo-campaign-meta">
                        <span>{formatCurrency(campaign.amount || 0)}</span>
                        <span>{campaign.expirationTime ? formatDate(campaign.expirationTime) : 'No expiry'}</span>
                      </div>
                      <div className="ngo-campaign-tags">
                        <span>{campaign.acceptsMoney ? 'Money' : 'No money'}</span>
                        <span>{campaign.acceptsTime ? 'Time' : 'No time'}</span>
                      </div>
                      <div className="ngo-card-actions">
                        <button className="action-btn small" onClick={() => handleEditCampaign(campaign)}><PencilLine size={14} /> Edit</button>
                        <button className="action-btn small danger" onClick={() => handleDeleteCampaign(campaign._id)}><Trash2 size={14} /> Delete</button>
                      </div>
                    </div>
                  </article>
                ))}
                {campaigns.length === 0 && <div className="empty-state-inline">No campaigns yet. Create your first campaign below.</div>}
              </div>

              <form className="ngo-form-card" ref={formAnchorRef} onSubmit={handleCampaignSubmit}>
                <div className="ngo-form-header">
                  <h3>{editingCampaignId ? 'Edit Campaign' : 'Create Campaign'}</h3>
                  {editingCampaignId && <button type="button" className="text-link" onClick={resetCampaignForm}>Cancel edit</button>}
                </div>

                <div className="ngo-image-drop" onClick={handleCampaignImagePick} role="button" tabIndex={0} onKeyDown={() => handleCampaignImagePick()}>
                  {campaignImagePreview ? (
                    <img src={campaignImagePreview} alt="Campaign preview" className="ngo-image-preview" />
                  ) : (
                    <div className="ngo-image-placeholder">
                      <Camera size={24} />
                      <span>{campaignImageLoading ? 'Processing...' : 'Upload campaign image'}</span>
                    </div>
                  )}
                </div>
                <input ref={campaignImageInputRef} type="file" accept="image/*" className="hidden-input" onChange={handleCampaignImageChange} />

                <label className="ngo-field">
                  <span>Description</span>
                  <textarea
                    value={campaignForm.description}
                    onChange={(e) => setCampaignForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the campaign goal and impact"
                    rows={4}
                    required
                  />
                </label>

                <div className="ngo-form-grid">
                  <label className="ngo-field">
                    <span>Target Amount</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={campaignForm.targetAmount}
                      onChange={(e) => setCampaignForm((prev) => ({ ...prev, targetAmount: e.target.value }))}
                      placeholder="Optional"
                    />
                  </label>
                  <label className="ngo-field">
                    <span>Expiration</span>
                    <input
                      type="datetime-local"
                      value={campaignForm.expirationTime}
                      onChange={(e) => setCampaignForm((prev) => ({ ...prev, expirationTime: e.target.value }))}
                    />
                  </label>
                </div>

                <div className="ngo-toggle-row">
                  <label className={`ngo-switch ${campaignForm.acceptsMoney ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={campaignForm.acceptsMoney}
                      onChange={(e) => setCampaignForm((prev) => ({ ...prev, acceptsMoney: e.target.checked }))}
                    />
                    <span>Accept money</span>
                  </label>
                  <label className={`ngo-switch ${campaignForm.acceptsTime ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      checked={campaignForm.acceptsTime}
                      onChange={(e) => setCampaignForm((prev) => ({ ...prev, acceptsTime: e.target.checked }))}
                    />
                    <span>Accept time</span>
                  </label>
                </div>

                <div className="ngo-form-actions">
                  <button type="submit" className="primary-btn" disabled={campaignSubmitting}>
                    {campaignSubmitting ? <RefreshCw className="spin-icon" size={16} /> : <Save size={16} />}
                    {editingCampaignId ? 'Update Campaign' : 'Create Campaign'}
                  </button>
                  <button type="button" className="secondary-btn" onClick={resetCampaignForm}>Reset</button>
                </div>
              </form>
            </div>
          </section>
        )}

        {activeTab === 'donations' && (
          <section className="ngo-panel ngo-panel-span">
            <div className="ngo-panel-header">
              <div>
                <h2>Donations Received</h2>
                <p>Money donations routed to your NGO.</p>
              </div>
            </div>

            <div className="ngo-table-wrap">
              <table className="ngo-table">
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Campaign</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation._id}>
                      <td>{donation.donorId ? `${donation.donorId.firstName} ${donation.donorId.lastName}` : 'N/A'}</td>
                      <td>{donation.campaignId?.description || 'General support'}</td>
                      <td>{formatCurrency(donation.amount || 0)}</td>
                      <td><span className={`status-pill ${donation.status === 'SUCCESS' ? 'status-approved' : 'status-pending'}`}>{donation.status}</span></td>
                      <td>{donation.timestamp ? formatDateTime(donation.timestamp) : 'N/A'}</td>
                    </tr>
                  ))}
                  {donations.length === 0 && (
                    <tr><td colSpan="5" className="empty-state-inline">No donations received yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'volunteers' && (
          <section className="ngo-panel ngo-panel-span">
            <div className="ngo-panel-header">
              <div>
                <h2>Volunteer Applications</h2>
                <p>Review time donations and update status when work is completed.</p>
              </div>
            </div>

            <div className="ngo-volunteer-list">
              {volunteers.map((volunteer) => (
                <article key={volunteer._id} className="ngo-volunteer-card">
                  <div>
                    <h3>{volunteer.donorId ? `${volunteer.donorId.firstName} ${volunteer.donorId.lastName}` : 'Volunteer'}</h3>
                    <p>{volunteer.donorId?.email || ''}</p>
                    <p className="muted">{volunteer.campaignId?.description || 'Campaign volunteer request'}</p>
                  </div>
                  <div className="ngo-volunteer-meta">
                    <span>{volunteer.hoursCommitted || 0} committed hrs</span>
                    <span>{volunteer.hoursCompleted || 0} completed hrs</span>
                    <span className={`status-pill ${volunteer.status === 'APPROVED' ? 'status-approved' : volunteer.status === 'REJECTED' ? 'status-rejected' : volunteer.status === 'COMPLETED' ? 'status-review' : 'status-pending'}`}>
                      {volunteer.status}
                    </span>
                  </div>
                  <div className="ngo-card-actions">
                    <button className="action-btn small" disabled={volunteerLoadingId === volunteer._id} onClick={() => handleVolunteerStatus(volunteer._id, 'APPROVED')}>
                      Approve
                    </button>
                    <button className="action-btn small danger" disabled={volunteerLoadingId === volunteer._id} onClick={() => handleVolunteerStatus(volunteer._id, 'REJECTED')}>
                      Reject
                    </button>
                    <button
                      className="action-btn small"
                      disabled={volunteerLoadingId === volunteer._id}
                      onClick={() => {
                        const value = window.prompt('Hours completed', String(volunteer.hoursCommitted || 0));
                        if (value === null) return;
                        handleVolunteerStatus(volunteer._id, 'COMPLETED', Number(value));
                      }}
                    >
                      Complete
                    </button>
                  </div>
                </article>
              ))}
              {volunteers.length === 0 && <div className="empty-state-inline">No volunteer applications yet.</div>}
            </div>
          </section>
        )}

        {activeTab === 'profile' && (
          <section className="ngo-panel ngo-panel-span">
            <div className="ngo-panel-header">
              <div>
                <h2>Organization Profile</h2>
                <p>Keep your brand, contact details, and profile picture current.</p>
              </div>
            </div>

            <div className="ngo-profile-grid">
              <div className="ngo-profile-card">
                <div className="ngo-profile-picture">
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt="Profile preview" className="ngo-profile-image" />
                  ) : (
                    <div className="ngo-profile-fallback">{profileInitials}</div>
                  )}
                </div>
                <div className="ngo-profile-actions">
                  <input ref={profileImageInputRef} type="file" accept="image/*" className="hidden-input" onChange={handleProfileImageChange} />
                  <button type="button" className="primary-btn" onClick={handleProfileImagePick} disabled={profilePictureLoading}>
                    <Camera size={16} /> {profilePictureLoading ? 'Uploading...' : profileImagePreview ? 'Change Image' : 'Add Image'}
                  </button>
                  {profileImagePreview && (
                    <button type="button" className="secondary-btn" onClick={handleProfilePictureRemove} disabled={profilePictureLoading}>
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <form className="ngo-form-card" onSubmit={handleProfileSubmit}>
                <div className="ngo-form-grid">
                  <label className="ngo-field full">
                    <span>Organization Name</span>
                    <input
                      value={profileForm.organizationName}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, organizationName: e.target.value }))}
                      required
                    />
                  </label>
                  <label className="ngo-field">
                    <span>Contact Person</span>
                    <input
                      value={profileForm.contactPerson}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, contactPerson: e.target.value }))}
                      required
                    />
                  </label>
                  <label className="ngo-field">
                    <span>Phone Number</span>
                    <input
                      value={profileForm.phoneNumber}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    />
                  </label>
                  <label className="ngo-field">
                    <span>Website</span>
                    <input
                      value={profileForm.website}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, website: e.target.value }))}
                      placeholder="https://example.org"
                    />
                  </label>
                  <label className="ngo-field full">
                    <span>Address</span>
                    <input
                      value={profileForm.address}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                    />
                  </label>
                  <label className="ngo-field full">
                    <span>Description</span>
                    <textarea
                      rows={4}
                      value={profileForm.description}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </label>
                  <label className="ngo-field full">
                    <span>Focus Areas</span>
                    <input
                      value={profileForm.focusAreas}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, focusAreas: e.target.value }))}
                      placeholder="Education, Health, Disaster Relief"
                    />
                  </label>
                </div>

                <div className="ngo-form-actions">
                  <button type="submit" className="primary-btn" disabled={profileSubmitting}>
                    {profileSubmitting ? <RefreshCw className="spin-icon" size={16} /> : <Save size={16} />}
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default NGODashboard;
