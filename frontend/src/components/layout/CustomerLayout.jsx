import React from 'react';
import CustomerHeader from './CustomerHeader';
import CustomerSidebar from './CustomerSidebar';
import CustomerCartPanel from './CustomerCartPanel';
import Footer from '../common/Footer';

export default function CustomerLayout({ children }) {
  return (
    <div className="h-screen w-screen bg-[#F8F9FA] flex flex-col font-sans overflow-hidden">
      {/* Top Header */}
      <CustomerHeader />

      {/* Main 3-Column Layout */}
      <div className="flex flex-1 overflow-hidden w-full">
        {/* Left Customer Nav */}
        <div className="w-[200px] flex-shrink-0 bg-white border-r border-slate-100 h-full overflow-y-auto">
          <CustomerSidebar />
        </div>

        {/* Center Dynamic Content */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-[#F8F9FA] p-5">
          <div className="w-full mx-auto max-w-[1100px]">
            {children}
          </div>
        </main>

        {/* Right Cart Sidebar */}
        <div className="w-[200px] flex-shrink-0 bg-white border-l border-slate-100 h-full overflow-y-auto pr-0.5">
          <CustomerCartPanel />
        </div>
      </div>

      <Footer appName="RestoCustomer Portal" />
    </div>
  );
}