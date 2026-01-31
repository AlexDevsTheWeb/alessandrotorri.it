import { create } from 'zustand';

type ThemeState = {
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  themeMode: 'dark', // Default theme
  toggleTheme: () =>
    set((state) => ({ themeMode: state.themeMode === 'light' ? 'dark' : 'light' })),
}));
