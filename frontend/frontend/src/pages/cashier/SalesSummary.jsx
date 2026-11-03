// src/pages/cashier/SalesSummary.jsx
import React from 'react';
import { BarChart3 } from 'lucide-react';

export function SalesSummary() {
  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="border-b pb-4 border-slate-200">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-teal-500" /> Sales Summary Report
        </h1>
        <p className="text-xs text-slate-500 font-medium">Shift analytics and revenue breakdown.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-400">Total Revenue Today</p>
          <p className="text-2xl font-black text-emerald-600">$4,325.50</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-400">Total Transactions</p>
          <p className="text-2xl font-black text-blue-600">152 Bills</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <p className="text-xs font-semibold text-slate-400">Average Ticket Size</p>
          <p className="text-2xl font-black text-purple-600">$28.46</p>
        </div>
      </div>
    </div>
  );
}