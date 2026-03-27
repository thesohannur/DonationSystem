import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";

// Import Donor Components
import DonorLayout from "./components/donor/DonorLayout";
import DonorDashboard from "./components/donor/DonorDashboard";
import BrowseCampaigns from "./components/donor/BrowseCampaigns";
import DonateForm from "./components/donor/DonateForm";
import DonationHistory from "./components/donor/DonationHistory";
import DonorProfile from "./components/donor/DonorProfile";

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import AdminCampaigns from './components/admin/AdminCampaigns';
import AdminProfile from './components/admin/AdminProfile';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />

        {/* Protected Donor Routes with Layout */}
        <Route
          path="/donor/dashboard"
          element={
            <ProtectedRoute>
              <DonorLayout>
                <DonorDashboard />
              </DonorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/campaigns"
          element={
            <ProtectedRoute>
              <DonorLayout>
                <BrowseCampaigns />
              </DonorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/donate/:campaignId"
          element={
            <ProtectedRoute>
              <DonorLayout>
                <DonateForm />
              </DonorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/donations"
          element={
            <ProtectedRoute>
              <DonorLayout>
                <DonationHistory />
              </DonorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/profile"
          element={
            <ProtectedRoute>
              <DonorLayout>
                <DonorProfile />
              </DonorLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes wrapped in Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="campaigns" element={<AdminCampaigns />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
