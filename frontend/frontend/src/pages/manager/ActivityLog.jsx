// src/pages/manager/ActivityLog.jsx
import React, { useState } from 'react';
import { History, Search, ShieldAlert, CheckCircle, Info, RefreshCw } from 'lucide-react';

export default function ActivityLog() {
  const [logs, setLogs] = useState([
    { id: 1, action: 'Order #ORD-1250 Completed', user: 'John Manager', type: 'success', time: '10:30 AM', date: 'May 20, 2025' },
    { id: 2, action: 'Table #5 Status changed to Occupied', user: 'John Manager', type: 'info', time: '10:20 AM', date: 'May 20, 2025' },
    { id: 3, action: 'Low stock alert triggered for Chicken Breast', user: 'System', type: 'warning', time: '09:45 AM', date: 'May 20, 2025' },
    { id: 4, action: 'New menu item added: Grilled Salmon', user: 'Admin User', type: 'success', time: '09:00 AM', date: 'May 20, 2025' },
    { id: 5, action: 'Employee shift updated for Sarah Johnson', user: 'John Manager', type: 'info', time: '08:30 AM', date: 'May 20, 2025' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeBadge = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400';
      case 'warning':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400';
      case 'info':
      default:
        return 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-slate-700 dark:text-slate-300" /> Activity Log
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Audit trail of manager actions, system events, and inventory updates.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search activity log..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-400 border-b border-slate-200 dark:border-slate-700 text-[10px]">
                <th className="p-4 font-semibold">Event / Action</th>
                <th className="p-4 font-semibold">User / Source</th>
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-400">No activity logs found.</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-bold text-slate-800 dark:text-white">{log.action}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{log.user}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getTypeBadge(log.type)}`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-400 text-[11px]">{log.date} at {log.time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}