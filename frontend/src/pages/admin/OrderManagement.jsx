// // src/pages/admin/OrderManagement.jsx
// import React, { useState } from 'react';
// import { ShoppingBag, Plus, Trash2, Edit, X } from 'lucide-react';

// export default function OrderManagement() {
//   const [orders, setOrders] = useState([
//     { id: '#ORD-1250', customer: 'John Smith', table: 'Table 5', items: '3 items', amount: '$45.50', status: 'Completed' },
//     { id: '#ORD-1249', customer: 'Sarah Johnson', table: 'Table 12', items: '5 items', amount: '$78.20', status: 'Preparing' },
//     { id: '#ORD-1248', customer: 'Michael Brown', table: 'Table 3', items: '2 items', amount: '$32.00', status: 'Pending' },
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingOrder, setEditingOrder] = useState(null); // null = Create, object = Edit
  
//   const [formData, setFormData] = useState({
//     customer: '',
//     table: 'Table 1',
//     items: '1 item',
//     amount: '',
//     status: 'Pending',
//   });

//   // Open modal for Create New Order
//   const handleOpenAdd = () => {
//     setEditingOrder(null);
//     setFormData({ customer: '', table: 'Table 1', items: '1 item', amount: '', status: 'Pending' });
//     setIsModalOpen(true);
//   };

//   // Open modal for Edit/Update Order Status
//   const handleOpenEdit = (ord) => {
//     setEditingOrder(ord);
//     setFormData({
//       customer: ord.customer,
//       table: ord.table,
//       items: ord.items,
//       amount: ord.amount,
//       status: ord.status,
//     });
//     setIsModalOpen(true);
//   };

//   // Handle Form Submit (Create or Update)
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.customer || !formData.amount) return;

//     if (editingOrder) {
//       // Update existing order
//       setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, ...formData } : o));
//     } else {
//       // Create new order
//       const newOrder = {
//         id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
//         ...formData,
//       };
//       setOrders([newOrder, ...orders]);
//     }

//     setIsModalOpen(false);
//     setEditingOrder(null);
//   };

//   // Handle Delete with Confirmation
//   const handleDelete = (id) => {
//     if (window.confirm(`Are you sure you want to delete order ${id}? This action cannot be undone.`)) {
//       setOrders(orders.filter(o => o.id !== id));
//     }
//   };

//   return (
//     <div className="space-y-6 font-sans">
      
//       {/* Header Section with Create Order Button */}
//       <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
//         <div>
//           <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Order Management</h1>
//           <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitor real-time transactions, kitchen preparation status, and billing.</p>
//         </div>
//         <button 
//           onClick={handleOpenAdd}
//           className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition cursor-pointer"
//         >
//           <Plus className="w-4 h-4" />
//           <span>Create Order</span>
//         </button>
//       </div>

//       {/* Orders Table */}
//       <div className="bg-white dark:bg-[#122448] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs border-collapse">
//             <thead>
//               <tr className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 uppercase font-extrabold text-[10px]">
//                 <th className="p-4">Order ID</th>
//                 <th className="p-4">Customer</th>
//                 <th className="p-4">Table</th>
//                 <th className="p-4">Items</th>
//                 <th className="p-4">Amount</th>
//                 <th className="p-4">Status</th>
//                 <th className="p-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
//               {orders.length > 0 ? (
//                 orders.map((ord) => (
//                   <tr key={ord.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
//                     <td className="p-4 font-bold text-brand">{ord.id}</td>
//                     <td className="p-4 font-semibold">{ord.customer}</td>
//                     <td className="p-4 text-gray-500 dark:text-gray-400">{ord.table}</td>
//                     <td className="p-4 text-gray-500 dark:text-gray-400">{ord.items}</td>
//                     <td className="p-4 font-extrabold text-gray-900 dark:text-white">{ord.amount}</td>
//                     <td className="p-4">
//                       <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
//                         ord.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' :
//                         ord.status === 'Preparing' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400' : 
//                         'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400'
//                       }`}>
//                         {ord.status}
//                       </span>
//                     </td>
//                     <td className="p-4 text-right space-x-2">
//                       <button 
//                         onClick={() => handleOpenEdit(ord)} 
//                         className="p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer transition"
//                         title="Edit Order"
//                       >
//                         <Edit className="w-4 h-4" />
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(ord.id)} 
//                         className="p-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition"
//                         title="Delete Order"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="p-8 text-center text-gray-400">No orders found.</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Create / Edit Order Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800 dark:text-white animate-in fade-in zoom-in duration-150">
//             <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
//               <h3 className="font-extrabold uppercase">{editingOrder ? 'Edit Order' : 'Create New Order'}</h3>
//               <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
            
