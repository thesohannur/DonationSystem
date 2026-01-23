import React from 'react';
import '../styles/TestimonialsSection.css';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Priya Singh',
      role: 'Donor',
      message: 'Shohay made it so easy to contribute to causes I care about. I love seeing the real-time impact!',
      avatar: '👩‍💼'
    },
    {
      name: 'Rajesh Kumar',
      role: 'NGO Director',
      message: 'The platform has transformed how we manage campaigns. Our fundraising is now transparent and efficient.',
      avatar: '👨‍💼'
    },
    {
      name: 'Anjali Patel',
      role: 'Donor',
      message: 'I trust Shohay completely. The verification process ensures I\'m supporting legitimate organizations.',
      avatar: '👩‍🦰'
    },
    {
      name: 'Vikram Sharma',
      role: 'NGO Head',
      message: 'Outstanding support team and an intuitive dashboard. Highly recommended for any NGO!',
      avatar: '👨‍🦱'
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="section-title">What Our Users Say</h2>
        <p className="section-subtitle">Real stories from real people making a difference</p>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar">{testimonial.avatar}</div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-message">"{testimonial.message}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
