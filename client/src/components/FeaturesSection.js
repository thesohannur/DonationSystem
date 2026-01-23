import React from 'react';
import '../styles/FeaturesSection.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: '🔐',
      title: 'Secure & Transparent',
      description: 'Bank-level security with transparent donation tracking'
    },
    {
      icon: '⚡',
      title: 'Easy to Use',
      description: 'Simple registration and intuitive interface for all users'
    },
    {
      icon: '📱',
      title: 'Mobile Friendly',
      description: 'Access and manage donations on any device, anytime'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track campaign progress and donation impact instantly'
    },
    {
      icon: '🌍',
      title: 'Global Reach',
      description: 'Connect donors and NGOs across the world'
    },
    {
      icon: '💬',
      title: 'Community Support',
      description: '24/7 customer support and active community'
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">
        <h2 className="section-title">Why Choose Shohay?</h2>
        <p className="section-subtitle">Powerful features designed for maximum impact</p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
