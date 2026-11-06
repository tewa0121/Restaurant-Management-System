// // src/pages/manager/Orders.jsx
// import React, { useState } from 'react';
// import { ShoppingBag, Plus, Search, Eye, RefreshCw, X, CheckCircle2 } from 'lucide-react';
// import { mockDatabase } from '../../data/mockData';
// import { formatCurrency } from '../../utils/formatters';

// export default function Orders() {
//   const [orders, setOrders] = useState(mockDatabase.orders || []);
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   // Modals state
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [isStatusOpen, setIsStatusOpen] = useState(false);
//   const [isAddOpen, setIsAddOpen] = useState(false);

//   // New order form fields
//   const [tableNum, setTableNum] = useState('1');
//   const [orderAmount, setOrderAmount] = useState('45.00');

//   // Filter orders
//   const filteredOrders = orders.filter(o => {
//     const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
//     const matchesSearch = o.id.toString().includes(searchTerm) || (o.status || '').toLowerCase().includes(searchTerm.toLowerCase());
//     return matchesStatus && matchesSearch;
//   });

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 'completed':
//         return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400';
//       case 'preparing':
//         return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400';
//       case 'served':
//         return 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400';
//       case 'pending':
//       default:
//         return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400';
//     }
//   };

//   const handleUpdateStatus = (newStatus) => {
//     if (!selectedOrder) return;
//     setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
//     setIsStatusOpen(false);
//     setSelectedOrder(null);
//   };

//   const handleAddOrder = (e) => {
//     e.preventDefault();
//     const newOrder = {
//       id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
//       table_id: parseInt(tableNum, 10),
//       total_amount: parseFloat(orderAmount) || 0,
//       status: 'pending',
//       created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };
//     setOrders([newOrder, ...orders]);
//     setIsAddOpen(false);
//     setTableNum('1');
//     setOrderAmount('45.00');
//   };

//   return (
//     <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
//       {/* Top Banner */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
//             <ShoppingBag className="w-6 h-6 text-emerald-500" /> Order Management
//           </h1>
//           <p className="text-xs text-slate-500 dark:text-slate-400">
//             Monitor live dining orders, update statuses, and create new guest tickets.
//           </p>
//         </div>
//         <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
//           <div className="relative flex-1 sm:w-56">
//             <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//             <input 
//               type="text" 
//               placeholder="Search order ID..." 
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
//             />
//           </div>
//           <select 
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
//           >
//             <option value="all">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="preparing">Preparing</option>
//             <option value="served">Served</option>
//             <option value="completed">Completed</option>
//           </select>
//           <button 
//             type="button"
//             onClick={() => setIsAddOpen(true)}
//             className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
//           >
//             <Plus className="w-4 h-4" /> New Order
//           </button>
//         </div>
//       </div>