//             <form onSubmit={handleSubmit} className="space-y-3">
//               <div>
//                 <label className="font-bold block mb-1">CUSTOMER NAME</label>
//                 <input 
//                   type="text" 
//                   required 
//                   placeholder="e.g. Samuel Abebe"
//                   value={formData.customer} 
//                   onChange={(e) => setFormData({ ...formData, customer: e.target.value })} 
//                   className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white" 
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="font-bold block mb-1">TABLE</label>
//                   <select 
//                     value={formData.table} 
//                     onChange={(e) => setFormData({ ...formData, table: e.target.value })} 
//                     className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
//                   >
//                     <option value="Table 1">Table 1</option>
//                     <option value="Table 2">Table 2</option>
//                     <option value="Table 3">Table 3</option>
//                     <option value="Table 5">Table 5</option>
//                     <option value="Table 12">Table 12</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="font-bold block mb-1">AMOUNT ($)</label>
//                   <input 
//                     type="text" 
//                     required 
//                     placeholder="45.50"
//                     value={formData.amount} 
//                     onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
//                     className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white" 
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="font-bold block mb-1">ITEMS SUMMARY</label>
//                   <input 
//                     type="text" 
//                     placeholder="3 items"
//                     value={formData.items} 
//                     onChange={(e) => setFormData({ ...formData, items: e.target.value })} 
//                     className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white" 
//                   />
//                 </div>
//                 <div>
//                   <label className="font-bold block mb-1">STATUS</label>
//                   <select 
//                     value={formData.status} 
//                     onChange={(e) => setFormData({ ...formData, status: e.target.value })} 
//                     className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="Preparing">Preparing</option>
//                     <option value="Completed">Completed</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
//                 <button 
//                   type="button" 
//                   onClick={() => setIsModalOpen(false)} 
//                   className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold cursor-pointer text-gray-600 dark:text-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg cursor-pointer"
//                 >
//                   {editingOrder ? 'Update Order' : 'Save Order'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }




// src/pages/admin/OrderManagement.jsx
// Every order of the restaurant. Real data; status changes follow the server's rules.
// Orders are a financial record, so they are CANCELLED (kept), never deleted.
import React, { useEffect, useState } from 'react';
import { Plus, XCircle, Edit, X } from 'lucide-react';
import useOrders, { apiRequest, timeOf } from '../../hooks/useOrders';
import useTables from '../../hooks/useTables';

// The steps the server allows from each status
const NEXT = {
  pending: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['served', 'cancelled'],
  served: ['completed'],
  completed: [],
  cancelled: [],
};
const BADGE = {
  completed: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400',
  preparing: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400',
  ready: 'bg-teal-50 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400',
  served: 'bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400',
  cancelled: 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400',
  pending: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400',
};
const FIELD = 'w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white';

