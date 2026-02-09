import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DonorDashboard from './DonorDashboard';
import BrowseCampaigns from './BrowseCampaigns';
import DonateForm from './DonateForm';
import DonationHistory from './DonationHistory';
import DonorProfile from './DonorProfile';

const DonorRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/donor/dashboard" replace />} />
      <Route path="/dashboard" element={<DonorDashboard />} />
      <Route path="/campaigns" element={<BrowseCampaigns />} />
      <Route path="/donate/:campaignId" element={<DonateForm />} />
      <Route path="/donations" element={<DonationHistory />} />
      <Route path="/profile" element={<DonorProfile />} />
    </Routes>
  );
};

export default DonorRoutes;