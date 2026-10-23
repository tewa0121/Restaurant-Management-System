import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  TrendingUp,
  Smartphone,
  Globe,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const loginImage = '/assets/food-placeholders/login.png';

function mockLogin(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Default static mock accounts
  const defaultAccounts = {
    'admin@resto.com': { id: 1, name: 'System Admin', email: 'admin@resto.com', role: 'admin' },
    'manager@resto.com': { id: 2, name: 'Manager', email: 'manager@resto.com', role: 'manager' },
    'waiter@resto.com': { id: 3, name: 'Waiter', email: 'waiter@resto.com', role: 'waiter' },
    'cashier@resto.com': { id: 4, name: 'Cashier', email: 'cashier@resto.com', role: 'cashier' },
    'kitchen@resto.com': { id: 5, name: 'Kitchen Staff', email: 'kitchen@resto.com', role: 'kitchen' },
    'customer@resto.com': { id: 6, name: 'Customer', email: 'customer@resto.com', role: 'customer' },
  };

  let user = defaultAccounts[normalizedEmail];
  let validPassword = (password === 'password123');

  // 2. Check accounts registered via SignUp (saved in localStorage)
  if (!user) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser = registeredUsers.find(u => u.email === normalizedEmail);

    if (foundUser && foundUser.password === password) {
      user = {
        id: foundUser.id || Date.now(),
        name: foundUser.fullName,
        email: foundUser.email,
        role: foundUser.role || 'customer'
      };
      validPassword = true;
    }
  }

  if (user && validPassword) {
    return { success: true, user, token: 'demo-token-' + Date.now() };
  }

  throw new Error('Invalid email or password.');
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');

  const navigate = useNavigate();

  let authLogin = () => {};
  try {
    const auth = useAuth();
    if (auth && auth.login) authLogin = auth.login;
  } catch (e) {}

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = mockLogin(email, password);
      if (!response.success) throw new Error('Invalid email or password.');

      if (authLogin) authLogin(response.user, response.token);

      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(response.user));
      if (rememberMe) {
        localStorage.setItem('token', response.token);
      } else {
        localStorage.removeItem('token');
      }

      // Synchronized navigation targets based on role
      const role = String(response.user.role || '').toLowerCase();
      if (role.includes('admin')) navigate('/admin/panel/dashboard');
      else if (role.includes('cashier')) navigate('/cashier/dashboard');
      else if (role.includes('kitchen')) navigate('/kitchen/dashboard');
      else if (role.includes('manager')) navigate('/manager/dashboard');
      else if (role.includes('waiter')) navigate('/waiter/dashboard');
      else if (role.includes('customer')) navigate('/');
      else setError('Your account does not have a recognized role.');
    } catch (err) {
      setError(err.message || 'Invalid email or password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white font-sans">
      
      {/* LEFT SIDE: IMAGE */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1a1a1a] h-full items-center justify-center p-3 overflow-hidden">
        <img
          src={loginImage}
          alt="Restaurant Background"
          onError={(e) => {
            // Fallback if image isn't available in public folder
            e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80';
          }}
          className="w-full h-[90%] object-cover object-center rounded-2xl shadow-2xl"
        />
      </div>

      {/* RIGHT SIDE: LOGIN FORM & BADGES */}
      <div 
        className="w-full lg:w-1/2 h-full flex flex-col items-center overflow-y-auto bg-[#fafafa] relative"
        style={{
          backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundPosition: 'right top'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#fafafa] via-[#fafafa] to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-[420px] flex flex-col justify-between min-h-full py-4 px-4">
          
          {/* Top Bar: Language Selector */}
          <div className="flex justify-end w-full mb-1">
            <label className="flex items-center gap-2 text-[12px] font-medium text-gray-700 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm cursor-pointer hover:bg-gray-50 transition">
              <Globe className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent outline-none cursor-pointer font-semibold text-gray-700"
              >
                <option value="English">English</option>
                <option value="Amharic">አማርኛ</option>
              </select>
            </label>
          </div>

          {/* Login Card */}
          <div className="w-full bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 mb-4 mt-2">
            
            <div className="text-center mb-5">
              <h2 className="text-[22px] font-bold text-[#1a1f36] tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-[12px] text-gray-500 mt-1">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <div role="alert" className="bg-red-50 border border-red-200 p-2 text-[11px] text-red-600 rounded-lg mb-3">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1b8b30] focus:border-[#1b8b30] outline-none text-[13px] bg-[#fafafa] text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#1b8b30] focus:border-[#1b8b30] outline-none text-[13px] bg-[#fafafa] text-gray-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px] pt-1">
                <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#1b8b30] border-gray-300 rounded focus:ring-[#1b8b30] cursor-pointer accent-[#1b8b30]"
                  />
                  <span className="text-gray-600 font-medium">Remember me</span>
                </label>
                <span 
                  onClick={() => navigate('/forgot-password')} 
                  className="text-[#1b8b30] hover:text-green-700 font-medium transition cursor-pointer"
                >
                  Forgot Password?
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center py-2 rounded-lg text-[13px] font-semibold text-white transition-colors mt-1 ${
                  loading ? 'bg-[#1b8b30]/70 cursor-not-allowed' : 'bg-[#1b8b30] hover:bg-green-700 cursor-pointer'
                }`}
              >
                {loading ? 'Signing in...' : (
                  <>
                    <LogIn className="w-4 h-4 mr-1.5" strokeWidth={2} />
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="relative flex py-3 items-center">
              <div className="flex-grow border-t border-gray-200" />
              <span className="flex-shrink mx-2 text-gray-400 text-[10px]">
                or sign in with
              </span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button type="button" className="flex items-center justify-center py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span className="text-[10px] font-semibold text-gray-700">Google</span>
              </button>

              <button type="button" className="flex items-center justify-center py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <span className="text-[10px] font-semibold text-gray-700">Microsoft</span>
              </button>

              <button type="button" className="flex items-center justify-center py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                <svg className="w-3.5 h-3.5 mr-1 fill-current text-black" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.87 6.1c.64-.78 1.07-1.86.95-2.94-.92.04-2.03.62-2.69 1.39-.58.67-1.1 1.76-.96 2.83 1.03.08 2.06-.5 2.7-1.28z" />
                </svg>
                <span className="text-[10px] font-semibold text-gray-700">Apple</span>
              </button>
            </div>

            <p className="text-center text-[11px] text-gray-500 mt-3">
              Don&apos;t have an account?{' '}
              <span 
                onClick={() => navigate('/signup')} 
                className="text-[#1b8b30] font-bold hover:underline cursor-pointer"
              >
                Sign Up
              </span>
            </p>
          </div>

          {/* Bottom Feature Badges */}
          <div className="w-full grid grid-cols-4 gap-1 mt-2 pb-2 mt-auto">
            <div className="flex flex-col items-center text-center space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#1b8b30]" strokeWidth={2} />
              <span className="font-bold text-[9px] text-gray-800 leading-tight">Secure &<br/>Reliable</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-1">
              <Clock className="w-5 h-5 text-[#1b8b30]" strokeWidth={2} />
              <span className="font-bold text-[9px] text-gray-800 leading-tight">24/7<br/>Support</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-1">
              <TrendingUp className="w-5 h-5 text-[#1b8b30]" strokeWidth={2} />
              <span className="font-bold text-[9px] text-gray-800 leading-tight">Powerful<br/>Analytics</span>
            </div>

            <div className="flex flex-col items-center text-center space-y-1">
              <Smartphone className="w-5 h-5 text-[#1b8b30]" strokeWidth={2} />
              <span className="font-bold text-[9px] text-gray-800 leading-tight">Access<br/>Anywhere</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}