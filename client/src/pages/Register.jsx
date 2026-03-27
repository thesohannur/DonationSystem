import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const validateEmail = (email) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

export default function Register() {
  const navigate = useNavigate();
  const [role,    setRole]    = useState('DONOR');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  /* ── User ── */
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');

  /* ── Donor ── */
  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [phoneNumber,setPhoneNumber] = useState('');
  const [address,    setAddress]    = useState('');
  const [occupation, setOccupation] = useState('');

  /* ── NGO ── */
  const [organizationName,  setOrganizationName]  = useState('');
  const [registrationNumber,setRegistrationNumber] = useState('');
  const [contactPerson,     setContactPerson]      = useState('');
  const [ngoPhone,          setNgoPhone]           = useState('');
  const [ngoAddress,        setNgoAddress]         = useState('');
  const [website,           setWebsite]            = useState('');
  const [description,       setDescription]        = useState('');

  /* ── Admin ── */
  const [fullName,   setFullName]   = useState('');
  const [secretKey,  setSecretKey]  = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email))   { setError('Please enter a valid email address.'); return; }
    if (password.length < 6)     { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm)    { setError('Passwords do not match.'); return; }

    setLoading(true);

    let payload = { email, password, role };

    if (role === 'DONOR') {
      payload = { ...payload, firstName, lastName, phoneNumber, address, occupation };
    } else if (role === 'NGO') {
      payload = {
        ...payload,
        organizationName, registrationNumber, contactPerson,
        phoneNumber: ngoPhone, address: ngoAddress, website, description,
      };
    } else if (role === 'ADMIN') {
      payload = { ...payload, fullName, adminSecretKey: secretKey };
    }

    try {
      const { data } = await api.post('/auth/register', payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.user.role);
      const redirect = { DONOR: '/donor/dashboard', NGO: '/donor/dashboard', ADMIN: '/admin/dashboard' };
      navigate(redirect[data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">

        <div className="auth-header">
          <h1>Create an Account</h1>
          <p>Fill in the details below to register on Shohay.</p>
        </div>

        {error && <div className="auth-alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate className="auth-form-body">

          {/* ── Role ── */}
          <div className="form-section">
            <label className="section-title">Account Type</label>
            <div className="role-tabs">
              {['DONOR', 'NGO', 'ADMIN'].map(r => (
                <button
                  key={r}
                  type="button"
                  className={`role-tab ${role === r ? 'active' : ''}`}
                  onClick={() => setRole(r)}
                >
                  {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* ── User Account ── */}
          <div className="form-section">
            <label className="section-title">Account Credentials</label>
            <div className="form-grid">
              <div className="form-field full">
                <label>Email Address <span className="req">*</span></label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@domain.com" required
                />
              </div>
              <div className="form-field">
                <label>Password <span className="req">*</span></label>
                <input
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters" required
                />
              </div>
              <div className="form-field">
                <label>Confirm Password <span className="req">*</span></label>
                <input
                  type="password" value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter password" required
                />
              </div>
            </div>
          </div>

          {/* ── DONOR ── */}
          {role === 'DONOR' && (
            <div className="form-section">
              <label className="section-title">Personal Information</label>
              <div className="form-grid">
                <div className="form-field">
                  <label>First Name <span className="req">*</span></label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" required />
                </div>
                <div className="form-field">
                  <label>Last Name <span className="req">*</span></label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Doe" required />
                </div>
                <div className="form-field">
                  <label>Phone Number</label>
                  <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+880 1X XXXX XXXX" />
                </div>
                <div className="form-field">
                  <label>Occupation</label>
                  <input type="text" value={occupation} onChange={e => setOccupation(e.target.value)} placeholder="e.g. Software Engineer" />
                </div>
                <div className="form-field full">
                  <label>Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, City, Country" />
                </div>
              </div>
            </div>
          )}

          {/* ── NGO ── */}
          {role === 'NGO' && (
            <div className="form-section">
              <label className="section-title">Organization Information</label>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Organization Name <span className="req">*</span></label>
                  <input type="text" value={organizationName} onChange={e => setOrganizationName(e.target.value)} placeholder="e.g. Green Earth Initiative" required />
                </div>
                <div className="form-field">
                  <label>Registration Number <span className="req">*</span></label>
                  <input type="text" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} placeholder="REG-XXXXX" required />
                </div>
                <div className="form-field">
                  <label>Contact Person <span className="req">*</span></label>
                  <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} placeholder="Full name of representative" required />
                </div>
                <div className="form-field">
                  <label>Phone Number</label>
                  <input type="tel" value={ngoPhone} onChange={e => setNgoPhone(e.target.value)} placeholder="+880 1X XXXX XXXX" />
                </div>
                <div className="form-field">
                  <label>Website</label>
                  <input type="url" value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourorg.org" />
                </div>
                <div className="form-field full">
                  <label>Address</label>
                  <input type="text" value={ngoAddress} onChange={e => setNgoAddress(e.target.value)} placeholder="Office address" />
                </div>
                <div className="form-field full">
                  <label>Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe your organization's mission and goals..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── ADMIN ── */}
          {role === 'ADMIN' && (
            <div className="form-section">
              <label className="section-title">Administrator Information</label>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Full Name <span className="req">*</span></label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" required />
                </div>
                <div className="form-field full">
                  <label>Admin Secret Key <span className="req">*</span></label>
                  <input
                    type="password" value={secretKey}
                    onChange={e => setSecretKey(e.target.value)}
                    placeholder="Provided by system administrator" required
                  />
                  <span className="field-note">Admin accounts require a valid secret key issued by the system administrator.</span>
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Create Account'}
            </button>
            <p className="auth-footer-text">
              Already have an account? <Link to="/auth/login">Sign in</Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
