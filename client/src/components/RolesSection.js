import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RolesSection.css';

const RolesSection = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState('donor');

  const roles = {
    donor: {
      title: '💚 DONOR',
      description: 'Make a Difference',
      features: [
        'Browse active campaigns',
        'Make secure donations',
        'Track donation progress',
        'View donation history',
        'Connect with causes you care about',
        'Receive impact updates'
      ],
      color: '#10B981'
    },
    ngo: {
      title: '🏢 NGO',
      description: 'Create Impact',
      features: [
        'Create fundraising campaigns',
        'Manage campaigns in real-time',
        'Monitor donations',
        'Track donor engagement',
        'Verify organization credentials',
        'Build trust with donors'
      ],
      color: '#F59E0B'
    },
    admin: {
      title: '👑 ADMIN',
      description: 'Oversee Everything',
      features: [
        'Verify NGO registrations',
        'Manage all users',
        'Monitor system activities',
        'View analytics & reports',
        'Ensure platform security',
        'System-wide oversight'
      ],
      color: '#8B5CF6'
    }
  };

  return (
    <section className="roles-section">
      <div className="roles-container">
        <h2 className="section-title">Choose Your Role</h2>
        <p className="section-subtitle">Three ways to make an impact</p>

        <div className="roles-selector">
          {Object.entries(roles).map(([key, role]) => (
            <button
              key={key}
              className={`role-tab ${activeRole === key ? 'active' : ''}`}
              onClick={() => setActiveRole(key)}
              style={activeRole === key ? { borderBottomColor: role.color } : {}}
            >
              {role.title.split(' ')[0]} {role.title.split(' ')[1]}
            </button>
          ))}
        </div>

        <div className="role-content">
          <div 
            className="role-card"
            style={{ borderTopColor: roles[activeRole].color }}
          >
            <h3>{roles[activeRole].title}</h3>
            <p className="role-description">{roles[activeRole].description}</p>
            
            <ul className="features-list">
              {roles[activeRole].features.map((feature, index) => (
                <li key={index}>
                  <span className="feature-check">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className="btn btn-primary role-cta"
              onClick={() => navigate('/auth/register')}
              style={{ backgroundColor: roles[activeRole].color }}
            >
              Get Started as {roles[activeRole].title.split(' ')[1]}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RolesSection;
