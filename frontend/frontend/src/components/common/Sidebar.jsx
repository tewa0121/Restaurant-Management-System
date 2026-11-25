import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronRight, LogOut } from 'lucide-react';

export default function Sidebar({
  isOpen,
  brandName,
  brandHighlight,
  brandSubtitle = 'Restaurant Management System',
  brandIcon: BrandIcon,
  navSections,
  user,
  userRole,
  onLogout
}) {
  const navigate = useNavigate();

  return (
    <aside
      className={`${
        isOpen ? 'w-[260px]' : 'w-0 -ml-[260px] md:w-20 md:ml-0'
      } bg-[#0B172A] text-slate-300 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out select-none z-30`}
    >
      <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar">
        {/* Logo Branding */}
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="w-9 h-9 rounded-full border-2 border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold bg-emerald-950/20 shrink-0">
            {BrandIcon && <BrandIcon className="w-5 h-5 text-emerald-400" />}
          </div>
          {isOpen && (
            <div>
              <h2 className="font-extrabold text-white text-lg tracking-tight leading-tight">
                {brandName}<span className="text-[#52C41A]">{brandHighlight}</span>
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">{brandSubtitle}</p>
            </div>
          )}
        </div>

        {/* Nav Sections */}
        <nav className="space-y-4 pt-1">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {section.title && isOpen && (
                <p className="text-[10px] font-bold text-slate-400/70 tracking-wider uppercase px-3 pt-2 pb-1">
                  {section.title}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150
                      ${isActive 
                        ? 'bg-[#52C41A] text-white font-bold shadow-md shadow-emerald-950/40' 
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'}
                    `}
                    title={!isOpen ? item.label : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 shrink-0" />
                          {isOpen && <span>{item.label}</span>}
                        </div>
                        {isOpen && !isActive && <ChevronRight className="w-3.5 h-3.5 opacity-40" />}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}

          {/* Logout Option */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-rose-950/30 hover:text-rose-400 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 shrink-0" />
                {isOpen && <span>Logout</span>}
              </div>
            </button>
          )}
        </nav>
      </div>

      {/* User Card at Bottom */}
      {isOpen && user && (
        <div className="p-4 m-3 rounded-2xl bg-[#070F1E] border border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#070F1E] rounded-full" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 font-medium">{userRole}</p>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}