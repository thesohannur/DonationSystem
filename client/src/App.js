import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import NGOLogin from './pages/NGOLogin';
import NGOSignup from './pages/NGOSignup';
import DonorLogin from './pages/DonorLogin';
import DonorSignup from './pages/DonorSignup';
import RoleChoice from './pages/RoleChoice';

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
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
