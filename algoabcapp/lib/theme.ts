export type Theme = 
  | 'light' 
  | 'dark' 
  | 'synthwave' 
  | 'retro' 
  | 'cyberpunk' 
  | 'valentine' 
  | 'aqua'
  | 'forest'
  | 'black'
  | 'luxury'
  | 'dracula'
  | 'cmyk'
  | 'autumn'
  | 'business'
  | 'acid'
  | 'lemonade'
  | 'night'
  | 'coffee'
  | 'winter';

export const availableThemes: { value: Theme; label: string; description: string }[] = [
  { value: 'light', label: 'Light', description: 'Clean and bright' },
  { value: 'dark', label: 'Dark', description: 'Easy on the eyes' },
  { value: 'synthwave', label: 'Synthwave', description: 'Neon cyberpunk vibes' },
  { value: 'retro', label: 'Retro', description: 'Vintage aesthetic' },
  { value: 'cyberpunk', label: 'Cyberpunk', description: 'Futuristic neon' },
  { value: 'valentine', label: 'Valentine', description: 'Romantic pink tones' },
  { value: 'aqua', label: 'Aqua', description: 'Ocean blue theme' },
  { value: 'forest', label: 'Forest', description: 'Natural green tones' },
  { value: 'black', label: 'Black', description: 'Pure black theme' },
  { value: 'luxury', label: 'Luxury', description: 'Elegant gold accents' },
  { value: 'dracula', label: 'Dracula', description: 'Dark purple theme' },
  { value: 'cmyk', label: 'CMYK', description: 'Print-inspired colors' },
  { value: 'autumn', label: 'Autumn', description: 'Warm fall colors' },
  { value: 'business', label: 'Business', description: 'Professional look' },
  { value: 'acid', label: 'Acid', description: 'Bright and bold' },
  { value: 'lemonade', label: 'Lemonade', description: 'Fresh citrus theme' },
  { value: 'night', label: 'Night', description: 'Deep night mode' },
  { value: 'coffee', label: 'Coffee', description: 'Warm brown tones' },
  { value: 'winter', label: 'Winter', description: 'Cool winter theme' }
];

export function getThemeFromStorage(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  const saved = localStorage.getItem('theme');
  return (saved as Theme) || 'light';
}

export function saveThemeToStorage(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('theme', theme);
}

export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  document.documentElement.setAttribute('data-theme', theme);
}
