// src/pages/cashier/PaymentHistory.jsx
import React from 'react';
import { CreditCard } from 'lucide-react';

export function PaymentHistory() {
  const payments = [
    { tx: '#TXN-9021', bill: '#BILL-152', method: 'Card (Visa)', amount: '$45.50', time: '10:30 AM' },
    { tx: '#TXN-9020', bill: '#BILL-151', method: 'Cash', amount: '$78.20', time: '10:25 AM' },
    { tx: '#TXN-9019', bill: '#BILL-150', method: 'Mobile Banking', amount: '$32.00', time: '10:20 AM' },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="border-b pb-4 border-slate-200">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-emerald-500" /> Payment Gateway Transactions
        </h1>
        <p className="text-xs text-slate-500 font-medium">Processor logs and cash drawer receipts.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-4">Transaction ID</th>
              <th className="p-4">Bill Ref</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Amount Received</th>
              <th className="p-4 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {payments.map((p, i) => (
              <tr key={i} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-emerald-600">{p.tx}</td>
                <td className="p-4 font-bold text-blue-600">{p.bill}</td>
                <td className="p-4">{p.method}</td>
                <td className="p-4 font-black">{p.amount}</td>
                <td className="p-4 text-right text-slate-400">{p.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}