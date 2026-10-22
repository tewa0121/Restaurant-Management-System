import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * A reusable Quick Actions grid component.
 * 
 * Usage:
 * <QuickActions actions={[
 *   { label: 'New Bill', icon: PlusCircle, color: 'text-green-600', bg: 'bg-green-50', path: '/cashier/new-bill' },
 *   { label: 'Active Bills', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', path: '/cashier/active-bills' }
 * ]} />
 */
export default function QuickActions({ actions, columns = 6 }) {
  const navigate = useNavigate();

  // Map the number of columns to Tailwind classes
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
      
      <div className={`grid ${gridCols[columns] || gridCols[6]} gap-4`}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-xl hover:shadow-md hover:border-green-200 transition-all group"
            >
              <div className={`p-3 rounded-full mb-2 ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}