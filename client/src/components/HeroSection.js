import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">
          Shohay - Connect Hearts, Create Impact
        </h1>
        <p className="hero-subtitle">
          Empowering donors to make a difference and NGOs to create lasting change
        </p>
        
        <div className="hero-cta-buttons">
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/auth/register')}
          >
            Get Started Now
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => document.querySelector('.features-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </button>
        </div>

        <div className="hero-animation">
          <div className="floating-card card-1">
            <div className="card-icon">💰</div>
            <p>Secure Donations</p>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">📊</div>
            <p>Real-time Tracking</p>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🤝</div>
            <p>Connect & Impact</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
