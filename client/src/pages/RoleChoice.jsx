import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function RoleChoice({ mode: propMode }) {
  const { mode: paramMode } = useParams(); // 'login' or 'register'
  const mode = propMode || paramMode;
  const navigate = useNavigate();

  const go = (role) => {
    const base = role.toLowerCase();
    if (mode === 'login') navigate(`/${base}/login`);
    else navigate(`/${base}/signup`);
  };

  return (
    <div style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{background: 'white', padding: 30, borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}}>
        <h2 style={{marginTop:0, marginBottom:8}}>{mode === 'login' ? 'Choose account to sign in' : 'Choose account to create'}</h2>
        <p style={{color:'#6b7280', marginTop:0}}>Select one of the roles below</p>
        <div style={{display:'flex', gap:12, marginTop:16}}>
          <button onClick={() => go('Admin')} style={{padding:'10px 16px', borderRadius:8, background:'#667eea', color:'white', border:'none'}}>Admin</button>
          <button onClick={() => go('Donor')} style={{padding:'10px 16px', borderRadius:8, background:'#10b981', color:'white', border:'none'}}>Donor</button>
          <button onClick={() => go('NGO')} style={{padding:'10px 16px', borderRadius:8, background:'#f59e0b', color:'white', border:'none'}}>NGO</button>
        </div>
        <div style={{marginTop:16}}>
          <button onClick={() => navigate('/')} style={{background:'none', border:'none', color:'#9ca3af'}}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}
