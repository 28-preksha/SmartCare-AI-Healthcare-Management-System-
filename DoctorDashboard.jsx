import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const DoctorDashboard = () => {
  const navigate = useNavigate();

  // Directly extract auth tokens from local storage telemetry nodes
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const [medicines, setMedicines] = useState('');
  const [instructions, setInstructions] = useState('');
  const [emergencyAlert, setEmergencyAlert] = useState(null);
  
  const [queue, setQueue] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clean local storage logout mechanism
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const fetchQueue = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ai/doctor-queue', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueue(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching doctor queue:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchQueue();
    }
    
    socket.on('admin_emergency_alert', (data) => {
      setEmergencyAlert(data);
    });
    
    socket.on('new_triage_added', () => {
      fetchQueue();
    });
    
    return () => {
      socket.off('admin_emergency_alert');
      socket.off('new_triage_added');
    };
  }, [token]);

  const downloadPrescription = async () => {
    if (!selectedPatient) return;
    try {
      const response = await axios.post(
        'http://localhost:5000/api/prescription/download',
        { 
          appointmentId: selectedPatient._id,
          patientName: selectedPatient.patientName,
          medicines, 
          instructions 
        },
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob' 
        }
      );

      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', `Rx_${selectedPatient.patientName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setMedicines('');
      setInstructions('');
      setSelectedPatient(null);
      fetchQueue();
    } catch (err) {
      alert('Error streaming compiled PDF file.');
    }
  };

  // Modern UI badge color scheme
  const getUrgencyBadge = (urgency) => {
    let baseStyle = { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' };
    if (urgency === 'High') return { ...baseStyle, background: 'rgba(220, 53, 69, 0.15)', color: '#ea4335' };
    if (urgency === 'Medium') return { ...baseStyle, background: 'rgba(255, 193, 7, 0.15)', color: '#fbbc05' };
    return { ...baseStyle, background: 'rgba(40, 167, 69, 0.15)', color: '#34a853' };
  };

  return (
    <div style={{ padding: '0', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      
      {/* MODERN GLASS-LOOK NAVBAR */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', padding: '15px 40px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🏥</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SmartCare AI Command Center</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>Welcome, <strong style={{ color: '#f1f5f9' }}>Dr. {user?.name || "User"}</strong></span>
          <button onClick={handleLogout} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: '0.3s', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)' }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ padding: '40px' }}>
        
        {/* CRITICAL REAL-TIME SOS BANNER */}
        {emergencyAlert && (
          <div style={{ marginBottom: '30px', background: 'linear-gradient(135deg, #7f1d1d, #450a0a)', border: '1px solid #ef4444', padding: '20px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 5px 0', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '8px' }}>🚨 LIVE EMERGENCY TRANSPINDER INCOMING</h3>
              <p style={{ margin: 0, color: '#f8fafc', fontSize: '14px' }}>Patient: <strong>{emergencyAlert.name}</strong> | Loc: <code>{emergencyAlert.location}</code> | Time: {emergencyAlert.time}</p>
            </div>
            <button onClick={() => setEmergencyAlert(null)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Clear Grid</button>
          </div>
        )}

        {/* MAIN TWO-COLUMN DASHBOARD */}
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          
          {/* LEFT PANEL: LIVE TRIAGE GRID */}
          <div style={{ flex: '1.6', minWidth: '450px', background: '#1e293b', padding: '25px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>📋 AI Triage Patient Pipeline</h3>
            
            {loading ? (
              <p style={{ color: '#94a3b8' }}>Syncing telemetry data streams...</p>
            ) : queue.length === 0 ? (
              <p style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '40px 0' }}>No incoming cases detected in the live queue buffer.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '13px' }}>
                      <th style={{ padding: '12px 16px' }}>Patient Identity</th>
                      <th style={{ padding: '12px 16px' }}>AI Medical Prediction</th>
                      <th style={{ padding: '12px 16px' }}>Triage Priority</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queue.map((patient) => (
                      <tr key={patient._id} style={{ borderBottom: '1px solid #334155', background: selectedPatient?._id === patient._id ? 'rgba(56, 189, 248, 0.08)' : 'transparent', transition: '0.2s' }}>
                        <td style={{ padding: '18px 16px', fontWeight: '600', color: '#f1f5f9' }}>{patient.patientName}</td>
                        <td style={{ padding: '18px 16px' }}>
                          <span style={{ color: '#f8fafc', display: 'block', fontSize: '14px', fontWeight: '500' }}>{patient.aiCondition}</span>
                          <span style={{ color: '#64748b', fontSize: '12px', display: 'block', marginTop: '4px', maxWidth: '280px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{patient.rawSymptoms}</span>
                        </td>
                        <td style={{ padding: '18px 16px' }}>
                          <span style={getUrgencyBadge(patient.urgency)}>{patient.urgency}</span>
                        </td>
                        <td style={{ padding: '18px 16px', textAlign: 'right' }}>
                          <button 
                            onClick={() => setSelectedPatient(patient)} 
                            style={{ background: selectedPatient?._id === patient._id ? '#0284c7' : '#38bdf8', color: selectedPatient?._id === patient._id ? '#fff' : '#0f172a', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: '0.2s' }}
                          >
                            {selectedPatient?._id === patient._id ? 'Selected' : 'Load Case'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: HIGH-TECH PRESCRIPTION TERMINAL */}
          <div style={{ flex: '1', minWidth: '350px', background: '#1e293b', padding: '25px', borderRadius: '16px', border: '1px solid #334155', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', height: 'fit-content' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#818cf8', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>📝 Digital Rx Constructor</h3>
            
            {selectedPatient ? (
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid #6366f1', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 6px 0', color: '#a5b4fc', fontSize: '14px' }}><strong>Active File:</strong> {selectedPatient.patientName}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}><strong>AI Protocol:</strong> {selectedPatient.suggestion}</p>
              </div>
            ) : (
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#fcd34d', fontSize: '13px' }}>
                ⚠️ Select a medical case profile from the left matrix array to initialize prescription protocols.
              </div>
            )}

            <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Medicines & Dosage Layout:</label>
            <textarea rows="4" placeholder="Paracetamol 650mg - Twice a day after meals" value={medicines} onChange={(e) => setMedicines(e.target.value)} style={{ width: '94%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '14px', outline: 'none', transition: '0.3s', marginBottom: '15px' }} />
            
            <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Clinical Guidelines / Instructions:</label>
            <textarea rows="3" placeholder="Complete bedrest for 3 days and track hourly temperature records" value={instructions} onChange={(e) => setInstructions(e.target.value)} style={{ width: '94%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '14px', outline: 'none', transition: '0.3s', marginBottom: '20px' }} />
            
            <button 
              onClick={downloadPrescription} 
              disabled={!selectedPatient}
              style={{ background: selectedPatient ? 'linear-gradient(to right, #6366f1, #4f46e5)' : '#334155', color: selectedPatient ? 'white' : '#64748b', border: 'none', padding: '14px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: selectedPatient ? 'pointer' : 'not-allowed', width: '100%', fontSize: '14px', boxShadow: selectedPatient ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none', transition: '0.3s' }}
            >
              Compile & Export Official PDF
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;