//       {/* Orders Table Grid */}
//       <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs whitespace-nowrap">
//             <thead>
//               <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-400 border-b border-slate-200 dark:border-slate-700 text-[10px]">
//                 <th className="p-4 font-semibold">Order ID</th>
//                 <th className="p-4 font-semibold">Table</th>
//                 <th className="p-4 font-semibold">Total Amount</th>
//                 <th className="p-4 font-semibold">Status</th>
//                 <th className="p-4 font-semibold text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
//               {filteredOrders.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="p-8 text-center text-slate-400">No orders found.</td>
//                 </tr>
//               ) : (
//                 filteredOrders.map((order) => {
//                   const table = mockDatabase.tables?.find(t => t.id === order.table_id);
//                   return (
//                     <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
//                       <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">#{order.id}</td>
//                       <td className="p-4 text-slate-700 dark:text-slate-200">{table ? `Table ${table.table_number}` : `Table #${order.table_id || 1}`}</td>
//                       <td className="p-4 font-extrabold text-slate-800 dark:text-white">{formatCurrency(order.total_amount || 0)}</td>
//                       <td className="p-4">
//                         <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(order.status)}`}>
//                           {order.status || 'pending'}
//                         </span>
//                       </td>
//                       <td className="p-4 text-right flex justify-end gap-2">
//                         <button 
//                           type="button"
//                           onClick={() => { setSelectedOrder(order); setIsViewOpen(true); }}
//                           className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
//                           title="View Details"
//                         >
//                           <Eye className="w-3.5 h-3.5" /> View
//                         </button>
//                         <button 
//                           type="button"
//                           onClick={() => { setSelectedOrder(order); setIsStatusOpen(true); }}
//                           className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
//                           title="Change Status"
//                         >
//                           <RefreshCw className="w-3.5 h-3.5" /> Status
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* New Order Modal */}
//       {isAddOpen && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-xl">
//             <div className="flex justify-between items-center">
//               <h3 className="font-bold text-slate-800 dark:text-white text-sm">Create New Order</h3>
//               <button type="button" onClick={() => setIsAddOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
//             </div>
//             <form onSubmit={handleAddOrder} className="space-y-3 text-xs">
//               <div>
//                 <label className="block text-slate-500 mb-1">Table Number</label>
//                 <input 
//                   type="number" 
//                   value={tableNum} 
//                   onChange={(e) => setTableNum(e.target.value)} 
//                   required 
//                   className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="block text-slate-500 mb-1">Total Amount ($)</label>
//                 <input 
//                   type="number" 
//                   step="0.01"
//                   value={orderAmount} 
//                   onChange={(e) => setOrderAmount(e.target.value)} 
//                   required 
//                   className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
//                 />
//               </div>
//               <div className="flex justify-end gap-2 pt-2">
//                 <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1.5 rounded-xl text-slate-500">Cancel</button>
//                 <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-semibold">Create Order</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Change Status Modal */}
//       {isStatusOpen && selectedOrder && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-xl">
//             <div className="flex justify-between items-center">
//               <h3 className="font-bold text-slate-800 dark:text-white text-sm">Update Order #{selectedOrder.id}</h3>
//               <button type="button" onClick={() => setIsStatusOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
//             </div>
//             <div className="space-y-2 text-xs">
//               <p className="text-slate-500">Select new status:</p>
//               <div className="grid grid-cols-2 gap-2">
//                 {['pending', 'preparing', 'served', 'completed'].map((statusOption) => (
//                   <button
//                     key={statusOption}
//                     type="button"
//                     onClick={() => handleUpdateStatus(statusOption)}
//                     className={`p-2.5 rounded-xl border text-center font-bold capitalize transition-all ${selectedOrder.status === statusOption ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100'}`}
//                   >
//                     {statusOption}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Details Modal */}
//       {isViewOpen && selectedOrder && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
//             <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
//               <h3 className="font-bold text-slate-800 dark:text-white text-sm">Order Details: #{selectedOrder.id}</h3>
//               <button type="button" onClick={() => setIsViewOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
//             </div>
//             <div className="space-y-2.5">
//               <div className="flex justify-between"><span className="text-slate-400">Table ID:</span><span className="font-bold text-slate-700 dark:text-slate-200">Table #{selectedOrder.table_id || 1}</span></div>
//               <div className="flex justify-between"><span className="text-slate-400">Status:</span><span className="font-bold text-emerald-600 uppercase">{selectedOrder.status}</span></div>
//               <div className="flex justify-between"><span className="text-slate-400">Total Amount:</span><span className="font-extrabold text-slate-800 dark:text-white">{formatCurrency(selectedOrder.total_amount || 0)}</span></div>
//             </div>
//             <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
//               <button type="button" onClick={() => setIsViewOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold">Close</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }




// src/pages/manager/Orders.jsx
import React, { useEffect, useState } from 'react';
import { ShoppingBag, Plus, Search, Eye, RefreshCw, X, CheckCircle2 } from 'lucide-react';
import useOrders, { apiRequest } from '../../hooks/useOrders';
import useTables from '../../hooks/useTables';
import { formatCurrency } from '../../utils/formatters';

