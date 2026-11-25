import React, { useEffect, useState } from 'react';
import { Store, Save } from 'lucide-react';
import settingsService from '../../services/settingsService';

export default function Restaurants() {
  const [form, setForm] = useState({
    restaurantName: '',
    phone: '',
    address: '',
    openingTime: '08:00',
    closingTime: '22:00',
    currency: 'USD',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await settingsService.getSettings();
        if (!active || !data) return;
        setForm({
          restaurantName: data.restaurantName ?? data.restaurant_name ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
          openingTime: (data.openingTime ?? data.opening_time ?? '08:00').slice(0, 5),
          closingTime: (data.closingTime ?? data.closing_time ?? '22:00').slice(0, 5),
          currency: data.currency ?? 'USD',
        });
      } catch (err) {
        if (active) setError(err.message || 'Failed to load restaurant profile.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');
    setError('');
    try {
      await settingsService.updateSettings({
        restaurantName: form.restaurantName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        openingTime: form.openingTime,
        closingTime: form.closingTime,
        currency: form.currency.trim() || 'USD',
      });
      setStatusMsg('Restaurant profile updated in backend settings.');
      setTimeout(() => setStatusMsg(''), 2500);
    } catch (err) {
      setError(err.message || 'Failed to update restaurant profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-gray-100 text-xs text-gray-400">
        Loading restaurant profile...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
          <Store className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Restaurant Profile</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage restaurant branch details, operating hours, and contact location.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {statusMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-bold">
          {statusMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-xs">
        <div>
          <label className="font-bold block mb-1 text-gray-700">RESTAURANT NAME</label>
          <input
            type="text"
            required
            value={form.restaurantName}
            onChange={(e) => setForm({ ...form, restaurantName: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold block mb-1 text-gray-700">PHONE</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold"
            />
          </div>
          <div>
            <label className="font-bold block mb-1 text-gray-700">CURRENCY</label>
            <input
              type="text"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="font-bold block mb-1 text-gray-700">ADDRESS</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold block mb-1 text-gray-700">OPENING TIME</label>
            <input
              type="time"
              value={form.openingTime}
              onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold"
            />
          </div>
          <div>
            <label className="font-bold block mb-1 text-gray-700">CLOSING TIME</label>
            <input
              type="time"
              value={form.closingTime}
              onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none font-semibold"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-bold cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Restaurant Info'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}