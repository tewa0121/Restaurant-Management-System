import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export default function CashierLayout({ children }) {
  // State to manage the mobile sidebar toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      
      {/* 1. The Sidebar (Receives state to open/close on mobile) */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 2. The Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* The Top Header (Receives function to open sidebar) */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* The Page Content (Dashboard, New Bill, etc.) */}
        <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8">
          {children}
        </main>
        
      </div>
    </div>
  );
}