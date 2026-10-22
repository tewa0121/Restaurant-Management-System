import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  // Common & Dashboard Icons
  LayoutDashboard,
  PlusCircle,
  FileText,
  PauseCircle,
  History,
  CreditCard,
  RotateCcw,
  Receipt,
  TrendingUp,
  Lock,
  Users,
  Settings,
  LogOut,
  
  // Waiter & Operations Icons
  Utensils,
  Calendar,
  Bell,
  UserCheck,
  User,
  
  // Kitchen & Inventory Icons
  ChefHat,
  Clock,
  CheckCircle2,
  ShoppingBag,
  
  // Manager & Admin Analytics Icons
  BarChart3,
  PieChart,
  Store,
  ShieldCheck,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // ---------------------------------------------------------------------------
  // 1. ROUTE & ROLE DETECTION
  // ---------------------------------------------------------------------------
  const isCashier = path.startsWith('/cashier');
  const isWaiter = path.startsWith('/waiter');
  const isKitchen = path.startsWith('/kitchen');
  const isManager = path.startsWith('/manager');
  const isAdmin = path.startsWith('/admin');
  const isCustomer = path.startsWith('/customer');

  // Dynamic Profile and Brand Branding Configuration based on Role
  const roleConfig = {
    brandName: isCashier
      ? 'RestoCashier'
      : isWaiter
      ? 'RestoWaiter'
      : isKitchen
      ? 'RestoKitchen'
      : isManager
      ? 'RestoManager'
      : isAdmin
      ? 'RestoAdmin'
      : isCustomer
      ? 'RestoGourmet'
      : 'RestoApp',
    userName: isCashier
      ? 'Michael Cashier'
      : isWaiter
      ? 'Sarah Waiter'
      : isKitchen
      ? 'Chef Alex'
      : isManager
      ? 'David Manager'
      : isAdmin
      ? 'Super Admin'
      : 'Guest Customer',
    userRole: isCashier
      ? 'Cashier • Counter'
      : isWaiter
      ? 'Waiter • Dining Floor'
      : isKitchen
      ? 'Head Chef • KDS'
      : isManager
      ? 'Restaurant Manager'
      : isAdmin
      ? 'System Administrator'
      : 'Loyalty Member',
    avatarInitials: isCashier
      ? 'MC'
      : isWaiter
      ? 'SW'
      : isKitchen
      ? 'CA'
      : isManager
      ? 'DM'
      : isAdmin
      ? 'SA'
      : 'GC'
  };

  // ---------------------------------------------------------------------------
  // 2. ROLE-SPECIFIC NAVIGATION CONFIGURATIONS
  // ---------------------------------------------------------------------------

  // CASHIER DASHBOARD NAVIGATION (12 Sub-pages)
  const cashierNav = [
    {
      section: 'BILLING & ORDERS',
      items: [
        { label: 'Dashboard', path: '/cashier/dashboard', icon: LayoutDashboard },
        { label: 'New Bill', path: '/cashier/new-bill', icon: PlusCircle },
        { label: 'Active Bills', path: '/cashier/active-bills', icon: FileText },
        { label: 'Hold Bills', path: '/cashier/hold-bills', icon: PauseCircle },
        { label: 'Order History', path: '/cashier/order-history', icon: History }
      ]
    },
    {
      section: 'PAYMENTS',
      items: [
        { label: 'Payment History', path: '/cashier/payment-history', icon: CreditCard },
        { label: 'Refunds', path: '/cashier/refunds', icon: RotateCcw },
        { label: 'Receipts', path: '/cashier/receipts', icon: Receipt }
      ]
    },
    {
      section: 'REPORTS',
      items: [
        { label: 'Sales Summary', path: '/cashier/sales-summary', icon: TrendingUp },
        { label: 'Daily Cash Report', path: '/cashier/daily-cash-report', icon: Lock }
      ]
    },
    {
      section: 'OTHER',
      items: [
        { label: 'Customers', path: '/cashier/customers', icon: Users },
        { label: 'Settings', path: '/cashier/settings', icon: Settings }
      ]
    }
  ];

  // WAITER DASHBOARD NAVIGATION
  const waiterNav = [
    {
      section: 'FLOOR MANAGEMENT',
      items: [
        { label: 'Dashboard', path: '/waiter/dashboard', icon: LayoutDashboard },
        { label: 'My Tables', path: '/waiter/tables', icon: Utensils },
        { label: 'New Order', path: '/waiter/new-order', icon: PlusCircle },
        { label: 'Active Orders', path: '/waiter/orders', icon: FileText },
        { label: 'Reservations', path: '/waiter/reservations', icon: Calendar },
        { label: 'Customer Requests', path: '/waiter/requests', icon: UserCheck }
      ]
    },
    {
      section: 'PERSONAL',
      items: [
        { label: 'Customers', path: '/waiter/customers', icon: Users },
        { label: 'Notifications', path: '/waiter/notifications', icon: Bell },
        { label: 'My Profile', path: '/waiter/profile', icon: User }
      ]
    }
  ];

  // KITCHEN DISPLAY SYSTEM (KDS) NAVIGATION
  const kitchenNav = [
    {
      section: 'KITCHEN DISPLAY (KDS)',
      items: [
        { label: 'Live Tickets', path: '/kitchen/dashboard', icon: ChefHat },
        { label: 'Preparing Orders', path: '/kitchen/preparing', icon: Clock },
        { label: 'Ready for Pickup', path: '/kitchen/ready', icon: CheckCircle2 }
      ]
    },
    {
      section: 'STOCK MANAGEMENT',
      items: [
        { label: 'Ingredient Stock', path: '/kitchen/inventory', icon: Package },
        { label: 'Kitchen Settings', path: '/kitchen/settings', icon: Settings }
      ]
    }
  ];

  // MANAGER DASHBOARD NAVIGATION
  const managerNav = [
    {
      section: 'OVERVIEW & ANALYTICS',
      items: [
        { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
        { label: 'Sales Analytics', path: '/manager/analytics', icon: BarChart3 },
        { label: 'Revenue Reports', path: '/manager/revenue', icon: PieChart }
      ]
    },
    {
      section: 'OPERATIONS',
      items: [
        { label: 'Staff Management', path: '/manager/staff', icon: Users },
        { label: 'Menu Engineering', path: '/manager/menu', icon: Utensils },
        { label: 'Inventory & Supplies', path: '/manager/inventory', icon: Store },
        { label: 'Table Layouts', path: '/manager/tables', icon: Layers }
      ]
    },
    {
      section: 'SETTINGS',
      items: [
        { label: 'Restaurant Settings', path: '/manager/settings', icon: Settings }
      ]
    }
  ];

  // SUPER ADMIN DASHBOARD NAVIGATION
  const adminNav = [
    {
      section: 'SYSTEM MANAGEMENT',
      items: [
        { label: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Multi-Branch Stores', path: '/admin/branches', icon: Store },
        { label: 'User Roles & Access', path: '/admin/users', icon: ShieldCheck },
        { label: 'System Logs', path: '/admin/logs', icon: History }
      ]
    },
    {
      section: 'CONFIGURATIONS',
      items: [
        { label: 'Global Settings', path: '/admin/settings', icon: Settings }
      ]
    }
  ];

  // CUSTOMER PORTAL NAVIGATION
  const customerNav = [
    {
      section: 'ONLINE ORDERING',
      items: [
        { label: 'Explore Menu', path: '/customer/menu', icon: Utensils },
        { label: 'My Cart & Checkout', path: '/customer/cart', icon: ShoppingBag },
        { label: 'Order Tracking', path: '/customer/orders', icon: Clock },
        { label: 'Loyalty Rewards', path: '/customer/rewards', icon: Sparkles }
      ]
    }
  ];

  // Dynamic Navigation Selector based on Active Route
  const navGroups = isCashier
    ? cashierNav
    : isWaiter
    ? waiterNav
    : isKitchen
    ? kitchenNav
    : isManager
    ? managerNav
    : isAdmin
    ? adminNav
    : isCustomer
    ? customerNav
    : cashierNav; // Fallback default to Cashier

  // ---------------------------------------------------------------------------
  // 3. RENDERED SIDEBAR TEMPLATE
  // ---------------------------------------------------------------------------
  return (
    <aside className="w-64 bg-[#0B1426] text-gray-300 min-h-screen flex flex-col justify-between p-4 shrink-0 select-none font-sans border-r border-gray-800">
      <div>
        
        {/* BRAND LOGO & SYSTEM TITLE */}
        <div className="flex items-center gap-3 px-2 py-3 mb-6 border-b border-gray-800/80">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black shadow-xs shrink-0">
            <Utensils size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-white text-base tracking-tight truncate">
              {roleConfig.brandName}
            </h1>
            <p className="text-[10px] text-gray-400 font-medium truncate">
              Restaurant Management System
            </p>
          </div>
        </div>

        {/* NAVIGATION SECTIONS */}
        <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-210px)] pr-1 custom-scrollbar">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {group.section && (
                <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase px-3 block mb-2">
                  {group.section}
                </span>
              )}
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = path === item.path;

                return (
                  <NavLink
                    key={itemIdx}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-white' : 'text-gray-400'} />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </div>

      </div>

      {/* USER FOOTER CARD & LOGOUT */}
      <div className="pt-4 border-t border-gray-800/80 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
            {roleConfig.avatarInitials}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">
              {roleConfig.userName}
            </h4>
            <span className="text-[10px] text-gray-400 block truncate">
              {roleConfig.userRole}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}