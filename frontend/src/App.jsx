
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

import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';

import AdminLayout from './components/layout/AdminLayout';
import CashierLayout from './components/layout/CashierLayout';
import KitchenLayout from './components/layout/KitchenLayout';
import ManagerLayout from './components/layout/ManagerLayout';
import WaiterLayout from './components/layout/WaiterLayout';
import CustomerLayout from './components/layout/CustomerLayout';

import AdminDashboard from './pages/admin/Dashboard';
import UsersAndRoles from './pages/admin/UsersAndRoles';
import AdminMenuManagement from './pages/admin/MenuManagement';
import AdminTableManagement from './pages/admin/TableManagement';
import OrderManagement from './pages/admin/OrderManagement';
import ReservationManagement from './pages/admin/ReservationManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import AdminInventoryManagement from './pages/admin/InventoryManagement';
import ReportsAndAnalytics from './pages/admin/ReportsAndAnalytics';
import DeliveryManagement from './pages/admin/DeliveryManagement';
import LogsAndActivity from './pages/admin/LogsAndActivity';
import PaymentManagement from './pages/admin/PaymentManagement';
import Restaurants from './pages/admin/Restaurants';
import Settings from './pages/admin/Settings';
import SupplierManagement from './pages/admin/SupplierManagement';

import CashierDashboard from './pages/cashier/Dashboard';
import KitchenDashboard from './pages/kitchen/Dashboard';
import WaiterDashboard from './pages/waiter/Dashboard';

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

import Home from './pages/customer/Home';
import Checkout from './pages/customer/Checkout';
import Cart from './pages/customer/Cart';

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
