import React from 'react';

export default function RecentOrdersTable({ orders = [] }) {
  const list = orders.length > 0 ? orders : [
    { id: '#ORD-1250', table: 'Table 5', customer: 'John Smith', amount: '$45.50', status: 'Completed' },
    { id: '#ORD-1249', table: 'Table 12', customer: 'Sarah Johnson', amount: '$78.20', status: 'Preparing' },
    { id: '#ORD-1248', table: 'Table 3', customer: 'Michael Brown', amount: '$32.00', status: 'Preparing' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <h3 className="font-bold text-slate-900 dark:text-white text-xs">Recent System Orders</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px]">
              <th className="pb-3 font-semibold">Order ID</th>
              <th className="pb-3 font-semibold">Table</th>
              <th className="pb-3 font-semibold">Customer</th>
              <th className="pb-3 font-semibold">Amount</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {list.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 font-bold text-emerald-600">{o.id}</td>
                <td className="py-3 text-slate-700 dark:text-slate-300">{o.table}</td>
                <td className="py-3 font-semibold text-slate-900 dark:text-white">{o.customer}</td>
                <td className="py-3 font-bold text-slate-900 dark:text-white">{o.amount}</td>
                <td className="py-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    {o.status}
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