import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const NotificationContext = createContext({
  showNotification: () => {},
  removeNotification: () => {},
  clearNotifications: () => {},
});

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const timersRef = useRef(new Map());

  const removeNotification = useCallback((id) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setNotifications([]);
  }, []);

  const showNotification = useCallback(
    (message, type = 'success', duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setNotifications((prev) => [...prev, { id, message, type }]);

      if (duration && duration > 0) {
        const timer = setTimeout(() => {
          removeNotification(id);
        }, duration);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [removeNotification]
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, showNotification, removeNotification, clearNotifications }}
    >
      {children}
      <aside
        aria-label="Notifications"
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            role={n.type === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-xl border text-xs font-bold transition-all backdrop-blur-md ${
              n.type === 'success'
                ? 'bg-emerald-900/95 text-white border-emerald-700'
                : n.type === 'error'
                ? 'bg-rose-900/95 text-white border-rose-700'
                : n.type === 'warning'
                ? 'bg-amber-900/95 text-white border-amber-700'
                : 'bg-slate-900/95 text-white border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {n.type === 'success' && (
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              )}
              {n.type === 'error' && (
                <AlertCircle size={16} className="text-rose-400 shrink-0" />
              )}
              {n.type === 'warning' && (
                <AlertTriangle size={16} className="text-amber-400 shrink-0" />
              )}
              {n.type === 'info' && <Info size={16} className="text-sky-400 shrink-0" />}
              <span className="break-words line-clamp-3">{n.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeNotification(n.id)}
              aria-label="Dismiss"
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