import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import RolesSection from '../components/RolesSection';
import StatsSection from '../components/StatsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import CTASection from '../components/CTASection';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <RolesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Home;