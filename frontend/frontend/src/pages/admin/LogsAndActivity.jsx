// src/pages/admin/LogsAndActivity.jsx
import React, { useState } from 'react';
import { FileText, Shield, User, Clock, Search } from 'lucide-react';

export default function LogsAndActivity() {
  const [search, setSearch] = useState('');
  const logs = [
    { id: 1, user: 'Admin User', action: 'Created new menu item: Grilled Steak', timestamp: '2026-06-15 10:45 AM', type: 'SUCCESS' },
    { id: 2, user: 'Cashier Staff', action: 'Processed payment of $45.50 for ORD-1250', timestamp: '2026-06-15 10:32 AM', type: 'INFO' },
    { id: 3, user: 'System', action: 'Automated daily inventory database backup completed', timestamp: '2026-06-15 03:00 AM', type: 'SYSTEM' }
  ];

  const filteredLogs = logs.filter(l => 
    l.user.toLowerCase().includes(search.toLowerCase()) ||
    l.action.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">System Logs & Activity</h1>
          <p className="text-xs text-gray-500 mt-1">Audit administrative actions, user sign-ins, and automated system triggers.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit logs..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 uppercase font-bold text-[10px] bg-gray-50/50">
              <th className="py-3 px-4">Log Type</th>
              <th className="py-3 px-4">User / Actor</th>
              <th className="py-3 px-4">Action Details</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
            {filteredLogs.map(l => (
              <tr key={l.id} className="hover:bg-gray-50/50 transition">
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${
                    l.type === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                    l.type === 'INFO' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {l.type}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-gray-900">{l.user}</td>
                <td className="py-3 px-4 text-gray-600">{l.action}</td>
                <td className="py-3 px-4 text-gray-400 text-[11px]">{l.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}