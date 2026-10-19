// src/pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ❌ REMOVED: import loginImage from '../../assets/food-placeholders/login.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);

    if (result.success) {
      const role = result.user.role;
      if (role === 'Super Administrator' || role === 'Admin') navigate('/admin');
      else if (role === 'Restaurant Manager') navigate('/manager');
      else if (role === 'Waiter') navigate('/waiter');
      else if (role === 'Cashier') navigate('/cashier');
      else if (role === 'Kitchen Staff') navigate('/kitchen');
      else navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      
      {/* =============== LEFT SIDE (IMAGE + BRANDING) =============== */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden bg-gray-900">
        
        {/* 👇 FIXED: Use the path from public folder */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/food-placeholders/login.png')" }}
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30" />

        {/* Content Container - Centered Absolutely */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-16 text-center">
          
          {/* Chef Hat Logo */}
          <div className="w-20 h-20 rounded-full border-[3px] border-green-500 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a4 4 0 00-4 4v.5A4.5 4.5 0 004.5 12c0 2 1.5 3.5 3.5 4v2h8v-2c2-.5 3.5-2 3.5-4A4.5 4.5 0 0016 7.5V7a4 4 0 00-4-4z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2 2 2-2m-4 6h4" />
            </svg>
          </div>

          {/* Brand Name */}
          <h1 className="text-[46px] font-bold tracking-tight text-white mb-2">
            Resto<span className="text-green-500">Manager</span>
          </h1>
          <p className="text-gray-300 text-[18px] mb-8">Restaurant Management System</p>

          {/* Divider with Chef Hat */}
          <div className="flex items-center gap-4 mb-8 w-64">
            <div className="h-[1px] bg-green-500/50 flex-1" />
            <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a4 4 0 00-4 4v.5A4.5 4.5 0 004.5 12c0 2 1.5 3.5 3.5 4v2h8v-2c2-.5 3.5-2 3.5-4A4.5 4.5 0 0016 7.5V7a4 4 0 00-4-4z" />
            </svg>
            <div className="h-[1px] bg-green-500/50 flex-1" />
          </div>

          {/* Main Tagline */}
          <h2 className="text-[40px] font-bold text-white leading-[1.15] mb-5">
            Manage your restaurant <br />
            <span className="text-green-500">smarter and faster</span>
          </h2>

          <p className="text-gray-300 text-[16px] leading-relaxed max-w-lg">
            All-in-one solution to manage orders, tables, menu, staff, inventory and more.
          </p>
        </div>
      </div>

      {/* =============== RIGHT SIDE (LOGIN FORM) =============== */}
      <div className="w-full lg:w-[40%] flex flex-col items-center justify-center relative bg-[#F8F9FA] px-8 py-12">
        
        {/* Subtle dot pattern background */}
        <div className="absolute top-16 right-12 w-32 h-32 opacity-[0.04]" 
             style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '12px 12px' }} />

        {/* Language Selector */}
        <div className="absolute top-8 right-8 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 shadow-sm cursor-pointer hover:bg-gray-50 transition z-20">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="font-medium">English</span>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>

        {/* Main Login Card */}
        <div className="w-full max-w-[460px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-10 border border-gray-100 z-10 mt-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">Welcome Back!</h2>
            <p className="text-gray-500 text-[15px] mt-2">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-[14px] font-medium text-gray-800 mb-2">Email Address</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </span>
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-[15px] text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[14px] font-medium text-gray-800 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition text-[15px] text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-[14px] pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center border transition-colors ${remember ? 'bg-green-600 border-green-600' : 'border-gray-300 group-hover:border-green-500'}`}>
                  {remember && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="hidden"
                />
                <span className="text-gray-600 font-medium">Remember me</span>
              </label>
              <a href="#" className="text-green-600 hover:text-green-700 font-semibold">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#16A34A] hover:bg-[#15803d] text-white font-semibold py-3.5 rounded-lg transition duration-200 flex items-center justify-center gap-2 text-[16px] mt-2 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-[13px] text-gray-400 font-medium">or sign in with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Social Buttons */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-[14px] font-semibold text-gray-700">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-[14px] font-semibold text-gray-700">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 23 23"><path fill="#f3f3f3" d="M0 0h23v23H0z"/><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
              Microsoft
            </button>
            <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-[14px] font-semibold text-gray-700">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Apple
            </button>
          </div>

          {/* Sign Up link */}
          <p className="text-center text-[15px] text-gray-600 mt-8 font-medium">
            Don't have an account?{' '}
            <a href="#" className="text-green-600 font-bold hover:underline">
              Sign Up
            </a>
          </p>
        </div>

        {/* Trust Badges Footer */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center w-full max-w-[550px] z-10">
          <div className="flex flex-col items-center">
            <div className="mb-2.5 text-green-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <span className="font-bold text-gray-800 text-[13px]">Secure & Reliable</span>
            <span className="text-gray-500 text-[12px] mt-0.5">Your data is safe<br/>with us</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2.5 text-green-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <span className="font-bold text-gray-800 text-[13px]">24/7 Support</span>
            <span className="text-gray-500 text-[12px] mt-0.5">We're here to help<br/>anytime</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2.5 text-green-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <span className="font-bold text-gray-800 text-[13px]">Powerful Analytics</span>
            <span className="text-gray-500 text-[12px] mt-0.5">Make data-driven<br/>decisions</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2.5 text-green-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <span className="font-bold text-gray-800 text-[13px]">Access Anywhere</span>
            <span className="text-gray-500 text-[12px] mt-0.5">Use on any device,<br/>anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}