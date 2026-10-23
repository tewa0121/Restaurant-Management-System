// frontend/src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  let user = null;
  let token = null;

  try {
    const auth = useAuth();
    user = auth?.user;
    token = auth?.token;
  } catch (e) {}

  // Fallback check against localStorage if page reloads
  if (!token) token = localStorage.getItem('token');
  if (!user) user = JSON.parse(localStorage.getItem('user') || 'null');

  // 1. If user is not logged in, redirect to login page
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Verify user role permissions if roles are specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = String(user.role || '').toLowerCase();
    const hasPermission = allowedRoles.some(role => 
      userRole.includes(role.toLowerCase())
    );

    if (!hasPermission) {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
}