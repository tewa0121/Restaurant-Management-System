// src/pages/cashier/DailyCashReport.jsx
import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

export function DailyCashReport() {
  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="border-b pb-4 border-slate-200">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-emerald-500" /> Daily Cash Register Report
        </h1>
        <p className="text-xs text-slate-500 font-medium">Opening balance, cash drops, and closing drawer count.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 max-w-xl">
        <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Register Shift #2025-05-20</h3>
        <div className="space-y-2 text-xs font-medium">
          <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl"><span>Opening Float</span><span className="font-bold">$300.00</span></div>
          <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl"><span>Cash Collected</span><span className="font-bold text-emerald-600">$1,890.00</span></div>
          <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl"><span>Cash Drops / Payouts</span><span className="font-bold text-rose-500">-$200.00</span></div>
          <div className="flex justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 font-black text-sm">
            <span>Expected Drawer Balance</span>
            <span className="text-emerald-700">$1,990.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}