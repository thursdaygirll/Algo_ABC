'use client';

import { useState } from 'react';
import { Theme, availableThemes, applyTheme } from '@/lib/theme';

export default function ThemeDemoPage() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('light');

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    applyTheme(theme);
  };

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">🎨 Theme Showcase</h1>
          <p className="text-lg text-base-content/70">
            Explore all available themes for the Bee Algorithm Platform
          </p>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {availableThemes.map((theme) => (
            <div
              key={theme.value}
              className={`card cursor-pointer transition-all duration-300 ${
                selectedTheme === theme.value
                  ? 'ring-2 ring-primary shadow-xl'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => handleThemeChange(theme.value)}
            >
              <div className="card-body">
                <h3 className="card-title">{theme.label}</h3>
                <p className="text-base-content/70">{theme.description}</p>
                
                {/* Theme Preview Colors */}
                <div className="flex gap-2 mt-4">
                  <div className="w-6 h-6 rounded bg-primary"></div>
                  <div className="w-6 h-6 rounded bg-secondary"></div>
                  <div className="w-6 h-6 rounded bg-accent"></div>
                  <div className="w-6 h-6 rounded bg-neutral"></div>
                </div>
                
                {selectedTheme === theme.value && (
                  <div className="badge badge-primary mt-2">Active</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Current Theme Info */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Current Theme: {selectedTheme}</h2>
            <p className="text-base-content/70">
              This theme is now applied to the entire application. 
              The theme will persist across page refreshes and browser sessions.
            </p>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Theme Colors:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded bg-primary mx-auto mb-2"></div>
                  <span className="text-sm">Primary</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded bg-secondary mx-auto mb-2"></div>
                  <span className="text-sm">Secondary</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded bg-accent mx-auto mb-2"></div>
                  <span className="text-sm">Accent</span>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded bg-neutral mx-auto mb-2"></div>
                  <span className="text-sm">Neutral</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component Examples */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Component Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Buttons</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-primary">Primary</button>
                  <button className="btn btn-secondary">Secondary</button>
                  <button className="btn btn-accent">Accent</button>
                  <button className="btn btn-outline">Outline</button>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Form Elements</h3>
                <div className="space-y-2">
                  <input type="text" placeholder="Input field" className="input input-bordered w-full" />
                  <select className="select select-bordered w-full">
                    <option>Select option</option>
                    <option>Option 1</option>
                    <option>Option 2</option>
                  </select>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text">Checkbox</span>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Alerts</h3>
                <div className="space-y-2">
                  <div className="alert alert-info">
                    <span>Info alert</span>
                  </div>
                  <div className="alert alert-success">
                    <span>Success alert</span>
                  </div>
                  <div className="alert alert-warning">
                    <span>Warning alert</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Progress & Stats</h3>
                <div className="space-y-4">
                  <progress className="progress progress-primary w-full" value="70" max="100"></progress>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Total Experiments</div>
                      <div className="stat-value">42</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
