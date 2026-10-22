import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

// --- AUTH PAGES ---
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';

// --- ADMIN PAGES ---
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
import AdminSettings from './pages/admin/Settings';

// --- CASHIER PAGES ---
import CashierDashboard from './pages/cashier/Dashboard';
import NewBill from './pages/cashier/NewBill';
import ActiveBills from './pages/cashier/ActiveBills';
import HoldBills from './pages/cashier/HoldBills';
import OrderHistory from './pages/cashier/OrderHistory';
import PaymentHistory from './pages/cashier/PaymentHistory';
import Refunds from './pages/cashier/Refunds';
import Receipts from './pages/cashier/Receipts';
import SalesSummary from './pages/cashier/SalesSummary';
import DailyCashReport from './pages/cashier/DailyCashReport';
import CashierCustomers from './pages/cashier/Customers';
import CashierSettings from './pages/cashier/Settings';

// --- KITCHEN PAGES ---
import KitchenDashboard from './pages/kitchen/Dashboard';
import IncomingOrders from './pages/kitchen/IncomingOrders';
import InProgressOrders from './pages/kitchen/InProgressOrders';
import ReadyToServe from './pages/kitchen/ReadyToServe';
import CompletedOrders from './pages/kitchen/CompletedOrders';
import Ingredients from './pages/kitchen/Ingredients';
import StockAlerts from './pages/kitchen/StockAlerts';
import KitchenReports from './pages/kitchen/KitchenReports';
import Performance from './pages/kitchen/Performance';
import KitchenSettings from './pages/kitchen/Settings';

// --- MANAGER PAGES ---
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

// --- WAITER PAGES ---
import WaiterDashboard from './pages/waiter/Dashboard';
import NewOrder from './pages/waiter/NewOrder';
import MyTables from './pages/waiter/MyTables';
import Tables from './pages/waiter/Tables';
import Reservations from './pages/waiter/Reservations';
import WaiterCustomers from './pages/waiter/Customers';
import CustomerRequests from './pages/waiter/CustomerRequests';
import Notifications from './pages/waiter/Notifications';
import WaiterProfile from './pages/waiter/Profile';
import WaiterSettings from './pages/waiter/Settings';

