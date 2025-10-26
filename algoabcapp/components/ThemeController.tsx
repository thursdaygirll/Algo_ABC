'use client';

import { useState, useEffect } from 'react';
import { Theme, availableThemes, getThemeFromStorage, saveThemeToStorage, applyTheme } from '@/lib/theme';

export default function ThemeController() {
  const [currentTheme, setCurrentTheme] = useState<Theme>('light');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initialize theme from storage or system preference
    const savedTheme = getThemeFromStorage();
    setCurrentTheme(savedTheme);
    setIsDark(savedTheme === 'dark');
    applyTheme(savedTheme);
  }, []);

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    setIsDark(theme === 'dark');
    saveThemeToStorage(theme);
    applyTheme(theme);
  };

  const toggleDarkMode = () => {
    const newTheme = isDark ? 'light' : 'dark';
    handleThemeChange(newTheme);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Quick Dark/Light Toggle */}
      <label className="flex cursor-pointer gap-2 items-center">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-base-content/70"
        >
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>
        </svg>
        
        <input 
          type="checkbox" 
          checked={isDark}
          onChange={toggleDarkMode}
          className="toggle toggle-sm"
        />
        
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-base-content/70"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </label>

      {/* Theme Dropdown for All Options */}
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
          <svg 
            width="16px" 
            height="16px" 
            className="h-4 w-4 fill-current opacity-60" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <ul tabIndex={0} className="dropdown-content z-1 p-2 shadow-2xl bg-base-100 rounded-box w-64 border border-base-300 max-h-96 overflow-y-auto">
          <li className="menu-title">
            <span>Choose Theme</span>
          </li>
          {availableThemes.map((theme) => (
            <li key={theme.value}>
              <label className="flex cursor-pointer gap-2 items-center p-2 hover:bg-base-200 rounded">
                <input 
                  type="radio" 
                  name="theme-options" 
                  className="theme-controller radio radio-sm" 
                  value={theme.value}
                  checked={currentTheme === theme.value}
                  onChange={() => handleThemeChange(theme.value)}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{theme.label}</span>
                  <span className="text-xs text-base-content/60">{theme.description}</span>
                </div>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
