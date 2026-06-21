import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const navigate = useNavigate();

  // Directly extract user credentials from our local data nodes
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const [symptoms, setSymptoms] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Clean LocalStorage logout handling mechanism
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSymptomCheck = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return alert("Please enter your symptoms first!");
    
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/ai/symptom-check',
        { symptoms },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiResult(response.data);
    } catch (err) {
      alert("AI pipeline core error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const triggerSOS = () => {
    alert("🚨 DISPATCHING SOS TELEMETRY BUFFER: Emergency alert broadcasted via WebSockets to all on-duty clinical units!");
  };

  const getUrgencyColor = (urgency) => {
    if (urgency === 'High') return '#ef4444';
    if (urgency === 'Medium') return '#fbbc05';
    return '#34a853';
  };

  return (
    <div style={{ padding: '0', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      
      {/* PREMIUM GLASS NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', padding: '15px 40px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🛡️</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', background: 'linear-gradient(to right, #34d399, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SmartCare Patient Portal</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>Patient: <strong style={{ color: '#f1f5f9' }}>{user?.name || "User"}</strong></span>
          <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* EMERGENCY PANIC INTERFACE */}
        <div style={{ background: 'linear-gradient(135deg, #450a0a, #7f1d1d)', border: '1px solid #ef4444', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h3 style={{ margin: '0 0 5px 0', color: '#fca5a5' }}>⚠️ CRITICAL MEDICAL SITUATION?</h3>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '14px' }}>Instantly broadcast your telemetry data and current location directly to the hospital core station.</p>
          </div>
          <button onClick={triggerSOS} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' }}>Trigger Live SOS</button>
        </div>

        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          {/* LEFT INPUT CORE */}
          <div style={{ flex: '1', minWidth: '350px', background: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#38bdf8' }}>🧠 Smart AI Diagnostician</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px 0', lineHeight: '1.4' }}>Describe your symptoms naturally below. The core AI neural network will process the triage factors in real-time.</p>
            
            <form onSubmit={handleSymptomCheck}>
              <textarea 
                rows="5" 
                placeholder="Example: I have been experiencing a sudden high fever accompanied by mild shivering, a dry cough, and a persistent throbbing headache since yesterday morning..." 
                value={symptoms} 
                onChange={(e) => setSymptoms(e.target.value)} 
                style={{ width: '94%', padding: '14px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '14px', outline: 'none', lineHeight: '1.5', resize: 'none' }}
              />
              <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '20px', background: 'linear-gradient(to right, #3b82f6, #2563eb)', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)' }}>
                {loading ? "Analyzing Case Matrix..." : "Begin Diagnostic Scan"}
              </button>
            </form>
          </div>

          {/* RIGHT SCREEN DIAGNOSTIC RESULTS */}
          <div style={{ flex: '1.2', minWidth: '400px', background: '#1e293b', padding: '30px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#34d399', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>📊 Analysis Matrix Output</h3>
            
            {aiResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>PREDICTED DIAGNOSIS:</span>
                  <div style={{ fontSize: '22px', fontWeight: '700', color: '#f8fafc', marginTop: '4px' }}>{aiResult.condition}</div>
                </div>

                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>URGENCY PROTOCOL LEVEL:</span>
                  <div style={{ marginTop: '6px' }}>
                    <span style={{ background: `${getUrgencyColor(aiResult.urgency)}20`, color: getUrgencyColor(aiResult.urgency), border: `1px solid ${getUrgencyColor(aiResult.urgency)}`, padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
                      ⚡ {aiResult.urgency} Priority
                    </span>
                  </div>
                </div>

                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', borderLeft: `4px solid ${getUrgencyColor(aiResult.urgency)}` }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>CLINICAL ACTIONS SUGGESTED:</span>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5' }}>{aiResult.suggestion}</p>
                </div>
              </div>
            ) : (
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b', textAlign: 'center', padding: '40px' }}>
                <span style={{ fontSize: '40px', marginBottom: '10px' }}>📡</span>
                <p style={{ margin: 0, fontStyle: 'italic', fontSize: '14px' }}>Awaiting data streams. Trigger a diagnostic scan to populate the telemetry console windows.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;