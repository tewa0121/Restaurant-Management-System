import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({ 
  title = 'No data found', 
  description = 'There are no items to display right now.', 
  icon: Icon = Inbox,
  action 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mt-1 mb-6">{description}</p>
      {action && action}
    </div>
  );
}