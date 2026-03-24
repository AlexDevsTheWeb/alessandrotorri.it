import { create } from 'zustand';
import type { ThemeState } from '../types/theme.types';

export const useThemeStore = create<ThemeState>((set) => ({
  themeMode: 'dark', // Default theme
  toggleTheme: () =>
    set((state) => ({ themeMode: state.themeMode === 'light' ? 'dark' : 'light' })),
}));
