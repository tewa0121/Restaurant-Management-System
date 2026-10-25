// src/pages/cashier/OrderHistory.jsx
import React from 'react';
import { History, CheckCircle2 } from 'lucide-react';

export function OrderHistory() {
  const history = [
    { id: '#BILL-152', table: 'Table 5', customer: 'John Smith', amount: '$45.50', method: 'Card', status: 'Paid', time: '10:30 AM' },
    { id: '#BILL-151', table: 'Table 12', customer: 'Sarah Johnson', amount: '$78.20', method: 'Cash', status: 'Paid', time: '10:25 AM' },
    { id: '#BILL-150', table: 'Table 3', customer: 'Michael Brown', amount: '$32.00', method: 'Mobile Banking', status: 'Paid', time: '10:20 AM' },
    { id: '#BILL-149', table: 'Table 7', customer: 'Emily Davis', amount: '$67.80', method: 'Card', status: 'Paid', time: '10:15 AM' },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="border-b pb-4 border-slate-200">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <History className="w-6 h-6 text-purple-500" /> Cashier Order History & Audit Log
        </h1>
        <p className="text-xs text-slate-500 font-medium">Complete record of settled transactions across shifts.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-4">Bill No.</th>
              <th className="p-4">Table</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {history.map((h, i) => (
              <tr key={i} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-blue-600">{h.id}</td>
                <td className="p-4 font-bold text-slate-900">{h.table}</td>
                <td className="p-4 text-slate-500">{h.customer}</td>
                <td className="p-4 font-black">{h.amount}</td>
                <td className="p-4">{h.method}</td>
                <td className="p-4"><span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700">{h.status}</span></td>
                <td className="p-4 text-right text-slate-400">{h.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}