import React from 'react';

export default function PaymentMethodChart() {
  const methods = [
    { label: 'Credit / Debit Card', percentage: '55%', amount: '$2,450.00', color: 'bg-emerald-500' },
    { label: 'Cash', percentage: '30%', amount: '$1,340.00', color: 'bg-blue-500' },
    { label: 'Mobile Payment', percentage: '15%', amount: '$670.00', color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <h3 className="font-bold text-slate-900 dark:text-white text-xs">Payment Methods Breakdown</h3>

      <div className="space-y-3">
        {methods.map((m, idx) => (
          <div key={idx} className="space-y-1 text-xs">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700 dark:text-slate-300">{m.label}</span>
              <span className="text-slate-900 dark:text-white">{m.amount} ({m.percentage})</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div style={{ width: m.percentage }} className={`h-full ${m.color} rounded-full`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}