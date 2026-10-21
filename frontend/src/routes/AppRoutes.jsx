// frontend/src/routes/AppRoute.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Pages & Protection Component
import Login from '../../pages/auth/Login';
import SignUp from '../../pages/auth/SignUp';
import ForgotPassword from '../../pages/auth/ForgotPassword';
import ProtectedRoute from './ProtectedRoute';

// Customer Portal Components
import CustomerLayout from '../../components/layout/CustomerLayout';
import Home from '../../pages/customer/Home';
import MyOrders from '../../pages/customer/MyOrders';
import Favorites from '../../pages/customer/Favorites';
import CustomerTrackOrder from '../../pages/customer/TrackOrder';
import Profile from '../../pages/customer/Profile';

// Staff & Admin Portals
import AdminDashboard from '../../pages/admin/Dashboard';
import UsersAndRoles from '../../pages/admin/UsersAndRoles';
import CashierDashboard from '../../pages/cashier/Dashboard';
import KitchenDashboard from '../../pages/kitchen/Dashboard';
import ManagerDashboard from '../../pages/manager/Dashboard';
import WaiterDashboard from '../../pages/waiter/Dashboard';
import NewOrder from '../../pages/waiter/NewOrder';

export default function AppRoute() {
  return (
    <Routes>
      {/* ================= PUBLIC AUTH ROUTES ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ================= PROTECTED CUSTOMER PORTAL ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
        <Route path="/customer" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/customer/menu" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/customer/categories" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/customer/offers" element={<CustomerLayout><Home /></CustomerLayout>} />
        <Route path="/customer/orders" element={<CustomerLayout><MyOrders /></CustomerLayout>} />
        <Route path="/customer/favorites" element={<CustomerLayout><Favorites /></CustomerLayout>} />
        <Route path="/customer/track" element={<CustomerLayout><CustomerTrackOrder /></CustomerLayout>} />
        <Route path="/customer/profile" element={<CustomerLayout><Profile /></CustomerLayout>} />
        <Route path="/customer/address" element={<CustomerLayout><Profile /></CustomerLayout>} />
        <Route path="/customer/help" element={<CustomerLayout><Profile /></CustomerLayout>} />
      </Route>

      {/* ================= PROTECTED ADMIN ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'super administrator']} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users-and-roles" element={<UsersAndRoles />} />
      </Route>

      {/* ================= PROTECTED MANAGER ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['manager', 'restaurant manager']} />}>
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      </Route>

      {/* ================= PROTECTED WAITER ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['waiter']} />}>
        <Route path="/waiter/dashboard" element={<WaiterDashboard />} />
        <Route path="/waiter/new-order" element={<NewOrder />} />
      </Route>

      {/* ================= PROTECTED CASHIER ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['cashier']} />}>
        <Route path="/cashier/dashboard" element={<CashierDashboard />} />
      </Route>

      {/* ================= PROTECTED KITCHEN ROUTES ================= */}
      <Route element={<ProtectedRoute allowedRoles={['kitchen', 'kitchen staff']} />}>
        <Route path="/kitchen/dashboard" element={<KitchenDashboard />} />
      </Route>

      {/* Fallback route: Redirects any unauthorized or unauthenticated URL straight to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}