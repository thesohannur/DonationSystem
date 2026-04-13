import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, getDaysRemaining } from '../../utils/helpers';
import './CampaignCard.css';

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  const daysRemaining = getDaysRemaining(campaign.expirationTime);
  const acceptsBoth = campaign.acceptsMoney && campaign.acceptsTime;
  const hasTarget = campaign.acceptsMoney && Number(campaign.targetAmount) > 0;
  const progressPercent = hasTarget
    ? Math.min((Number(campaign.amount || 0) / Number(campaign.targetAmount)) * 100, 100)
    : 0;

  const handleDonate = () => {
    navigate(`/donor/donate/${campaign._id}`);
  };

  const buttonLabel = () => {
    if (daysRemaining === 0) return 'Campaign Ended';
    if (acceptsBoth) return 'Donate / Volunteer';
    if (campaign.acceptsTime) return 'Volunteer Now';
    return 'Donate Now';
  };

  return (
    <div className="campaign-card">
      <div className="campaign-image-wrap">
        {campaign.imageUrl ? (
          <img src={campaign.imageUrl} alt="Campaign" className="campaign-image" />
        ) : (
          <div className="campaign-image-placeholder">📷 No campaign image</div>
        )}
      </div>

      <div className="campaign-card-header">
        <div className="campaign-badges">
          {campaign.acceptsMoney && (
            <span className="badge badge-money">💰 Money</span>
          )}
          {campaign.acceptsTime && (
            <span className="badge badge-time">⏱ Time</span>
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

        {hasTarget ? (
          <div className="campaign-progress">
            <div className="progress-header">
              <span className="progress-label">Amount Raised / Target</span>
              <span className="progress-amount">
                {formatCurrency(campaign.amount || 0)} / {formatCurrency(campaign.targetAmount)}
              </span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : campaign.acceptsMoney ? (
          <div className="campaign-progress campaign-progress--simple">
            <div className="progress-header">
              <span className="progress-label">Amount Raised</span>
              <span className="progress-amount">{formatCurrency(campaign.amount || 0)}</span>
            </div>
          </div>
        ) : (
          <div className="campaign-volunteer-info">
            <span className="volunteer-info-icon">🤝</span>
            <span className="volunteer-info-text">Volunteers Welcome</span>
          </div>
        )}
      </div>

      <div className="campaign-card-footer">
        <button
          className={`donate-btn${campaign.acceptsTime && !campaign.acceptsMoney ? ' donate-btn--time' : ''}`}
          onClick={handleDonate}
          disabled={daysRemaining === 0}
        >
          {buttonLabel()}
        </button>
      </div>
    </div>
  );
};

export default CampaignCard;