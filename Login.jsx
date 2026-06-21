import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  setLoading(true);

  try {
    const response = await axios.post(
      'http://127.0.0.1:5000/api/auth/login',
      {
        email,
        password
      }
    );

    if (response.data && response.data.token) {

      localStorage.setItem(
        'token',
        response.data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify({
          name: response.data.name,
          role: response.data.role
        })
      );

      if (response.data.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    }

  } catch (err) {
    console.log(err);

    alert(
      err.response?.data?.error ||
      "Authentication network node failed."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', overflow: 'hidden' }}>
      
      {/* LEFT PANEL */}
      <div style={{ flex: '1.2', background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px', borderRight: '1px solid #1e293b' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 10px 0' }}>🏥 SmartCare Enterprise</h1>
        <h2 style={{ fontSize: '42px', fontWeight: '700', color: '#38bdf8', lineHeight: '1.2' }}>Next-Gen AI <br />Clinical Triage Grid.</h2>
        <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '480px', marginTop: '15px' }}>Institutional high-tech cloud ecosystem connecting automated diagnostics.</p>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backgroundColor: '#090d16' }}>
        <div style={{ width: '100%', maxWidth: '460px', background: '#1e293b', borderRadius: '24px', padding: '45px', border: '1px solid #334155', boxSizing: 'border-box' }}>
          <h3 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 20px 0' }}>System Authentication</h3>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>SECURE EMAIL ADDRESS</label>
              <input type="email" placeholder="name@hospital.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#f8fafc', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>MASTER PASSWORD</label>
              <input type="password" placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#f8fafc', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(90deg, #6366f1 0%, #4f46e5 100%)', color: 'white', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
              {loading ? "Establishing Secure Link..." : "Initialize Command Session"}
            </button>
          </form>
          
          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
            New grid node? <span onClick={() => navigate('/register')} style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: '600' }}>Create an Account</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;