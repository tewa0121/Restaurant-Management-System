// src/pages/kitchen/IncomingOrders.jsx
import React, { useState } from 'react';
import { Flame, Clock, Play, AlertCircle } from 'lucide-react';

export default function IncomingOrders() {
  const [orders, setOrders] = useState([
    { id: '#ORD-1250', table: 'Table 5', items: ['Grilled Chicken Breast x2', 'Caesar Salad x1'], time: '10:20 AM', priority: 'High', elapsed: '15 min' },
    { id: '#ORD-1249', table: 'Table 7', items: ['Beef Burger x2', 'French Fries x2', 'Coke x2'], time: '10:18 AM', priority: 'High', elapsed: '17 min' },
    { id: '#ORD-1248', table: 'Table 12', items: ['Margherita Pizza x1', 'Garlic Bread x1'], time: '10:15 AM', priority: 'Medium', elapsed: '20 min' },
    { id: '#ORD-1247', table: 'Table 3', items: ['Pasta Carbonara x2'], time: '10:10 AM', priority: 'Medium', elapsed: '25 min' },
    { id: '#ORD-1246', table: 'Table 15', items: ['Seafood Soup x1', 'Steak x1'], time: '10:08 AM', priority: 'Low', elapsed: '27 min' },
  ]);

  const handleStartOrder = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">{order.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  order.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' :
                  order.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {order.priority} Priority
                </span>
              </div>
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200">{order.table}</div>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">• {item}</li>
                ))}
              </ul>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Placed: {order.time}</span>
                <span className="text-amber-600 font-bold">Waiting: {order.elapsed}</span>
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