import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

export default function Login() {
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      const redirect = { DONOR: '/donor/dashboard', NGO: '/ngo/dashboard', ADMIN: '/admin/dashboard' };
      navigate(redirect[data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card login-card">

        <div className="auth-header">
          <h1>Sign In</h1>
          <p>Enter your credentials to access your account.</p>
        </div>

        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-form-body">
            <div className="form-field">
              <label>Email Address</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@domain.com"
                required autoFocus
              />
            </div>

            <div className="form-field">
              <label>Password</label>
              <input
                type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Sign In'}
            </button>
            <p className="auth-footer-text">
              Don't have an account? <Link to="/auth/register">Create one</Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}
