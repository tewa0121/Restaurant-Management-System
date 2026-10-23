import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Generic fallback layout wrapper for dashboards.
 */
export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800">
      <Outlet />
    </div>
  );
}