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
import ProtectedRoute from './routes/ProtectedRoute';

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

// Admin Pages
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
import * as NewBillModule from './pages/cashier/NewBill';
import * as ActiveBillsModule from './pages/cashier/ActiveBills';
import * as HoldBillsModule from './pages/cashier/HoldBills';
import * as OrderHistoryModule from './pages/cashier/OrderHistory';
import * as PaymentHistoryModule from './pages/cashier/PaymentHistory';
import * as RefundsModule from './pages/cashier/Refunds';
import * as ReceiptsModule from './pages/cashier/Receipts';
import * as SalesSummaryModule from './pages/cashier/SalesSummary';
import * as DailyCashReportModule from './pages/cashier/DailyCashReport';
import * as CustomersModule from './pages/cashier/Customers';
import * as CashierSettingsModule from './pages/cashier/Settings';

const getComp = (mod, name) => mod.default || mod[name] || (() => <div className="p-6 text-xs font-semibold text-slate-500">Page Loaded</div>);

const NewBill = getComp(NewBillModule, 'NewBill');
const ActiveBills = getComp(ActiveBillsModule, 'ActiveBills');
const HoldBills = getComp(HoldBillsModule, 'HoldBills');
const OrderHistory = getComp(OrderHistoryModule, 'OrderHistory');
const PaymentHistory = getComp(PaymentHistoryModule, 'PaymentHistory');
const Refunds = getComp(RefundsModule, 'Refunds');
const Receipts = getComp(ReceiptsModule, 'Receipts');
const SalesSummary = getComp(SalesSummaryModule, 'SalesSummary');
const DailyCashReport = getComp(DailyCashReportModule, 'DailyCashReport');
const Customers = getComp(CustomersModule, 'Customers');
const CashierSettings = getComp(CashierSettingsModule, 'CashierSettings');

// Kitchen Pages
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

// Manager Pages
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

// Waiter Pages
import WaiterDashboard from './pages/waiter/Dashboard';
import WaiterTables from './pages/waiter/MyTables';
import WaiterNewOrder from './pages/waiter/NewOrder';
import WaiterOrders from './pages/waiter/Orders';
import WaiterOrderHistory from './pages/waiter/OrderHistory';
import WaiterTablesGrid from './pages/waiter/Tables';
import WaiterReservations from './pages/waiter/Reservations';
import WaiterCustomers from './pages/waiter/Customers';
import WaiterCustomerRequests from './pages/waiter/CustomerRequests';
import WaiterNotifications from './pages/waiter/Notifications';
import WaiterProfile from './pages/waiter/Profile';
import WaiterSettings from './pages/waiter/Settings';

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
                {/* 1. PUBLIC CUSTOMER PORTAL */}
                <Route path="/" element={<CustomerLayout />}>
                  <Route index element={<Home />} />
                  <Route path="menu" element={<BrowseMenu />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="offers" element={<OffersAndDeals />} />
                  <Route path="orders" element={<MyOrders />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="track" element={<TrackOrder />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="address" element={<AddressBook />} />
                  <Route path="help" element={<HelpSupport />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                </Route>

                {/* 2. AUTHENTICATION (Staff & Admin Login) */}
                <Route path="/admin" element={<Login />} />
                <Route path="/login" element={<Navigate to="/admin" replace />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* 3. ADMIN MANAGEMENT ROUTES */}
                <Route path="/admin/panel" element={
                  <ProtectedRoute allowedRoles={['Super Administrator', 'superadmin', 'admin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
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

                {/* 4. CASHIER ROUTES */}
                <Route path="/cashier" element={
                  <ProtectedRoute allowedRoles={['Cashier', 'cashier', 'admin']}>
                    <CashierLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<CashierDashboard />} />
                  <Route path="new-bill" element={<NewBill />} />
                  <Route path="active-bills" element={<ActiveBills />} />
                  <Route path="hold-bills" element={<HoldBills />} />
                  <Route path="order-history" element={<OrderHistory />} />
                  <Route path="payment-history" element={<PaymentHistory />} />
                  <Route path="refunds" element={<Refunds />} />
                  <Route path="receipts" element={<Receipts />} />
                  <Route path="sales-summary" element={<SalesSummary />} />
                  <Route path="daily-cash-report" element={<DailyCashReport />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="settings" element={<CashierSettings />} />
                </Route>

                {/* 5. KITCHEN ROUTES */}
                <Route path="/kitchen" element={
                  <ProtectedRoute allowedRoles={['Kitchen Staff', 'kitchen', 'admin']}>
                    <KitchenLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<KitchenDashboard />} />
                  <Route path="incoming-orders" element={<IncomingOrders />} />
                  <Route path="in-progress" element={<InProgressOrders />} />
                  <Route path="ready-to-serve" element={<ReadyToServe />} />
                  <Route path="completed-orders" element={<CompletedOrders />} />
                  <Route path="ingredients" element={<Ingredients />} />
                  <Route path="stock-alerts" element={<StockAlerts />} />
                  <Route path="reports" element={<KitchenReports />} />
                  <Route path="performance" element={<Performance />} />
                  <Route path="settings" element={<KitchenSettings />} />
                </Route>

                {/* 6. MANAGER ROUTES */}
                <Route path="/manager" element={
                  <ProtectedRoute allowedRoles={['Restaurant Manager', 'manager', 'admin']}>
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

                {/* 7. WAITER ROUTES */}
                <Route path="/waiter" element={
                  <ProtectedRoute allowedRoles={['Waiter', 'waiter', 'admin']}>
                    <WaiterLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<WaiterDashboard />} />
                  <Route path="my-tables" element={<WaiterTables />} />
                  <Route path="new-order" element={<WaiterNewOrder />} />
                  <Route path="orders" element={<WaiterOrders />} />
                  <Route path="order-history" element={<WaiterOrderHistory />} />
                  <Route path="tables" element={<WaiterTablesGrid />} />
                  <Route path="reservations" element={<WaiterReservations />} />
                  <Route path="customers" element={<WaiterCustomers />} />
                  <Route path="customer-requests" element={<WaiterCustomerRequests />} />
                  <Route path="notifications" element={<WaiterNotifications />} />
                  <Route path="profile" element={<WaiterProfile />} />
                  <Route path="settings" element={<WaiterSettings />} />
                </Route>

                {/* Catch-all unknown routes redirect to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </CartProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}