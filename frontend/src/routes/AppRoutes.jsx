import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../../pages/auth/Login';
import SignUp from '../../pages/auth/SignUp';
import ForgotPassword from '../../pages/auth/ForgotPassword';
import ProtectedRoute from './ProtectedRoute';

import ManagerLayout from '../../components/layout/ManagerLayout';
import ManagerDashboard from '../../pages/manager/Dashboard';

export default function AppRoute() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* MANAGER PORTAL WITH LAYOUT & OUTLET */}
      <Route element={
        <ProtectedRoute allowedRoles={['manager', 'restaurant manager', 'admin']} />
      }>
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ManagerDashboard />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}