import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Store, User, KeyRound, CheckCircle2, Lock } from 'lucide-react';
import settingsService from '../../services/settingsService';
import { updateProfileRequest, changePasswordRequest } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

const inputClass =
  'w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border rounded-xl text-xs outline-none focus:border-emerald-500';

const Notice = ({ ok, children }) =>
  children ? (
    <div
      className={`p-3 rounded-xl border text-xs font-semibold ${
        ok ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'
      }`}
    >
      {children}
    </div>
  ) : null;

const ReadOnly = ({ label, value }) => (
  <div>
    <p className="text-[11px] font-semibold text-slate-400">{label}</p>
    <p className="text-xs font-semibold text-slate-800 dark:text-white">{value || '—'}</p>
  </div>
);

export default function Settings() {
  const { user, token, login } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [restaurantError, setRestaurantError] = useState('');

  const [fullName, setFullName] = useState(user?.fullName || user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState({ ok: true, text: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ ok: true, text: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let active = true;
    settingsService
      .getSettings()
      .then((data) => {
        if (active) setRestaurant(data);
      })
      .catch((err) => {
        if (active) setRestaurantError(err.message || 'Failed to load restaurant settings.');
      });
    return () => {
      active = false;
    };
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg({ ok: true, text: '' });
    try {
      const res = await updateProfileRequest({ fullName: fullName.trim(), phone: phone.trim() });
      const updated = res?.user;
      if (updated) {
        // keep the session, refresh the name shown in the header
        const remember = Boolean(localStorage.getItem('token'));
        await login({ ...user, ...updated }, token, remember);
      }
      setProfileMsg({ ok: true, text: 'Profile updated.' });
    } catch (err) {
      setProfileMsg({ ok: false, text: err.message || 'Failed to update profile.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordMsg({ ok: false, text: 'The new password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ ok: false, text: 'The new passwords do not match.' });
      return;
    }
    setSavingPassword(true);
    setPasswordMsg({ ok: true, text: '' });
    try {
      await changePasswordRequest(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordMsg({ ok: true, text: 'Password changed.' });
    } catch (err) {
      setPasswordMsg({ ok: false, text: err.message || 'Failed to change password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen font-sans max-w-4xl">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-slate-500" /> Settings
        </h1>
        <p className="text-xs text-slate-500">Your account and the restaurant configuration.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600" /> Restaurant
          </h3>
          <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
            <Lock className="w-3 h-3" /> Only an admin can change these
          </span>
        </div>
        <Notice>{restaurantError}</Notice>
        {restaurant ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ReadOnly label="Name" value={restaurant.restaurantName} />
            <ReadOnly label="Phone" value={restaurant.phone} />
            <ReadOnly label="Support email" value={restaurant.supportEmail} />
            <ReadOnly label="Address" value={restaurant.address} />
            <ReadOnly label="Currency" value={restaurant.currency} />
            <ReadOnly label="Tax rate" value={`${restaurant.taxRate}%`} />
            <ReadOnly label="Delivery fee" value={`${restaurant.currency} ${Number(restaurant.deliveryFee).toFixed(2)}`} />
            <ReadOnly
              label="Opening hours"
              value={restaurant.openingTime && restaurant.closingTime ? `${String(restaurant.openingTime).slice(0, 5)} – ${String(restaurant.closingTime).slice(0, 5)}` : ''}
            />
            <ReadOnly label="Notifications" value={restaurant.notificationsEnabled ? 'On' : 'Off'} />
          </div>
        ) : (
          !restaurantError && <p className="text-xs text-slate-400">Loading...</p>
        )}
      </div>

      <form onSubmit={saveProfile} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600" /> My Profile
        </h3>
        <Notice ok={profileMsg.ok}>{profileMsg.text}</Notice>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500">Full name</span>
            <input required minLength={2} maxLength={100} value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500">Phone</span>
            <input maxLength={20} value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="text-[11px] font-semibold text-slate-500">Email (cannot be changed here)</span>
            <input value={user?.email || ''} disabled className={`${inputClass} opacity-60`} />
          </label>
        </div>
        <button type="submit" disabled={savingProfile} className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold cursor-pointer">
          <CheckCircle2 className="w-4 h-4" /> {savingProfile ? 'Saving...' : 'Save profile'}
        </button>
      </form>

      <form onSubmit={savePassword} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-emerald-600" /> Change Password
        </h3>
        <Notice ok={passwordMsg.ok}>{passwordMsg.text}</Notice>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500">Current password</span>
            <input type="password" required autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500">New password</span>
            <input type="password" required minLength={8} autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} />
          </label>
          <label className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500">Confirm new password</span>
            <input type="password" required minLength={8} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} />
          </label>
        </div>
        <button type="submit" disabled={savingPassword} className="px-5 py-2 bg-slate-900 hover:bg-slate-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold cursor-pointer">
          {savingPassword ? 'Changing...' : 'Change password'}
        </button>
      </form>
    </div>
  );
}
