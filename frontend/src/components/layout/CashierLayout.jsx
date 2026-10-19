<<<<<<< HEAD
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function CashierLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
=======
// import React from 'react';
// import DashboardLayout from './DashboardLayout';

// export default function CashierLayout({ children }) {
//   return <DashboardLayout>{children}</DashboardLayout>;
// }



import React from 'react';
import CustomerHeader from './CustomerHeader';
import CustomerSidebar from './CustomerSidebar';
import CustomerCartPanel from './CustomerCartPanel';

export default function CustomerLayout({ children }) {
  return (
    <div className="h-screen w-screen bg-[#F8F9FA] flex flex-col font-sans overflow-hidden">
      
      {/* Top Header */}
      <CustomerHeader />

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* 1. Left Sidebar Navigation (Reduced to 180px) */}
        <div className="w-[180px] flex-shrink-0 hidden lg:block bg-white border-r border-gray-100 h-full overflow-y-auto">
          <CustomerSidebar />
        </div>

        {/* 2. Center Content / Menu Bar (Expands to take all remaining width) */}
        <main className="flex-1 min-w-0 overflow-y-auto bg-[#F8F9FA] p-6">
          <div className="w-full mx-auto">
            {children}
          </div>
        </main>

        {/* 3. Right Cart Sidebar (Reduced to 180px) */}
        <div className="w-[180px] flex-shrink-0 hidden md:block bg-white border-l border-gray-100 h-full overflow-y-auto">
          <CustomerCartPanel />
        </div>

      </div>
>>>>>>> origin/developer
    </div>
  );
}