// frontend/src/pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAdapter } from '../../services/mockAdapter';
import AuthLayout from '../../components/layout/AuthLayout';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UI State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page reload
    setError('');
    setLoading(true);

    try {
      // 🔗 1. CALL THE BACKEND (Mock Adapter)
      const response = await mockAdapter.auth.login(email, password);
      const { user, token } = response.data;

      // 🔗 2. Save token and user to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // 🔗 3. Redirect based on Role
      switch (user.role) {
        case 'Admin':         navigate('/admin/dashboard'); break;
        case 'Manager':       navigate('/manager/dashboard'); break;
        case 'Waiter':        navigate('/waiter/dashboard'); break;
        case 'Cashier':       navigate('/cashier/dashboard'); break;
        case 'Kitchen Staff': navigate('/kitchen/dashboard'); break;
        default:              navigate('/'); break;
      }
    } catch (err) {
      // 🔗 4. Catch the error thrown by the Backend
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        
        {/* Headers */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-500">Please login to your account</p>
        </div>

        {/* Error Message Alert */}
        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="manager@yegna.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm font-medium text-green-600 hover:text-green-700">Forgot Password?</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-70 transition-all font-medium"
          >
            {loading ? <><Loader2 className="animate-spin mr-2" size={18} /> Signing in...</> : 'Login'}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100 text-xs text-gray-500">
          <p className="font-semibold text-gray-700 mb-2">Demo Credentials:</p>
          <p className="mb-1">Manager: <span className="font-mono text-gray-800">manager@yegna.com / manager123</span></p>
          <p>Admin: <span className="font-mono text-gray-800">admin@yegna.com / admin123</span></p>
        </div>

      </div>
    </AuthLayout>
  );
}