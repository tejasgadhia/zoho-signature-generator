/**
 * Application State Management
 * Centralized state with type safety and localStorage persistence
 */

import type { AppState, FormData, FieldToggles, SocialOptions, SignatureStyle } from '../types';
import { STORAGE_KEYS } from '../constants';

export class AppStateManager {
  private state: AppState;

  constructor() {
    // Initialize default state
    this.state = {
      formData: {
        name: '',
        title: '',
        department: '',
        email: '',
        phone: '',
        linkedin: '',
        twitter: '',
        bookings: '',
        website: 'https://www.zoho.com'
      },
      fieldToggles: {
        title: true,
        department: true,
        email: true,
        phone: true,
        linkedin: false,
        twitter: false,
        bookings: false,
        website: false  // Website is locked, not toggleable
      },
      signatureStyle: 'classic',
      socialOptions: {
        enabled: true,
        channels: ['linkedin', 'twitter', 'instagram', 'facebook'],
        displayType: 'text'
      },
      isDarkModePreview: false,
      accentColor: '#E42527',  // Default Zoho red
      formatLockState: {
        name: true,
        title: true,
        department: true
      }
    };
  }

  /**
   * Get the current application state
   */
  getState(): AppState {
    return this.state;
  }

  /**
   * Get form data only
   */
  getFormData(): FormData {
    return this.state.formData;
  }

  /**
   * Update a specific form field
   */
  updateFormData(field: keyof FormData, value: string): void {
    this.state.formData[field] = value;
  }

  /**
   * Update multiple form fields at once
   * Note: Only allows known FormData keys to prevent prototype pollution
   */
  updateFormDataBatch(data: Partial<FormData>): void {
    const safeKeys: (keyof FormData)[] = [
      'name', 'title', 'department', 'email', 'phone',
      'linkedin', 'twitter', 'bookings', 'website'
    ];

    for (const key of safeKeys) {
      if (key in data && data[key] !== undefined) {
        this.state.formData[key] = data[key] as string;
      }
    }
  }

  /**
   * Update field toggle state
   */
  updateFieldToggle(field: keyof FieldToggles, enabled: boolean): void {
    this.state.fieldToggles[field] = enabled;
  }

  /**
   * Set signature style
   */
  setSignatureStyle(style: SignatureStyle): void {
    this.state.signatureStyle = style;
  }

  /**
   * Get current signature style
   */
  getSignatureStyle(): SignatureStyle {
    return this.state.signatureStyle;
  }

  /**
   * Update social media options
   */
  setSocialOptions(options: Partial<SocialOptions>): void {
    this.state.socialOptions = {
      ...this.state.socialOptions,
      ...options
    };
  }

  /**
   * Set accent color
   */
  setAccentColor(color: string): void {
    this.state.accentColor = color;
    this.saveAccentColor(color);
  }

  /**
   * Get current accent color
   */
  getAccentColor(): string {
    return this.state.accentColor;
  }

  /**
   * Set dark mode preview state
   */
  setDarkModePreview(enabled: boolean): void {
    this.state.isDarkModePreview = enabled;
  }

  /**
   * Toggle format lock for a field (title case auto-formatting)
   */
  toggleFormatLock(field: 'name' | 'title' | 'department'): void {
    this.state.formatLockState[field] = !this.state.formatLockState[field];
    this.saveFormatLock(field, this.state.formatLockState[field]);
  }

  /**
   * Get format lock state for a field
   */
  getFormatLock(field: 'name' | 'title' | 'department'): boolean {
    return this.state.formatLockState[field];
  }

  /**
   * Set format lock state for a field
   */
  setFormatLock(field: 'name' | 'title' | 'department', enabled: boolean): void {
    this.state.formatLockState[field] = enabled;
    this.saveFormatLock(field, enabled);
  }

  // ===== STORAGE OPERATIONS =====

  /**
   * Load state from localStorage
   */
  loadFromStorage(): void {
    // Load accent color
    const savedColor = localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR);
    if (savedColor) {
      this.state.accentColor = savedColor;
    }

    // Load social channel order
    const savedOrder = localStorage.getItem(STORAGE_KEYS.SOCIAL_ORDER);
    if (savedOrder) {
      try {
        const channels = JSON.parse(savedOrder);
        if (Array.isArray(channels)) {
          this.state.socialOptions.channels = channels;
        }
      } catch (e) {
        console.warn('Failed to parse saved social order:', e);
      }
    }

    // Load format lock states
    ['name', 'title', 'department'].forEach(field => {
      const key = `${STORAGE_KEYS.FORMAT_LOCK_PREFIX}${field}`;
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        this.state.formatLockState[field as 'name' | 'title' | 'department'] = saved !== 'false';
      }
    });
  }

  /**
   * Save accent color to localStorage
   */
  private saveAccentColor(color: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, color);
  }

  /**
   * Save social channel order to localStorage
   */
  saveSocialOrder(): void {
    localStorage.setItem(
      STORAGE_KEYS.SOCIAL_ORDER,
      JSON.stringify(this.state.socialOptions.channels)
    );
  }

  /**
   * Save format lock state to localStorage
   */
  private saveFormatLock(field: 'name' | 'title' | 'department', enabled: boolean): void {
    const key = `${STORAGE_KEYS.FORMAT_LOCK_PREFIX}${field}`;
    localStorage.setItem(key, String(enabled));
  }
}
