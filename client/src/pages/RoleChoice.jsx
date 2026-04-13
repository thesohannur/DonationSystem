import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function RoleChoice({ mode: propMode }) {
  const { mode: paramMode } = useParams(); // 'login' or 'register'
  const mode = propMode || paramMode;
  const navigate = useNavigate();

  const roles = [
    { key: 'admin', title: 'Admin', emoji: '👑', color: '#667eea', login: '/admin/login', signup: '/admin/signup', blurb: 'Oversee users, NGOs, and system activity.' },
    { key: 'ngo', title: 'NGO', emoji: '🏢', color: '#f59e0b', login: '/ngo/login', signup: '/ngo/signup', blurb: 'Manage fundraising campaigns and donor trust.' },
    { key: 'donor', title: 'Donor', emoji: '💚', color: '#10b981', login: '/donor/login', signup: '/donor/signup', blurb: 'Support causes with money or volunteer time.' }
  ];

  const go = (role) => {
    const selected = roles.find((item) => item.key === role.toLowerCase());
    if (!selected) return;
    if (mode === 'login') navigate(selected.login);
    else navigate(selected.signup);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'linear-gradient(135deg, #f5f7fb 0%, #e9eefc 100%)'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '980px',
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(102,126,234,0.12)',
        borderRadius: '28px',
        boxShadow: '0 24px 70px rgba(31, 41, 55, 0.14)',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{
          padding: '36px 32px 28px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.18)',
            marginBottom: 16,
            fontSize: 30,
            fontWeight: 800
          }}>
            {mode === 'login' ? '↪' : '+'}
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: '2rem', lineHeight: 1.15 }}>
            {mode === 'login' ? 'Choose your login role' : 'Choose your registration role'}
          </h2>
          <p style={{ margin: 0, opacity: 0.92, fontSize: '1rem' }}>
            Pick the account type that matches how you want to continue.
          </p>
        </div>

        <div style={{ padding: '28px 32px 32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '16px'
          }}>
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => go(role.key)}
                style={{
                  textAlign: 'left',
                  padding: '18px',
                  borderRadius: '18px',
                  border: `1px solid ${role.color}22`,
                  background: `linear-gradient(180deg, ${role.color}10 0%, rgba(255,255,255,0.98) 100%)`,
                  boxShadow: '0 10px 24px rgba(31,41,55,0.08)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
                }}
              >
                <div style={{
                  width: 52,
                  height: 52,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: role.color,
                  color: 'white',
                  fontSize: '1.4rem',
                  marginBottom: '14px',
                  boxShadow: `0 10px 20px ${role.color}33`
                }}>
                  {role.emoji}
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', color: '#111827' }}>{role.title}</h3>
                <p style={{ margin: '0 0 14px', color: '#6b7280', lineHeight: 1.5, fontSize: '0.95rem' }}>{role.blurb}</p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: role.color
                }}>
                  {mode === 'login' ? 'Continue to login' : 'Continue to signup'}
                  <span aria-hidden="true">→</span>
                </div>
              </button>
            ))}
          </div>

          <div style={{ marginTop: '22px', textAlign: 'center' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6b7280',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
