import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const normalizeRole = (r) =>
  String(r || '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, ' ');

const extractUserRoles = (user) => {
  if (!user) return [];
  const raw = [
    ...(Array.isArray(user.roles) ? user.roles : []),
    user.role,
    user.primaryRole,
    user.userType,
    user.type,
    user.designation,
  ].filter(Boolean);
  return raw.map(normalizeRole);
};

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  let user = null;
  let token = null;

  try {
    const auth = useAuth();
    user = auth?.user || null;
    token = auth?.token || null;
  } catch {
    // fallback to storage
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
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0) {
    const userRoles = extractUserRoles(user);
    const wanted = allowedRoles.map(normalizeRole);
    const hasPermission =
      userRoles.includes('admin') ||
      userRoles.some((r) => wanted.includes(r));

    if (!hasPermission) {
      return <Navigate to="/" replace />;
    }
  }

  return children ? children : <Outlet />;
}