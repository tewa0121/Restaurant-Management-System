import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Trash2 } from 'lucide-react';
import customerService from '../../services/customerService';

export default function AddressBook() {
  const [addresses, setAddresses] = useState([]);
  const [title, setTitle] = useState('Home');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadAddresses = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await customerService.getMyAddresses();
      setAddresses(list);
    } catch (err) {
      setError(err.message || 'Failed to load addresses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    setSaving(true);
    setError('');
    try {
      await customerService.createMyAddress({
        title: title.trim() || 'Address',
        address: address.trim(),
        isDefault: addresses.length === 0,
      });
      setAddress('');
      await loadAddresses();
    } catch (err) {
      setError(err.message || 'Failed to save address.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await customerService.deleteMyAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete address.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" /> My Saved Addresses
        </h1>
        <p className="text-xs text-gray-500 mt-1">Manage delivery addresses stored in your account.</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleAdd} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Label (Home, Work)"
          className="sm:col-span-3 px-3 py-2 bg-gray-50 border rounded-xl outline-none font-semibold"
        />
        <input
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Full delivery address..."
          className="sm:col-span-6 px-3 py-2 bg-gray-50 border rounded-xl outline-none"
        />
        <button
          type="submit"
          disabled={saving}
          className="sm:col-span-3 inline-flex items-center justify-center gap-1.5 bg-emerald-600 text-white rounded-xl font-bold py-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> <span>{saving ? 'Saving...' : 'Add'}</span>
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100 text-xs">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading addresses...</div>
        ) : addresses.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No saved addresses yet.</div>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-gray-900">{addr.title || addr.label || 'Address'}</p>
                <p className="text-gray-600 mt-0.5">{addr.address || addr.street || ''}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}