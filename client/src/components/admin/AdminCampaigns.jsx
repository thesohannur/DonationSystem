import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './AdminCampaigns.css';

const AdminCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data } = await api.get('/campaigns');
        if (data.success) {
          setCampaigns(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch campaigns", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  const handleApprove = async (id) => {
    try {
      const { data } = await api.patch(`/campaigns/${id}/approve`);
      setCampaigns(campaigns.map(c => c._id === id ? data.data : c));
      if (selectedCampaign?._id === id) setSelectedCampaign(data.data);
    } catch (error) {
      console.error("Failed to approve campaign", error);
      alert('Failed to approve campaign.');
    }
  };

  const handleReject = async (id) => {
    try {
      const { data } = await api.patch(`/campaigns/${id}/reject`);
      setCampaigns(campaigns.map(c => c._id === id ? data.data : c));
      if (selectedCampaign?._id === id) setSelectedCampaign(data.data);
    } catch (error) {
      console.error("Failed to reject campaign", error);
      alert('Failed to reject campaign.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await api.delete(`/campaigns/${id}`);
        setCampaigns(campaigns.filter(c => c._id !== id));
        setSelectedCampaign(null);
      } catch (error) {
        console.error("Failed to delete campaign", error);
        alert('Failed to delete campaign.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading campaigns...</div>;
  }

  const filtered = campaigns.filter(c => {
    if (filter === 'pending') return !c.approved && !c.rejectFlag;
    if (filter === 'approved') return c.approved;
    if (filter === 'rejected') return !c.approved && c.rejectFlag > 0;
    return true;
  });

  const getStatusLabel = (c) => {
    if (c.approved) return 'Approved';
    if (c.rejectFlag > 0) return 'Rejected';
    return 'Pending';
  };
  const getStatusClass = (c) => {
    if (c.approved) return 'approved';
    if (c.rejectFlag > 0) return 'rejected';
    return 'pending';
  };

  return (
    <div className="admin-campaigns">
      <div className="uv-header">
        <h1>Campaigns Management</h1>
        <p>Review, approve, reject, and manage all campaigns on the platform.</p>
      </div>

      {/* Filter Tabs */}
      <div className="campaign-filters">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="filter-count">
              {f === 'all' ? campaigns.length :
                f === 'pending' ? campaigns.filter(c => !c.approved && !c.rejectFlag).length :
               f === 'approved' ? campaigns.filter(c => c.approved).length :
               campaigns.filter(c => !c.approved && c.rejectFlag > 0).length}
            </span>
          </button>
        ))}
      </div>

      <div className="cards-container">
        {filtered.length === 0 ? (
          <div className="no-pending">
            <p>No campaigns in this category.</p>
          </div>
        ) : (
          filtered.map(campaign => (
            <div className="campaign-card" key={campaign._id}>
              <div className="card-header">
                <h2>{campaign.description?.substring(0, 40) || 'Untitled Campaign'}{campaign.description?.length > 40 ? '...' : ''}</h2>
                <span className={`badge-status ${getStatusClass(campaign)}`}>{getStatusLabel(campaign)}</span>
              </div>
              <div className="card-body">
                <p><strong>NGO:</strong> {campaign.ngoEmail}</p>
                <p><strong>Amount Raised:</strong> ৳{campaign.amount ?? 0}</p>
                <p><strong>Expires:</strong> {campaign.expirationTime ? new Date(campaign.expirationTime).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="card-actions">
                <button className="btn-view-details" onClick={() => setSelectedCampaign(campaign)}>View Details</button>
                {!campaign.approved && (
                  <button className="btn-approve" onClick={() => handleApprove(campaign._id)}>Approve</button>
                )}
                {campaign.approved && (
                  <button className="btn-reject" onClick={() => handleReject(campaign._id)}>Revoke</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      {selectedCampaign && (
        <div className="camp-modal-overlay" onClick={() => setSelectedCampaign(null)}>
          <div className="camp-modal" onClick={e => e.stopPropagation()}>
            <div className="camp-modal-header">
              <div>
                <h2>Campaign Details</h2>
                <span className={`badge-status ${getStatusClass(selectedCampaign)}`}>{getStatusLabel(selectedCampaign)}</span>
              </div>
              <button className="camp-modal-close" onClick={() => setSelectedCampaign(null)}>✕</button>
            </div>
            <div className="camp-modal-body">
              <div className="camp-detail-row"><span>NGO Email</span><span>{selectedCampaign.ngoEmail}</span></div>
              <div className="camp-detail-row"><span>Description</span><span>{selectedCampaign.description}</span></div>
              <div className="camp-detail-row"><span>Amount Raised</span><span>৳{selectedCampaign.amount ?? 0}</span></div>
              <div className="camp-detail-row"><span>Accepts Money</span><span>{selectedCampaign.acceptsMoney ? 'Yes' : 'No'}</span></div>
              <div className="camp-detail-row"><span>Accepts Time</span><span>{selectedCampaign.acceptsTime ? 'Yes' : 'No'}</span></div>
              <div className="camp-detail-row"><span>Created</span><span>{new Date(selectedCampaign.creationTime).toLocaleDateString()}</span></div>
              <div className="camp-detail-row"><span>Expires</span><span>{selectedCampaign.expirationTime ? new Date(selectedCampaign.expirationTime).toLocaleDateString() : 'N/A'}</span></div>
            </div>
            <div className="camp-modal-footer">
              {!selectedCampaign.approved && (
                <button className="btn-approve" onClick={() => handleApprove(selectedCampaign._id)}>✓ Approve Campaign</button>
              )}
              {selectedCampaign.approved && (
                <button className="btn-reject" onClick={() => handleReject(selectedCampaign._id)}>Revoke Approval</button>
              )}
              <button className="btn-delete" onClick={() => handleDelete(selectedCampaign._id)}>Delete</button>
              <button className="btn-close-modal" onClick={() => setSelectedCampaign(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCampaigns;


