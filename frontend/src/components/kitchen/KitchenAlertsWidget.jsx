import React from 'react';
import { AlertTriangle, Bell } from 'lucide-react';

export default function KitchenAlertsWidget({ alerts = [] }) {
  const displayAlerts = alerts.length > 0 ? alerts : [
    { id: 1, type: 'warning', text: 'Low stock warning: Berbere spice running low.', time: '15m ago' },
    { id: 2, type: 'info', text: 'Table 5 requested extra napkins.', time: '25m ago' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
        <Bell className="w-4 h-4 text-rose-500" /> Kitchen & Inventory Alerts
      </h3>

      <div className="space-y-2.5">
        {displayAlerts.map((alert) => (
          <div key={alert.id} className="p-3 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl flex items-start gap-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{alert.text}</p>
              <span className="text-[10px] text-slate-400">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}