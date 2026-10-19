// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';

// Temporary placeholder for dashboards to test redirect
const DashboardPlaceholder = ({ role }) => (
  <div className="p-10 font-sans">
    <h1 className="text-3xl font-bold text-gray-900">{role} Dashboard</h1>
    <p className="text-gray-500 mt-2">Coming in the next step!</p>
  </div>
);

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['Super Administrator', 'Admin']}>
          <DashboardPlaceholder role="Admin" />
        </ProtectedRoute>
      } />
      
      <Route path="/manager" element={
        <ProtectedRoute allowedRoles={['Restaurant Manager']}>
          <DashboardPlaceholder role="Manager" />
        </ProtectedRoute>
      } />
      
      <Route path="/waiter" element={
        <ProtectedRoute allowedRoles={['Waiter']}>
          <DashboardPlaceholder role="Waiter" />
        </ProtectedRoute>
      } />
      
      <Route path="/cashier" element={
        <ProtectedRoute allowedRoles={['Cashier']}>
          <DashboardPlaceholder role="Cashier" />
        </ProtectedRoute>
      } />
      
      <Route path="/kitchen" element={
        <ProtectedRoute allowedRoles={['Kitchen Staff']}>
          <DashboardPlaceholder role="Kitchen" />
        </ProtectedRoute>
      } />

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}