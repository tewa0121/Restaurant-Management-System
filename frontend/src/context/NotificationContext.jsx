import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);

    if (duration) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Global Toast Container */}
      <aside aria-label="Notifications" className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-xl border text-xs font-bold transition-all animate-bounce-short backdrop-blur-md ${
              n.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-700'
                : n.type === 'error'
                ? 'bg-rose-900/90 text-white border-rose-700'
                : n.type === 'warning'
                ? 'bg-amber-900/90 text-white border-amber-700'
                : 'bg-slate-900/90 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {n.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
              {n.type === 'error' && <AlertCircle size={16} className="text-rose-400 shrink-0" />}
              {n.type === 'warning' && <AlertTriangle size={16} className="text-amber-400 shrink-0" />}
              {n.type === 'info' && <Info size={16} className="text-sky-400 shrink-0" />}
              <span className="truncate">{n.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeNotification(n.id)}
              className="p-1 text-white/70 hover:text-white rounded-lg cursor-pointer shrink-0 ml-2"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </aside>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);