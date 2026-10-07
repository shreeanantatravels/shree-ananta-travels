"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getThemeConfig, getAllThemes, type ThemeConfig, type LayoutVariant } from '../config/themeConfig';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  color: string;
  themeConfig: ThemeConfig;
  layoutVariant: LayoutVariant;
  toggleMode: () => void;
  setThemeColor: (color: string) => void;
  allThemes: ThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_theme_mode');
      if (saved === 'dark' || saved === 'light') return saved as ThemeMode;
    }
    return 'light';
  });

  const [color, setColor] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_theme_color');
      if (saved) return saved;
    }
    return 'gold';
  });

  const themeConfig = getThemeConfig(color);
  const layoutVariant = themeConfig.layoutVariant;
  const allThemes = getAllThemes();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    root.setAttribute('data-theme-color', color);
    root.setAttribute('data-heading-font', 'poppins');
    root.setAttribute('data-body-font', 'montserrat');

    if (typeof window !== 'undefined') {
      localStorage.setItem('app_theme_mode', mode);
      localStorage.setItem('app_theme_color', color);
    }

    // Apply CSS vars from themeConfig — this makes themes fully dynamic
    const { colors } = themeConfig;
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-primary-dark', colors.primaryDark);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-gradient', colors.gradient);
  }, [mode, color, themeConfig]);

  const toggleMode = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeColor = (newColor: string) => {
    setColor(newColor);
  };

  return (
    <ThemeContext.Provider value={{ mode, color, themeConfig, layoutVariant, toggleMode, setThemeColor, allThemes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
