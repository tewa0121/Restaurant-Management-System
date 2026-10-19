import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from '../components/layout/CustomerLayout';
import Home from '../pages/customer/Home';
import MyOrders from '../pages/customer/MyOrders';
import Favorites from '../pages/customer/Favorites';
import CustomerTrackOrder from '../pages/customer/TrackOrder';
import Profile from '../pages/customer/Profile';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Customer Portal Page Routes */}
      <Route path="/customer" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/customer/menu" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/customer/categories" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/customer/offers" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/customer/orders" element={<CustomerLayout><MyOrders /></CustomerLayout>} />
      <Route path="/customer/favorites" element={<CustomerLayout><Favorites /></CustomerLayout>} />
      <Route path="/customer/track" element={<CustomerLayout><TrackOrder /></CustomerLayout>} />
      <Route path="/customer/profile" element={<CustomerLayout><Profile /></CustomerLayout>} />
      <Route path="/customer/address" element={<CustomerLayout><Profile /></CustomerLayout>} />
      <Route path="/customer/help" element={<CustomerLayout><Profile /></CustomerLayout>} />

      {/* Fallback route redirecting back to customer home */}
      <Route path="*" element={<Navigate to="/customer" replace />} />
    </Routes>
  );
}