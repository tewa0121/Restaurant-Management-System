import React from 'react';
import { ChefHat, CheckCircle2, Clock } from 'lucide-react';

export default function IncomingOrdersTable({ orders = [], onUpdateStatus }) {
  const displayOrders = orders.length > 0 ? orders : [
    { id: '#ORD-1253', table: 'Table 4', items: '2x Special Doro Wat, 1x Injera', time: '3m ago', status: 'Pending' },
    { id: '#ORD-1252', table: 'Table 8', items: '1x Tibs Special, 2x Tej', time: '7m ago', status: 'Pending' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
          <ChefHat className="w-4 h-4 text-amber-500" /> Incoming Kitchen Queue
        </h3>
        <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full">
          {displayOrders.length} New Orders
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px]">
              <th className="pb-3 font-semibold">Order ID</th>
              <th className="pb-3 font-semibold">Table</th>
              <th className="pb-3 font-semibold">Ordered Items</th>
              <th className="pb-3 font-semibold">Elapsed Time</th>
              <th className="pb-3 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">{ord.id}</td>
                <td className="py-3 text-slate-700 dark:text-slate-300">{ord.table}</td>
                <td className="py-3 font-semibold text-slate-900 dark:text-white">{ord.items}</td>
                <td className="py-3 text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {ord.time}
                </td>
                <td className="py-3 text-right">
                  <button
                    onClick={() => onUpdateStatus && onUpdateStatus(ord.id, 'Preparing')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] cursor-pointer inline-flex items-center gap-1 transition"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Start Cooking
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}