import React from 'react';
import { useNotification } from '../../context/NotificationContext';

export default function ExamplePage() {
  const { showNotification } = useNotification();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-bold">Notifications Test</h2>
      
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => showNotification('Operation completed successfully!', 'success')}
          className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer"
        >
          Show Success
        </button>

        <button
          type="button"
          onClick={() => showNotification('Failed to process payment.', 'error')}
          className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg cursor-pointer"
        >
          Show Error
        </button>

        <button
          type="button"
          onClick={() => showNotification('Low inventory stock warning!', 'warning')}
          className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg cursor-pointer"
        >
          Show Warning
        </button>
      </div>
    </div>
  );
}