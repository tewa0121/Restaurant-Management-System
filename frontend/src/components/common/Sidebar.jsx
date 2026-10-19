// frontend/src/components/common/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Utensils, Table, ShoppingBag, Calendar, 
  Package, CreditCard, BarChart3, Settings, LogOut, ChefHat, 
  ClipboardList, Bell
} from 'lucide-react';

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role || 'Restaurant Manager';

  // Define menus based on your UI designs
  const menus = {
    'Super Administrator': [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
      { name: 'Users & Roles', icon: Users, path: '/admin/users' },
      { name: 'Restaurants', icon: Utensils, path: '/admin/restaurants' },
      { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ],
    'Restaurant Manager': [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/manager/dashboard' },
      { name: 'Orders', icon: ShoppingBag, path: '/manager/orders' },
      { name: 'Table Management', icon: Table, path: '/manager/tables' },
      { name: 'Menu Management', icon: Utensils, path: '/manager/menu' },
      { name: 'Inventory', icon: Package, path: '/manager/inventory' },
      { name: 'Employees', icon: Users, path: '/manager/employees' },
      { name: 'Reports', icon: BarChart3, path: '/manager/reports' },
    ],
    'Waiter': [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/waiter/dashboard' },
      { name: 'My Tables', icon: Table, path: '/waiter/tables' },
      { name: 'Orders', icon: ClipboardList, path: '/waiter/orders' },
      { name: 'Customer Requests', icon: Bell, path: '/waiter/requests' },
    ],
    'Cashier': [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/cashier/dashboard' },
      { name: 'Active Bills', icon: ClipboardList, path: '/cashier/bills' },
      { name: 'Payment History', icon: CreditCard, path: '/cashier/history' },
    ],
    'Kitchen Staff': [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/kitchen/dashboard' },
      { name: 'Incoming Orders', icon: ClipboardList, path: '/kitchen/incoming' },
      { name: 'In Progress', icon: ChefHat, path: '/kitchen/progress' },
    ],
  };

  const currentMenu = menus[role] || menus['Restaurant Manager'];

  return (
    <aside className="w-64 bg-[#0B1220] min-h-screen flex flex-col text-gray-300">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <div className="bg-green-500 p-1.5 rounded-lg">
            <ChefHat size={20} className="text-white" />
          </div>
          RestoAdmin
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {currentMenu.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-6 py-2.5 transition-colors ${
                    isActive 
                      ? 'bg-green-600 text-white border-r-4 border-white' 
                      : 'hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800">
        <button 
          onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          className="flex items-center gap-3 px-6 py-2 w-full text-left text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors rounded-lg"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}