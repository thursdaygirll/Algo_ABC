'use client';

import { useEffect } from 'react';
import { getThemeFromStorage, applyTheme } from '@/lib/theme';

export default function ThemeScript() {
  useEffect(() => {
    // Apply theme immediately on page load to prevent flash
    const theme = getThemeFromStorage();
    applyTheme(theme);
  }, []);

  return null;
}
