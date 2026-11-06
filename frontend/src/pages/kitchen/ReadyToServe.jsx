// // src/pages/kitchen/ReadyToServe.jsx
// import React, { useState } from 'react';
// import { CheckCircle2, BellRing, UserCheck } from 'lucide-react';

// export default function ReadyToServe() {
//   const [readyOrders, setReadyOrders] = useState([
//     { id: '#ORD-1242', table: 'Table 3', items: ['Margherita Pizza x1', 'Iced Tea x2'], readyTime: '10:12 AM', waiter: 'David (Server)', waitDuration: '3 min' },
//     { id: '#ORD-1241', table: 'Table 6', items: ['Grilled Chicken Breast x1', 'French Fries x1'], readyTime: '10:10 AM', waiter: 'Sarah (Server)', waitDuration: '5 min' },
//     { id: '#ORD-1240', table: 'Table 9', items: ['Pasta Carbonara x2', 'Garlic Bread x1'], readyTime: '10:08 AM', waiter: 'John (Server)', waitDuration: '7 min' },
//     { id: '#ORD-1238', table: 'Table 11', items: ['Seafood Soup x1', 'Lemonade x1'], readyTime: '10:05 AM', waiter: 'David (Server)', waitDuration: '10 min' },
//   ]);

//   const handleNotifyWaiter = (id) => {
//     alert(`Pickup notification sent to waitstaff for Order ${id}`);
//   };

//   const handleMarkServed = (id) => {
//     setReadyOrders(prev => prev.filter(o => o.id !== id));
//   };

//   return (
//     <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
//       <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
//         <div>
//           <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
//             <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Ready to Serve Counter
//           </h1>
//           <p className="text-xs text-slate-500 dark:text-slate-400">Plated dishes waiting for waiter dispatch.</p>
//         </div>
//         <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
//           {readyOrders.length} Orders Staged
//         </span>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {readyOrders.map(order => (
//           <div key={order.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="font-black text-sm text-emerald-600">{order.id}</span>
//                 <span className="text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-2.5 py-0.5 rounded-full">
//                   {order.table}
//                 </span>
//               </div>

//               <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl font-medium">
//                 {order.items.map((item, idx) => (
//                   <li key={idx}>✓ {item}</li>
//                 ))}
//               </ul>

//               <div className="flex justify-between items-center text-[11px] text-slate-400">
//                 <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-slate-400" /> {order.waiter}</span>
//                 <span className="text-amber-600 font-bold">Waiting: {order.waitDuration}</span>
//               </div>
//             </div>

//             <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
//               <button
//                 type="button"
//                 onClick={() => handleNotifyWaiter(order.id)}
//                 className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
//               >
//                 <BellRing className="w-3.5 h-3.5 text-amber-500" /> Ring Waiter
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleMarkServed(order.id)}
//                 className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
//               >
//                 Mark Served
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }




// src/pages/kitchen/ReadyToServe.jsx
// Finished plates waiting for a waiter. "Ring Waiter" notifies; "Mark Served" hands the order over.
import React, { useState } from 'react';
import { CheckCircle2, BellRing, UserCheck } from 'lucide-react';
import useOrders, { minutesSince } from '../../hooks/useOrders';

export default function ReadyToServe() {
  const { orders, loading, error, notice, changeStatus, notifyWaiter } = useOrders({ status: 'ready', sort: 'oldest', pollMs: 8000 });
  const [actionError, setActionError] = useState('');

  const handleNotifyWaiter = async (id) => {
    setActionError('');
    const r = await notifyWaiter(id);
    if (!r.ok) setActionError(r.message);
  };

  const handleMarkServed = async (id) => {
    setActionError('');
    const r = await changeStatus(id, 'served', 'Order marked as served.');
    if (!r.ok) setActionError(r.message);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" /> Ready to Serve Counter
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Plated dishes waiting for waiter dispatch.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
          {orders.length} Orders Staged
        </span>
      </div>

      {notice && <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">{notice}</div>}
      {(error || actionError) && <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">{actionError || error}</div>}
      {loading && <p className="text-xs text-slate-400">Loading orders...</p>}
      {!loading && !error && orders.length === 0 && <p className="text-xs text-slate-400">No orders are waiting to be served.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-black text-sm text-emerald-600">{order.displayId}</span>
                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-2.5 py-0.5 rounded-full">
                  {order.tableLabel}
                </span>
              </div>

              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl font-medium">
                {order.itemsText.map((item, idx) => (
                  <li key={idx}>✓ {item}</li>
                ))}
              </ul>

              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-slate-400" /> {order.waiterName || 'No waiter'}</span>
                <span className="text-amber-600 font-bold">Waiting: {minutesSince(order.readyAt || order.orderedAt)} min</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => handleNotifyWaiter(order.id)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <BellRing className="w-3.5 h-3.5 text-amber-500" /> {order.notifiedWaiter ? 'Waiter Notified' : 'Ring Waiter'}
              </button>
              <button
                type="button"
                onClick={() => handleMarkServed(order.id)}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                Mark Served
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}