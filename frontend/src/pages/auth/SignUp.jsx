import React, { useState } from 'react';
import { User, Mail, Lock, Building } from 'lucide-react';
import Button from '../../components/common/Button';

export default function SignUp() {
  const [formData, setFormData] = useState({ name: '', restaurantName: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Account created using Mock Adapter! You can now log in.');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="text-sm text-gray-500">Sign up to get started with RestoManager</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" required placeholder="John Doe" className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Restaurant Name</label>
            <div className="relative">
              <Building className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="text" required placeholder="Habesha Restaurant" className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="email" required placeholder="owner@restaurant.com" className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input type="password" required placeholder="••••••••" className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>

          <Button type="submit" variant="primary">Create Account</Button>

          <p className="text-center text-xs text-gray-600 pt-2">
            Already have an account? <a href="/login" className="text-green-600 font-bold hover:underline">Log In</a>
          </p>
        </form>
      </div>
    </div>
  );
}