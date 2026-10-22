import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export default function WaiterLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* 👇 THIS IS CRITICAL */}
        <main className="flex-1 overflow-y-auto w-full p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}