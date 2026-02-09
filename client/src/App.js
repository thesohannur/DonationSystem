import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Auth Routes */}
        {/* <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} /> */}
        
        {/* Other Routes */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
