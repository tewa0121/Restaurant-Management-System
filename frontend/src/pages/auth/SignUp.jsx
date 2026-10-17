import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout.jsx';
import Button from '../../components/common/Button.jsx';
import { isEmail } from '../../utils/validators.js';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [status, setStatus] = useState({ loading: false, error: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEmail(formData.email)) {
      setStatus({ loading: false, error: 'Please enter a valid email address.' });
      return;
    }
    if (formData.password.length < 6) {
      setStatus({ loading: false, error: 'Password must be at least 6 characters long.' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setStatus({ loading: false, error: 'Passwords do not match.' });
      return;
    }

    setStatus({ loading: true, error: '' });
    try {
      // Simulate registration request
      await new Promise((r) => setTimeout(r, 800));
      navigate('/login', { state: { message: 'Registration successful! Please sign in.' } });
    } catch (err) {
      setStatus({ loading: false, error: err.message || 'Failed to sign up.' });
    }
  };

  return (
    <AuthLayout title="Create an account" subtitle="Sign up to get started with your restaurant portal">
      <form onSubmit={handleSubmit} className="space-y-4">
        {status.error && (
          <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
            {status.error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email address
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@resto.com"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <Button busy={status.loading} type="submit">
          Create Account
        </Button>

        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}