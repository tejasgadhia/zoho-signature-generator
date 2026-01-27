/**
 * Theme Manager
 * Handles light/dark mode theme switching
 */

import { STORAGE_KEYS } from '../constants';

export type Theme = 'light' | 'dark';

export class ThemeManager {
  private currentTheme: Theme;

  constructor() {
    this.currentTheme = this.loadTheme();
  }

  /**
   * Initialize theme manager
   */
  initialize(): void {
    this.applyTheme(this.currentTheme);
    this.setupThemeToggle();
  }

  /**
   * Get current theme
   */
  getTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Set theme
   */
  setTheme(theme: Theme): void {
    this.currentTheme = theme;
    this.applyTheme(theme);
    this.saveTheme(theme);
  }

  /**
   * Toggle between light and dark mode
   */
  toggleTheme(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Apply theme to document
   */
  private applyTheme(theme: Theme): void {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Update theme toggle checkbox if it exists
    const themeToggle = document.getElementById('themeToggle') as HTMLInputElement;
    if (themeToggle) {
      themeToggle.checked = theme === 'dark';
    }
  }

  /**
   * Setup theme toggle listener
   */
  setupThemeToggle(): void {
    const themeToggle = document.getElementById('themeToggle') as HTMLInputElement;

    if (themeToggle) {
      themeToggle.addEventListener('change', () => {
        this.toggleTheme();
      });
    }
  }

  /**
   * Load theme from localStorage or system preference
   */
  private loadTheme(): Theme {
    // Check localStorage first
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  /**
   * Save theme to localStorage
   */
  private saveTheme(theme: Theme): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
}
