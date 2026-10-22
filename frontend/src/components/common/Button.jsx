import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  icon: Icon,
  className = '', 
  ...props 
}) {
  const variants = {
    primary: 'bg-green-600 text-white hover:bg-green-700 shadow-sm',
    secondary: 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    warning: 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button 
      disabled={isLoading}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        Icon && <Icon size={18} />
      )}
      {children}
    </button>
  );
}