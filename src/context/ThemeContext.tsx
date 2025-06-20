import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useRealm } from '@/database/RealmContext';
import { User } from '@/models/User';
import { Appearance } from 'react-native';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  colors: ThemeColors;
}

interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  success: string;
  error: string;
  warning: string;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  primary: '#000000',
  secondary: '#6C757D',
  text: '#000000',
  textSecondary: '#6C757D',
  border: '#E9ECEF',
  card: '#FFFFFF',
  success: '#28A745',
  error: '#DC3545',
  warning: '#FFC107',
};

const darkColors: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#FFFFFF',
  secondary: '#B0B0B0',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#2D2D2D',
  card: '#1E1E1E',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
};

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
  const users = useQuery(User);
  const realm = useRealm();
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    if (users.length > 0) {
      const user = users[0];
      const userTheme = user.theme as Theme;
      
      if (userTheme === 'light' || userTheme === 'dark') {
        setThemeState(userTheme);
      } else {
        const systemTheme = Appearance.getColorScheme() as Theme;
        const defaultTheme = systemTheme === 'light' || systemTheme === 'dark' ? systemTheme : 'dark';
        
        try {
          realm.write(() => {
            user.theme = defaultTheme;
            user.updatedAt = new Date();
          });
          setThemeState(defaultTheme);
        } catch (error) {
          console.error('Error setting default theme:', error);
          setThemeState('dark');
        }
      }
    }
  }, [users, realm]);

  const setTheme = (newTheme: Theme) => {
    if (users.length > 0) {
      const user = users[0];
      try {
        realm.write(() => {
          user.theme = newTheme;
          user.updatedAt = new Date();
        });
        setThemeState(newTheme);
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 