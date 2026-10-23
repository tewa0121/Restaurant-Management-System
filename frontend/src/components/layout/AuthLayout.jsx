import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck, Headphones, BarChart3, Smartphone } from 'lucide-react';
import Footer from '../common/Footer';

export default function AuthLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <div className="flex flex-1">
        {/* Left Side Hero */}
        <div className="hidden lg:flex w-1/2 relative bg-slate-900 flex-col justify-between overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: "url('/food-placeholders/login.png')" }}
          />

          <div className="relative z-10 p-12 flex flex-col items-center text-center mt-10">
            <div className="w-16 h-16 bg-[#52C41A] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
              <span className="text-3xl text-white font-black">R</span>
            </div>

            <h1 className="text-4xl font-extrabold text-white mb-2">
              Resto<span className="text-[#52C41A]">Manager</span>
            </h1>

            <p className="text-slate-300 tracking-widest text-xs font-semibold uppercase">
              Restaurant Management System
            </p>

            <div className="mt-16">
              <h2 className="text-3xl font-bold text-white leading-tight">
                Manage your restaurant
                <br />
                <span className="text-[#52C41A]">smarter and faster</span>
              </h2>
              <p className="text-slate-300 mt-4 max-w-md mx-auto text-xs leading-relaxed">
                All-in-one solution to manage orders, tables, menu, staff, inventory and more.
              </p>
            </div>
          </div>

          <div className="relative z-10 p-12 grid grid-cols-4 gap-4 text-center border-t border-white/10 bg-black/40 backdrop-blur-md">
            <div className="flex flex-col items-center">
              <ShieldCheck className="text-[#52C41A] mb-2" size={24} />
              <span className="text-white text-xs font-semibold">Secure & Reliable</span>
            </div>
            <div className="flex flex-col items-center">
              <Headphones className="text-[#52C41A] mb-2" size={24} />
              <span className="text-white text-xs font-semibold">24/7 Support</span>
            </div>
            <div className="flex flex-col items-center">
              <BarChart3 className="text-[#52C41A] mb-2" size={24} />
              <span className="text-white text-xs font-semibold">Powerful Analytics</span>
            </div>
            <div className="flex flex-col items-center">
              <Smartphone className="text-[#52C41A] mb-2" size={24} />
              <span className="text-white text-xs font-semibold">Access Anywhere</span>
            </div>
          </div>
        </div>

        {/* Right Side Auth Outlet */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}