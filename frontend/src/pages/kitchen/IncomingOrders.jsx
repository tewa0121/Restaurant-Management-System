// src/pages/kitchen/IncomingOrders.jsx
// New tickets waiting for the kitchen. "Start Preparing" moves an order to Preparing.
import React, { useState } from 'react';
import { Flame, Clock, Play } from 'lucide-react';
import useOrders, { timeOf } from '../../hooks/useOrders';

export default function IncomingOrders() {
  const { orders, loading, error, notice, changeStatus } = useOrders({ status: 'pending', sort: 'priority', pollMs: 8000 });
  const [actionError, setActionError] = useState('');

  const handleStartOrder = async (id) => {
    setActionError('');
    const r = await changeStatus(id, 'preparing', 'Order started.');
    if (!r.ok) setActionError(r.message);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-rose-500" /> Incoming Orders Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage and start new orders placed by waiters/customers.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 text-xs font-bold">
          {orders.length} Pending Approval
        </span>
      </div>

      {notice && <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">{notice}</div>}
      {(error || actionError) && <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">{actionError || error}</div>}
      {loading && <p className="text-xs text-slate-400">Loading orders...</p>}
      {!loading && !error && orders.length === 0 && <p className="text-xs text-slate-400">No new orders. The kitchen is all caught up.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">{order.displayId}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  order.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' :
                  order.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {order.priority} Priority
                </span>
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {order.tableLabel}{order.type !== 'dine_in' ? ` • ${order.type.replace('_', ' ')}` : ''}
              </div>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-1.5">
                    • {item.name} x{item.quantity}
                    {item.instructions && <span className="text-amber-600"> ({item.instructions})</span>}
                  </li>
                ))}
              </ul>
              {order.notes && <p className="text-[11px] text-amber-700 dark:text-amber-400">Note: {order.notes}</p>}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Placed: {timeOf(order.orderedAt)}</span>
                <span className="text-amber-600 font-bold">Waiting: {order.elapsedMinutes} min</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStartOrder(order.id)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Play className="w-4 h-4 fill-current" /> Start Preparing Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}