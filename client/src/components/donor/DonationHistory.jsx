import React, { useState, useEffect } from 'react';
import { donorService } from '../../services/donorService';
import { formatCurrency, formatDateTime, getStatusClass } from '../../utils/helpers';
import './DonationHistory.css';

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [donations, statusFilter, sortOrder]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await donorService.getMyDonations();
      setDonations(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load donation history');
      console.error('Donations fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...donations];

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredDonations(filtered);
  };

  const calculateTotalAmount = () => {
    return filteredDonations
      .filter(d => d.status === 'SUCCESS')
      .reduce((sum, d) => sum + d.amount, 0);
  };

  if (loading) {
    return (
      <div className="history-container">
        <div className="loading-spinner">Loading donation history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <div>
          <h1>Donation History</h1>
          <p className="subtitle">Track all your contributions</p>
        </div>
        <div className="history-stats">
          <div className="stat-item">
            <span className="stat-label">Total Donations:</span>
            <span className="stat-value">{filteredDonations.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Amount:</span>
            <span className="stat-value success">{formatCurrency(calculateTotalAmount())}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By Date:</label>
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Donations Table/List */}
      {filteredDonations.length > 0 ? (
        <>
          {/* Desktop Table View */} {/* Dummy not tested */}
          <div className="table-container desktop-view">
            <table className="donations-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>NGO</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((donation) => (
                  <tr key={donation._id}>
                    <td>{formatDateTime(donation.timestamp)}</td>
                    <td>
                      <div className="ngo-cell">
                        <span className="ngo-name">{donation.ngoId?.name || 'N/A'}</span>
                        <span className="ngo-email">{donation.ngoId?.email || ''}</span>
                      </div>
                    </td>
                    <td className="amount-cell">{formatCurrency(donation.amount)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(donation.status)}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="transaction-id">{donation._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="donations-cards mobile-view">
            {filteredDonations.map((donation) => (
              <div key={donation._id} className="donation-card">
                <div className="card-header">
                  <span className={`status-badge ${getStatusClass(donation.status)}`}>
                    {donation.status}
                  </span>
                  <span className="card-date">{formatDateTime(donation.timestamp)}</span>
                </div>
                <div className="card-body">
                  <div className="card-ngo">
                    <h4>{donation.ngoId?.name || 'N/A'}</h4>
                    <p>{donation.ngoId?.email || ''}</p>
                  </div>
                  <div className="card-amount">{formatCurrency(donation.amount)}</div>
                </div>
                <div className="card-footer">
                  <span className="transaction-label">Transaction ID:</span>
                  <span className="transaction-id">{donation._id}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3>No donations found</h3>
          <p>
            {statusFilter !== 'ALL' 
              ? `No donations with status: ${statusFilter}` 
              : 'You haven\'t made any donations yet'}
          </p>
          {statusFilter !== 'ALL' && (
            <button className="reset-filter-btn" onClick={() => setStatusFilter('ALL')}>
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DonationHistory;