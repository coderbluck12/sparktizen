import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
  const root = window.document.documentElement;
  
  // Remove both just to be safe before adding the current one
  root.classList.remove('light', 'dark');
  root.classList.add(theme);

  // Optional: Save to localStorage so it stays on refresh
  localStorage.setItem('theme', theme);
}, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
