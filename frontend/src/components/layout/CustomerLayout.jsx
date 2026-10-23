import React from 'react';
import CustomerHeader from './CustomerHeader';
import CustomerSidebar from './CustomerSidebar';
import CustomerCartPanel from './CustomerCartPanel';

export default function CustomerLayout({ children }) {
  return (
    <div className="h-screen w-screen bg-[#F8F9FA] flex flex-col font-sans overflow-hidden">
      
      {/* Top Header */}
      <CustomerHeader />

      {/* Main 3-Column Layout Container */}
      <div className="flex flex-1 overflow-hidden w-full">
        
        {/* 1. Left Sidebar Navigation (200px width) */}
        <div className="w-[200px] flex-shrink-0 bg-white border-r border-gray-100 h-full overflow-y-auto">
          <CustomerSidebar />
        </div>

        {/* 2. Middle Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-[#F8F9FA] p-5">
          <div className="w-full mx-auto max-w-[1100px]">
            {children}
          </div>
        </main>

        {/* 3. Right Cart Sidebar (200px width with 2px right padding) */}
        <div className="w-[200px] flex-shrink-0 bg-white border-l border-gray-100 h-full overflow-y-auto pr-0.5">
          <CustomerCartPanel />
        </div>

      </div>
    </div>
  );
}