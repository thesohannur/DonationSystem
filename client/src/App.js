import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import NGOLogin from "./pages/NGOLogin";
import NGOSignup from "./pages/NGOSignup";
import DonorLogin from "./pages/DonorLogin";
import DonorSignup from "./pages/DonorSignup";
import RoleChoice from "./pages/RoleChoice";

// Import Donor Components
import DonorLayout from "./components/donor/DonorLayout";
import DonorDashboard from "./components/donor/DonorDashboard";
import BrowseCampaigns from "./components/donor/BrowseCampaigns";
import DonateForm from "./components/donor/DonateForm";
import DonationHistory from "./components/donor/DonationHistory";
import DonorProfile from "./components/donor/DonorProfile";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/donor/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Auth Routes */}
        <Route path="/choose/:mode" element={<RoleChoice />} />
        <Route path="/auth/register" element={<RoleChoice mode="register" />} />
        <Route path="/auth/login" element={<RoleChoice mode="login" />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/ngo/login" element={<NGOLogin />} />
        <Route path="/ngo/signup" element={<NGOSignup />} />
        <Route path="/donor/login" element={<DonorLogin />} />
        <Route path="/donor/signup" element={<DonorSignup />} />
        {/* <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} /> */}

        {/* Other Routes */}
        {/* <Route path="/admin" element={<AdminPage />} /> */}

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
      </Routes>
    </Router>
  );
}

export default App;
