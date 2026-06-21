import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("All fields are mandatory.");
      return;
    }

    setLoading(true);
    try {
      // Correct single endpoint URL syntax execution
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role }, { headers: { 'Content-Type': 'application/json' } });
      if (response.data) {
        alert("🎉 Registration Successful! Redirecting...");
        navigate('/login');
      }
    } catch (err) {
  console.log(err.response);
  alert(err.response?.data?.error || "Registration failed.");
} finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', overflow: 'hidden' }}>
      
      {/* LEFT PANEL */}
      <div style={{ flex: '1.2', background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px', borderRight: '1px solid #1e293b' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 10px 0' }}>🏥 SmartCare Cloud</h1>
        <h2 style={{ fontSize: '42px', fontWeight: '700', color: '#34d399', lineHeight: '1.2' }}>Join Decentralized <br />Medical Grid.</h2>
        <p style={{ color: '#94a3b8', fontSize: '16px', maxWidth: '480px', marginTop: '15px' }}>Deploy credentials to create your clinical triage node profile profile.</p>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backgroundColor: '#090d16' }}>
        <div style={{ width: '100%', maxWidth: '460px', background: '#1e293b', borderRadius: '24px', padding: '45px', border: '1px solid #334155', boxSizing: 'border-box' }}>
          <h3 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 20px 0' }}>Create System Node</h3>
          
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>FULL ACCOUNT NAME</label>
              <input type="text" placeholder="e.g., Preksha" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#f8fafc', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>SECURE EMAIL ADDRESS</label>
              <input type="email" placeholder="name@hospital.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#f8fafc', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>MASTER PASSWORD</label>
              <input type="password" placeholder="••••••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#f8fafc', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>SYSTEM ROLE PROFILE</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: '#f8fafc', cursor: 'pointer', boxSizing: 'border-box', outline: 'none' }}>
                <option value="patient">Patient Operator Portal</option>
                <option value="doctor">Licensed Medical Doctor</option>
              </select>
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', background: 'linear-gradient(90deg, #34d399 0%, #059669 100%)', color: 'white', padding: '15px', borderRadius: '10px', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
              {loading ? "Deploying..." : "Initialize Registration"}
            </button>
          </form>
          
          <div style={{ marginTop: '30px', textAlign: 'center', fontSize: '14px', color: '#94a3b8' }}>
            Verified credentials? <span onClick={() => navigate('/login')} style={{ color: '#34d399', cursor: 'pointer', fontWeight: '600' }}>Sign In Here</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;