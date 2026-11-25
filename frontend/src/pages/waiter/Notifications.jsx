import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Trash2, CheckCheck, RefreshCw } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { useNotification } from '../../context/NotificationContext';

export default function WaiterNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const { showNotification } = useNotification();

  const loadNotifications = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const result = await notificationService.getNotifications({ page: 1, limit: 50 });
      setNotifications(result.items);
      setUnreadCount(result.unreadCount);
    } catch (err) {
      if (!silent) {
        showNotification(err?.message || 'Failed to load notifications.', 'error');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadNotifications(false);
  }, [loadNotifications]);

  const handleMarkAsRead = async (item) => {
    if (!item || item.isRead) return;
    setBusy(true);
    try {
      await notificationService.markRead(item.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === item.id ? { ...n, isRead: true, is_read: true, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      showNotification(err?.message || 'Failed to mark notification as read.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || busy) return;
    setBusy(true);
    try {
      await notificationService.markAllRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, is_read: true, read: true }))
      );
      setUnreadCount(0);
      showNotification('All notifications marked as read.', 'success');
    } catch (err) {
      showNotification(err?.message || 'Failed to mark all as read.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (busy) return;
    setBusy(true);
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === id);
        if (target && !target.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n.id !== id);
      });
      showNotification('Notification removed.', 'info');
    } catch (err) {
      showNotification(err?.message || 'Failed to delete notification.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleClearRead = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await notificationService.clearRead();
      setNotifications((prev) => prev.filter((n) => !n.isRead));
      showNotification('Read notifications cleared.', 'info');
    } catch (err) {
      showNotification(err?.message || 'Failed to clear read notifications.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 font-sans text-xs">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-500" />
            <span>Notifications Center</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-rose-100 text-rose-700">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Shift alerts, order ready notifications, and table requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={loading || busy}
            onClick={() => loadNotifications(false)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-bold text-slate-700 dark:text-slate-200 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            disabled={unreadCount === 0 || busy}
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 transition cursor-pointer disabled:opacity-50"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>

          <button
            type="button"
            disabled={busy || notifications.every((n) => !n.isRead)}
            onClick={handleClearRead}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition cursor-pointer disabled:opacity-50"
          >
            Clear Read
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 font-semibold max-w-2xl">
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-500 font-semibold max-w-2xl">
          No notifications found.
        </div>
      ) : (
        <div className="space-y-3 max-w-2xl">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleMarkAsRead(n)}
              className={`p-4 rounded-2xl border shadow-sm transition-all flex items-start justify-between gap-4 cursor-pointer ${
                n.isRead
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
                  : 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    n.isRead
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{n.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {n.message}
                  </p>
                  {n.createdAt && (
                    <span className="inline-block text-[11px] text-slate-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                disabled={busy}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNotification(n.id);
                }}
                aria-label="Delete notification"
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}