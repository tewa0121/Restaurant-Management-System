import React from 'react';
import { Clock, CreditCard } from 'lucide-react';

export default function PendingPaymentsList({ pendingBills = [], onPay }) {
  const items = pendingBills.length > 0 ? pendingBills : [
    { id: '#ORD-1254', table: 'Table 4', customer: 'David Miller', amount: '$54.00', time: '10m ago' },
    { id: '#ORD-1251', table: 'Table 9', customer: 'Emma Watson', amount: '$82.50', time: '22m ago' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-amber-500" /> Pending Bill Clearances
        </h3>
        <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full">
          {items.length} Pending
        </span>
      </div>

      <div className="space-y-2.5">
        {items.map((bill) => (
          <div key={bill.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{bill.id} — <span className="text-slate-500">{bill.table}</span></p>
              <p className="text-[10px] text-slate-400">{bill.customer} • {bill.time}</p>
            </div>
            <div className="text-right flex items-center gap-3">
              <span className="font-black text-slate-900 dark:text-white">{bill.amount}</span>
              <button
                onClick={() => onPay && onPay(bill)}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] cursor-pointer inline-flex items-center gap-1"
              >
                <CreditCard className="w-3 h-3" /> Pay
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}