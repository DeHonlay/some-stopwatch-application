import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, themes } from '../types/theme';

interface ThemeState {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: themes[0],
  setTheme: async (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId) || themes[0];
    set({ currentTheme: theme });
    await AsyncStorage.setItem('theme', themeId);
  },
}));

// Initialize theme from storage
AsyncStorage.getItem('theme').then((themeId) => {
  if (themeId) {
    useThemeStore.getState().setTheme(themeId);
  }
});

export default useThemeStore;