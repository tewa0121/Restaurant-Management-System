import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { normalizeRole, ROLE_PRIORITY } from '../../utils/constants.js';
import { isEmail } from '../../utils/validators.js';
import Button from '../../components/common/Button.jsx';
import Icon from '../../components/common/Icon.jsx';
import AuthLayout from '../../components/layout/AuthLayout.jsx';

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100';

const FEATURES = [
  ['shield', 'Secure & Reliable', 'Your data is safe with us'],
  ['clock', '24/7 Support', "We're here to help anytime"],
  ['chart', 'Powerful Analytics', 'Make data-driven decisions'],
  ['device', 'Access Anywhere', 'Use on any device, anytime'],
];

export default function Login() {
  const { user, primaryRole, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState('');

  // If already logged in, redirect directly to their dashboard
  if (user && primaryRole) {
    return <Navigate to={`/${primaryRole}`} replace />;
  }

  const handleChange = (key) => (e) => {
    setForm({
      ...form,
      [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!isEmail(form.email.trim())) {
      return setError('Please enter a valid email address.');
    }
    if (!form.password) {
      return setError('Please enter your password.');
    }

    setBusy(true);

    try {
      const signedInUser = await login(form.email.trim(), form.password, form.remember);
      const roles = signedInUser.roles.map(normalizeRole);
      const targetRole = ROLE_PRIORITY.find((r) => roles.includes(r)) || 'admin';
      
      navigate(`/${targetRole}`, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Cannot connect to login service. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid w-full max-w-md gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Back!</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Sign in to your account to continue
          </p>
        </div>

        {info && (
          <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm dark:bg-slate-700">{info}</p>
        )}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </p>
        )}

        {/* Email Input */}
        <label className="grid gap-1 text-sm font-medium">
          Email Address
          <span className="relative text-slate-400">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Icon name="mail" />
            </span>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="Enter your email"
              autoComplete="username"
              className={inputClass}
            />
          </span>
        </label>

        {/* Password Input */}
        <label className="grid gap-1 text-sm font-medium">
          Password
          <span className="relative text-slate-400">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <Icon name="lock" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-slate-600"
            >
              <Icon name={showPassword ? 'eyeOff' : 'eye'} />
            </button>
          </span>
        </label>

        {/* Remember me & Forgot Password */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={handleChange('remember')}
              className="h-4 w-4 accent-brand"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-brand hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button busy={busy}>
          <Icon name="login" size={18} />
          {busy ? 'Signing in…' : 'Login'}
        </Button>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <hr className="flex-1 border-slate-200 dark:border-slate-600" />
          or sign in with
          <hr className="flex-1 border-slate-200 dark:border-slate-600" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-2">
          {['Google', 'Microsoft', 'Apple'].map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => setInfo(`${provider} sign-in is not configured yet.`)}
              className="rounded-lg border border-slate-300 px-2 py-2.5 text-sm font-medium hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
            >
              {provider}
            </button>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-brand hover:underline">
            Sign Up
          </Link>
        </p>
      </form>

      {/* Feature Badges under form */}
      <ul className="grid w-full max-w-2xl grid-cols-2 gap-6 text-center text-sm sm:grid-cols-4">
        {FEATURES.map(([icon, title, desc]) => (
          <li key={title} className="grid justify-items-center gap-1">
            <span className="text-brand">
              <Icon name={icon} size={28} />
            </span>
            <strong>{title}</strong>
            <span className="text-slate-500 dark:text-slate-400">{desc}</span>
          </li>
        ))}
      </ul>
    </AuthLayout>
  );
}