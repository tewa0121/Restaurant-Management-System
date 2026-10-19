import React from 'react';
<<<<<<< HEAD
import { Outlet } from 'react-router-dom';

export default function WaiterLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
=======
import DashboardLayout from './DashboardLayout';

export default function WaiterLayout({ children }) {
  return <DashboardLayout>{children}</DashboardLayout>;
>>>>>>> origin/developer
}