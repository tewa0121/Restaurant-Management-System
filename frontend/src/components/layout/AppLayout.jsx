import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Home, Utensils, Grid, Tag, ShoppingBag, Heart, Clock, User, BookOpen, HelpCircle,
  Gift, Search, Bell, X, Minus, Plus, Trash2, CreditCard, Banknote, Wallet, ArrowRight,
  CheckCircle2, LayoutDashboard, ChefHat, Receipt, Users, Sun, Moon, UtensilsCrossed,
  Settings as SettingsIcon, Calendar, UserCheck, UserCog, Boxes, Truck, BarChart3,
  History, Store, DollarSign, FileText, AlertTriangle, Menu as MenuIcon, XCircle,
  RefreshCw, ShieldCheck, CheckSquare, RotateCcw, Printer, LogOut,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeLayout from './ThemeLayout';

// ==========================================
// 1. PORTAL CONFIG (roles + paths match App.jsx)
// ==========================================
const PORTALS = {
  admin: {
    // allowedRoles: 'Super Administrator', 'superadmin', 'admin'
    roleName: 'Admin',
    portalTitle: 'Admin Portal',
    subtitle: 'System Overview & Administration',
    brandName: 'RestoAdmin',
    brandIcon: UtensilsCrossed,
    sections: [
      { title: null, items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/panel/dashboard' },
      ]},
      { title: 'MANAGEMENT', items: [
        { label: 'Users & Roles', icon: Users, path: '/admin/panel/users-and-roles' },
        { label: 'Restaurants', icon: Store, path: '/admin/panel/restaurants' },
        { label: 'Menu Management', icon: UtensilsCrossed, path: '/admin/panel/menu-management' },
        { label: 'Table Management', icon: Grid, path: '/admin/panel/table-management' },
        { label: 'Order Management', icon: Receipt, path: '/admin/panel/order-management' },
        { label: 'Reservation Management', icon: Calendar, path: '/admin/panel/reservation-management' },
        { label: 'Customer Management', icon: UserCheck, path: '/admin/panel/customer-management' },
        { label: 'Employee Management', icon: UserCog, path: '/admin/panel/employee-management' },
        { label: 'Inventory Management', icon: Boxes, path: '/admin/panel/inventory-management' },
        { label: 'Supplier Management', icon: Truck, path: '/admin/panel/supplier-management' },
        { label: 'Delivery Management', icon: Truck, path: '/admin/panel/delivery-management' },
        { label: 'Payment Management', icon: DollarSign, path: '/admin/panel/payment-management' },
      ]},
      { title: 'ANALYTICS & REPORTS', items: [
        { label: 'Reports & Analytics', icon: BarChart3, path: '/admin/panel/reports-and-analytics' },
        { label: 'Logs & Activity', icon: History, path: '/admin/panel/logs-and-activity' },
      ]},
      { title: 'OTHER', items: [
        { label: 'Settings', icon: SettingsIcon, path: '/admin/panel/settings' },
      ]},
    ],
  },

  cashier: {
    // allowedRoles: 'Cashier', 'cashier'
    roleName: 'Cashier',
    portalTitle: 'Cashier Portal',
    subtitle: 'POS Billing & Transactions',
    brandName: 'RestoCashier',
    brandIcon: DollarSign,
    sections: [
      { title: null, items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/cashier/dashboard' },
      ]},
      { title: 'BILLING & ORDERS', items: [
        { label: 'New Bill', icon: Plus, path: '/cashier/new-bill' },
        { label: 'Active Bills', icon: FileText, path: '/cashier/active-bills' },
        { label: 'Hold Bills', icon: Clock, path: '/cashier/hold-bills' },
        { label: 'Order History', icon: History, path: '/cashier/order-history' },
      ]},
      { title: 'PAYMENTS', items: [
        { label: 'Payment History', icon: CreditCard, path: '/cashier/payment-history' },
        { label: 'Refunds', icon: RotateCcw, path: '/cashier/refunds' },
        { label: 'Receipts', icon: Printer, path: '/cashier/receipts' },
      ]},
      { title: 'REPORTS', items: [
        { label: 'Sales Summary', icon: BarChart3, path: '/cashier/sales-summary' },
        { label: 'Daily Cash Report', icon: FileText, path: '/cashier/daily-cash-report' },
      ]},
      { title: 'OTHER', items: [
        { label: 'Customers', icon: Users, path: '/cashier/customers' },
        { label: 'Settings', icon: SettingsIcon, path: '/cashier/settings' },
      ]},
    ],
  },

  kitchen: {
    // allowedRoles: 'Kitchen Staff', 'kitchen'
    roleName: 'Kitchen',
    portalTitle: 'Kitchen Portal',
    subtitle: 'Live Kitchen Order Management',
    brandName: 'RestoKitchen',
    brandIcon: ChefHat,
    sections: [
      { title: null, items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/kitchen/dashboard' },
      ]},
      { title: 'KITCHEN OPERATIONS', items: [
        { label: 'Incoming Orders', icon: Calendar, path: '/kitchen/incoming-orders' },
        { label: 'In Progress', icon: Utensils, path: '/kitchen/in-progress' },
        { label: 'Ready to Serve', icon: CheckCircle2, path: '/kitchen/ready-to-serve' },
        { label: 'Completed Orders', icon: CheckSquare, path: '/kitchen/completed-orders' },
      ]},
      { title: 'INVENTORY', items: [
        { label: 'Ingredients', icon: Boxes, path: '/kitchen/ingredients' },
        { label: 'Stock Alerts', icon: AlertTriangle, path: '/kitchen/stock-alerts' },
      ]},
      { title: 'REPORTS', items: [
        { label: 'Kitchen Reports', icon: FileText, path: '/kitchen/reports' },
        { label: 'Performance', icon: BarChart3, path: '/kitchen/performance' },
      ]},
      { title: 'OTHER', items: [
        { label: 'Settings', icon: SettingsIcon, path: '/kitchen/settings' },
      ]},
    ],
  },

  manager: {
    // allowedRoles: 'Restaurant Manager', 'manager'
    roleName: 'Manager',
    portalTitle: 'Manager Portal',
    subtitle: 'Operations & Staff Planning',
    brandName: 'RestoManager',
    brandIcon: UserCheck,
    sections: [
      { title: null, items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/manager/dashboard' },
      ]},
      { title: 'OPERATIONS', items: [
        { label: 'Orders', icon: Receipt, path: '/manager/orders' },
        { label: 'Table Management', icon: Grid, path: '/manager/table-management' },
        { label: 'Inventory Management', icon: Boxes, path: '/manager/inventory-management' },
        { label: 'Reservations', icon: Calendar, path: '/manager/reservations' },
        { label: 'Menu Management', icon: UtensilsCrossed, path: '/manager/menu-management' },
        { label: 'Employees', icon: UserCog, path: '/manager/employees' },
        { label: 'Customers', icon: UserCheck, path: '/manager/customers' },
        { label: 'Suppliers', icon: Truck, path: '/manager/suppliers' },
      ]},
      { title: 'REPORTS', items: [
        { label: 'Reports', icon: FileText, path: '/manager/reports' },
        { label: 'Sales & Revenue', icon: DollarSign, path: '/manager/sales-and-revenue' },
        { label: 'Analytics', icon: BarChart3, path: '/manager/analytics' },
        { label: 'Activity Log', icon: History, path: '/manager/activity-log' },
      ]},
      { title: 'OTHER', items: [
        { label: 'Settings', icon: SettingsIcon, path: '/manager/settings' },
      ]},
    ],
  },

  waiter: {
    // allowedRoles: 'Waiter', 'waiter'
    roleName: 'Waiter',
    portalTitle: 'Waiter Portal',
    subtitle: 'Table Service & Ordering',
    brandName: 'RestoWaiter',
    brandIcon: Utensils,
    sections: [
      { title: null, items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/waiter/dashboard' },
      ]},
      { title: 'ORDER MANAGEMENT', items: [
        { label: 'My Tables', icon: Grid, path: '/waiter/my-tables' },
        { label: 'New Order', icon: Plus, path: '/waiter/new-order' },
        { label: 'Orders', icon: Receipt, path: '/waiter/orders' },
        { label: 'Order History', icon: History, path: '/waiter/order-history' },
      ]},
      { title: 'TABLE MANAGEMENT', items: [
        { label: 'Tables', icon: Grid, path: '/waiter/tables' },
        { label: 'Reservations', icon: Calendar, path: '/waiter/reservations' },
      ]},
      { title: 'CUSTOMER', items: [
        { label: 'Customers', icon: Users, path: '/waiter/customers' },
        { label: 'Customer Requests', icon: Bell, path: '/waiter/customer-requests' },
      ]},
      { title: 'OTHER', items: [
        { label: 'Notifications', icon: Bell, path: '/waiter/notifications' },
        { label: 'My Profile', icon: User, path: '/waiter/profile' },
        { label: 'Settings', icon: SettingsIcon, path: '/waiter/settings' },
      ]},
    ],
  },
};

