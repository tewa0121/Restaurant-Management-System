import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-sm text-gray-500">Enter your email to receive reset instructions</p>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center space-y-3">
            <p className="text-sm text-green-800 font-medium">Reset link sent to your email!</p>
            <a href="/login" className="inline-block text-xs font-bold text-green-600 hover:underline">Return to Login</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@resto.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
                />
              </div>
            </div>

            <Button type="submit" variant="primary">Send Reset Link</Button>

            <a href="/login" className="flex items-center justify-center space-x-1 text-xs text-gray-500 hover:text-gray-800 font-medium pt-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </a>
          </form>
        )}
      </div>
    </div>
  );
}