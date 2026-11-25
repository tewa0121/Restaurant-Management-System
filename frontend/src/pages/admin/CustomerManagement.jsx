import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit3, Trash2, X } from 'lucide-react';
import customerService from '../../services/customerService';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'regular',
  });

  const { showNotification } = useNotification();

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getCustomers({ limit: 100 });
      setCustomers(data);
    } catch (err) {
      showNotification(err.message || 'Failed to load customers.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const name = String(c.name || c.fullName || c.full_name || '').toLowerCase();
    const phone = String(c.phone || '');
    const email = String(c.email || '').toLowerCase();
    const q = searchTerm.trim().toLowerCase();
    return !q || name.includes(q) || phone.includes(q) || email.includes(q);
  });

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name || customer.fullName || customer.full_name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        status: String(customer.status || 'regular').toLowerCase(),
      });
    } else {
      setEditingCustomer(null);
      setFormData({ name: '', email: '', phone: '', status: 'regular' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        status: String(formData.status || 'regular').toLowerCase(),
      };

      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, payload);
        showNotification('Customer updated successfully.', 'success');
      } else {
        await customerService.createCustomer(payload);
        showNotification('Customer added successfully.', 'success');
      }

      setIsModalOpen(false);
      setEditingCustomer(null);
      await loadCustomers();
    } catch (err) {
      showNotification(err.message || 'Failed to save customer.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete customer ${name}?`)) return;
    try {
      await customerService.deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      showNotification('Customer deleted.', 'success');
    } catch (err) {
      showNotification(err.message || 'Failed to delete customer.', 'error');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Customer Management</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage customer profiles, contact details, visits, and loyalty status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase font-extrabold text-[10px]">
                <th className="p-4">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Visits</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => {
                  const displayName = c.name || c.fullName || c.full_name || 'Customer';
                  const visits = Number(c.visits ?? c.totalVisits ?? c.total_visits ?? 0);
                  const spent = Number(c.totalSpent ?? c.total_spent ?? 0);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/70">
                      <td className="p-4 font-bold text-gray-900">{displayName}</td>
                      <td className="p-4 text-gray-500">
                        <div>{c.phone || '-'}</div>
                        <div className="text-[11px] text-gray-400">{c.email || ''}</div>
                      </td>
                      <td className="p-4 font-semibold">{visits}</td>
                      <td className="p-4 font-extrabold text-emerald-600">
                        {formatCurrency ? formatCurrency(spent) : `$${spent.toFixed(2)}`}
                      </td>
                      <td className="p-4 capitalize font-bold">{c.status || 'regular'}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(c)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(c.id, displayName)}
                          className="p-1.5 bg-rose-50 text-rose-600 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100">
              <h3 className="font-extrabold uppercase">
                {editingCustomer ? 'Edit Customer' : 'Add Customer'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">NAME</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">PHONE</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">EMAIL</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">STATUS</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                >
                  <option value="new">New</option>
                  <option value="regular">Regular</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 disabled:opacity-60 text-white rounded-xl font-bold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}