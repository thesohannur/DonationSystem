import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import { formatCurrency, formatDateTime, getStatusClass } from '../../utils/helpers';
import './DonationHistory.css';

// Status options per type tab
const STATUS_OPTIONS = {
  all:   ['ALL', 'SUCCESS', 'PENDING', 'APPROVED', 'FAILED', 'REJECTED', 'COMPLETED'],
  money: ['ALL', 'SUCCESS', 'PENDING', 'FAILED'],
  time:  ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'],
};

const TYPE_TABS = [
  { key: 'all',   label: '🗂 All' },
  { key: 'money', label: '💰 Money' },
  { key: 'time',  label: '⏱ Time' },
];

const DonationHistory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [typeTab, setTypeTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchHistory();
  }, []);

  // Reset status filter when switching type tab if current filter is invalid
  useEffect(() => {
    if (!STATUS_OPTIONS[typeTab].includes(statusFilter)) {
      setStatusFilter('ALL');
    }
  }, [typeTab]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await donorService.getMyDonations();
      setItems(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const filtered = items
    .filter(item => typeTab === 'all' || item.type === typeTab)
    .filter(item => statusFilter === 'ALL' || item.status === statusFilter)
    .sort((a, b) => {
      const diff = new Date(b.timestamp) - new Date(a.timestamp);
      return sortOrder === 'desc' ? diff : -diff;
    });

  const totalMoneyDonated = filtered
    .filter(i => i.type === 'money' && i.status === 'SUCCESS')
    .reduce((s, i) => s + i.amount, 0);

  const totalHoursCommitted = filtered
    .filter(i => i.type === 'time')
    .reduce((s, i) => s + (i.hoursCommitted || 0), 0);

  if (loading) return (
    <div className="history-container">
      <div className="loading-spinner">Loading history...</div>
    </div>
  );

  if (error) return (
    <div className="history-container">
      <div className="error-message">{error}</div>
    </div>
  );

  return (
    <div className="history-container">
      {/* Header */}
      <div className="history-header">
        <div>
          <h1>Contribution History</h1>
          <p className="subtitle">All your money donations &amp; volunteer applications</p>
        </div>
        <div className="history-stats">
          <div className="stat-item">
            <span className="stat-label">Shown:</span>
            <span className="stat-value">{filtered.length} records</span>
          </div>
          {(typeTab === 'all' || typeTab === 'money') && (
            <div className="stat-item">
              <span className="stat-label">Money Donated:</span>
              <span className="stat-value success">{formatCurrency(totalMoneyDonated)}</span>
            </div>
          )}
          {(typeTab === 'all' || typeTab === 'time') && (
            <div className="stat-item">
              <span className="stat-label">Hours Committed:</span>
              <span className="stat-value time-stat">{totalHoursCommitted} hrs</span>
            </div>
          )}
        </div>
      </div>

      {/* Type Tabs */}
      <div className="type-tabs">
        {TYPE_TABS.map(tab => (
          <button
            key={tab.key}
            className={`type-tab${typeTab === tab.key ? ' active' : ''}`}
            onClick={() => setTypeTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="history-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS[typeTab].map(s => (
              <option key={s} value={s}>{s === 'ALL' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By Date:</label>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <>
          {/* Desktop */}
          <div className="table-container desktop-view">
            <table className="donations-table">
              <thead>
                <tr>
                  <th>Date &amp; Time</th>
                  {typeTab === 'all' && <th>Type</th>}
                  <th>NGO</th>
                  {typeTab !== 'time'  && <th>Amount</th>}
                  {typeTab !== 'money' && <th>Hours</th>}
                  {typeTab === 'time'  && <th>Campaign</th>}
                  <th>Status</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => (
                  <tr key={item._id}>
                    <td>{formatDateTime(item.timestamp)}</td>
                    {typeTab === 'all' && (
                      <td>
                        <span className={`type-badge type-badge--${item.type}`}>
                          {item.type === 'money' ? '💰 Money' : '⏱ Time'}
                        </span>
                      </td>
                    )}
                    <td>
                      <div className="ngo-cell">
                        <span className="ngo-name">{item.ngoId?.organizationName || 'N/A'}</span>
                        <span className="ngo-email">{item.ngoId?.email || ''}</span>
                      </div>
                    </td>
                    {typeTab !== 'time' && (
                      <td className="amount-cell">
                        {item.type === 'money' ? formatCurrency(item.amount) : '—'}
                      </td>
                    )}
                    {typeTab !== 'money' && (
                      <td className="hours-cell">
                        {item.type === 'time'
                          ? `${item.hoursCommitted} hr${item.hoursCommitted !== 1 ? 's' : ''}`
                          : '—'}
                      </td>
                    )}
                    {typeTab === 'time' && (
                      <td className="campaign-cell">
                        {item.campaignId?.description || '—'}
                      </td>
                    )}
                    <td>
                      <span className={`status-badge ${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="transaction-id">{item._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="donations-cards mobile-view">
            {filtered.map(item => (
              <div key={item._id} className={`donation-card donation-card--${item.type}`}>
                <div className="card-header">
                  <div className="card-header-left">
                    <span className={`type-badge type-badge--${item.type}`}>
                      {item.type === 'money' ? '💰 Money' : '⏱ Time'}
                    </span>
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <span className="card-date">{formatDateTime(item.timestamp)}</span>
                </div>
                <div className="card-body">
                  <div className="card-ngo">
                    <h4>{item.ngoId?.organizationName || 'N/A'}</h4>
                    <p>{item.ngoId?.email || ''}</p>
                  </div>
                  {item.type === 'money' ? (
                    <div className="card-amount">{formatCurrency(item.amount)}</div>
                  ) : (
                    <div className="card-hours">
                      {item.hoursCommitted} hr{item.hoursCommitted !== 1 ? 's' : ''} committed
                      {item.campaignId?.description && (
                        <div className="card-campaign">{item.campaignId.description}</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="card-footer">
                    <span className="transaction-label">ID:</span>
                    <span className="transaction-id">{item._id}</span>
                  </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No records found</h3>
          <p>
            {statusFilter !== 'ALL'
              ? `No ${typeTab === 'all' ? '' : typeTab + ' '}records with status: ${statusFilter}`
              : typeTab === 'time'
              ? "You haven't volunteered yet"
              : typeTab === 'money'
              ? "You haven't made any donations yet"
              : "You haven't made any contributions yet"}
          </p>
          {statusFilter !== 'ALL' && (
            <button className="reset-filter-btn" onClick={() => setStatusFilter('ALL')}>
              Clear Filter
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DonationHistory;
