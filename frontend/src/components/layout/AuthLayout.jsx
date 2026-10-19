import React from 'react';
import { ShieldCheck, Headphones, BarChart3, Smartphone } from 'lucide-react';

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* LEFT SIDE - Image & Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 flex-col justify-between overflow-hidden">
        
        {/* 👇 FIXED: Point to your actual public image path */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/food-placeholders/login.png')" }}
        />
        
        <div className="relative z-10 p-12 flex flex-col items-center text-center mt-10">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-3xl text-white font-bold">R</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Resto<span className="text-green-500">Manager</span>
          </h1>
          <p className="text-gray-300 tracking-widest text-sm uppercase">Restaurant Management System</p>
          
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white leading-tight">
              Manage your restaurant<br />
              <span className="text-green-400">smarter and faster</span>
            </h2>
            <p className="text-gray-300 mt-4 max-w-md mx-auto">
              All-in-one solution to manage orders, tables, menu, staff, inventory and more.
            </p>
          </div>
        </div>

        {/* Bottom Features */}
        <div className="relative z-10 p-12 grid grid-cols-4 gap-4 text-center border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <ShieldCheck className="text-green-400 mb-2" size={24} />
            <span className="text-white text-xs font-semibold">Secure & Reliable</span>
          </div>
          <div className="flex flex-col items-center">
            <Headphones className="text-green-400 mb-2" size={24} />
            <span className="text-white text-xs font-semibold">24/7 Support</span>
          </div>
          <div className="flex flex-col items-center">
            <BarChart3 className="text-green-400 mb-2" size={24} />
            <span className="text-white text-xs font-semibold">Powerful Analytics</span>
          </div>
          <div className="flex flex-col items-center">
            <Smartphone className="text-green-400 mb-2" size={24} />
            <span className="text-white text-xs font-semibold">Access Anywhere</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

    </div>
  );
}