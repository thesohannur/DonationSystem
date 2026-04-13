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
import NGODashboard from "./components/ngo/NGODashboard";

import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import AdminCampaigns from './components/admin/AdminCampaigns';
import AdminProfile from './components/admin/AdminProfile';

const getCurrentRole = () => {
  const storedRole = localStorage.getItem('role');
  if (storedRole) return storedRole.toUpperCase();

  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return (payload.role || payload.Role || '').toUpperCase();
  } catch {
    return null;
  }
};

const redirectByRole = {
  DONOR: '/donor/dashboard',
  NGO: '/ngo/dashboard',
  ADMIN: '/admin/dashboard',
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const role = getCurrentRole();

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return <Navigate to={redirectByRole[role] || '/auth/login'} replace />;
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
        <Route path="/ngo" element={<Navigate to="/ngo/dashboard" replace />} />

        {/* Protected Donor Routes with Layout */}
        <Route
          path="/donor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['DONOR']}>
              <DonorLayout>
                <DonorDashboard />
              </DonorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/campaigns"
          element={
            <ProtectedRoute allowedRoles={['DONOR']}>
              <DonorLayout>
                <BrowseCampaigns />
              </DonorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/donate/:campaignId"
          element={
            <ProtectedRoute allowedRoles={['DONOR']}>
              <DonorLayout>
                <DonateForm />
              </DonorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/donations"
          element={
            <ProtectedRoute allowedRoles={['DONOR']}>
              <DonorLayout>
                <DonationHistory />
              </DonorLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/profile"
          element={
            <ProtectedRoute allowedRoles={['DONOR']}>
              <DonorLayout>
                <DonorProfile />
              </DonorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo/dashboard"
          element={
            <ProtectedRoute allowedRoles={['NGO']}>
              <NGODashboard />
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
