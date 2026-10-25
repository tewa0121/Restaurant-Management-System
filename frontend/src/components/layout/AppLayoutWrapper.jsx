import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { AuthProvider } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';
import { NotificationProvider } from '../../context/NotificationContext';
import { CartProvider } from '../../context/CartContext';

// Master AppLayout Component
import AppLayout from './AppLayout';

// Customer Pages
import Home from '../../pages/customer/Home';
import BrowseMenu from '../../pages/customer/BrowseMenu';
import Categories from '../../pages/customer/Categories';
import OffersAndDeals from '../../pages/customer/OffersAndDeals';
import MyOrders from '../../pages/customer/MyOrders';
import Favorites from '../../pages/customer/Favorites';
import TrackOrder from '../../pages/customer/TrackOrder';
import Profile from '../../pages/customer/Profile';
import AddressBook from '../../pages/customer/AddressBook';
import HelpSupport from '../../pages/customer/HelpSupport';

// Auth Pages
import Login from '../../pages/auth/Login';
import SignUp from '../../pages/auth/SignUp';
import ForgotPassword from '../../pages/auth/ForgotPassword';

// Staff & Admin Dashboards
import AdminDashboard from '../../pages/admin/Dashboard';
import CashierDashboard from '../../pages/cashier/Dashboard';
import KitchenDashboard from '../../pages/kitchen/Dashboard';
import ManagerDashboard from '../../pages/manager/Dashboard';
import WaiterDashboard from '../../pages/waiter/Dashboard';

export default function AppLayoutWrapper() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <CartProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <Routes>
                {/* 
                  EVERY ROUTE IS WRAPPED UNDER APPLAYOUT.
                  AppLayout automatically evaluates user.role or location.pathname 
                  and renders the exact Layout shell (Customer, Admin, Cashier, etc.)
                */}
                <Route element={<AppLayout />}>
                  
                  {/* Public / Customer Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<BrowseMenu />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/offers" element={<OffersAndDeals />} />
                  <Route path="/orders" element={<MyOrders />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/track" element={<TrackOrder />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/address" element={<AddressBook />} />
                  <Route path="/help" element={<HelpSupport />} />

                  {/* Authentication Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />

                  {/* Admin Routes */}
                  <Route path="/admin/panel/dashboard" element={<AdminDashboard />} />

                  {/* Cashier Routes */}
                  <Route path="/cashier/dashboard" element={<CashierDashboard />} />

                  {/* Kitchen Routes */}
                  <Route path="/kitchen/dashboard" element={<KitchenDashboard />} />

                  {/* Manager Routes */}
                  <Route path="/manager/dashboard" element={<ManagerDashboard />} />

                  {/* Waiter Routes */}
                  <Route path="/waiter/dashboard" element={<WaiterDashboard />} />

                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </CartProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}