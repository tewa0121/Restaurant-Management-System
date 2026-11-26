// src/pages/cashier/Customers.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { Users, Search, Award, Phone, Mail, Plus, RefreshCw } from 'lucide-react';
import customerService from '../../services/customerService';
import usePolling from '../../hooks/usePolling';

const STATUS_BADGE = {
  VIP: 'bg-purple-100 text-purple-700',
  Regular: 'bg-amber-100 text-amber-700',
  New: 'bg-emerald-100 text-emerald-700',
};

const EMPTY_FORM = { name: '', phone: '', email: '' };

export function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // debounce the search box so we do not hit the API on every key
  useEffect(() => {
    const id = setTimeout(() => setQuery(searchTerm.trim()), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const load = useCallback(
    async (silent = false) => {
      if (silent !== true) setLoading(true);
      try {
        const list = await customerService.getCustomers({ search: query || undefined, limit: 100 });
        setCustomers(list);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load customers.');
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    load();
  }, [load]);

  usePolling(() => load(true), 30000);

  const closeModal = () => {
    setShowAddModal(false);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    setSaving(true);
    setFormError('');
    try {
      await customerService.createCustomer({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
      });
      closeModal();
      await load(true);
    } catch (err) {
      setFormError(err.message || 'Failed to save the customer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" /> Cashier Customer Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium">Look up customers, see their loyalty points, and register new ones.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl text-xs font-medium border border-slate-200 outline-none shadow-sm"
            />
          </div>
          <button
            type="button"
            onClick={() => load()}
            className="p-2.5 bg-slate-900 text-white rounded-xl cursor-pointer shrink-0"
            aria-label="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Contact Phone</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Status</th>
              <th className="p-4">Loyalty Points</th>
              <th className="p-4 text-right">Total Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-400">Loading customers...</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-400 font-bold">
                  {query ? 'No customers found matching search.' : 'No customers registered yet.'}
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-[10px]">
                        {(c.name || '?').charAt(0).toUpperCase()}
                      </div>
                      {c.name}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" /> {c.phone || '-'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" /> {c.email || '-'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${STATUS_BADGE[c.status] || STATUS_BADGE.Regular}`}>
                      {c.status || 'Regular'}
                    </span>
                  </td>
                  <td className="p-4 font-black text-emerald-600">
                    <span className="inline-flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> {Number(c.loyaltyPoints ?? 0)} pts
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-slate-900">{Number(c.visits ?? 0)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Register New Customer</h3>
            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Alex Turner"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. +251 91 123 4567"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. alex@example.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>

              {formError && <p className="text-rose-600 font-semibold">{formError}</p>}

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl cursor-pointer shadow-sm"
                >
                  {saving ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;
