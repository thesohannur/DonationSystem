import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, Lock, User, Mail, AlertCircle, CheckCircle, Hash, Phone, MapPin, Globe, FileText, Tag } from 'lucide-react';

export default function NGOSignup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        organizationName: '',
        contactPerson: '',
        ngoId: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
        website: '',
        description: '',
        focusAreas: ''
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

        // Organization Name validation
        if (!formData.organizationName.trim()) {
            newErrors.organizationName = 'Organization name is required';
        }

        // Contact Person validation
        if (!formData.contactPerson.trim()) {
            newErrors.contactPerson = 'Contact person name is required';
        }

        // NGO ID validation
        if (!formData.ngoId.trim()) {
            newErrors.ngoId = 'NGO ID is required';
        } else if (formData.ngoId.length < 4) {
            newErrors.ngoId = 'NGO ID must be at least 4 characters';
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

        // Phone Number validation
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^\d{11}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
            newErrors.phoneNumber = 'Please enter a valid 11-digit phone number';
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

            // Check if this email is already registered under a DIFFERENT role
            try {
                const checkRes = await fetch(`${API_BASE}/auth/check-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: formData.email })
                });
                if (checkRes.ok) {
                    const checkData = await checkRes.json();
                    if (checkData.exists && checkData.role && checkData.role.toUpperCase() !== 'NGO') {
                        setErrors({ form: `This email is already registered as a ${checkData.role} account. Each email can only be used for one role.` });
                        setIsLoading(false);
                        return;
                    }
                }
            } catch {
                // If check endpoint doesn't exist, proceed — server will catch duplicate on register
            }

            const payload = {
                email: formData.email,
                password: formData.password,
                role: 'NGO',
                organizationName: formData.organizationName,
                contactPerson: formData.contactPerson,
                registrationNumber: formData.ngoId,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                website: formData.website,
                description: formData.description,
                focusAreas: formData.focusAreas ? formData.focusAreas.split(',').map(area => area.trim()).filter(area => area) : []
            };
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) {
                const serverMsg = data.message || `Registration failed (${res.status})`;
                const friendlyMsg = serverMsg.toLowerCase().includes('already') || serverMsg.toLowerCase().includes('exist')
                    ? `${serverMsg} — Each email address can only be registered under one role.`
                    : serverMsg;
                setErrors({ form: friendlyMsg });
                setIsLoading(false);
                return;
            }
            setSuccess(true);
            localStorage.setItem('token', data.token);
            setIsLoading(false);
            setTimeout(() => navigate('/ngo/login'), 1500);
        } catch (err) {
            console.error('NGO signup error', err);
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
                        Your NGO account has been created successfully.
                        Redirecting to login page...
                    </p>
                    <div style={{
                        background: '#f3f4f6',
                        padding: '16px',
                        borderRadius: '10px',
                        marginTop: '24px'
                    }}>
                        <p style={{
                            color: '#4b5563',
                            fontSize: '14px',
                            margin: 0
                        }}>
                            <strong>Organization:</strong> {formData.organizationName}
                        </p>
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
                        <Building size={40} color="#ffffff" />
                    </div>
                    <h1 style={{
                        color: 'white',
                        fontSize: '28px',
                        fontWeight: '700',
                        margin: '0 0 8px 0'
                    }}>
                        Create NGO Account
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '15px',
                        margin: 0
                    }}>
                        Register your organization to raise funds
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
                    {/* Organization Name Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            Organization Name
                        </label>
                        <input
                            type="text"
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleChange}
                            placeholder="Enter organization name"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: `2px solid ${errors.organizationName ? '#ef4444' : '#e5e7eb'}`,
                                borderRadius: '10px',
                                fontSize: '15px',
                                transition: 'all 0.3s',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                            onFocus={(e) => {
                                if (!errors.organizationName) {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                }
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = errors.organizationName ? '#ef4444' : '#e5e7eb';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                        {errors.organizationName && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '6px 0 0 0'
                            }}>
                                {errors.organizationName}
                            </p>
                        )}
                    </div>

                    {/* Contact Person Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            Contact Person Name
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User
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
                                type="text"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                placeholder="Contact person name"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: `2px solid ${errors.contactPerson ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    if (!errors.contactPerson) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.contactPerson ? '#ef4444' : '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.contactPerson && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '6px 0 0 0'
                            }}>
                                {errors.contactPerson}
                            </p>
                        )}
                    </div>

                    {/* NGO ID Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            NGO ID
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Hash
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
                                type="text"
                                name="ngoId"
                                value={formData.ngoId}
                                onChange={handleChange}
                                placeholder="Choose a unique NGO ID"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: `2px solid ${errors.ngoId ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    if (!errors.ngoId) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.ngoId ? '#ef4444' : '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.ngoId && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '6px 0 0 0'
                            }}>
                                {errors.ngoId}
                            </p>
                        )}
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
                                placeholder="organization@example.com"
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
                    <div style={{ marginBottom: '24px' }}>
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

                    {/* Phone Number Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            Phone Number
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Phone
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
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="11-digit phone number"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: `2px solid ${errors.phoneNumber ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    if (!errors.phoneNumber) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.phoneNumber ? '#ef4444' : '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.phoneNumber && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '6px 0 0 0'
                            }}>
                                {errors.phoneNumber}
                            </p>
                        )}
                    </div>

                    {/* Address Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <MapPin
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
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street address, city, state"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: `2px solid ${errors.address ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    if (!errors.address) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.address ? '#ef4444' : '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.address && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '6px 0 0 0'
                            }}>
                                {errors.address}
                            </p>
                        )}
                    </div>

                    {/* Website Field */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            Website
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Globe
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
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: `2px solid ${errors.website ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    if (!errors.website) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.website ? '#ef4444' : '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.website && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '6px 0 0 0'
                            }}>
                                {errors.website}
                            </p>
                        )}
                    </div>

                    {/* Description Field */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            Description
                        </label>
                        <div style={{ position: 'relative' }}>
                            <FileText
                                size={20}
                                color="#9ca3af"
                                style={{
                                    position: 'absolute',
                                    left: '16px',
                                    top: '16px',
                                    pointerEvents: 'none'
                                }}
                            />
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell us about your organization and mission"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: `2px solid ${errors.description ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    fontFamily: 'inherit',
                                    minHeight: '100px',
                                    resize: 'vertical'
                                }}
                                onFocus={(e) => {
                                    if (!errors.description) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.description ? '#ef4444' : '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.description && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '6px 0 0 0'
                            }}>
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Focus Areas Field */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            color: '#374151',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '8px'
                        }}>
                            Focus Areas
                            <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '400', marginLeft: '4px' }}>
                                (comma-separated)
                            </span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Tag
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
                                type="text"
                                name="focusAreas"
                                value={formData.focusAreas}
                                onChange={handleChange}
                                placeholder="e.g., Education, Healthcare, Poverty Relief"
                                style={{
                                    width: '100%',
                                    padding: '14px 16px 14px 48px',
                                    border: `2px solid ${errors.focusAreas ? '#ef4444' : '#e5e7eb'}`,
                                    borderRadius: '10px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => {
                                    if (!errors.focusAreas) {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                                    }
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = errors.focusAreas ? '#ef4444' : '#e5e7eb';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        {errors.focusAreas && (
                            <p style={{
                                color: '#ef4444',
                                fontSize: '12px',
                                margin: '6px 0 0 0'
                            }}>
                                {errors.focusAreas}
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
                        {isLoading ? 'Creating Account...' : 'Create NGO Account'}
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
                                onClick={() => navigate('/ngo/login')}
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
