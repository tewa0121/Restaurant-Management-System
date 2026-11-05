import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Could not create the account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#fafafa] font-sans p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-5">
        
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
        </button>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-gray-900">Create Customer Account</h2>
          <p className="text-xs text-gray-500">Sign up to start ordering food online</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">FULL NAME</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs outline-none bg-[#fafafa] focus:ring-1 focus:ring-[#1b8b30]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">EMAIL ADDRESS</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="customer@example.com"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs outline-none bg-[#fafafa] focus:ring-1 focus:ring-[#1b8b30]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">PASSWORD</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-xs outline-none bg-[#fafafa] focus:ring-1 focus:ring-[#1b8b30]"
              />
            </div>
          </div>

          {error && <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#1b8b30] hover:bg-green-700 text-white rounded-lg text-xs font-bold transition cursor-pointer mt-2"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <span 
            onClick={() => navigate('/login')} 
            className="text-[#1b8b30] font-bold hover:underline cursor-pointer"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}