// src/pages/manager/TableManagement.jsx
import React, { useState } from 'react';
import { Utensils, Users, Plus, Eye, RefreshCw, X, Trash2, AlertTriangle, ShoppingBag } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

export default function TableManagement() {
  const [tables, setTables] = useState(mockDatabase.tables || []);
  const [orders, setOrders] = useState(mockDatabase.orders || []);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Modals state
  const [selectedTable, setSelectedTable] = useState(null);
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false);
  const [isAddTableOpen, setIsAddTableOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Form fields
  const [newTableNum, setNewTableNum] = useState('');
  const [newCapacity, setNewCapacity] = useState('4');
  const [newStatus, setNewStatus] = useState('available');

  const filteredTables = tables.filter(t => filterStatus === 'all' || t.status === filterStatus);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400';
      case 'occupied': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400';
      case 'reserved': return 'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-400';
      case 'cleaning': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-400';
      case 'out_of_order': return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400';
      default: return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const handleAddTable = (e) => {
    e.preventDefault();
    if (!newTableNum) return;
    setTables([...tables, { id: Date.now(), table_number: parseInt(newTableNum, 10), capacity: parseInt(newCapacity, 10), status: 'available' }]);
    setNewTableNum('');
    setIsAddTableOpen(false);
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();
    if (!selectedTable) return;
    setTables(tables.map(t => t.id === selectedTable.id ? { ...t, status: newStatus } : t));
    setIsChangeStatusOpen(false);
  };

  const confirmDelete = () => {
    if (!selectedTable) return;
    setTables(tables.filter(t => t.id !== selectedTable.id));
    setIsDeleteOpen(false);
    setSelectedTable(null);
  };

  // Find active order associated with this table number or table id
  const getOrderForTable = (table) => {
    return orders.find(o => o.table_id === table.id || o.table_id === table.table_number || (o.table && o.table.includes(table.table_number)));
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Utensils className="w-6 h-6 text-emerald-500" /> Table Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Monitor floor status and table capacity.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs">
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="reserved">Reserved</option>
            <option value="cleaning">Cleaning</option>
            <option value="out_of_order">Out of Order</option>
          </select>
          <button type="button" onClick={() => setIsAddTableOpen(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer">
            <Plus className="w-4 h-4" /> Add Table
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const tableOrder = getOrderForTable(table);
          return (
            <div key={table.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-extrabold text-slate-800 dark:text-white">Table #{table.table_number}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusStyle(table.status)}`}>{table.status.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Capacity: {table.capacity} Persons</span>
              </div>
              {tableOrder && (
                <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl text-[11px] flex justify-between items-center">
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">#{tableOrder.id}</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(tableOrder.total_amount || 45.00)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
                <button 
                  type="button" 
                  onClick={() => { setSelectedTable(table); setIsViewOrderOpen(true); }} 
                  className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> View Order
                </button>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => { setSelectedTable(table); setNewStatus(table.status); setIsChangeStatusOpen(true); }} className="text-slate-600 dark:text-slate-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
                    <RefreshCw className="w-3.5 h-3.5" /> Status
                  </button>
                  <button type="button" onClick={() => { setSelectedTable(table); setIsDeleteOpen(true); }} className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer" title="Delete Table">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Order Modal */}
      {isViewOrderOpen && selectedTable && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-indigo-500" /> Order Details: Table #{selectedTable.table_number}
              </h3>
              <button type="button" onClick={() => setIsViewOrderOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            
            {(() => {
              const activeOrder = getOrderForTable(selectedTable);
              if (!activeOrder) {
                return (
                  <div className="py-8 text-center text-slate-400">
                    No active order currently assigned to Table #{selectedTable.table_number}.
                  </div>
                );
              }
              return (
                <div className="space-y-3">
                  <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-slate-400">Order ID:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">#{activeOrder.id}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-slate-400">Status:</span>
                    <span className="font-bold text-emerald-600 uppercase">{activeOrder.status || 'Preparing'}</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <span className="text-slate-400">Total Amount:</span>
                    <span className="font-black text-slate-800 dark:text-white">{formatCurrency(activeOrder.total_amount || 45.00)}</span>
                  </div>
                </div>
              );
            })()}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button type="button" onClick={() => setIsViewOrderOpen(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && selectedTable && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Delete Table #{selectedTable.table_number}?</h3>
            </div>
            <p className="text-slate-500">Are you sure you want to remove this table? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsDeleteOpen(false)} className="px-3 py-1.5 rounded-xl text-slate-500">Cancel</button>
              <button type="button" onClick={confirmDelete} className="px-4 py-1.5 bg-rose-600 text-white rounded-xl font-semibold cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {isAddTableOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Add New Table</h3>
            <form onSubmit={handleAddTable} className="space-y-3 text-xs">
              <input type="number" placeholder="Table Number" value={newTableNum} onChange={(e) => setNewTableNum(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-700 border rounded-xl px-3 py-2" />
              <select value={newCapacity} onChange={(e) => setNewCapacity(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border rounded-xl px-3 py-2">
                <option value="2">2 Persons</option><option value="4">4 Persons</option><option value="6">6 Persons</option><option value="8">8 Persons</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddTableOpen(false)} className="px-3 py-1.5 text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {isChangeStatusOpen && selectedTable && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Update Status: Table #{selectedTable.table_number}</h3>
            <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border rounded-xl px-3 py-2">
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="cleaning">Cleaning</option>
                <option value="out_of_order">Out of Order</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsChangeStatusOpen(false)} className="px-3 py-1.5 text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-semibold">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}