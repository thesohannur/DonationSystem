import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CTASection.css';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="cta-container">
        <h2>Ready to Make an Impact?</h2>
        <p>Join thousands of donors and NGOs changing the world together</p>
        
        <div className="cta-buttons">
          <button 
            className="btn btn-large btn-primary"
            onClick={() => navigate('/auth/register')}
          >
            Get Started
          </button>
          <button 
            className="btn btn-large btn-secondary"
            onClick={() => navigate('/auth/login')}
          >
            Already a Member? Login
          </button>
        </div>

        <div className="cta-footer">
          <p>🔒 Your data is secure • 💯 100% Transparent • 🚀 Join Us Today</p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