// --- CUSTOMER PAGES ---
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
  if (allowedRoles && !allowedRoles.some(role => role.toLowerCase() === String(user.role).toLowerCase())) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <CartProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* ================= ADMIN ROUTES (NESTED) ================= */}
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
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* ================= CASHIER ROUTES (FLAT) ================= */}
                <Route path="/cashier" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><CashierDashboard /></CashierLayout></ProtectedRoute>} />
                <Route path="/cashier/dashboard" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><CashierDashboard /></CashierLayout></ProtectedRoute>} />
                <Route path="/cashier/new-bill" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><NewBill /></CashierLayout></ProtectedRoute>} />
                <Route path="/cashier/active-bills" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><ActiveBills /></CashierLayout></ProtectedRoute>} />
                <Route path="/cashier/hold-bills" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><HoldBills /></CashierLayout></ProtectedRoute>} />
                <Route path="/cashier/order-history" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><OrderHistory /></CashierLayout></ProtectedRoute>} />
                <Route path="/cashier/payment-history" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><PaymentHistory /></CashierLayout></ProtectedRoute>} />
                <Route path="/cashier/refunds" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><Refunds /></CashierLayout></ProtectedRoute>} />
                <Route path="/cashier/receipts" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><Receipts /></CashierLayout></ProtectedRoute>} />
                <Route path="/cashier/sales-summary" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><SalesSummary /></CashierLayout></ProtectedRoute>} />
                <Route path="/cashier/daily-report" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><DailyCashReport /></CashierLayout></ProtectedRoute>} />
                <Route path="/cashier/customers" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><CashierCustomers /></CashierLayout></ProtectedRoute>} />
                <Route path="/cashier/settings" element={<ProtectedRoute allowedRoles={['Cashier']}><CashierLayout><CashierSettings /></CashierLayout></ProtectedRoute>} />

                {/* ================= KITCHEN ROUTES (FLAT) ================= */}
                <Route path="/kitchen" element={<KitchenLayout><KitchenDashboard /></KitchenLayout>} />
                <Route path="/kitchen/dashboard" element={<KitchenLayout><KitchenDashboard /></KitchenLayout>} />
                <Route path="/kitchen/incoming-orders" element={<KitchenLayout><IncomingOrders /></KitchenLayout>} />
                <Route path="/kitchen/in-progress" element={<KitchenLayout><InProgressOrders /></KitchenLayout>} />
                <Route path="/kitchen/ready-to-serve" element={<KitchenLayout><ReadyToServe /></KitchenLayout>} />
                <Route path="/kitchen/completed-orders" element={<KitchenLayout><CompletedOrders /></KitchenLayout>} />
                <Route path="/kitchen/ingredients" element={<KitchenLayout><Ingredients /></KitchenLayout>} />
                <Route path="/kitchen/stock-alerts" element={<KitchenLayout><StockAlerts /></KitchenLayout>} />
                <Route path="/kitchen/reports" element={<KitchenLayout><KitchenReports /></KitchenLayout>} />
                <Route path="/kitchen/performance" element={<KitchenLayout><Performance /></KitchenLayout>} />
                <Route path="/kitchen/settings" element={<KitchenLayout><KitchenSettings /></KitchenLayout>} />

                {/* ================= MANAGER ROUTES (FLAT) ================= */}
                <Route path="/manager" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerDashboard /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/dashboard" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerDashboard /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/orders" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerOrders /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/table-management" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerTableManagement /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/inventory-management" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerInventoryManagement /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/reservations" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerReservations /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/menu-management" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerMenuManagement /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/employees" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerEmployees /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/customers" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerCustomers /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/suppliers" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerSuppliers /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/reports" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerReports /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/sales-and-revenue" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerSalesAndRevenue /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/analytics" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerAnalytics /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/settings" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerSettings /></ManagerLayout></ProtectedRoute>} />
                <Route path="/manager/activity-log" element={<ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'Admin']}><ManagerLayout><ManagerActivityLog /></ManagerLayout></ProtectedRoute>} />

                {/* ================= WAITER ROUTES (FLAT) ================= */}
                <Route path="/waiter" element={<ProtectedRoute allowedRoles={['Waiter']}><WaiterLayout><WaiterDashboard /></WaiterLayout></ProtectedRoute>} />
                <Route path="/waiter/dashboard" element={<ProtectedRoute allowedRoles={['Waiter']}><WaiterLayout><WaiterDashboard /></WaiterLayout></ProtectedRoute>} />
                <Route path="/waiter/new-order" element={<ProtectedRoute allowedRoles={['Waiter']}><WaiterLayout><NewOrder /></WaiterLayout></ProtectedRoute>} />
                <Route path="/waiter/tables" element={<ProtectedRoute allowedRoles={['Waiter']}><WaiterLayout><Tables /></WaiterLayout></ProtectedRoute>} />
                <Route path="/waiter/my-tables" element={<ProtectedRoute allowedRoles={['Waiter']}><WaiterLayout><MyTables /></WaiterLayout></ProtectedRoute>} />
                <Route path="/waiter/reservations" element={<ProtectedRoute allowedRoles={['Waiter']}><WaiterLayout><Reservations /></WaiterLayout></ProtectedRoute>} />
                <Route path="/waiter/customers" element={<ProtectedRoute allowedRoles={['Waiter']}><WaiterLayout><WaiterCustomers /></WaiterLayout></ProtectedRoute>} />
                <Route path="/waiter/customer-requests" element={<ProtectedRoute allowedRoles={['Waiter']}><WaiterLayout><CustomerRequests /></WaiterLayout></ProtectedRoute>} />
                <Route path="/waiter/notifications" element={<ProtectedRoute allowedRoles={['Waiter']}><WaiterLayout><Notifications /></WaiterLayout></ProtectedRoute>} />
                <Route path="/waiter/profile" element={<ProtectedRoute allowedRoles={['Waiter']}><WaiterLayout><WaiterProfile /></WaiterLayout></ProtectedRoute>} />
                <Route path="/waiter/settings" element={<ProtectedRoute allowedRoles={['Waiter']}><WaiterLayout><WaiterSettings /></WaiterLayout></ProtectedRoute>} />

                {/* ================= CUSTOMER ROUTES ================= */}
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

                {/* CATCH ALL */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </CartProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}