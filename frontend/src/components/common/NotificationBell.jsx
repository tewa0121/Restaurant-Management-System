import React, { useCallback, useEffect, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notificationService, { isNotificationRead } from '../../services/notificationService';

export default function NotificationBell({ notificationsPath = '/notifications' }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadNotifications = useCallback(async () => {
    try {
      const list = await notificationService.getNotifications({ limit: 20 });
      setItems(list);
      setError('');
    } catch {
      // Ignore transient errors in header bell
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const timer = setInterval(loadNotifications, 30000);
    return () => clearInterval(timer);
  }, [loadNotifications]);

  const unreadCount = items.filter((n) => !isNotificationRead(n)).length;

  const handleMarkRead = async (notif) => {
    const id = notif.id;
    if (!id) return;
    try {
      await notificationService.markAsRead(id);
      await loadNotifications();
    } catch (err) {
      setError(err?.message || 'Failed to mark notification as read.');
    }
  };

  const handleMarkAll = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
    } catch (err) {
      setError(err?.message || 'Failed to mark all notifications as read.');
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          loadNotifications();
        }}
        className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        {unreadCount > 0 && (
          <span className="-top-0.5 -right-0.5 absolute min-w-[18px] h-[18px] px-1 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#122448] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden text-xs">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="font-extrabold text-slate-900 dark:text-white">
              Notifications ({unreadCount} unread)
            </span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="inline-flex items-center gap-1 text-emerald-600 hover:underline font-bold cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {error && (
            <div className="px-4 py-2 bg-amber-50 text-amber-800 text-[11px] font-semibold border-b border-amber-100">
              {error}
            </div>
          )}

          <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {items.length === 0 ? (
              <p className="p-6 text-center text-slate-400">No notifications yet.</p>
            ) : (
              items.slice(0, 8).map((n, idx) => {
                const isUnread = !isNotificationRead(n);
                return (
                  <button
                    key={n.id || idx}
                    type="button"
                    onClick={() => handleMarkRead(n)}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer ${
                      isUnread ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''
                    }`}
                  >
                    <p className="font-bold text-slate-900 dark:text-white">
                      {n.title || 'Notification'}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {n.message || n.body || ''}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 text-center">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                navigate(notificationsPath);
              }}
              className="text-emerald-600 font-extrabold hover:underline cursor-pointer"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}