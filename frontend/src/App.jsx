// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// --- LAYOUTS ---
import DashboardLayout from './components/layout/DashboardLayout';
import ManagerLayout from './components/layout/ManagerLayout';
import CustomerLayout from './components/layout/CustomerLayout';

// --- PAGES ---
import Login from './pages/auth/Login';
import Home from './pages/customer/Home'; 
import ManagerDashboard from './pages/manager/ManagerDashboard'; 

import Checkout from './pages/customer/Checkout';
import Cart from './pages/customer/Cart';

// --- AUTH GUARD ---
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
      
      {/* Customer Route */}
      <Route path="/customer" element={
        <CustomerLayout>
          <Home />
        </CustomerLayout>
      } />
       <Route path="/customer/checkout" element={
              <CustomerLayout>
                <Checkout />
              </CustomerLayout>
            } />
       <Route path="/customer/cart" element={
        <CustomerLayout>
          <Cart />
        </CustomerLayout>
      } />
      {/* Manager Route */}
      <Route path="/manager" element={
        <ProtectedRoute allowedRoles={['Restaurant Manager']}>
          <ManagerLayout>
            <ManagerDashboard />
          </ManagerLayout>
        </ProtectedRoute>
      } />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes> 
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}