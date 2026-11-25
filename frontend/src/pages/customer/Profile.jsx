import React, { useEffect, useState } from 'react';
import { User, Save } from 'lucide-react';
import authService from '../../services/authService';
import http from '../../services/http';

export default function CustomerProfile() {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const user = await authService.fetchMe();
        if (active && user) {
          setProfile({
            name: user.fullName || user.full_name || user.name || '',
            email: user.email || '',
            phone: user.phone || '',
          });
        }
      } catch (err) {
        if (active) setError(err.message || 'Failed to load profile.');
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
    setMsg('');
    setError('');
    try {
      await http.put('/auth/profile', {
        fullName: profile.name.trim(),
        phone: profile.phone.trim() || undefined,
      });
      setMsg('Profile updated.');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="bg-white p-8 rounded-2xl border text-xs text-gray-400">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <User className="w-6 h-6 text-emerald-600" />
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">My Profile</h1>
          <p className="text-xs text-gray-500">Update your account contact information.</p>
        </div>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>}
      {msg && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold">{msg}</div>}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-xs">
        <div>
          <label className="font-bold block mb-1">FULL NAME</label>
          <input
            type="text"
            required
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none font-semibold"
          />
        </div>
        <div>
          <label className="font-bold block mb-1">EMAIL</label>
          <input
            type="email"
            disabled
            value={profile.email}
            className="w-full px-3 py-2 bg-gray-100 border rounded-xl text-gray-500 outline-none"
          />
        </div>
        <div>
          <label className="font-bold block mb-1">PHONE</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none font-semibold"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer"
        >
          <Save className="w-4 h-4" /> <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </form>
    </div>
  );
}