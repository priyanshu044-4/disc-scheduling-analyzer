import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeId, ThemeColors } from './theme';
import { THEMES } from './theme';

interface ThemeContextType {
  themeId: ThemeId;
  theme: ThemeColors;
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeId: 'rustic-moss',
  theme: THEMES['rustic-moss'],
  setThemeId: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('disc-scheduler-theme') as ThemeId;
    return saved && THEMES[saved] ? saved : 'rustic-moss';
  });

  const theme = THEMES[themeId] || THEMES['cyber-violet'];

  useEffect(() => {
    localStorage.setItem('disc-scheduler-theme', themeId);
    if (theme.isLight) {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark-mode');
    } else {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    }
  }, [themeId, theme.isLight]);

  return (
    <ThemeContext.Provider value={{ themeId, theme, setThemeId }}>
      <div className={`${theme.bgPage} ${theme.textBody} min-h-screen transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
