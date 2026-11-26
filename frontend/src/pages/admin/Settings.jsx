import React, { useEffect, useState } from 'react';
import settingsService from '../../services/settingsService';

export default function Settings() {
  const [settings, setSettings] = useState({
    restaurantName: '',
    address: '',
    phone: '',
    currency: 'USD',
    taxRate: 0,
    deliveryFee: 0,
    openingTime: '08:00',
    closingTime: '22:00',
    receiptFooter: '',
    supportEmail: '',
    notificationsEnabled: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadSettings() {
      setLoading(true);
      setError('');
      try {
        const data = await settingsService.getSettings();
        if (!active || !data) return;
        setSettings({
          restaurantName: data.restaurantName ?? data.restaurant_name ?? '',
          address: data.address ?? '',
          phone: data.phone ?? '',
          currency: data.currency ?? 'USD',
          taxRate: Number(data.taxRate ?? data.tax_rate ?? 0),
          deliveryFee: Number(data.deliveryFee ?? data.delivery_fee ?? 0),
          openingTime: (data.openingTime ?? data.opening_time ?? '08:00').slice(0, 5),
          closingTime: (data.closingTime ?? data.closing_time ?? '22:00').slice(0, 5),
          receiptFooter: data.receiptFooter ?? data.receipt_footer ?? '',
          supportEmail: data.supportEmail ?? '',
          notificationsEnabled: Boolean(
            data.notificationsEnabled ?? data.notifications_enabled ?? true
          ),
        });
      } catch (err) {
        if (active) setError(err.message || 'Failed to load settings.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadSettings();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await settingsService.updateSettings({
        restaurantName: settings.restaurantName.trim(),
        address: settings.address.trim(),
        phone: settings.phone.trim(),
        currency: settings.currency.trim() || 'USD',
        taxRate: Number(settings.taxRate) || 0,
        deliveryFee: Number(settings.deliveryFee) || 0,
        openingTime: settings.openingTime || undefined,
        closingTime: settings.closingTime || undefined,
        receiptFooter: settings.receiptFooter.trim(),
        supportEmail: settings.supportEmail.trim() || undefined,
        notificationsEnabled: Boolean(settings.notificationsEnabled),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#122448] p-8 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs text-gray-400">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Configure global platform preferences, tax policies, and restaurant metadata.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#122448] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 text-xs"
      >
        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 font-semibold rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        {saved && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            ✓ Settings saved successfully!
          </div>
        )}

        <div>
          <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">
            RESTAURANT SYSTEM NAME
          </label>
          <input
            type="text"
            required
            value={settings.restaurantName}
            onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">PHONE</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">CURRENCY</label>
            <input
              type="text"
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">
              TAX RATE (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={settings.taxRate}
              onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">
              DELIVERY FEE
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={settings.deliveryFee}
              onChange={(e) => setSettings({ ...settings, deliveryFee: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">
              OPENING TIME
            </label>
            <input
              type="time"
              value={settings.openingTime}
              onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">
              CLOSING TIME
            </label>
            <input
              type="time"
              value={settings.closingTime}
              onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">ADDRESS</label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">
            SUPPORT EMAIL (shown on the customer Help page)
          </label>
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">
            RECEIPT FOOTER
          </label>
          <input
            type="text"
            value={settings.receiptFooter}
            onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="notifEnabled"
            checked={settings.notificationsEnabled}
            onChange={(e) => setSettings({ ...settings, notificationsEnabled: e.target.checked })}
            className="w-4 h-4 accent-emerald-600"
          />
          <label htmlFor="notifEnabled" className="font-bold text-gray-700 dark:text-gray-300">
            Enable System Notifications
          </label>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl font-bold shadow-md cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}