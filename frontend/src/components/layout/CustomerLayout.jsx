import React from 'react';
import { Outlet } from 'react-router-dom';
import CustomerSidebar from './CustomerSidebar';
import CustomerHeader from './CustomerHeader';

export default function CustomerLayout() {
  return (
    <div className="flex h-screen bg-gray-50/70 dark:bg-[#070D19] font-sans text-gray-900 dark:text-white overflow-hidden">
      
      {/* 1. SINGLE LEFT SIDEBAR */}
      <CustomerSidebar />

      {/* 2. RIGHT WRAPPER (Header + Main Page View) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <CustomerHeader />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
}