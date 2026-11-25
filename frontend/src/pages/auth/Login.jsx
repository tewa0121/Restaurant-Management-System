import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Globe, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const loginImage = '/assets/food-placeholders/login.png';

const resolveDestination = (user) => {
  const rawRole = String(
    user?.role || user?.userType || user?.type || user?.designation || ''
  )
    .trim()
    .toLowerCase();

  if (['admin', 'superadmin', 'super administrator', 'administrator'].includes(rawRole)) {
    return '/admin/panel/dashboard';
  }
  if (['manager', 'restaurant manager'].includes(rawRole)) {
    return '/manager/dashboard';
  }
  if (['cashier'].includes(rawRole)) {
    return '/cashier/dashboard';
  }
  if (['kitchen', 'chef'].includes(rawRole)) {
    return '/kitchen/dashboard';
  }
  if (['waiter'].includes(rawRole)) {
    return '/waiter/dashboard';
  }
  return '/';
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await authLogin(email, password, rememberMe);
      const destination = resolveDestination(loggedInUser);
      navigate(destination, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed. Please check your email and password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1a1a1a] h-full items-center justify-center p-3 overflow-hidden">
        <img
          src={loginImage}
          alt="Restaurant Background"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80';
          }}
          className="w-full h-[90%] object-cover object-center rounded-2xl shadow-2xl"
        />
      </div>

      <div className="w-full lg:w-1/2 h-full flex flex-col items-center justify-center bg-[#fafafa] px-6">
        <div className="w-full max-w-[420px] bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-gray-900">Staff & Admin Sign In</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Sign in to access your role dashboard
              </p>
            </div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent outline-none cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Amharic">አማርኛ</option>
              </select>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@restaurant.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-gray-400 hover:text-gray-600 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>Remember me</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl font-extrabold flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}