const CUSTOMER_NAV = [
  { label: 'Home', icon: Home, path: '/customer' },
  { label: 'Browse Menu', icon: Utensils, path: '/customer/menu' },
  { label: 'Categories', icon: Grid, path: '/customer/categories' },
  { label: 'Offers & Deals', icon: Tag, path: '/customer/offers' },
  { label: 'My Orders', icon: ShoppingBag, path: '/customer/orders' },
  { label: 'Favorites', icon: Heart, path: '/customer/favorites' },
  { label: 'Track Order', icon: Clock, path: '/customer/track' },
  { label: 'Profile', icon: User, path: '/customer/profile' },
  { label: 'Address Book', icon: BookOpen, path: '/customer/address' },
  { label: 'Help & Support', icon: HelpCircle, path: '/customer/help' },
];

// Active when exact match, or when on a nested page of the item (but never for bare "/customer")
const isPathActive = (current, itemPath) =>
  current === itemPath || (itemPath !== '/customer' && current.startsWith(itemPath + '/'));

// ==========================================
// 2. RESPONSIVE SIDEBAR WRAPPER
// ==========================================
function ResponsiveSidebar({ isOpen, onClose, children }) {
  return (
    <>
      <aside className="hidden md:flex w-52 min-w-[13rem] max-w-[13rem] bg-white dark:bg-[#0B1426] border-r border-gray-100 dark:border-gray-800 p-4 flex-col justify-start shrink-0 h-screen sticky top-0 z-30 font-sans transition-colors duration-200 overflow-y-auto scrollbar-thin">
        {children}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex items-start font-sans">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
          <div className="relative w-[16rem] bg-white dark:bg-[#0B1426] p-4 flex flex-col h-auto max-h-[85vh] mt-16 ml-3 rounded-2xl shadow-2xl z-10 overflow-y-auto border border-gray-100 dark:border-gray-800 scrollbar-thin">
            <button
              onClick={onClose}
              type="button"
              className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg cursor-pointer z-20 bg-white/80 dark:bg-[#0B1426]/80 backdrop-blur-xs"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <div className="pr-1">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}

// ==========================================
// 3. CUSTOMER SIDEBAR CONTENT
// ==========================================
export function CustomerSidebarContent({ onCloseMobile }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <div className="flex flex-col justify-start h-auto space-y-4">
      <div className="space-y-4">
        <div onClick={() => handleNav('/customer')} className="flex items-center gap-2.5 px-1 cursor-pointer">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shrink-0">
            <Utensils size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-emerald-600 text-base tracking-tight leading-none truncate">RestoDelight</h1>
            <span className="text-[9px] text-gray-400 font-medium truncate block mt-0.5">Good Food, Great Time</span>
          </div>
        </div>

        <nav className="space-y-0.5">
          {CUSTOMER_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = isPathActive(location.pathname, item.path);
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
              >
                <Icon size={15} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-[10px] bg-emerald-50/60 dark:bg-gray-800/80 p-3 rounded-xl border border-emerald-100 dark:border-gray-700 text-center space-y-2 shrink-0">
        <div className="w-8 h-8 bg-white dark:bg-emerald-950 text-emerald-600 rounded-lg flex items-center justify-center mx-auto shadow-2xs">
          <Gift size={16} />
        </div>
        <div>
          <h4 className="font-black text-[11px] text-gray-900 dark:text-white">Get 10% OFF</h4>
          <p className="text-[9px] text-gray-500 dark:text-gray-400">on your first order</p>
        </div>
        <button
          type="button"
          onClick={() => handleNav('/customer/menu')}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 rounded-lg transition-all shadow-xs cursor-pointer"
        >
          Order Now
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 4. STAFF SIDEBAR CONTENT (driven by PORTALS config)
// ==========================================
export function StaffSidebarContent({ role, onCloseMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const portal = PORTALS[role];

  if (!portal) return null;
  const BrandIcon = portal.brandIcon;

  const handleNav = (path) => {
    navigate(path);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogout = async () => {
    try {
      if (auth?.logout) await auth.logout();
    } finally {
      if (onCloseMobile) onCloseMobile();
      navigate('/admin', { replace: true }); // staff login lives at /admin
    }
  };

  return (
    <div className="flex flex-col justify-start h-auto space-y-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2.5 px-1 py-0.5">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shrink-0 shadow-md">
            <BrandIcon size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-gray-900 dark:text-white text-base tracking-tight leading-none truncate">
              {portal.brandName}
            </h1>
            <span className="text-[9px] text-gray-400 font-medium truncate block mt-0.5">
              {portal.roleName} Portal
            </span>
          </div>
        </div>

        <nav className="space-y-0.5">
          {portal.sections.map((section, idx) => (
            <div key={idx} className="space-y-2 mt-3">
              {section.title && (
                <h3 className="text-[9px] font-black text-gray-400 dark:text-slate-400 tracking-wider px-2 mb-1 uppercase">
                  {section.title}
                </h3>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isPathActive(location.pathname, item.path);
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => handleNav(item.path)}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon size={15} className="shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="text-[10px] opacity-60">›</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout (every staff portal) */}
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
            >
              <LogOut size={15} className="shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

// ==========================================
// 4B. NOTIFICATIONS (per portal / page)
// ==========================================
const NOTIFICATIONS_BY_ROLE = {
  customer: [
    { id: 1, title: 'Order on the way', text: 'Your order #1042 is out for delivery.', time: '2m ago', path: '/customer/track' },
    { id: 2, title: 'New offer', text: 'Get 10% off on all pizzas today.', time: '1h ago', path: '/customer/offers' },
    { id: 3, title: 'Order delivered', text: 'Order #1038 was delivered. Enjoy!', time: 'Yesterday', path: '/customer/orders' },
  ],
  admin: [
    { id: 1, title: 'New order', text: 'A new order was placed.', time: '1m ago', path: '/admin/panel/order-management' },
    { id: 2, title: 'Low stock', text: 'Tomatoes are running low.', time: '20m ago', path: '/admin/panel/inventory-management' },
    { id: 3, title: 'New reservation', text: 'Table for 4 booked for 7:30 PM.', time: '1h ago', path: '/admin/panel/reservation-management' },
  ],
  cashier: [
    { id: 1, title: 'Bill ready', text: 'Table 5 is waiting for payment.', time: '1m ago', path: '/cashier/active-bills' },
    { id: 2, title: 'Refund request', text: 'A refund request needs approval.', time: '30m ago', path: '/cashier/refunds' },
  ],
  kitchen: [
    { id: 1, title: 'Incoming order', text: 'New order #1043 received.', time: 'Just now', path: '/kitchen/incoming-orders' },
    { id: 2, title: 'Stock alert', text: 'Cheese is below minimum level.', time: '15m ago', path: '/kitchen/stock-alerts' },
  ],
  manager: [
    { id: 1, title: 'Daily report', text: 'Yesterday\'s sales report is ready.', time: '1h ago', path: '/manager/reports' },
    { id: 2, title: 'Inventory', text: '3 items need restocking.', time: '2h ago', path: '/manager/inventory-management' },
  ],
  waiter: [
    { id: 1, title: 'Customer request', text: 'Table 3 is asking for the bill.', time: '1m ago', path: '/waiter/customer-requests' },
    { id: 2, title: 'Order ready', text: 'Order for Table 7 is ready to serve.', time: '5m ago', path: '/waiter/orders' },
  ],
};

export function NotificationBell({ role = 'customer' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(() =>
    (NOTIFICATIONS_BY_ROLE[role] || []).map((n) => ({ ...n, read: false }))
  );

  const unread = items.filter((n) => !n.read).length;

  // Close on page change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (wrapRef.current && wrapRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', handleOutside, true);
    return () => document.removeEventListener('pointerdown', handleOutside, true);
  }, [open]);

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const removeItem = (id) => setItems((prev) => prev.filter((n) => n.id !== id));

  const handleItemClick = (n) => {
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    setOpen(false);
    if (n.path) navigate(n.path);
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed top-[66px] right-[3px] z-50 w-72 max-w-[calc(100vw-6px)] bg-white dark:bg-[#0B1426] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl overflow-hidden font-sans">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100 dark:border-gray-800">
            <h4 className="font-extrabold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
              <Bell size={13} className="text-emerald-600" /> Notifications
              {unread > 0 && (
                <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{unread}</span>
              )}
            </h4>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button type="button" onClick={markAllRead} className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer">
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/60 scrollbar-thin">
            {items.length === 0 ? (
              <p className="text-[11px] text-gray-400 py-6 text-center">No notifications.</p>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/60 ${
                    n.read ? '' : 'bg-emerald-50/60 dark:bg-emerald-950/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleItemClick(n)}
                    className="flex-1 min-w-0 text-left px-3 py-2.5 flex items-start gap-2 cursor-pointer"
                  >
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${n.read ? 'bg-transparent' : 'bg-emerald-600'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[11px] text-gray-900 dark:text-white truncate">{n.title}</span>
                        <span className="text-[9px] text-gray-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-snug">{n.text}</p>
                    </div>
                  </button>

                  {n.read && (
                    <button
                      type="button"
                      onClick={() => removeItem(n.id)}
                      aria-label="Dismiss notification"
                      className="mt-2 mr-2 p-1 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer shrink-0"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. CUSTOMER HEADER
// ==========================================
export function CustomerHeader({ onOpenCart, onOpenMobileMenu }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { cart } = useCart();
  const { user } = useAuth();

  const totalItemsCount = cart ? cart.reduce((sum, item) => sum + item.qty, 0) : 0;

  return (
    <header className="h-16 bg-white dark:bg-[#0B1426] border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 font-sans">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          type="button"
          className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
          aria-label="Open sidebar"
        >
          <MenuIcon size={20} />
        </button>
        <div className="relative hidden sm:block w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search food, drinks..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-600 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          type="button"
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <NotificationBell role="customer" />

        <button
          onClick={onOpenCart}
          data-cart-toggle
          type="button"
          className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
        >
          <ShoppingBag size={18} />
          {totalItemsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {totalItemsCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {user?.name ? user.name[0].toUpperCase() : 'C'}
          </div>
          <span className="hidden sm:inline text-xs font-bold text-gray-800 dark:text-gray-200">
            {user?.name || 'Customer'}
          </span>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// 6. PORTAL HEADER
// ==========================================
export function PortalHeader({ title, subtitle, roleName, onOpenMobileMenu }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-[#0B1426] border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20 font-sans">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          type="button"
          className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
          aria-label="Open sidebar"
        >
          <MenuIcon size={20} />
        </button>
        <div>
          <h2 className="font-extrabold text-sm text-gray-900 dark:text-white uppercase tracking-wider leading-none">
            {title}
          </h2>
          <span className="text-[10px] text-gray-400 font-medium leading-none block mt-1">{subtitle}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          type="button"
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <NotificationBell role={(roleName || '').toLowerCase()} />

        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {user?.name ? user.name[0].toUpperCase() : roleName ? roleName[0].toUpperCase() : 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block leading-tight">
              {user?.name || 'System User'}
            </span>
            <span className="text-[9px] text-emerald-600 font-extrabold uppercase block leading-tight">
              {roleName}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// 7. CUSTOMER CART PANEL
// ==========================================
export function CustomerCartPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, subtotal, totalAmount, clearCart } = useCart();
  const { isAuthenticated, user, login, register, users = [] } = useAuth();

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [authMode, setAuthMode] = useState('login');
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isLoyaltyApplied, setIsLoyaltyApplied] = useState(false);
  const [authForm, setAuthForm] = useState({ fullName: '', email: '', phone: '' });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalItemsCount = cart ? cart.reduce((sum, item) => sum + item.qty, 0) : 0;

  const getUserOrderCount = () => {
    try {
      const allOrders = JSON.parse(localStorage.getItem('resto_orders') || '[]');
      const activeUserEmail = user?.email || authForm.email;
      if (activeUserEmail) {
        return allOrders.filter((o) => o.customerEmail?.toLowerCase() === activeUserEmail.toLowerCase()).length;
      }
      return user?.orderCount || 0;
    } catch {
      return 0;
    }
  };

  const pastOrdersCount = getUserOrderCount();
  const REQUIRED_ORDERS = 10;
  const isEligibleForLoyalty = pastOrdersCount >= REQUIRED_ORDERS;
  const discountAmount = isEligibleForLoyalty && isLoyaltyApplied ? subtotal * 0.1 : 0;
  const finalPayableAmount = Math.max(0, totalAmount - discountAmount);

  const location = useLocation();
  const panelRef = useRef(null);

  // Collapse when the page changes
  useEffect(() => {
    if (isOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Collapse when clicking anywhere outside the cart (sidebar, main, etc.)
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e) => {
      if (panelRef.current && panelRef.current.contains(e.target)) return;
      if (e.target.closest && e.target.closest('[data-cart-toggle]')) return;
      onClose();
    };
    document.addEventListener('pointerdown', handleOutside, true);
    return () => document.removeEventListener('pointerdown', handleOutside, true);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
    if (formError) setFormError('');
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\s-]{8,15}$/;

    if (!emailRegex.test(authForm.email.trim())) {
      setFormError('Please enter a valid email address.');
      return false;
    }
    if (!phoneRegex.test(authForm.phone.trim())) {
      setFormError('Please enter a valid phone number.');
      return false;
    }
    if (authMode === 'signup' && !authForm.fullName.trim()) {
      setFormError('Full name is required for registration.');
      return false;
    }
    return true;
  };

  const handlePayClick = () => {
    if (!selectedPayment || cart.length === 0) return;
    if (!isAuthenticated) setCheckoutStep('auth');
    else setShowConfirmPopup(true);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFormError('');

    try {
      const emailInput = authForm.email.trim().toLowerCase();
      const existingUser = users.find((u) => u.email?.toLowerCase() === emailInput);

      if (authMode === 'login') {
        if (!existingUser) {
          setFormError('Account not found! Please click "New customer? Sign up here".');
          setIsSubmitting(false);
          return;
        }
        if (login) await login({ email: authForm.email, phone: authForm.phone });
      } else {
        if (existingUser) {
          setFormError('Account already exists with this email. Please login instead.');
          setIsSubmitting(false);
          return;
        }
        if (register) await register(authForm);
      }

      setCheckoutStep('cart');
      setShowConfirmPopup(true);
    } catch (err) {
      setFormError('Authentication failed. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const executePayment = (shouldSucceed = true) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmPopup(false);
      if (shouldSucceed) {
        setCheckoutStep('success');
        if (clearCart) clearCart();
      } else {
        setCheckoutStep('failed');
      }
    }, 800);
  };

  const handleResetAndClose = () => {
    setCheckoutStep('cart');
    setShowConfirmPopup(false);
    setFormError('');
    setIsLoyaltyApplied(false);
    onClose();
  };

  const handleGoToOrders = () => {
    setCheckoutStep('cart');
    setShowConfirmPopup(false);
    setIsLoyaltyApplied(false);
    onClose();
    navigate('/customer/orders');
  };

  const inputCls =
    'w-full px-2 py-1 text-[9px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-gray-900 dark:text-white focus:outline-none focus:border-emerald-600';

  return (
    <div className="fixed top-[66px] right-[3px] z-50 font-sans pointer-events-auto">
      <div
        ref={panelRef}
        style={{ width: '200px' }}
        className="bg-emerald-50 dark:bg-[#0B1426] border border-emerald-200 dark:border-gray-800 rounded-2xl shadow-2xl p-2.5 flex flex-col justify-start max-h-[85vh] overflow-y-auto transition-all shrink-0 scrollbar-thin relative"
      >
        {showConfirmPopup && (
          <div className="absolute inset-0 bg-emerald-50 dark:bg-[#0B1426] z-30 p-2.5 flex flex-col justify-between rounded-2xl">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-gray-800">
                <h4 className="font-extrabold text-[10px] text-gray-900 dark:text-white flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-600" /> Confirm Order
                </h4>
                <button type="button" onClick={() => setShowConfirmPopup(false)} className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                  <X size={13} />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/60 p-2 rounded-lg space-y-1 text-[8px]">
                <div className="flex justify-between text-gray-500">
                  <span>Customer:</span>
                  <span className="font-bold text-gray-900 dark:text-white truncate max-w-[90px]">{user?.name || authForm.fullName || 'Verified'}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Payment:</span>
                  <span className="font-bold capitalize text-gray-900 dark:text-white">{selectedPayment}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-700 font-extrabold text-[9px] text-gray-900 dark:text-white">
                  <span>Total:</span>
                  <span className="text-emerald-600">${finalPayableAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <button
                type="button"
                onClick={() => executePayment(true)}
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
              </button>
              <button
                type="button"
                onClick={() => executePayment(false)}
                className="w-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 font-bold text-[8px] py-1 rounded-lg transition-all cursor-pointer"
              >
                Test Payment Failure
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 'cart' && (
          <>
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <h3 className="font-extrabold text-[10px] flex items-center gap-1 text-gray-900 dark:text-white truncate">
                <ShoppingBag size={13} className="text-emerald-600 shrink-0" />
                <span>MY CART</span>
                <span className="bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                  {totalItemsCount}
                </span>
              </h3>
              <button type="button" onClick={handleResetAndClose} className="p-0.5 rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer shrink-0">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/60 pr-0.5 mt-2 shrink-0">
              {cart.length === 0 ? (
                <p className="text-[10px] text-gray-400 py-3 text-center">Cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="pt-2 flex items-center gap-1.5 min-w-0">
                    <img
                      src={item.image || '/assets/food-placeholders/food-burger.png'}
                      alt={item.name}
                      className="w-7 h-7 rounded-md object-cover shrink-0 bg-gray-50"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-[9px] truncate text-gray-900 dark:text-white leading-tight">{item.name}</h5>
                      <span className="font-black text-[9px] text-emerald-600 block">${(item.price * item.qty).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center gap-0.5 bg-gray-50 dark:bg-gray-800 p-0.5 rounded shrink-0">
                      <button type="button" onClick={() => updateQuantity(item.id, item.qty - 1)} className="p-0.5 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                        <Minus size={8} />
                      </button>
                      <span className="text-[8px] font-bold px-0.5 text-gray-900 dark:text-white">{item.qty}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.qty + 1)} className="p-0.5 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                        <Plus size={8} />
                      </button>
                    </div>

                    <button type="button" onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-rose-500 p-0.5 shrink-0">
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <button
                type="button"
                disabled={!isEligibleForLoyalty}
                onClick={() => setIsLoyaltyApplied(!isLoyaltyApplied)}
                className={`w-full p-1.5 rounded-lg border text-[8px] font-bold transition-all flex items-center justify-between gap-1 ${
                  isEligibleForLoyalty
                    ? isLoyaltyApplied
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs cursor-pointer'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 cursor-pointer'
                    : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-800 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-1 min-w-0">
                  <Gift size={11} className="shrink-0" />
                  <span className="truncate">
                    {isEligibleForLoyalty
                      ? isLoyaltyApplied ? '10% Discount Applied!' : 'Apply 10% Loyalty Off'
                      : '10-Day Loyalty Off'}
                  </span>
                </div>
                <span className="text-[7px] font-black shrink-0 px-1 py-0.5 rounded bg-black/10 dark:bg-white/10">
                  {pastOrdersCount}/{REQUIRED_ORDERS} Orders
                </span>
              </button>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-800 mt-2 shrink-0">
              <label className="text-[8px] font-extrabold uppercase tracking-wider block text-gray-400">Payment Method</label>
              <div className="grid grid-cols-3 gap-1">
                {['card', 'cash', 'wallet'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedPayment(type)}
                    className={`p-1 rounded border text-[8px] font-bold flex flex-col items-center gap-0.5 capitalize transition-all cursor-pointer ${
                      selectedPayment === type
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 ring-1 ring-emerald-600/30'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {type === 'card' && <CreditCard size={11} />}
                    {type === 'cash' && <Banknote size={11} />}
                    {type === 'wallet' && <Wallet size={11} />}
                    <span className="text-[8px]">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-[10px] pt-2 border-t border-gray-100 dark:border-gray-800 space-y-2 shrink-0">
              <div className="space-y-0.5 text-[10px]">
                <div className="flex justify-between text-gray-500 text-[9px]">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 text-[9px] font-bold">
                    <span>Loyalty 10% Off</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] font-black pt-1 border-t border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white">
                  <span>Total</span>
                  <span className="text-emerald-600">${finalPayableAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayClick}
                disabled={!selectedPayment || cart.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white font-bold text-[9px] py-2 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all"
              >
                <span className="truncate">
                  {!selectedPayment ? 'Select Payment' : `Pay $${finalPayableAmount.toFixed(2)}`}
                </span>
                <ArrowRight size={10} className="shrink-0" />
              </button>
            </div>
          </>
        )}

        {checkoutStep === 'auth' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-gray-100 dark:border-gray-800">
              <h4 className="font-extrabold text-[10px] text-gray-900 dark:text-white">
                {authMode === 'login' ? 'Customer Login' : 'Create Account'}
              </h4>
              <button type="button" onClick={() => setCheckoutStep('cart')} className="p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={13} />
              </button>
            </div>

            {formError && (
              <p className="text-[8px] text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-1 rounded font-bold border border-rose-200 dark:border-rose-900 leading-tight">
                {formError}
              </p>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-1.5">
              {authMode === 'signup' && (
                <div>
                  <label className="text-[8px] font-bold text-gray-500 dark:text-gray-400 block mb-0.5">Full Name</label>
                  <input type="text" name="fullName" value={authForm.fullName} onChange={handleInputChange} placeholder="John Doe" className={inputCls} />
                </div>
              )}
              <div>
                <label className="text-[8px] font-bold text-gray-500 dark:text-gray-400 block mb-0.5">Email Address</label>
                <input type="email" name="email" value={authForm.email} onChange={handleInputChange} placeholder="name@example.com" className={inputCls} />
              </div>
              <div>
                <label className="text-[8px] font-bold text-gray-500 dark:text-gray-400 block mb-0.5">Phone Number</label>
                <input type="tel" name="phone" value={authForm.phone} onChange={handleInputChange} placeholder="+1 234 567 890" className={inputCls} />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] py-1.5 rounded-lg transition-all cursor-pointer mt-1 disabled:opacity-50"
              >
                {isSubmitting ? 'Verifying...' : authMode === 'login' ? 'Login & Continue' : 'Sign Up & Continue'}
              </button>
            </form>

            <div className="text-center pt-1 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setFormError(''); }}
                className="text-[8px] text-emerald-600 hover:underline font-bold"
              >
                {authMode === 'login' ? 'New customer? Sign up here' : 'Already have an account? Login'}
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 'success' && (
          <div className="text-center py-2 space-y-3">
            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h4 className="font-black text-[11px] text-gray-900 dark:text-white">Payment Successful!</h4>
              <p className="text-[8px] text-gray-500 dark:text-gray-400 mt-0.5">Your order has been placed and sent to the kitchen.</p>
            </div>
            <div className="space-y-1.5 pt-1">
              <button type="button" onClick={handleGoToOrders} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] py-1.5 rounded-lg transition-all cursor-pointer">
                View Orders
              </button>
              <button type="button" onClick={handleResetAndClose} className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-[8px] py-1 rounded-lg transition-all cursor-pointer">
                Close
              </button>
            </div>
          </div>
        )}

        {checkoutStep === 'failed' && (
          <div className="text-center py-2 space-y-3">
            <div className="w-8 h-8 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <XCircle size={18} />
            </div>
            <div>
              <h4 className="font-black text-[11px] text-gray-900 dark:text-white">Payment Failed</h4>
              <p className="text-[8px] text-gray-500 dark:text-gray-400 mt-0.5">The transaction was declined.</p>
            </div>
            <div className="space-y-1.5 pt-1">
              <button type="button" onClick={() => setCheckoutStep('cart')} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1">
                <RefreshCw size={10} />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 8. CUSTOMER LAYOUT
// ==========================================
export function CustomerLayout({ children, context }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ThemeLayout>
      <div className="flex flex-row h-screen w-full overflow-hidden relative">
        <ResponsiveSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          <CustomerSidebarContent
            onCloseMobile={() => {
              setIsMobileMenuOpen(false);
              setIsCartOpen(false);
            }}
          />
        </ResponsiveSidebar>

        <div className="flex-1 flex flex-col min-w-0 h-screen relative overflow-hidden">
          <CustomerHeader
            onOpenCart={() => setIsCartOpen((v) => !v)}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-[#070D19] relative pointer-events-auto">
            {children || <Outlet context={{ ...context, isCartOpen, setIsCartOpen }} />}
            <CustomerCartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          </main>
        </div>
      </div>
    </ThemeLayout>
  );
}

// ==========================================
// 9. SHARED STAFF PORTAL LAYOUT
// ==========================================
function StaffPortalLayout({ role, children, context }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const portal = PORTALS[role];

  return (
    <ThemeLayout>
      <div className="flex flex-row h-screen w-full overflow-hidden relative bg-gray-50 dark:bg-[#070D19] font-sans">
        <ResponsiveSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          <StaffSidebarContent role={role} onCloseMobile={() => setIsMobileMenuOpen(false)} />
        </ResponsiveSidebar>

        <div className="flex-1 flex flex-col min-w-0 h-screen relative overflow-hidden">
          <PortalHeader
            title={portal.portalTitle}
            subtitle={portal.subtitle}
            roleName={portal.roleName}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />
          <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50 dark:bg-[#070D19] text-gray-900 dark:text-slate-100">
            {children || <Outlet context={context} />}
          </main>
        </div>
      </div>
    </ThemeLayout>
  );
}

// ==========================================
// 10. STAFF LAYOUTS (names used by App.jsx)
// ==========================================
export const AdminLayout = (props) => <StaffPortalLayout role="admin" {...props} />;
export const CashierLayout = (props) => <StaffPortalLayout role="cashier" {...props} />;
export const KitchenLayout = (props) => <StaffPortalLayout role="kitchen" {...props} />;
export const ManagerLayout = (props) => <StaffPortalLayout role="manager" {...props} />;
export const WaiterLayout = (props) => <StaffPortalLayout role="waiter" {...props} />;