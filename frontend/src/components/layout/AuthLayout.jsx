import React from 'react';
import LanguageSelector from '../common/LanguageSelector.jsx';
import ThemeSwitcher from '../common/ThemeSwitcher.jsx';
import Icon from '../common/Icon.jsx';
import loginBg from '../../assets/food-placeholders/login.png'; // Updated correct relative path

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen w-full bg-white text-slate-900">
      {/* Left Side: Dark background with restaurant photo */}
      <div className="relative hidden lg:flex lg:w-5/12 flex-col justify-between p-12 text-white bg-slate-900 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full border-2 border-brand bg-slate-900/80">
            <Icon name="shield" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Resto<span className="text-brand">Manager</span>
            </h1>
            <p className="text-xs text-slate-400">Restaurant Management System</p>
          </div>
        </div>

        {/* Center Content */}
        <div className="relative z-10 my-auto space-y-4 py-8">
          <div className="inline-block h-0.5 w-16 bg-brand mb-2" />
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            Manage your restaurant <span className="text-brand">smarter</span> and faster
          </h2>
          <p className="text-sm text-slate-300 max-w-md">
            All-in-one solution to manage orders, tables, menu, staff, inventory and more.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-slate-400">
          &copy; 2026 RestoManager. All rights reserved.
        </div>
      </div>

      {/* Right Side: Clean White Background for Login Form (Forced Light Mode) */}
      <div className="flex flex-1 flex-col justify-between bg-white px-6 py-8 text-slate-900 lg:px-16 lg:py-10">
        {/* Top Controls: Language & Theme Switcher */}
        <div className="flex justify-end items-center gap-4">
          <LanguageSelector />
          <ThemeSwitcher />
        </div>

        {/* Login Form Container */}
        <div className="mx-auto w-full max-w-md my-auto py-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
            {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
          </div>

          {children}
        </div>

        {/* Bottom Feature Badges */}
        <div className="grid grid-cols-4 gap-4 border-t border-slate-100 pt-6 text-center text-xs text-slate-600">
          <div className="space-y-1">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-brand">
              <Icon name="shield" size={16} />
            </div>
            <p className="font-semibold text-slate-800">Secure & Reliable</p>
            <p className="text-[10px] text-slate-500">Your data is safe</p>
          </div>
          <div className="space-y-1">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-brand">
              <Icon name="clock" size={16} />
            </div>
            <p className="font-semibold text-slate-800">24/7 Support</p>
            <p className="text-[10px] text-slate-500">We're here to help</p>
          </div>
          <div className="space-y-1">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-brand">
              <Icon name="chart" size={16} />
            </div>
            <p className="font-semibold text-slate-800">Powerful Analytics</p>
            <p className="text-[10px] text-slate-500">Make data-driven</p>
          </div>
          <div className="space-y-1">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-brand">
              <Icon name="device" size={16} />
            </div>
            <p className="font-semibold text-slate-800">Access Anywhere</p>
            <p className="text-[10px] text-slate-500">Use on any device</p>
          </div>
        </div>
      </div>
    </div>
  );
}