'use client';

import { useState } from 'react';
import { Theme, availableThemes, applyTheme } from '@/lib/theme';

export default function ThemePreview() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light');

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    applyTheme(theme);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title mb-4">🎨 Theme Preview</h2>
        <p className="text-base-content/70 mb-4">
          Try different themes to see how the Bee Algorithm Platform looks in various styles!
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {availableThemes.slice(0, 8).map((theme) => (
            <button
              key={theme.value}
              onClick={() => handleThemeChange(theme.value)}
              className={`btn btn-sm ${
                selectedTheme === theme.value 
                  ? 'btn-primary' 
                  : 'btn-outline'
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-base-200 rounded-lg">
          <h3 className="font-medium mb-2">Current Theme: {selectedTheme}</h3>
          <p className="text-sm text-base-content/60">
            This preview shows how the interface will look with the selected theme.
            Use the theme controller in the navbar to apply it permanently.
          </p>
        </div>
      </div>
    </div>
  );
}
