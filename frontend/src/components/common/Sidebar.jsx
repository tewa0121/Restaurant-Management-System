// src/components/common/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ... (keep the menuItems object and Icon component from my previous response here)

export default function Sidebar({ isOpen, setIsOpen, role = 'Super Administrator' }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const currentMenu = menuItems[role] || menuItems['Super Administrator'];
  const brandName = role === 'Kitchen Staff' ? 'Kitchen' 
                  : role === 'Cashier' ? 'Cashier' 
                  : role === 'Waiter' ? 'Waiter' 
                  : role === 'Restaurant Manager' ? 'Manager' 
                  : 'Admin';

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f0a2e] text-white flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-full border border-green-500 flex items-center justify-center text-green-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3a4 4 0 00-4 4v.5A4.5 4.5 0 004.5 12c0 2 1.5 3.5 3.5 4v2h8v-2c2-.5 3.5-2 3.5-4A4.5 4.5 0 0016 7.5V7a4 4 0 00-4-4z" /></svg>
        </div>
        <div>
          <h2 className="font-bold text-lg leading-tight">Resto<span className="text-green-500">{brandName}</span></h2>
          <p className="text-[10px] text-gray-400">Restaurant Management System</p>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {currentMenu.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive 
                  ? 'bg-[#272056] text-white border-l-4 border-green-500' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon name={item.icon} />
                <span>{item.name}</span>
              </div>
              {item.hasArrow && <span className="text-gray-500">›</span>}
            </Link>
          );
        })}
      </div>

      {/* Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <img src={user?.avatar} alt="User" className="w-10 h-10 rounded-full bg-gray-700 border-2 border-green-500 object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-white">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.role}</p>
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-white transition" title="Logout">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}