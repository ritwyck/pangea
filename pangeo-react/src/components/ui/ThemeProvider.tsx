import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGameStore } from '../../stores/gameStore';

interface ThemeContextType {
  theme: 'light' | 'dark';
  isHighContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  toggleTheme: () => void;
  setHighContrast: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setReducedMotion: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { gameData, updateGameData } = useGameStore();
  const { settings } = gameData;

  // Determine actual theme based on settings
  const getActualTheme = (): 'light' | 'dark' => {
    if (settings.theme === 'auto') {
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return settings.theme;
  };

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>(getActualTheme());

  // Update actual theme when settings change
  useEffect(() => {
    const newTheme = getActualTheme();
    setActualTheme(newTheme);

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.setAttribute('data-high-contrast', settings.highContrast ? 'true' : 'false');
    document.documentElement.setAttribute('data-font-size', settings.fontSize);
    document.documentElement.setAttribute('data-reduced-motion', settings.reducedMotion ? 'true' : 'false');
  }, [settings.theme, settings.highContrast, settings.fontSize, settings.reducedMotion]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (settings.theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        setActualTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateGameData({
      settings: {
        ...settings,
        theme: newTheme,
      },
    });
  };

  const setHighContrast = (enabled: boolean) => {
    updateGameData({
      settings: {
        ...settings,
        highContrast: enabled,
      },
    });
  };

  const setFontSize = (size: 'small' | 'medium' | 'large') => {
    updateGameData({
      settings: {
        ...settings,
        fontSize: size,
      },
    });
  };

  const setReducedMotion = (enabled: boolean) => {
    updateGameData({
      settings: {
        ...settings,
        reducedMotion: enabled,
      },
    });
  };

  const value: ThemeContextType = {
    theme: actualTheme,
    isHighContrast: settings.highContrast,
    fontSize: settings.fontSize,
    reducedMotion: settings.reducedMotion,
    toggleTheme,
    setHighContrast,
    setFontSize,
    setReducedMotion,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
