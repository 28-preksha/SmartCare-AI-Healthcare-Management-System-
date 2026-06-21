import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Directly extract auth token and user metrics from local database node
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  // Node check: Authentication status failed validation
  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userString);

  // Clearance check: Role verification protocol failed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If not matching, bounce back to respective stable system consoles
    return user.role === 'doctor' 
      ? <Navigate to="/doctor-dashboard" replace /> 
      : <Navigate to="/patient-dashboard" replace />;
  }

  // Security criteria satisfied, deploy child subsystem node safely
  return children;
};

export default ProtectedRoute;