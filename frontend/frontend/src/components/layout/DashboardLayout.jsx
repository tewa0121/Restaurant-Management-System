import React from 'react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* 1. The Dark Navy Sidebar */}
      <Sidebar />

      {/* 2. The Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* The Top Header */}
        <Header />
        
        {/* The Actual Page Content (Dashboard) */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        
      </div>
    </div>
  );
}