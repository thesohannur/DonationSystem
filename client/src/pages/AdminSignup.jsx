import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, Mail, AlertCircle, CheckCircle, Hash } from 'lucide-react';

export default function AdminSignup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error for this field when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        // Confirm Password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
            // quick health check to give a clearer error when backend is down
            try {
                const ping = await fetch(`${API_BASE}/health`, { method: 'GET', mode: 'cors' });
                if (!ping.ok) {
                    throw new Error(`health check failed (${ping.status})`);
                }
            } catch (pingErr) {
                setErrors({ form: `Cannot reach backend at ${API_BASE}: ${pingErr.message}. Ensure the server is running (server/) and MONGO_URI, JWT_SECRET are set.` });
                setIsLoading(false);
                console.error('Backend unreachable:', pingErr);
                return;
            }
            // Check if this email is already registered under a DIFFERENT role
            try {
                const checkRes = await fetch(`${API_BASE}/auth/check-email`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email })
                });
                if (checkRes.ok) {
                    const checkData = await checkRes.json();
                    if (checkData.exists && checkData.role && checkData.role.toUpperCase() !== 'ADMIN') {
                        setErrors({ form: `This email is already registered as a ${checkData.role} account. Each email can only be used for one role.` });
                        setIsLoading(false);
                        return;
                    }
                }
            } catch {
                // If check endpoint doesn't exist, proceed — server will catch duplicate on register
            }

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                role: 'ADMIN',
                fullName: `${formData.firstName} ${formData.lastName}`
            };
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) {
                // show full server response for easier debugging
                const serverMsg = data.message || data.error || JSON.stringify(data) || `Registration failed (${res.status})`;
                // Surface role-conflict errors from server clearly
                const friendlyMsg = serverMsg.toLowerCase().includes('already') || serverMsg.toLowerCase().includes('exist')
                    ? `${serverMsg} — Each email address can only be registered under one role.`
                    : serverMsg;
                setErrors({ form: friendlyMsg });
                setIsLoading(false);
                return;
            }
            // success
            setSuccess(true);
            localStorage.setItem('token', data.token);
            setIsLoading(false);
            // keep user on success screen with a button to go to login
        } catch (err) {
            console.error('Admin signup error', err);
            setErrors({ form: err.message || 'Network error' });
            setIsLoading(false);
        }
    };

    // Success screen
    if (success) {
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
                    maxWidth: '500px',
                    width: '100%',
                    padding: '60px 40px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: '#d1fae5',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 30px'
                    }}>
                        <CheckCircle size={50} color="#10b981" />
                    </div>
                    <h1 style={{
                        color: '#1f2937',
                        fontSize: '32px',
                        fontWeight: '700',
                        margin: '0 0 12px 0'
                    }}>
                        Registration Successful!
                    </h1>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '16px',
                        margin: '0 0 20px 0',
                        lineHeight: '1.6'
                    }}>
                        Your admin account has been created successfully.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: 12,
                        justifyContent: 'center',
                        marginTop: '24px'
                    }}>
                        <div style={{
                            background: '#f3f4f6',
                            padding: '16px',
                            borderRadius: '10px'
                        }}>
                            <p style={{
                                color: '#4b5563',
                                fontSize: '14px',
                                margin: 0
                            }}>
                                <strong>Name:</strong> {formData.firstName} {formData.lastName}
                            </p>
                        </div>
                        <button onClick={() => navigate('/admin/login')} style={{
                            padding: '12px 18px',
                            borderRadius: 10,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}>Go to Login</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                maxWidth: '550px',
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
                        <Shield size={40} color="#ffffff" />
                    </div>
                    <h1 style={{
                        color: 'white',
                        fontSize: '28px',
                        fontWeight: '700',
                        margin: '0 0 8px 0'
                    }}>
                        Create Admin Account
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '15px',
                        margin: 0
                    }}>
                        Register for administrative access
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} style={{ padding: '40px 30px' }}>
                    {errors.form && (
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
                            }}>{errors.form}</p>
                        </div>
                    )}
                    {/* First Name & Last Name Row */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '16px',
                        marginBottom: '24px'
                    }}>
                        {/* First Name */}
                        <div>
                            <label style={{
                                display: 'block',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '8px'
                            }}>
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: `2px solid ${errors.firstName ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    if (!errors.firstName) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.firstName ? '#ef4444' : '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            {errors.firstName && (
                                <p style={{
                                    color: '#ef4444',
                                    fontSize: '12px',
                                    margin: '6px 0 0 0'
                                }}>
                                    {errors.firstName}
                                </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label style={{
                                display: 'block',
                                color: '#374151',
                                fontSize: '14px',
                                fontWeight: '600',
                                marginBottom: '8px'
                            }}>
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Last Name"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    border: `2px solid ${errors.lastName ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    if (!errors.lastName) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.lastName ? '#ef4444' : '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            {errors.lastName && (
                                <p style={{
                                    color: '#ef4444',
                                    fontSize: '12px',
                                    margin: '6px 0 0 0'
                                }}>
                                    {errors.lastName}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail
                                size={20}
                                color="#9ca3af"
                                style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none'
                                }}
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@example.com"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: `2px solid ${errors.email ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    if (!errors.email) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.email ? '#ef4444' : '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.email && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '6px 0 0 0'
                            }}>
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div style={{ marginBottom: '24px' }}>
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
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none'
                                }}
                            />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 8 characters"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: `2px solid ${errors.password ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    if (!errors.password) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.password ? '#ef4444' : '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.password && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '6px 0 0 0'
                            }}>
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            Confirm Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={20}
                                color="#9ca3af"
                                style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none'
                                }}
                            />
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: `2px solid ${errors.confirmPassword ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    if (!errors.confirmPassword) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.confirmPassword && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '6px 0 0 0'
                            }}>
                                {errors.confirmPassword}
                            </p>
                        )}
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
                        {isLoading ? 'Creating Account...' : 'Create Admin Account'}
                    </button>

                    {/* Footer Links */}
                    <div style={{
                        marginTop: '24px',
                        textAlign: 'center'
                    }}>
                        <p style={{
                            color: '#6b7280',
                            fontSize: '14px',
                            margin: '0'
                        }}>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/admin/login')}
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
                                Login
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
