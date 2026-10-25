// src/pages/admin/PaymentManagement.jsx
import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, Edit, X } from 'lucide-react';

export default function PaymentManagement() {
  const [payments, setPayments] = useState([
    { id: '#PAY-901', orderId: '#ORD-1249', method: 'TeleBirr', amount: '$78.20', status: 'Completed' },
    { id: '#PAY-902', orderId: '#ORD-1250', method: 'Cash', amount: '$45.50', status: 'Completed' },
    { id: '#PAY-903', orderId: '#ORD-1248', method: 'CBE Birr', amount: '$32.00', status: 'Pending' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ orderId: '', method: 'TeleBirr', amount: '', status: 'Completed' });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ orderId: '', method: 'TeleBirr', amount: '', status: 'Completed' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setPayments(payments.map(p => p.id === editingItem.id ? { ...p, ...formData } : p));
    } else {
      setPayments([{ id: `#PAY-${Math.floor(900 + Math.random() * 100)}`, ...formData }, ...payments]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete payment log ${id}?`)) {
      setPayments(payments.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Payment Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Audit customer transactions, digital payment gateways (TeleBirr, CBE Birr), and receipts.</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#122448] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Payment ID</th>
              <th className="p-4">Order Ref</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                <td className="p-4 font-bold text-purple-600 dark:text-purple-400">{p.id}</td>
                <td className="p-4 font-bold text-indigo-500">{p.orderId}</td>
                <td className="p-4 font-semibold">{p.method}</td>
                <td className="p-4 font-extrabold text-emerald-600">{p.amount}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(p)} className="p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer transition"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl p-6 space-y-4 text-xs text-gray-800 dark:text-white">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">{editingItem ? 'Edit Payment' : 'Record Payment'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">ORDER ID</label>
                <input type="text" required placeholder="#ORD-1250" value={formData.orderId} onChange={(e) => setFormData({ ...formData, orderId: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">METHOD</label>
                  <select value={formData.method} onChange={(e) => setFormData({ ...formData, method: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none">
                    <option value="TeleBirr">TeleBirr</option>
                    <option value="CBE Birr">CBE Birr</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">AMOUNT ($)</label>
                  <input type="text" required placeholder="45.50" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">STATUS</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none">
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-lg cursor-pointer">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}