import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('resto_theme');
      if (saved !== null) {
        // Handle plain strings like "dark"/"light" or JSON booleans
        if (saved === 'dark' || saved === '"dark"') return true;
        if (saved === 'light' || saved === '"light"') return false;
        return JSON.parse(saved);
      }
    } catch (e) {
      // Fallback if parsing fails
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save cleanly as boolean JSON or string
    localStorage.setItem('resto_theme', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);