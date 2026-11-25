import React, { useEffect, useState } from 'react';
import { UserCheck, Plus, Search, Trash2, X } from 'lucide-react';
import customerService from '../../services/customerService';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });

  const loadCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await customerService.getCustomers({ limit: 150 });
      setCustomers(list);
    } catch (err) {
      setError(err.message || 'Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      await customerService.createCustomer({
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
      });
      setIsAddOpen(false);
      setFormData({ name: '', email: '', phone: '', address: '' });
      await loadCustomers();
    } catch (err) {
      setError(err.message || 'Failed to create customer.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer record?')) return;
    setError('');
    try {
      await customerService.deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete customer.');
    }
  };

  const filtered = customers.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      String(c.name || c.fullName || c.full_name || '').toLowerCase().includes(q) ||
      String(c.email || '').toLowerCase().includes(q) ||
      String(c.phone || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-600" /> Customers
          </h1>
          <p className="text-xs text-gray-500 mt-1">Manage guest profiles and loyalty records.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
              className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> <span>Add Customer</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Loyalty Points</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">Loading customers...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">No customers found.</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/70">
                  <td className="p-4 font-bold text-gray-900">{c.name || c.fullName || c.full_name}</td>
                  <td className="p-4 text-gray-600">{c.email || '-'}</td>
                  <td className="p-4 text-gray-600">{c.phone || '-'}</td>
                  <td className="p-4 font-bold text-emerald-600">{c.loyaltyPoints ?? c.loyalty_points ?? 0}</td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold uppercase">Add Customer</h3>
              <button type="button" onClick={() => setIsAddOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">FULL NAME</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <label className="font-bold block mb-1">PHONE</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl font-bold cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer">
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