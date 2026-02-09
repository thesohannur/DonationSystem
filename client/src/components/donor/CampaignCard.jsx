import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, getDaysRemaining } from '../../utils/helpers';
import './CampaignCard.css';

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  const daysRemaining = getDaysRemaining(campaign.expirationTime);

  const handleDonate = () => {
    navigate(`/donor/donate/${campaign._id}`);
  };

  return (
    <div className="campaign-card">
      <div className="campaign-card-header">
        <div className="campaign-badges">
          {campaign.acceptsMoney && (
            <span className="badge badge-money">💰 Money</span>
          )}
          {campaign.acceptsTime && (
            <span className="badge badge-time">⏰ Time</span>
          )}
        </div>
        <div className="campaign-urgency">
          {daysRemaining <= 7 && daysRemaining > 0 && (
            <span className="urgency-badge">🔥 Expiring Soon</span>
          )}
        </div>
      </div>

      <div className="campaign-card-body">
        <h3 className="campaign-title">{campaign.description}</h3>
        
        <div className="campaign-meta">
          <div className="meta-item">
            <span className="meta-label">NGO:</span>
            <span className="meta-value">{campaign.ngoEmail}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Expires:</span>
            <span className="meta-value">
              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Expired'}
            </span>
          </div>
        </div>

        <div className="campaign-progress">
          <div className="progress-header">
            <span className="progress-label">Amount Raised</span>
            <span className="progress-amount">{formatCurrency(campaign.amount)}</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${Math.min((campaign.amount / 100000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="campaign-card-footer">
        <button 
          className="donate-btn"
          onClick={handleDonate}
          disabled={daysRemaining === 0}
        >
          {daysRemaining > 0 ? 'Donate Now' : 'Campaign Ended'}
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;