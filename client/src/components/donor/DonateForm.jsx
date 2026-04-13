import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { donorService } from '../../services/donorService';
import { formatCurrency, formatDate, getDaysRemaining } from '../../utils/helpers';
import './DonateForm.css';

const DonateForm = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);

  // money form
  const [amount, setAmount] = useState('');
  // time form
  const [hours, setHours] = useState('');
  const [message, setMessage] = useState('');

  const [donationType, setDonationType] = useState('money'); // 'money' | 'time'
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000];
  const predefinedHours = [1, 2, 4, 8, 16];

  useEffect(() => {
    fetchCampaignDetails();
  }, [campaignId]);

  // Set default tab once campaign loads
  useEffect(() => {
    if (campaign) {
      setDonationType(campaign.acceptsMoney ? 'money' : 'time');
    }
  }, [campaign]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (donationType === 'money') {
      if (!amount || parseFloat(amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      if (parseFloat(amount) < 100) {
        setError('Minimum donation amount is ৳100');
        return;
      }
      try {
        setSubmitting(true);
        await donorService.createDonation({ campaignId, amount: parseFloat(amount) });
        setSuccess(true);
        setTimeout(() => navigate('/donor/donations'), 2000);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to process donation');
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!hours || parseFloat(hours) <= 0) {
        setError('Please enter valid hours to commit');
        return;
      }
      try {
        setSubmitting(true);
        await donorService.createTimeDonation({ campaignId, hoursCommitted: parseFloat(hours), donorMessage: message });
        setSuccess(true);
        setTimeout(() => navigate('/donor/donations'), 2500);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to submit volunteer application');
      } finally {
        setSubmitting(false);
      }
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
    const isTimeDonation = donationType === 'time';
    return (
      <div className="donate-container">
        <div className="success-card">
          <div className="success-icon">{isTimeDonation ? '🙌' : '✅'}</div>
          <h2>{isTimeDonation ? 'Volunteer Application Submitted!' : 'Donation Successful!'}</h2>
          <p>{isTimeDonation ? 'Thank you for offering your time!' : 'Thank you for your generous contribution'}</p>
          <div className="success-amount">
            {isTimeDonation ? `${hours} hours committed` : formatCurrency(parseFloat(amount))}
          </div>
          <p className="redirect-message">Redirecting to donation history...</p>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(campaign.expirationTime);
  const acceptsBoth = campaign.acceptsMoney && campaign.acceptsTime;

  return (
    <div className="donate-container">
      <button className="back-btn" onClick={() => navigate('/donor/campaigns')}>
        ← Back to Campaigns
      </button>

      <div className="donate-layout">
        {/* Campaign Details */}
        <div className="campaign-details-section">
          <h2>Campaign Details</h2>
          <div className="detail-card">
            <div className="campaign-detail-image-wrap">
              {campaign.imageUrl ? (
                <img src={campaign.imageUrl} alt="Campaign" className="campaign-detail-image" />
              ) : (
                <div className="campaign-detail-image-placeholder">📷 No campaign image</div>
              )}
            </div>

            <h3 className="campaign-description">{campaign.name || campaign.description}</h3>

            <div className="detail-item">
              <span className="detail-label">NGO</span>
              <span className="detail-value">{campaign.ngoEmail}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created</span>
              <span className="detail-value">{formatDate(campaign.creationTime)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Expires</span>
              <span className="detail-value">{formatDate(campaign.expirationTime)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time Remaining</span>
              <span className="detail-value highlight">
                {daysRemaining > 0 ? `${daysRemaining} days` : 'Expired'}
              </span>
            </div>

            {campaign.acceptsMoney && (
              <div className="detail-item">
                <span className="detail-label">Amount Raised</span>
                <span className="detail-value amount-raised">{formatCurrency(campaign.amount)}</span>
              </div>
            )}

            <div className="acceptance-badges">
              {campaign.acceptsMoney && (
                <span className="acceptance-badge money">💰 Accepts Money</span>
              )}
              {campaign.acceptsTime && (
                <span className="acceptance-badge time">⏱ Accepts Time</span>
              )}
            </div>
          </div>
        </div>

        {/* Donation Form */}
        <div className="donation-form-section">
          {/* Tab switcher — only shown when campaign accepts both */}
          {acceptsBoth && (
            <div className="donation-type-tabs">
              <button
                type="button"
                className={`donation-tab${donationType === 'money' ? ' active' : ''}`}
                onClick={() => { setDonationType('money'); setError(''); }}
              >
                💰 Donate Money
              </button>
              <button
                type="button"
                className={`donation-tab${donationType === 'time' ? ' active' : ''}`}
                onClick={() => { setDonationType('time'); setError(''); }}
              >
                ⏱ Donate Time
              </button>
            </div>
          )}

          <h2>{donationType === 'money' ? 'Make a Donation' : 'Volunteer Your Time'}</h2>

          <form onSubmit={handleSubmit} className="donation-form">
            {error && <div className="form-error">{error}</div>}

            {donationType === 'money' ? (
              <>
                <div className="form-group">
                  <label htmlFor="amount">Donation Amount (৳)</label>
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
                  <span className="input-hint">Minimum amount: ৳100</span>
                </div>

                <div className="predefined-amounts">
                  <p className="predefined-label">Quick Select:</p>
                  <div className="amount-buttons">
                    {predefinedAmounts.map((preAmount) => (
                      <button
                        key={preAmount}
                        type="button"
                        className={`amount-btn${amount === preAmount.toString() ? ' selected' : ''}`}
                        onClick={() => setAmount(preAmount.toString())}
                        disabled={submitting || daysRemaining === 0}
                      >
                        ৳{preAmount.toLocaleString('en-BD')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="donation-summary">
                  <div className="summary-row">
                    <span>Donation Amount:</span>
                    <span className="summary-amount">
                      {amount ? formatCurrency(parseFloat(amount)) : '৳0'}
                    </span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span className="summary-amount">
                      {amount ? formatCurrency(parseFloat(amount)) : '৳0'}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label htmlFor="hours">Hours to Commit</label>
                  <input
                    type="number"
                    id="hours"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="How many hours can you give?"
                    min="1"
                    step="0.5"
                    required
                    disabled={submitting || daysRemaining === 0}
                  />
                  <span className="input-hint">Minimum: 1 hour</span>
                </div>

                <div className="predefined-amounts">
                  <p className="predefined-label">Quick Select:</p>
                  <div className="amount-buttons">
                    {predefinedHours.map((h) => (
                      <button
                        key={h}
                        type="button"
                        className={`amount-btn${hours === h.toString() ? ' selected' : ''}`}
                        onClick={() => setHours(h.toString())}
                        disabled={submitting || daysRemaining === 0}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message to NGO <span className="optional-label">(optional)</span></label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell them about your skills, availability, or motivation..."
                    rows={4}
                    disabled={submitting || daysRemaining === 0}
                    className="volunteer-textarea"
                  />
                </div>

                <div className="donation-summary">
                  <div className="summary-row">
                    <span>Hours Committed:</span>
                    <span className="summary-amount">{hours ? `${hours} hr${parseFloat(hours) !== 1 ? 's' : ''}` : '—'}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Application Status:</span>
                    <span className="summary-amount">Pending Approval</span>
                  </div>
                </div>

                <div className="time-donation-note">
                  You will be contacted by {campaign.ngoEmail} using your donor profile contact details.
                </div>
              </>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={submitting || (donationType === 'money' ? !amount : !hours) || daysRemaining === 0}
            >
              {submitting
                ? 'Processing...'
                : donationType === 'money'
                ? 'Donate Now'
                : 'Submit Application'}
            </button>

            {daysRemaining === 0 && (
              <div className="expired-notice">
                This campaign has expired and is no longer accepting contributions.
              </div>
            )}
          </form>

          <div className="security-notice">
            <span className="security-icon">{donationType === 'money' ? '🔒' : '🤝'}</span>
            <span>
              {donationType === 'money'
                ? 'Your donation is secure and will be processed immediately'
                : `Your application will be reviewed and ${campaign.ngoEmail} will contact you if approved`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateForm;