// The steps the server allows from each status (so the popup only offers valid moves)
const NEXT = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['served', 'cancelled'],
  served: ['completed'],
  completed: [],
  cancelled: [],
};

export default function Orders() {
  const { orders, loading, error, notice, createOrder, changeStatus } = useOrders({ limit: 200, pollMs: 15000 });
  const { tables, refresh: refreshTables } = useTables();
  const [menu, setMenu] = useState([]);
  const [formError, setFormError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New order form fields: a table and one or more dishes
  const [tableId, setTableId] = useState('');
  const [lines, setLines] = useState([{ menuItemId: '', quantity: 1 }]);
  const [orderNotes, setOrderNotes] = useState('');

  // load the real menu when the "New Order" popup opens
  useEffect(() => {
    if (!isAddOpen) return;
    apiRequest('GET', '/menu').then((json) => setMenu(json.data || [])).catch((e) => setFormError(e.message));
  }, [isAddOpen]);

  // forget an old error message whenever every popup is closed
  useEffect(() => {
    if (!isAddOpen && !isStatusOpen) setFormError('');
  }, [isAddOpen, isStatusOpen]);

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term
      || o.orderNumber.toLowerCase().includes(term)
      || (o.status || '').toLowerCase().includes(term)
      || (o.customerName || '').toLowerCase().includes(term)
      || (o.tableLabel || '').toLowerCase().includes(term);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400';
      case 'preparing':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400';
      case 'served':
        return 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400';
      case 'ready':
        return 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-400';
      case 'cancelled':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400';
      case 'pending':
      default:
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400';
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return;
    setFormError('');
    const r = await changeStatus(selectedOrder.id, newStatus, `Order ${selectedOrder.orderNumber} is now ${newStatus}.`);
    if (!r.ok) return setFormError(r.message);
    setIsStatusOpen(false);
    setSelectedOrder(null);
  };

  const updateLine = (index, changes) =>
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...changes } : l)));

  const handleAddOrder = async (e) => {
    e.preventDefault();
    setFormError('');
    const items = lines
      .filter((l) => l.menuItemId)
      .map((l) => ({ menuItemId: Number(l.menuItemId), quantity: Number(l.quantity) || 1 }));
    if (!tableId) return setFormError('Choose a table.');
    if (items.length === 0) return setFormError('Choose at least one dish.');
    const r = await createOrder({ type: 'dine_in', tableId: Number(tableId), items, notes: orderNotes.trim() || undefined });
    if (!r.ok) return setFormError(r.message);
    refreshTables();
    setIsAddOpen(false);
    setTableId('');
    setLines([{ menuItemId: '', quantity: 1 }]);
    setOrderNotes('');
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-500" /> Order Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitor live dining orders, update statuses, and create new guest tickets.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search order ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="served">Served</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button 
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Order
          </button>
        </div>
      </div>

      {notice && <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">{notice}</div>}
      {error && <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">{error}</div>}
      {loading && <p className="text-xs text-slate-400">Loading orders...</p>}

      {/* Orders Table Grid */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-400 border-b border-slate-200 dark:border-slate-700 text-[10px]">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Table</th>
                <th className="p-4 font-semibold">Total Amount</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">{order.displayId}</td>
                      <td className="p-4 text-slate-700 dark:text-slate-200">{order.tableLabel}</td>
                      <td className="p-4 font-extrabold text-slate-800 dark:text-white">{formatCurrency(order.total || 0)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(order.status)}`}>
                          {order.displayStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          type="button"
                          onClick={() => { setSelectedOrder(order); setIsViewOpen(true); }}
                          className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setSelectedOrder(order); setIsStatusOpen(true); }}
                          className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                          title="Change Status"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Status
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Create New Order</h3>
              <button type="button" onClick={() => setIsAddOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Table</label>
                <select
                  value={tableId}
                  onChange={(e) => setTableId(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="">Select a table</option>
                  {tables.filter((t) => t.status === 'available' || t.status === 'occupied').map((t) => (
                    <option key={t.id} value={t.id}>Table {t.table_number} ({t.capacity} seats){t.status === 'occupied' ? ' - occupied' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-slate-500">Dishes</label>
                {lines.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <select
                      value={line.menuItemId}
                      onChange={(e) => updateLine(i, { menuItemId: e.target.value })}
                      className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-2 py-2 text-slate-800 dark:text-white focus:outline-none"
                    >
                      <option value="">Choose a dish</option>
                      {menu.map((m) => (
                        <option key={m.id} value={m.id}>{m.name} - {formatCurrency(m.price)}</option>
                      ))}
                    </select>
                    <input
                      type="number" min="1" max="99"
                      value={line.quantity}
                      onChange={(e) => updateLine(i, { quantity: e.target.value })}
                      className="w-14 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-2 py-2 text-slate-800 dark:text-white focus:outline-none"
                    />
                    {lines.length > 1 && (
                      <button type="button" onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))} className="px-1 text-slate-400 hover:text-rose-500"><X className="w-4 h-4" /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setLines((prev) => [...prev, { menuItemId: '', quantity: 1 }])} className="text-emerald-600 font-semibold">+ Add another dish</button>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Note for the kitchen (optional)</label>
                <input
                  type="text"
                  maxLength={200}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              {formError && <p className="text-xs font-semibold text-rose-600">{formError}</p>}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1.5 rounded-xl text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-semibold">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {isStatusOpen && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Update Order {selectedOrder.displayId}</h3>
              <button type="button" onClick={() => setIsStatusOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="space-y-2 text-xs">
              <p className="text-slate-500">Now: <span className="font-bold">{selectedOrder.displayStatus}</span>. Move it to:</p>
              {(NEXT[selectedOrder.status] || []).length === 0 && (
                <p className="text-slate-400">This order is finished, so its status cannot change.</p>
              )}
              {formError && <p className="text-xs font-semibold text-rose-600">{formError}</p>}
              <div className="grid grid-cols-2 gap-2">
                {(NEXT[selectedOrder.status] || []).map((statusOption) => (
                  <button
                    key={statusOption}
                    type="button"
                    onClick={() => handleUpdateStatus(statusOption)}
                    className={`p-2.5 rounded-xl border text-center font-bold capitalize transition-all ${selectedOrder.status === statusOption ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100'}`}
                  >
                    {statusOption}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewOpen && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Order Details: {selectedOrder.displayId}</h3>
              <button type="button" onClick={() => setIsViewOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between"><span className="text-slate-400">Table:</span><span className="font-bold text-slate-700 dark:text-slate-200">{selectedOrder.tableLabel}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Customer:</span><span className="font-bold text-slate-700 dark:text-slate-200">{selectedOrder.customerName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Waiter:</span><span className="font-bold text-slate-700 dark:text-slate-200">{selectedOrder.waiterName || '—'}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Status:</span><span className="font-bold text-emerald-600 uppercase">{selectedOrder.displayStatus}</span></div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-1">
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>{it.name} x{it.quantity}</span><span>{formatCurrency(it.subtotal)}</span>
                  </div>
                ))}
              </div>
              {selectedOrder.notes && <p className="text-amber-600">Note: {selectedOrder.notes}</p>}
              <div className="flex justify-between"><span className="text-slate-400">Subtotal:</span><span>{formatCurrency(selectedOrder.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Tax:</span><span>{formatCurrency(selectedOrder.tax)}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Total Amount:</span><span className="font-extrabold text-slate-800 dark:text-white">{formatCurrency(selectedOrder.total || 0)}</span></div>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button type="button" onClick={() => setIsViewOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}