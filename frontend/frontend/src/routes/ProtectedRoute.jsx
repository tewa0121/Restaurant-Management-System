import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  let user = null;
  let token = null;

  try {
    const auth = useAuth();
    user = auth?.user;
    token = auth?.token;
  } catch (e) {
    // Context fallback
  }

  // Fallback check against localStorage on browser reload
  if (!token) token = localStorage.getItem('token');
  if (!user) {
    try {
      user = JSON.parse(localStorage.getItem('user') || 'null');
    } catch (e) {
      user = null;
    }
  }

  // 1. If user is not logged in, redirect to login page
  if (!token || !user) {
    return <Navigate to="/admin" replace />;
  }

  // 2. Verify user role permissions if specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = String(user.role || '').toLowerCase();
    const hasPermission = allowedRoles.some(role => {
      const target = String(role).toLowerCase();
      return userRole.includes(target) || userRole.includes('admin');
    });

    if (!hasPermission) {
      return <Navigate to="/admin" replace />;
    }
  }

  // Render children if passed directly; otherwise render Outlet for nested route layouts
  return children ? children : <Outlet />;
}