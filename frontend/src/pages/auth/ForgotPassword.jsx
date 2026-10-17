import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Button from '../../components/common/Button.jsx';
import { isEmail } from '../../utils/validators.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setStatus({ loading: false, error: 'Please enter a valid email address.', success: false });
      return;
    }

    setStatus({ loading: true, error: '', success: false });
    try {
      // Simulate backend request for password reset
      await new Promise((r) => setTimeout(r, 800));
      setStatus({ loading: false, error: '', success: true });
    } catch (err) {
      setStatus({ loading: false, error: err.message || 'Failed to send reset instructions.', success: false });
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Enter your email to receive recovery instructions">
      {status.success ? (
        <div className="space-y-4 text-center">
          <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
            Password reset instructions have been sent to <strong>{email}</strong> if an account exists.
          </div>
          <Link
            to="/login"
            className="inline-block font-medium text-brand hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status.error && (
            <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
              {status.error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@resto.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <Button busy={status.loading} type="submit">
            Send Reset Instructions
          </Button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm font-medium text-brand hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}