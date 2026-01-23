import React from 'react';
import '../styles/StatsSection.css';

const StatsSection = () => {
  const stats = [
    { number: '50K+', label: 'Active Donors' },
    { number: '500+', label: 'NGO Partners' },
    { number: '$10M+', label: 'Funds Raised' },
    { number: '100K+', label: 'Lives Impacted' }
  ];

  return (
    <section className="stats-section">
      <div className="stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-number">{stat.number}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
