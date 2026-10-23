// src/pages/cashier/Receipts.jsx
import React from 'react';
import { Receipt, Printer } from 'lucide-react';

export function Receipts() {
  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="border-b pb-4 border-slate-200">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Receipt className="w-6 h-6 text-amber-500" /> Receipt Printer & Logs
        </h1>
        <p className="text-xs text-slate-500 font-medium">Reprint past customer receipts and thermal slip logs.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-slate-900">Thermal Printer Status</h3>
          <p className="text-xs text-emerald-600 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Connected (USB Thermal Printer #1)
          </p>
        </div>
        <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm">
          <Printer className="w-4 h-4" /> Test Print Slip
        </button>
      </div>
    </div>
  );
}