import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { donorService } from '../../services/donorService';
import { formatCurrency, formatDate, getDaysRemaining } from '../../utils/helpers';
import './DonateForm.css';

const DonateForm = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000];

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const response = await donorService.getCampaign(campaignId);
      setCampaign(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load campaign details');
      console.error('Campaign fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) < 100) {
      setError('Minimum donation amount is ₹100');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      await donorService.createDonation({
        campaignId: campaignId,
        amount: parseFloat(amount),
      });

      setSuccess(true);
      
      // Redirect to success page after 2 seconds
      setTimeout(() => {
        navigate('/donor/donations');
      }, 2000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process donation');
      console.error('Donation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="donate-container">
        <div className="loading-spinner">Loading campaign details...</div>
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div className="donate-container">
        <div className="error-message">{error}</div>
        <button className="back-btn" onClick={() => navigate('/donor/campaigns')}>
          Back to Campaigns
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="donate-container">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Donation Successful!</h2>
          <p>Thank you for your generous contribution</p>
          <div className="success-amount">{formatCurrency(parseFloat(amount))}</div>
          <p className="redirect-message">Redirecting to donation history...</p>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(campaign.expirationTime);

  return (
    <div className="donate-container">
      <button className="back-btn" onClick={() => navigate('/donor/campaigns')}>
        ← Back to Campaigns
      </button>

      <div className="donate-layout">
        {/* Campaign Details Section */}
        <div className="campaign-details-section">
          <h2>Campaign Details</h2>
          
          <div className="detail-card">
            <h3 className="campaign-description">{campaign.description}</h3>
            
            <div className="detail-item">
              <span className="detail-label">NGO:</span>
              <span className="detail-value">{campaign.ngoEmail}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Created:</span>
              <span className="detail-value">{formatDate(campaign.creationTime)}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Expires:</span>
              <span className="detail-value">{formatDate(campaign.expirationTime)}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Time Remaining:</span>
              <span className="detail-value highlight">
                {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Amount Raised:</span>
              <span className="detail-value amount-raised">
                {formatCurrency(campaign.amount)}
              </span>
            </div>

            <div className="acceptance-badges">
              {campaign.acceptsMoney && (
                <span className="acceptance-badge money">💰 Accepts Money</span>
              )}
              {campaign.acceptsTime && (
                <span className="acceptance-badge time">⏰ Accepts Time</span>
              )}
            </div>
          </div>
        </div>

        {/* Donation Form Section */}
        <div className="donation-form-section">
          <h2>Make a Donation</h2>
          
          <form onSubmit={handleSubmit} className="donation-form">
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="amount">Donation Amount (₹)</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="100"
                step="1"
                required
                disabled={submitting || daysRemaining === 0}
              />
              <span className="input-hint">Minimum amount: ₹100</span>
            </div>

            <div className="predefined-amounts">
              <p className="predefined-label">Quick Select:</p>
              <div className="amount-buttons">
                {predefinedAmounts.map((preAmount) => (
                  <button
                    key={preAmount}
                    type="button"
                    className={`amount-btn ${amount === preAmount.toString() ? 'selected' : ''}`}
                    onClick={() => handleAmountSelect(preAmount)}
                    disabled={submitting || daysRemaining === 0}
                  >
                    ₹{preAmount.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            <div className="donation-summary">
              <div className="summary-row">
                <span>Donation Amount:</span>
                <span className="summary-amount">
                  {amount ? formatCurrency(parseFloat(amount)) : '₹0'}
                </span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span className="summary-amount">
                  {amount ? formatCurrency(parseFloat(amount)) : '₹0'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting || !amount || daysRemaining === 0}
            >
              {submitting ? 'Processing...' : 'Donate Now'}
            </button>

            {daysRemaining === 0 && (
              <div className="expired-notice">
                This campaign has expired and is no longer accepting donations.
              </div>
            )}
          </form>

          <div className="security-notice">
            <span className="security-icon">🔒</span>
            <span>Your donation is secure and will be processed immediately</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateForm;