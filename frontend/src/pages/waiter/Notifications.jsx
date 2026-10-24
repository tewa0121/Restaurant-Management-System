// src/pages/waiter/Notifications.jsx
import React, { useState } from 'react';
import { Bell, Clock, Trash2, CheckCircle2 } from 'lucide-react';

export default function WaiterNotifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Order Ready for Pickup', desc: 'Order #ORD-1248 for Table 12 is ready on the serving pass.', time: '2 min ago', read: false },
    { id: 2, title: 'Customer Call Alert', desc: 'Table 7 requested Extra Napkins.', time: '5 min ago', read: false },
    { id: 3, title: 'Upcoming Reservation', desc: 'Table 8 reservation for Alice Cooper arriving in 15 minutes.', time: '15 min ago', read: true },
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex justify-between items-center border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-500" /> Notifications Center
          </h1>
          <p className="text-xs text-slate-500 font-medium">Shift alerts, order ready notifications, and table requests.</p>
        </div>

        <button
          type="button"
          onClick={markAllAsRead}
          className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-700 transition-all cursor-pointer"
        >
          Mark All as Read
        </button>
      </div>

      <div className="space-y-3 max-w-2xl">
        {notifications.map(n => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border shadow-sm transition-all flex items-start justify-between gap-4 ${
              n.read ? 'bg-white border-slate-200 opacity-75' : 'bg-blue-50/60 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl mt-0.5 ${n.read ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-900">{n.title}</h4>
                <p className="text-xs text-slate-600 font-medium">{n.desc}</p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {n.time}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => clearNotification(n.id)}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
              title="Dismiss"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
