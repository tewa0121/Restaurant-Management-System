import React from 'react';

export default function Input({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input 
          className={`
            w-full border rounded-lg px-4 py-2.5 text-sm transition-all
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}