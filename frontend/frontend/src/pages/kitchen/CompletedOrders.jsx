// src/pages/kitchen/CompletedOrders.jsx
import React, { useState } from 'react';
import { History, Search, CheckCircle2 } from 'lucide-react';

export default function CompletedOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const completedOrders = [
    { id: '#ORD-1239', table: 'Table 5', items: '3 items', prepTime: '14 min', completedAt: '10:00 AM', chef: 'Chef Alex' },
    { id: '#ORD-1238', table: 'Table 7', items: '4 items', prepTime: '18 min', completedAt: '9:58 AM', chef: 'Chef Sarah' },
    { id: '#ORD-1237', table: 'Table 12', items: '2 items', prepTime: '11 min', completedAt: '9:55 AM', chef: 'Chef Daniel' },
    { id: '#ORD-1236', table: 'Table 1', items: '3 items', prepTime: '16 min', completedAt: '9:50 AM', chef: 'Chef Alex' },
    { id: '#ORD-1235', table: 'Table 10', items: '4 items', prepTime: '21 min', completedAt: '9:45 AM', chef: 'Chef Sarah' },
    { id: '#ORD-1234', table: 'Table 3', items: '2 items', prepTime: '12 min', completedAt: '9:40 AM', chef: 'Chef Daniel' },
  ];

  const filtered = completedOrders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.table.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-blue-500" /> Completed Orders Log
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Historical performance and fulfilled kitchen tickets.</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search order or table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Table</th>
              <th className="p-4">Items Summary</th>
              <th className="p-4">Prep Duration</th>
              <th className="p-4">Assigned Chef</th>
              <th className="p-4">Completed Time</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
            {filtered.map(o => (
              <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-emerald-600">{o.id}</td>
                <td className="p-4">{o.table}</td>
                <td className="p-4">{o.items}</td>
                <td className="p-4 text-slate-500">{o.prepTime}</td>
                <td className="p-4">{o.chef}</td>
                <td className="p-4 text-slate-400">{o.completedAt}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Done
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}