import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const normalizeRole = (r) =>
  String(r || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, ' ');

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  let user = null;
  let token = null;

  try {
    const auth = useAuth();
    user = auth?.user || null;
    token = auth?.token || null;
  } catch {
    // fallback below
  }

  if (!token) {
    token = localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  if (!user) {
    try {
      user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
    } catch {
      user = null;
    }
  }

  if (!token || !user) {
    return <Navigate to="/admin" replace />;
  }

  if (allowedRoles.length > 0) {
    const userRole = normalizeRole(
      user?.role || user?.userType || user?.type || user?.designation
    );
    const hasPermission = allowedRoles.some((allowed) => normalizeRole(allowed) === userRole);

    if (!hasPermission) {
      return <Navigate to="/" replace />;
    }
  }

  return children ? children : <Outlet />;
}