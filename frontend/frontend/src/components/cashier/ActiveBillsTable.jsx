import React from 'react';
import { Eye, CreditCard } from 'lucide-react';

export default function ActiveBillsTable({ bills = [], onView, onPay }) {
  if (!bills || bills.length === 0) {
    return <div className="p-6 text-center text-xs text-slate-400">No active bills found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs whitespace-nowrap">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px]">
            <th className="pb-3 font-semibold">Bill ID</th>
            <th className="pb-3 font-semibold">Table</th>
            <th className="pb-3 font-semibold">Customer</th>
            <th className="pb-3 font-semibold">Total Amount</th>
            <th className="pb-3 font-semibold">Status</th>
            <th className="pb-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {bills.map((bill) => (
            <tr key={bill.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">{bill.id}</td>
              <td className="py-3 text-slate-700 dark:text-slate-300">{bill.table}</td>
              <td className="py-3 font-semibold text-slate-900 dark:text-white">{bill.customer}</td>
              <td className="py-3 font-black text-slate-900 dark:text-white">${bill.total || bill.amount}</td>
              <td className="py-3">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400">
                  {bill.status || 'Active'}
                </span>
              </td>
              <td className="py-3 text-right space-x-2">
                <button
                  onClick={() => onView && onView(bill)}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" /> View
                </button>
                <button
                  onClick={() => onPay && onPay(bill)}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer inline-flex items-center gap-1"
                >
                  <CreditCard className="w-3 h-3" /> Pay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}