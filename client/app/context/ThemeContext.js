'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'career-agent-theme';
const VALID_THEMES = new Set(['dark', 'light']);

const ThemeContext = createContext(null);

const applyTheme = (theme) => {
  if (typeof document === 'undefined') return;

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
};

const getInitialTheme = () => {
  if (typeof document === 'undefined') {
    return 'dark';
  }

  const currentTheme = document.documentElement.dataset.theme;
  if (VALID_THEMES.has(currentTheme)) {
    return currentTheme;
  }

  return 'dark';
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const setTheme = (nextTheme) => {
    if (!VALID_THEMES.has(nextTheme)) return;

    setThemeState(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const value = useMemo(
    () => ({
      mounted,
      theme,
      setTheme,
      toggleTheme,
    }),
    [mounted, theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
