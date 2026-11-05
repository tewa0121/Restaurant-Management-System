import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import authService from '../../services/authService';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('The two passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Could not reset the password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Choose a New Password</h2>
          <p className="text-sm text-gray-500">Use at least 6 characters</p>
        </div>

        {!token ? (
          <p className="text-sm text-red-600 text-center">This reset link is missing its token. Please request a new one.</p>
        ) : done ? (
          <p className="text-sm text-green-700 text-center font-medium">Password updated. Redirecting to login...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              ['New password', password, setPassword],
              ['Confirm password', confirm, setConfirm],
            ].map(([label, value, setter]) => (
              <div key={label}>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">{label}</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                  />
                </div>
              </div>
            ))}
            {error && <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <Button type="submit" variant="primary" disabled={loading}>{loading ? 'Saving...' : 'Update Password'}</Button>
          </form>
        )}

        <a href="/login" className="flex items-center justify-center space-x-1 text-xs text-gray-500 hover:text-gray-800 font-medium">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </a>
      </div>
    </div>
  );
}