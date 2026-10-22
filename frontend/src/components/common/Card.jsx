import React from 'react';

export default function Card({ children, className = '', noPadding = false }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm ${noPadding ? '' : 'p-5'} ${className}`}>
      {children}
    </div>
  );
}