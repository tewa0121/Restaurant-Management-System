import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  let user = null;
  let token = null;

  // 1. Try pulling auth details from Context
  try {
    const auth = useAuth();
    user = auth?.user || null;
    token = auth?.token || null;
  } catch (err) {
    // Context fallback
  }

  // 2. Fallback check against localStorage
  if (!token) token = localStorage.getItem('token');
  if (!user) {
    try {
      user = JSON.parse(localStorage.getItem('user') || 'null');
    } catch (err) {
      user = null;
    }
  }

  // 3. Strict authentication gate: If no token or user object exists, kick back to login
  if (!token || !user) {
    return <Navigate to="/admin" replace />;
  }

  // 4. Strict Role Authorization Check
  if (allowedRoles.length > 0) {
    // Extract role from standard property names (role, userType, type, designation)
    const rawRole = String(
      user?.role || user?.userType || user?.type || user?.designation || ''
    ).trim().toLowerCase();

    // Check if the user's role matches any of the allowed roles
    const hasPermission = allowedRoles.some((allowed) => {
      const targetRole = String(allowed).trim().toLowerCase();
      return rawRole === targetRole;
    });

    // If they are logged in as a Waiter, but trying to access Manager/Admin (or vice versa), block them
    if (!hasPermission) {
      // Redirect unauthorized attempts back to the login screen (or an error/unauthorized route)
      return <Navigate to="/admin" replace />;
    }
  }

  // 5. Render children or Outlet if authorization passes
  return children ? children : <Outlet />;
}