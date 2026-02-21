import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Lock, User, AlertCircle } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

export default function DonorLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, password: formData.password })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || `Login failed (${res.status})`);
                setIsLoading(false);
                return;
            }

            // Decode JWT payload to verify role (no library needed — JWT is base64)
            let tokenRole = null;
            try {
                const payload = JSON.parse(atob(data.token.split('.')[1]));
                tokenRole = (payload.role || payload.Role || '').toUpperCase();
            } catch {
                setError('Invalid token received from server.');
                setIsLoading(false);
                return;
            }

            if (tokenRole !== 'DONOR') {
                setError('Access denied. This login is for Donor accounts only. Please use the correct login page for your role.');
                setIsLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            navigate('/donor/dashboard');
        } catch (err) {
            console.error('Donor login error', err);
            setError(err.message || 'Network error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                maxWidth: '450px',
                width: '100%',
                overflow: 'hidden'
            }}>
                {/* Header Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '40px 30px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Heart size={40} color="#ffffff" />
                    </div>
                    <h1 style={{
                        color: 'white',
                        fontSize: '28px',
                        fontWeight: '700',
                        margin: '0 0 8px 0'
                    }}>
                        Donor Login
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '15px',
                        margin: 0
                    }}>
                        Login to contribute to causes
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} style={{ padding: '40px 30px' }}>
                    {error && (
                        <div style={{
                            background: '#fee2e2',
                            border: '1px solid #fca5a5',
                            borderRadius: '10px',
                            padding: '12px 16px',
                            marginBottom: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <AlertCircle size={20} color="#dc2626" />
                            <p style={{
                                color: '#dc2626',
                                fontSize: '14px',
                                margin: 0,
                                fontWeight: '500'
                            }}>
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Donor ID Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                                display: 'block',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '8px'
                            }}>
                                Email
                            </label>
                        <div style={{ position: 'relative' }}>
                            <User
                                size={20}
                                color="#9ca3af"
                                style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={20}
                                color="#9ca3af"
                                style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                            />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: isLoading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.4)'
                        }}
                        onMouseEnter={(e) => {
                            if (!isLoading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isLoading) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                            }
                        }}
                    >
                        {isLoading ? 'Authenticating...' : 'Login to Dashboard'}
                    </button>

                    {/* Footer Links */}
                    <div style={{
                        marginTop: '24px',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            color: '#6b7280',
                            fontSize: '14px',
                            margin: '0 0 12px 0'
                        }}>
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/donor/signup')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#667eea',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    padding: 0
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                                onMouseLeave={(e) => e.target.style.color = '#667eea'}
                            >
                                Sign Up
                            </button>
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#9ca3af',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#667eea'}
                            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                        >
                            Back to Home
                        </button>
                    </div>
                </form>

                {/* Demo Credentials Info */}
                <div style={{
                    background: '#f9fafb',
                    padding: '20px 30px',
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <p style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: '0 0 8px 0',
                        fontWeight: '600'
                    }}>
                        Demo Credentials:
                    </p>
                    <p style={{
                        fontSize: '12px',
                        color: '#9ca3af',
                        margin: 0,
                        lineHeight: '1.6'
                    }}>
                        Donor Email: <strong>sohannur2002@gmail.com</strong><br />
                        Password: <strong>sohannur2002</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
