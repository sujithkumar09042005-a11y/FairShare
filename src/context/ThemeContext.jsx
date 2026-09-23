import React, { createContext, useContext, useEffect, useState } from 'react';

export const THEMES = [
  {
    id: 'midnight-glow',
    name: 'Midnight Glow',
    subtitle: 'Deep navy midnight with vibrant teal & electric cyan glow',
    type: 'dark',
    accentColor: '#00BFFF',
    secondaryColor: '#008C8C',
    bgColor: '#001426',
    surfaceColor: 'rgba(0, 31, 63, 0.75)',
  },
  {
    id: 'sexy-blue',
    name: 'Sexy Blue',
    subtitle: 'Vibrant electric blue with soft ice cyan & crystal clarity',
    type: 'light',
    accentColor: '#007BFF',
    secondaryColor: '#B0E0E6',
    bgColor: '#f0f8ff',
    surfaceColor: 'rgba(255, 255, 255, 0.82)',
  },
];

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    try {
      const saved = localStorage.getItem('fairshare_theme') || localStorage.getItem('splitwise_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      const legacy = localStorage.getItem('fairshare_theme_preset') || localStorage.getItem('splitwise_theme_preset');
      if (legacy === 'midnight-glow') return 'dark';
      if (legacy === 'sexy-blue') return 'light';
    } catch (e) {
      console.error(e);
    }
    return 'light'; // Default to light soft UI, can be toggled to dark
  });

  const isDark = themeMode === 'dark';
  const activeTheme = isDark ? THEMES[0] : THEMES[1];

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('theme-midnight-glow', 'theme-sexy-blue', 'dark', 'light');

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }

    try {
      localStorage.setItem('fairshare_theme', themeMode);
      localStorage.setItem('fairshare_theme_preset', isDark ? 'midnight-glow' : 'sexy-blue');
    } catch (e) {
      console.error(e);
    }
  }, [themeMode, isDark]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (mode) => {
    if (mode === 'dark' || mode === 'light') {
      setThemeMode(mode);
    } else if (mode === 'midnight-glow') {
      setThemeMode('dark');
    } else if (mode === 'sexy-blue') {
      setThemeMode('light');
    }
  };


  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        activeTheme,
        isDark,
        toggleTheme,
        setTheme,
        themes: THEMES,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
