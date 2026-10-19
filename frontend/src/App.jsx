
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/customer/Home';
// --- LAYOUTS ---
import DashboardLayout from './components/layout/DashboardLayout';
import ManagerLayout from './components/layout/ManagerLayout';
import WaiterLayout from './components/layout/WaiterLayout';
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

import ManagerDashboard from './pages/manager/Dashboard';
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

function App() {
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
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Admin */}
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

                {/* Cashier */}
                <Route path="/cashier" element={<CashierLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<CashierDashboard />} />
                </Route>

                {/* Kitchen */}
                <Route path="/kitchen" element={<KitchenLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<KitchenDashboard />} />
                </Route>

                {/* Manager */}
                <Route path="/manager" element={<ManagerLayout />}>
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

                {/* Waiter */}
                <Route path="/waiter" element={<WaiterLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<WaiterDashboard />} />
                </Route>

                {/* Customer */}
                <Route
                  path="/customer"
                  element={
                    <CustomerLayout>
                      <Home />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/customer/cart"
                  element={
                    <CustomerLayout>
                      <Cart />
                    </CustomerLayout>
                  }
                />
                <Route
                  path="/customer/checkout"
                  element={
                    <CustomerLayout>
                      <Checkout />
                    </CustomerLayout>
                  }
                />

                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </CartProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
