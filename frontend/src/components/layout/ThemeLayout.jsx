import React from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeLayout({ children }) {
  // Access context to ensure it's wrapped properly
  const { isDarkMode } = useTheme();

  return (
    <div className={isDarkMode ? 'dark min-h-screen bg-[#070D19] text-slate-100' : 'min-h-screen bg-gray-50 text-gray-900'}>
      {children}
    </div>
  );
}