import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';

// --- LAYOUTS ---
import AdminLayout from './components/layout/AdminLayout';
import CashierLayout from './components/layout/CashierLayout';
import KitchenLayout from './components/layout/KitchenLayout';
import ManagerLayout from './components/layout/ManagerLayout';
import WaiterLayout from './components/layout/WaiterLayout';
import CustomerLayout from './components/layout/CustomerLayout';

// --- PAGES ---
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin Pages (Mapped to your folder structure)
import AdminDashboard from './pages/admin/Dashboard';
import UsersAndRoles from './pages/admin/UsersAndRoles';
import AdminMenuManagement from './pages/admin/MenuManagement';
import AdminTableManagement from './pages/admin/TableManagement';
import OrderManagement from './pages/admin/OrderManagement';
import ReservationManagement from './pages/admin/ReservationManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import AdminInventoryManagement from './pages/admin/InventoryManagement';
import SupplierManagement from './pages/admin/SupplierManagement';
import DeliveryManagement from './pages/admin/DeliveryManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import ReportsAndAnalytics from './pages/admin/ReportsAndAnalytics';
import LogsAndActivity from './pages/admin/LogsAndActivity';
import Restaurants from './pages/admin/Restaurants';
import Settings from './pages/admin/Settings';

// Cashier Pages
import CashierDashboard from './pages/cashier/Dashboard';

// Kitchen Pages
import KitchenDashboard from './pages/kitchen/Dashboard';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerOrders from './pages/manager/Orders';
import ManagerTableManagement from './pages/manager/TableManagement';
import ManagerInventoryManagement from './pages/manager/InventoryManagement';
import ManagerReservations from './pages/manager/Reservations';
import ManagerMenuManagement from './pages/manager/MenuManagement';
import ManagerEmployees from './pages/manager/Employees';
import ManagerCustomers from './pages/manager/Customers';
import ManagerSuppliers from './pages/manager/Suppliers';
import ManagerReports from './pages/manager/Reports';
import ManagerSalesAndRevenue from './pages/manager/SalesAndRevenue';
import ManagerAnalytics from './pages/manager/Analytics';
import ManagerSettings from './pages/manager/Settings';
import ManagerActivityLog from './pages/manager/ActivityLog';

// Waiter Pages
import WaiterDashboard from './pages/waiter/Dashboard';

// Customer Pages
import Home from './pages/customer/Home';
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

export default function App() {
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
                {/* Default Redirects */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users-and-roles" element={<UsersAndRoles />} />
                  <Route path="menu-management" element={<AdminMenuManagement />} />
                  <Route path="table-management" element={<AdminTableManagement />} />
                  <Route path="order-management" element={<OrderManagement />} />
                  <Route path="reservation-management" element={<ReservationManagement />} />
                  <Route path="customer-management" element={<CustomerManagement />} />
                  <Route path="employee-management" element={<EmployeeManagement />} />
                  <Route path="inventory-management" element={<AdminInventoryManagement />} />
                  <Route path="supplier-management" element={<SupplierManagement />} />
                  <Route path="delivery-management" element={<DeliveryManagement />} />
                  <Route path="payment-management" element={<PaymentManagement />} />
                  <Route path="reports-and-analytics" element={<ReportsAndAnalytics />} />
                  <Route path="logs-and-activity" element={<LogsAndActivity />} />
                  <Route path="restaurants" element={<Restaurants />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Cashier Routes */}
                <Route path="/cashier" element={<CashierLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<CashierDashboard />} />
                </Route>

                {/* Kitchen Routes */}
                <Route path="/kitchen" element={<KitchenLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<KitchenDashboard />} />
                </Route>

                {/* Manager Routes */}
                <Route path="/manager" element={
                  <ProtectedRoute allowedRoles={['Restaurant Manager', 'Admin']}>
                    <ManagerLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<ManagerDashboard />} />
                  <Route path="orders" element={<ManagerOrders />} />
                  <Route path="table-management" element={<ManagerTableManagement />} />
                  <Route path="inventory-management" element={<ManagerInventoryManagement />} />
                  <Route path="reservations" element={<ManagerReservations />} />
                  <Route path="menu-management" element={<ManagerMenuManagement />} />
                  <Route path="employees" element={<ManagerEmployees />} />
                  <Route path="customers" element={<ManagerCustomers />} />
                  <Route path="suppliers" element={<ManagerSuppliers />} />
                  <Route path="reports" element={<ManagerReports />} />
                  <Route path="sales-and-revenue" element={<ManagerSalesAndRevenue />} />
                  <Route path="analytics" element={<ManagerAnalytics />} />
                  <Route path="settings" element={<ManagerSettings />} />
                  <Route path="activity-log" element={<ManagerActivityLog />} />
                </Route>

                {/* Waiter Routes */}
                <Route path="/waiter" element={<WaiterLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<WaiterDashboard />} />
                </Route>

                {/* Customer Routes */}
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

                {/* Catch-all for unknown routes */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </CartProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}