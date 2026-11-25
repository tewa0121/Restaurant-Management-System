import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const loginImage = '/assets/food-placeholders/login.png';

const resolveDestination = (user) => {
  const roleList = [
    ...(Array.isArray(user?.roles) ? user.roles : []),
    user?.role,
    user?.primaryRole,
    user?.userType,
    user?.type,
    user?.designation,
  ]
    .filter(Boolean)
    .map((r) => String(r).trim().toLowerCase());

  const has = (candidates) => roleList.some((r) => candidates.includes(r));

  if (has(['admin', 'superadmin', 'super administrator', 'administrator'])) {
    return '/admin/panel/dashboard';
  }
  if (has(['manager', 'restaurant manager'])) {
    return '/manager/dashboard';
  }
  if (has(['cashier'])) {
    return '/cashier/dashboard';
  }
  if (has(['kitchen', 'kitchen staff', 'chef'])) {
    return '/kitchen/dashboard';
  }
  if (has(['waiter'])) {
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

  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await authLogin(email, password, rememberMe);
      const fromPath = location.state?.from?.pathname;
      const destination =
        fromPath && !['/admin', '/login'].includes(fromPath)
          ? fromPath
          : resolveDestination(loggedInUser);
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
    <div className="flex h-screen w-screen overflow-hidden bg-white font-sans text-xs">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1a1a1a] h-full items-center justify-center p-3 overflow-hidden">
        <img
          src={loginImage}
          alt="Restaurant Background"
          onError={(e) => {
            if (!e.currentTarget.src.endsWith('/assets/food-placeholders/food-burger.png')) {
              e.currentTarget.src = '/assets/food-placeholders/food-burger.png';
            }
          }}
          className="w-full h-[90%] object-cover object-center rounded-2xl shadow-2xl"
        />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-gray-50/50">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5"
        >
          <div>
            <h1 className="text-xl font-black text-gray-900">Sign In</h1>
            <p className="text-gray-500 mt-1">
              Access your staff portal or customer account.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block font-bold text-gray-700">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block font-bold text-gray-700">Password</label>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
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
            <Link to="/forgot-password" className="text-emerald-600 font-bold hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl font-extrabold cursor-pointer transition"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>

          <p className="text-center text-gray-500 pt-1">
            New customer?{' '}
            <Link to="/signup" className="text-emerald-600 font-bold hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}