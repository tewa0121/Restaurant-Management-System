// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/customer/Home';
// --- LAYOUTS ---
import DashboardLayout from './components/layout/DashboardLayout';
import ManagerLayout from './components/layout/ManagerLayout';
import CustomerLayout from './components/layout/CustomerLayout';

// --- PAGES ---
import Login from './pages/auth/Login';
import ManagerDashboard from './pages/manager/ManagerDashboard'; 

// Customer Pages
import CustomerHome from './pages/customer/Home';
import BrowseMenu from './pages/customer/BrowseMenu';
import Categories from './pages/customer/Categories';
import OffersAndDeals from './pages/customer/OffersAndDeals';
import MyOrders from './pages/customer/MyOrders';
import Favorites from './pages/customer/Favorites';
import TrackOrder from './pages/customer/TrackOrder';
import Profile from './pages/customer/Profile';
import AddressBook from './pages/customer/AddressBook';
import HelpSupport from './pages/customer/HelpSupport';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';

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
      {/* 1. Login */}
      <Route path="/login" element={<Login />} />

      {/* 2. Customer Routes (All inside CustomerLayout) */}
      <Route path="/customer" element={<CustomerLayout><Home /></CustomerLayout>} />
      <Route path="/customer/menu" element={<CustomerLayout><BrowseMenu /></CustomerLayout>} />
      <Route path="/customer/categories" element={<CustomerLayout><Categories /></CustomerLayout>} />
      <Route path="/customer/offers" element={<CustomerLayout><OffersAndDeals /></CustomerLayout>} />
      <Route path="/customer/orders" element={<CustomerLayout><MyOrders /></CustomerLayout>} />
      <Route path="/customer/favorites" element={<CustomerLayout><Favorites /></CustomerLayout>} />
      <Route path="/customer/track" element={<CustomerLayout><TrackOrder /></CustomerLayout>} />
      <Route path="/customer/profile" element={<CustomerLayout><Profile /></CustomerLayout>} />
      <Route path="/customer/address" element={<CustomerLayout><AddressBook /></CustomerLayout>} />
      <Route path="/customer/help" element={<CustomerLayout><HelpSupport /></CustomerLayout>} />
      <Route path="/customer/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
      <Route path="/customer/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />

      {/* 3. Manager Route */}
      <Route path="/manager" element={
        <ProtectedRoute allowedRoles={['Restaurant Manager']}>
          <ManagerLayout>
            <ManagerDashboard />
          </ManagerLayout>
        </ProtectedRoute>
      } />

      {/* 4. Default Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Catch-all for unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
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