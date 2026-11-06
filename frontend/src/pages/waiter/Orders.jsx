// // src/pages/waiter/Orders.jsx
// import React, { useState } from 'react';
// import { ShoppingBag } from 'lucide-react';

// export default function WaiterOrders() {
//   const [activeTab, setActiveTab] = useState('All');

//   const [orders] = useState([
//     { id: '#ORD-1250', table: 'Table 5', items: '3 items', total: '$35.00', status: 'Preparing', time: '10:20 AM', chef: 'Chef Alex' },
//     { id: '#ORD-1249', table: 'Table 7', items: '4 items', total: '$48.50', status: 'Preparing', time: '10:18 AM', chef: 'Chef Sarah' },
//     { id: '#ORD-1248', table: 'Table 12', items: '5 items', total: '$62.00', status: 'Ready to Serve', time: '10:15 AM', chef: 'Chef Daniel' },
//     { id: '#ORD-1247', table: 'Table 3', items: '2 items', total: '$24.00', status: 'Preparing', time: '10:10 AM', chef: 'Chef Alex' },
//     { id: '#ORD-1246', table: 'Table 15', items: '3 items', total: '$38.00', status: 'Pending', time: '10:08 AM', chef: 'Unassigned' },
//   ]);

//   const filteredOrders = activeTab === 'All' 
//     ? orders 
//     : orders.filter(o => o.status.toLowerCase() === activeTab.toLowerCase());

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'Pending':
//         return 'bg-blue-100 text-blue-700';
//       case 'Preparing':
//         return 'bg-amber-100 text-amber-700';
//       case 'Ready to Serve':
//         return 'bg-emerald-100 text-emerald-700';
//       default:
//         return 'bg-slate-100 text-slate-700';
//     }
//   };

//   return (
//     <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
//         <div>
//           <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
//             <ShoppingBag className="w-6 h-6 text-purple-500" /> Active Orders
//           </h1>
//           <p className="text-xs text-slate-500 font-medium">Track kitchen preparation statuses and pick up ready dishes.</p>
//         </div>

//         <div className="flex gap-1 bg-white p-1.5 rounded-xl border border-slate-200 text-xs font-bold shadow-sm">
//           {['All', 'Pending', 'Preparing', 'Ready to Serve'].map(tab => (
//             <button
//               key={tab}
//               type="button"
//               onClick={() => setActiveTab(tab)}
//               className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
//                 activeTab === tab 
//                   ? 'bg-purple-600 text-white shadow-sm' 
//                   : 'text-slate-500 hover:text-slate-900'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
//         <table className="w-full text-left text-xs">
//           <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
//             <tr>
//               <th className="p-4">Order ID</th>
//               <th className="p-4">Table</th>
//               <th className="p-4">Items</th>
//               <th className="p-4">Total</th>
//               <th className="p-4">Assigned Kitchen</th>
//               <th className="p-4">Status</th>
//               <th className="p-4 text-right">Time</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
//             {filteredOrders.map(o => (
//               <tr key={o.id} className="hover:bg-slate-50/50">
//                 <td className="p-4 font-bold text-blue-600">{o.id}</td>
//                 <td className="p-4 font-bold text-slate-900">{o.table}</td>
//                 <td className="p-4">{o.items}</td>
//                 <td className="p-4 font-black">{o.total}</td>
//                 <td className="p-4 text-slate-400">{o.chef}</td>
//                 <td className="p-4">
//                   <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(o.status)}`}>
//                     {o.status}
//                   </span>
//                 </td>
//                 <td className="p-4 text-right text-slate-400">{o.time}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }





// src/pages/waiter/Orders.jsx
// Active orders for the floor. Track the kitchen and pick up ready dishes.
import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import useOrders, { timeOf } from '../../hooks/useOrders';

const TABS = ['All', 'Pending', 'Preparing', 'Ready to Serve', 'Served'];

export default function Orders() {
  const [activeTab, setActiveTab] = useState('All');
  const [actionError, setActionError] = useState('');
  const { orders, loading, error, notice, changeStatus } = useOrders({ active: true, pollMs: 10000 });

  const filteredOrders = activeTab === 'All'
    ? orders
    : orders.filter(o => o.displayStatus.toLowerCase() === activeTab.toLowerCase());

  const handleServe = async (id) => {
    setActionError('');
    const r = await changeStatus(id, 'served', 'Order marked as served.');
    if (!r.ok) setActionError(r.message);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-blue-100 text-blue-700';
      case 'Preparing':
        return 'bg-amber-100 text-amber-700';
      case 'Ready to Serve':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-purple-500" /> Active Orders
          </h1>
          <p className="text-xs text-slate-500 font-medium">Track kitchen preparation statuses and pick up ready dishes.</p>
        </div>

        <div className="flex flex-wrap gap-1 bg-white p-1.5 rounded-xl border border-slate-200 text-xs font-bold shadow-sm">
          {TABS.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {notice && <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">{notice}</div>}
      {(error || actionError) && <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">{actionError || error}</div>}
      {loading && <p className="text-xs text-slate-400">Loading orders...</p>}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Table</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Kitchen</th>
              <th className="p-4">Status</th>
              <th className="p-4">Time</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {!loading && filteredOrders.length === 0 && (
              <tr><td colSpan="8" className="p-8 text-center text-slate-400">No orders found.</td></tr>
            )}
            {filteredOrders.map(o => (
              <tr key={o.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-blue-600">{o.displayId}</td>
                <td className="p-4 font-bold text-slate-900">{o.tableLabel}</td>
                <td className="p-4">{o.itemCount} items</td>
                <td className="p-4 font-black">${o.total.toFixed(2)}</td>
                <td className="p-4 text-slate-400">{o.cookingStartedAt ? `Started ${timeOf(o.cookingStartedAt)}` : 'Waiting'}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(o.displayStatus)}`}>
                    {o.displayStatus}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{timeOf(o.orderedAt)}</td>
                <td className="p-4 text-right">
                  {o.status === 'ready' && (
                    <button
                      type="button"
                      onClick={() => handleServe(o.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                    >
                      Mark Served
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}