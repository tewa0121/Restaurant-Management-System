// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { User, Mail, Phone, Lock, ArrowLeft } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// export default function SignUp() {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     password: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { register } = useAuth();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       // Real backend call: POST /api/auth/register
//       await register({
//         fullName: formData.fullName.trim(),
//         email: formData.email.trim().toLowerCase(),
//         phone: formData.phone.trim(),
//         password: formData.password,
//       });
//       // The backend already logged the new customer in.
//       navigate('/', { replace: true });
//     } catch (err) {
//       setError(err.message || 'Could not create the account');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputClass =
//     'w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs outline-none bg-[#fafafa] focus:ring-1 focus:ring-[#1b8b30]';

//   return (
//     <div className="flex h-screen w-screen items-center justify-center bg-[#fafafa] font-sans p-4">
//       <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-5">

//         <button
//           type="button"
//           onClick={() => navigate('/login')}
//           className="flex items-center text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
//         >
//           <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
//         </button>

//         <div className="text-center space-y-1">
//           <h2 className="text-2xl font-bold text-gray-900">Create Customer Account</h2>
//           <p className="text-xs text-gray-500">Sign up to start ordering food online</p>
//         </div>

//         <form onSubmit={handleRegister} className="space-y-3">
//           <div>
//             <label className="block text-xs font-semibold text-gray-700 mb-1">FULL NAME</label>
//             <div className="relative">
//               <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="text"
//                 required
//                 value={formData.fullName}
//                 onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//                 placeholder="John Doe"
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-700 mb-1">EMAIL ADDRESS</label>
//             <div className="relative">
//               <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="email"
//                 required
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 placeholder="customer@example.com"
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-700 mb-1">PHONE</label>
//             <div className="relative">
//               <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="tel"
//                 required
//                 value={formData.phone}
//                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                 placeholder="0911000000"
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-700 mb-1">PASSWORD</label>
//             <div className="relative">
//               <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//               <input
//                 type="password"
//                 required
//                 minLength={6}
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 placeholder="••••••••"
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2.5 bg-[#1b8b30] hover:bg-green-700 text-white rounded-lg text-xs font-bold transition cursor-pointer mt-2 disabled:opacity-60"
//           >
//             {loading ? 'Creating Account...' : 'Sign Up'}
//           </button>
//         </form>

//         <p className="text-center text-xs text-gray-500">
//           Already have an account?{' '}
//           <span
//             onClick={() => navigate('/login')}
//             className="text-[#1b8b30] font-bold hover:underline cursor-pointer"
//           >
//             Log In
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function authRequest(path, body) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.token) {
    throw new Error(json.message || `Request failed (${res.status})`);
  }
  return json;
}

export default function CustomerAuthForm({ onSuccess }) {
  const auth = useAuth() || {};
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const inputCls =
    'w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 ' +
    'px-3 py-2 text-xs text-gray-900 dark:text-gray-100 outline-none focus:border-emerald-500';
  const labelCls = 'text-[10px] font-bold text-gray-500 dark:text-gray-400 block mb-1';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\s-]{8,15}$/;
    if (mode === 'signup' && !form.fullName.trim()) return 'Full name is required.';
    if (!emailRegex.test(form.email.trim())) return 'Please enter a valid email address.';
    if (mode === 'signup' && !phoneRegex.test(form.phone.trim())) return 'Please enter a valid phone number.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problem = validate();
    if (problem) return setError(problem);

    setSubmitting(true);
    setError('');
    try {
      const email = form.email.trim().toLowerCase();
      const data =
        mode === 'login'
          ? await authRequest('/auth/login', { email, password: form.password })
          : await authRequest('/auth/register', {
              fullName: form.fullName.trim(),
              email,
              phone: form.phone.trim(),
              password: form.password,
            });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setForm((f) => ({ ...f, password: '' }));

      if (typeof auth.setSession === 'function') {
        auth.setSession({ token: data.token, user: data.user });
        onSuccess?.(data);
      } else {
        window.location.reload(); // AuthContext reads the saved login on reload
      }
    } catch (err) {
      setError(err.message || 'Could not sign you in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
        {mode === 'signup' ? 'Create Account' : 'Login'}
      </h3>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] font-semibold text-red-500">
          {error}
        </div>
      )}

      {mode === 'signup' && (
        <div>
          <label className={labelCls}>Full Name</label>
          <input name="fullName" value={form.fullName} onChange={handleChange} className={inputCls} />
        </div>
      )}

      <div>
        <label className={labelCls}>Email Address</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} autoComplete="email" className={inputCls} />
      </div>

      {mode === 'signup' && (
        <div>
          <label className={labelCls}>Phone Number</label>
          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 890" className={inputCls} />
        </div>
      )}

      <div>
        <label className={labelCls}>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="At least 6 characters"
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          className={inputCls}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {submitting ? 'Please wait…' : mode === 'signup' ? 'Sign Up & Continue' : 'Login & Continue'}
      </button>

      <button
        type="button"
        onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); }}
        className="w-full text-center text-[11px] font-bold text-emerald-500 hover:underline"
      >
        {mode === 'signup' ? 'Already have an account? Login' : "Don't have an account? Sign up"}
      </button>
    </form>
  );
}