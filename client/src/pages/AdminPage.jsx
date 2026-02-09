import React from 'react';
import { Settings, Users, TrendingUp, Heart, DollarSign, FileText, Bell, Shield } from 'lucide-react';

export default function AdminPage() {
    const tools = [
        {
            icon: Users,
            title: 'Donor Management',
            description: 'Manage donors, view donation history, and track engagement',
            color: '#667eea'
        },
        {
            icon: Heart,
            title: 'Campaign Management',
            description: 'Create and monitor donation campaigns, set goals and deadlines',
            color: '#ec4899'
        },
        {
            icon: DollarSign,
            title: 'Transaction Monitoring',
            description: 'Track donations, process refunds, and manage payment methods',
            color: '#10b981'
        },
        {
            icon: TrendingUp,
            title: 'Analytics & Reports',
            description: 'Generate insights on donation trends, donor retention, and impact',
            color: '#f59e0b'
        },
        {
            icon: FileText,
            title: 'Tax Receipts',
            description: 'Generate and manage tax-deductible donation receipts',
            color: '#3b82f6'
        },
        {
            icon: Bell,
            title: 'Notifications',
            description: 'Configure email alerts, thank you messages, and reminders',
            color: '#8b5cf6'
        },
        {
            icon: Shield,
            title: 'Security & Compliance',
            description: 'Fraud detection, data privacy controls, and audit logs',
            color: '#ef4444'
        },
        {
            icon: Settings,
            title: 'System Settings',
            description: 'Configure platform settings, integrations, and user permissions',
            color: '#6b7280'
        },
    ];

    return (
        <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ color: '#333', marginBottom: '8px', fontSize: '32px', fontWeight: '700' }}>
                    Admin Dashboard
                </h1>
                <p style={{ color: '#666', fontSize: '16px' }}>
                    Manage donations, donors, campaigns, and system operations
                </p>
            </div>

            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '40px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
                <Shield size={32} color="#ffffff" />
                <div>
                    <h3 style={{ 
                        margin: '0 0 6px 0', 
                        fontSize: '20px', 
                        fontWeight: '600', 
                        color: '#ffffff' 
                    }}>
                        Administrative Control Center
                    </h3>
                    <p style={{ margin: 0, fontSize: '15px', color: '#e0e7ff' }}>
                        Access advanced tools for platform management, donor relations, and financial oversight
                    </p>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
            }}>
                {tools.map((tool, index) => {
                    const Icon = tool.icon;
                    return (
                        <div
                            key={index}
                            style={{
                                background: 'white',
                                padding: '28px',
                                borderRadius: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                border: '1px solid #e5e7eb',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                                e.currentTarget.style.borderColor = tool.color;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                                e.currentTarget.style.borderColor = '#e5e7eb';
                            }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '14px',
                                background: `${tool.color}15`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '18px'
                            }}>
                                <Icon size={28} color={tool.color} />
                            </div>
                            <h3 style={{ 
                                margin: '0 0 10px 0', 
                                fontSize: '19px', 
                                fontWeight: '600', 
                                color: '#1f2937' 
                            }}>
                                {tool.title}
                            </h3>
                            <p style={{ 
                                margin: 0, 
                                fontSize: '14px', 
                                color: '#6b7280', 
                                lineHeight: '1.6' 
                            }}>
                                {tool.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div style={{
                marginTop: '48px',
                padding: '24px',
                background: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
            }}>
                <h3 style={{ 
                    margin: '0 0 12px 0', 
                    fontSize: '18px', 
                    fontWeight: '600', 
                    color: '#374151' 
                }}>
                    Quick Actions
                </h3>
                <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    flexWrap: 'wrap' 
                }}>
                    <button style={{
                        padding: '10px 20px',
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#5568d3'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#667eea'}
                    >
                        Export Data
                    </button>
                    <button style={{
                        padding: '10px 20px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                    >
                        Generate Report
                    </button>
                    <button style={{
                        padding: '10px 20px',
                        background: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#d97706'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f59e0b'}
                    >
                        Send Announcement
                    </button>
                </div>
            </div>
        </div>
    );
}