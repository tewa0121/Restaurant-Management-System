import React from 'react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export default function ManagerLayout({ children }) {
  return (
    // 👇 h-screen w-screen forces full width
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar is fixed width (w-64 inside Sidebar.jsx) */}
      <Sidebar />

      {/* Main Content Area takes the rest of the space */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        {/* 👇 Make sure this is overflow-y-auto and w-full */}
        <main className="flex-1 overflow-y-auto w-full p-6">
          {children}
        </main>
      </div>
      
    </div>
  );
}