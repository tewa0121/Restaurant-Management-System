import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import SignUp from './pages/auth/SignUp.jsx';
import ForgotPassword from './pages/auth/ForgotPassword.jsx';

// Temporary placeholder dashboard for Step 1 verification (will be replaced by full dashboards in Step 2)
const PlaceholderDashboard = ({ title }) => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title} Portal</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Authentication successful! Full role dashboard coming up in Step 2.
      </p>
    </div>
  </div>
);

// Protected Route wrapper ensuring authentication & role authorization
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, primaryRole } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(primaryRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Role Portals */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PlaceholderDashboard title="Admin" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/*"
          element={
            <ProtectedRoute allowedRoles={['manager', 'admin']}>
              <PlaceholderDashboard title="Manager" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier/*"
          element={
            <ProtectedRoute allowedRoles={['cashier', 'admin', 'manager']}>
              <PlaceholderDashboard title="Cashier" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/waiter/*"
          element={
            <ProtectedRoute allowedRoles={['waiter', 'admin', 'manager']}>
              <PlaceholderDashboard title="Waiter" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kitchen/*"
          element={
            <ProtectedRoute allowedRoles={['kitchen', 'admin', 'manager']}>
              <PlaceholderDashboard title="Kitchen Staff" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}>
              <PlaceholderDashboard title="Customer" />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized View */}
        <Route
          path="/unauthorized"
          element={
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
              <div className="text-center">
                <h1 className="text-xl font-bold text-rose-600">Unauthorized Access</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  You do not have the required permissions to view this portal.
                </p>
              </div>
            </div>
          }
        />

        {/* Default Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}