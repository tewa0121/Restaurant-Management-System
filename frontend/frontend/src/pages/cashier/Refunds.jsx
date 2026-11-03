// src/pages/cashier/Refunds.jsx
import React from 'react';
import { RotateCcw } from 'lucide-react';

export function Refunds() {
  const refunds = [
    { id: '#REF-101', bill: '#BILL-147', customer: 'Mark Spencer', amount: '$25.50', reason: 'Incorrect dish delivered', time: 'Yesterday' },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="border-b pb-4 border-slate-200">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <RotateCcw className="w-6 h-6 text-rose-500" /> Refunds & Returns Log
        </h1>
        <p className="text-xs text-slate-500 font-medium">Manage customer return authorizations and credit slips.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-4">Refund ID</th>
              <th className="p-4">Original Bill</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Refund Amount</th>
              <th className="p-4">Reason</th>
              <th className="p-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {refunds.map((r, i) => (
              <tr key={i} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-rose-600">{r.id}</td>
                <td className="p-4 font-bold text-blue-600">{r.bill}</td>
                <td className="p-4 text-slate-800">{r.customer}</td>
                <td className="p-4 font-black">{r.amount}</td>
                <td className="p-4 text-slate-500">{r.reason}</td>
                <td className="p-4 text-right text-slate-400">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}