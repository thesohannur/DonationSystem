import React, { useState, useEffect } from 'react';
import './NGOVerification.css';

const NGOVerification = () => {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock fetching unverified NGOs: `/api/ngos?isVerified=false`
  useEffect(() => {
    const fetchNGOs = async () => {
      setTimeout(() => {
        setNgos([
          { _id: 'ngo1', name: 'Global Water Initiative', email: 'contact@gwi.org', registrationNo: 'REG-12490X', appliedDate: '2026-03-24' },
          { _id: 'ngo2', name: 'Childrens Future Fund', email: 'info@cffund.org', registrationNo: 'REG-99120Y', appliedDate: '2026-03-25' },
        ]);
        setLoading(false);
      }, 500);
    };

    fetchNGOs();
  }, []);

  const handleVerify = (id) => {
    // Call PATCH /api/ngos/${id}/verify
    setNgos(ngos.filter(ngo => ngo._id !== id));
    alert('NGO Verified Successfully!');
  };

  const handleReject = (id) => {
    // Call DELETE /api/ngos/${id} or update status
    setNgos(ngos.filter(ngo => ngo._id !== id));
    alert('NGO Registration Rejected.');
  };

  if (loading) {
    return <div className="loading">Loading pending verifications...</div>;
  }

  return (
    <div className="ngo-verification">
      <div className="uv-header">
        <h1>NGO Verification</h1>
        <p>Review and approve new NGO registrations to grant them platform access.</p>
      </div>

      <div className="cards-container">
        {ngos.length === 0 ? (
          <div className="no-pending">
            <p>No NGOs are currently pending verification. Good job!</p>
          </div>
        ) : (
          ngos.map(ngo => (
            <div className="ngo-card" key={ngo._id}>
              <div className="card-header">
                <h2>{ngo.name}</h2>
                <span className="badge-pending">Pending</span>
              </div>
              <div className="card-body">
                <p><strong>Email:</strong> {ngo.email}</p>
                <p><strong>Registration No:</strong> {ngo.registrationNo}</p>
                <p><strong>Applied On:</strong> {ngo.appliedDate}</p>
              </div>
              <div className="card-actions">
                <button className="btn-approve" onClick={() => handleVerify(ngo._id)}>Approve</button>
                <button className="btn-reject" onClick={() => handleReject(ngo._id)}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NGOVerification;