export default function OrderManagement() {
  const { orders, loading, error, notice, createOrder, changeStatus } = useOrders({ limit: 200, pollMs: 15000 });
  const { tables, refresh: refreshTables } = useTables();

  const [menu, setMenu] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState(null); // the order whose status is being changed
  const [formError, setFormError] = useState('');
  const [actionError, setActionError] = useState('');

  const [tableId, setTableId] = useState('');
  const [lines, setLines] = useState([{ menuItemId: '', quantity: 1 }]);
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    if (!isCreateOpen) return;
    apiRequest('GET', '/menu').then((json) => setMenu(json.data || [])).catch((e) => setFormError(e.message));
  }, [isCreateOpen]);

  const closeAll = () => { setIsCreateOpen(false); setStatusOrder(null); setFormError(''); };

  const updateLine = (index, changes) =>
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, ...changes } : l)));

  const handleCreate = async (e) => {
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
    setTableId(''); setLines([{ menuItemId: '', quantity: 1 }]); setOrderNotes('');
    closeAll();
  };

  const handleStatus = async (next) => {
    setFormError('');
    const r = await changeStatus(statusOrder.id, next, `Order ${statusOrder.orderNumber} is now ${next}.`);
    if (!r.ok) return setFormError(r.message);
    closeAll();
  };

  const handleCancel = async (ord) => {
    if (!window.confirm(`Cancel order ${ord.displayId}? The order stays in the records as cancelled.`)) return;
    setActionError('');
    const r = await changeStatus(ord.id, 'cancelled', `Order ${ord.orderNumber} was cancelled.`);
    if (!r.ok) setActionError(r.message);
  };

  return (
    <div className="space-y-6 font-sans">

      {/* Header Section with Create Order Button */}
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Order Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitor real-time transactions, kitchen preparation status, and billing.</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Order</span>
        </button>
      </div>

      {notice && <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">{notice}</div>}
      {(error || actionError) && <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">{actionError || error}</div>}
      {loading && <p className="text-xs text-gray-400">Loading orders...</p>}

      {/* Orders Table */}
      <div className="bg-white dark:bg-[#122448] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 uppercase font-extrabold text-[10px]">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Table</th>
                <th className="p-4">Items</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Time</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
              {orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="p-4 font-bold text-brand">{ord.displayId}</td>
                    <td className="p-4 font-semibold">{ord.customerName}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{ord.tableLabel}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{ord.itemCount} {ord.itemCount === 1 ? 'item' : 'items'}</td>
                    <td className="p-4 font-extrabold text-gray-900 dark:text-white">${ord.total.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${BADGE[ord.status] || BADGE.pending}`}>
                        {ord.displayStatus}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{timeOf(ord.orderedAt)}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => { setFormError(''); setStatusOrder(ord); }}
                        disabled={NEXT[ord.status].length === 0}
                        className="p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Change status"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCancel(ord)}
                        disabled={!NEXT[ord.status].includes('cancelled')}
                        className="p-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Cancel order"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                !loading && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-400">No orders found.</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800 dark:text-white">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">Create New Order</h3>
              <button onClick={closeAll} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">TABLE</label>
                <select value={tableId} onChange={(e) => setTableId(e.target.value)} className={FIELD}>
                  <option value="">Select a table</option>
                  {tables.filter((t) => t.status === 'available' || t.status === 'occupied').map((t) => (
                    <option key={t.id} value={t.id}>Table {t.table_number} ({t.capacity} seats){t.status === 'occupied' ? ' - occupied' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="font-bold block">DISHES</label>
                {lines.map((line, i) => (
                  <div key={i} className="flex gap-2">
                    <select value={line.menuItemId} onChange={(e) => updateLine(i, { menuItemId: e.target.value })} className={`${FIELD} flex-1 min-w-0`}>
                      <option value="">Choose a dish</option>
                      {menu.map((m) => (
                        <option key={m.id} value={m.id}>{m.name} - ${Number(m.price).toFixed(2)}</option>
                      ))}
                    </select>
                    <input type="number" min="1" max="99" value={line.quantity} onChange={(e) => updateLine(i, { quantity: e.target.value })} className={`${FIELD} w-16`} />
                    {lines.length > 1 && (
                      <button type="button" onClick={() => setLines((prev) => prev.filter((_, idx) => idx !== i))} className="px-1 text-gray-400 hover:text-rose-500"><X className="w-4 h-4" /></button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setLines((prev) => [...prev, { menuItemId: '', quantity: 1 }])} className="text-emerald-600 font-bold">+ Add another dish</button>
              </div>

              <div>
                <label className="font-bold block mb-1">NOTE FOR THE KITCHEN (OPTIONAL)</label>
                <input type="text" maxLength={200} value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} className={FIELD} />
              </div>

              {formError && <p className="text-xs font-semibold text-rose-600">{formError}</p>}

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={closeAll} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold cursor-pointer text-gray-600 dark:text-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg cursor-pointer">
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {statusOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-sm rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800 dark:text-white">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">Update {statusOrder.displayId}</h3>
              <button onClick={closeAll} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-500">Now: <span className="font-bold">{statusOrder.displayStatus}</span>. Move it to:</p>
            {formError && <p className="text-xs font-semibold text-rose-600">{formError}</p>}
            <div className="grid grid-cols-2 gap-2">
              {NEXT[statusOrder.status].map((next) => (
                <button
                  key={next}
                  type="button"
                  onClick={() => handleStatus(next)}
                  className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#0b1d3a] font-bold capitalize hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition cursor-pointer"
                >
                  {next}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}