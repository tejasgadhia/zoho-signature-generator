/**
 * Application State Management
 * Centralized state with immutable patterns and localStorage persistence
 */

import type { AppState, FormData, FieldToggles, SocialOptions, SignatureStyle, SocialChannel } from '../types';
import { STORAGE_KEYS } from '../constants';

/**
 * Create a deep frozen copy of an object (immutable)
 */
function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as Record<string, unknown>)[prop];
    if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value as object);
    }
  });
  return obj;
}

/**
 * Create default initial state
 */
function createDefaultState(): AppState {
  return {
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

export class AppStateManager {
  private state: AppState;

  constructor() {
    this.state = createDefaultState();
  }

  /**
   * Get the current application state (immutable copy)
   */
  getState(): Readonly<AppState> {
    return deepFreeze({ ...this.state });
  }

  /**
   * Get form data only (immutable copy)
   */
  getFormData(): Readonly<FormData> {
    return deepFreeze({ ...this.state.formData });
  }

  /**
   * Update a specific form field (immutable)
   */
  updateFormData(field: keyof FormData, value: string): void {
    this.state = {
      ...this.state,
      formData: {
        ...this.state.formData,
        [field]: value
      }
    };
  }

  /**
   * Update multiple form fields at once (immutable)
   * Note: Only allows known FormData keys to prevent prototype pollution
   */
  updateFormDataBatch(data: Partial<FormData>): void {
    const safeKeys: (keyof FormData)[] = [
      'name', 'title', 'department', 'email', 'phone',
      'linkedin', 'twitter', 'bookings', 'website'
    ];

    const updates: Partial<FormData> = {};
    for (const key of safeKeys) {
      if (key in data && data[key] !== undefined) {
        updates[key] = data[key];
      }
    }

    this.state = {
      ...this.state,
      formData: {
        ...this.state.formData,
        ...updates
      }
    };
  }

  /**
   * Update field toggle state (immutable)
   */
  updateFieldToggle(field: keyof FieldToggles, enabled: boolean): void {
    this.state = {
      ...this.state,
      fieldToggles: {
        ...this.state.fieldToggles,
        [field]: enabled
      }
    };
  }

  /**
   * Set signature style (immutable)
   */
  setSignatureStyle(style: SignatureStyle): void {
    this.state = {
      ...this.state,
      signatureStyle: style
    };
  }

  /**
   * Get current signature style
   */
  getSignatureStyle(): SignatureStyle {
    return this.state.signatureStyle;
  }

  /**
   * Update social media options (immutable)
   */
  setSocialOptions(options: Partial<SocialOptions>): void {
    this.state = {
      ...this.state,
      socialOptions: {
        ...this.state.socialOptions,
        ...options
      }
    };
  }

  /**
   * Set accent color (immutable)
   */
  setAccentColor(color: string): void {
    this.state = {
      ...this.state,
      accentColor: color
    };
    this.saveAccentColor(color);
  }

  /**
   * Get current accent color
   */
  getAccentColor(): string {
    return this.state.accentColor;
  }

  /**
   * Set dark mode preview state (immutable)
   */
  setDarkModePreview(enabled: boolean): void {
    this.state = {
      ...this.state,
      isDarkModePreview: enabled
    };
  }

  /**
   * Toggle format lock for a field (immutable)
   */
  toggleFormatLock(field: 'name' | 'title' | 'department'): void {
    const newValue = !this.state.formatLockState[field];
    this.state = {
      ...this.state,
      formatLockState: {
        ...this.state.formatLockState,
        [field]: newValue
      }
    };
    this.saveFormatLock(field, newValue);
  }

  /**
   * Get format lock state for a field
   */
  getFormatLock(field: 'name' | 'title' | 'department'): boolean {
    return this.state.formatLockState[field];
  }

  /**
   * Set format lock state for a field (immutable)
   */
  setFormatLock(field: 'name' | 'title' | 'department', enabled: boolean): void {
    this.state = {
      ...this.state,
      formatLockState: {
        ...this.state.formatLockState,
        [field]: enabled
      }
    };
    this.saveFormatLock(field, enabled);
  }

  // ===== STORAGE OPERATIONS =====

  /**
   * Load state from localStorage (immutable updates)
   */
  loadFromStorage(): void {
    let updates: Partial<AppState> = {};

    // Load accent color
    const savedColor = localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR);
    if (savedColor) {
      updates.accentColor = savedColor;
    }

    // Load social channel order
    const savedOrder = localStorage.getItem(STORAGE_KEYS.SOCIAL_ORDER);
    if (savedOrder) {
      try {
        const channels = JSON.parse(savedOrder);
        // Validate: must be array, max 4 items, only valid channel names
        const validChannels: SocialChannel[] = ['linkedin', 'twitter', 'instagram', 'facebook'];
        if (
          Array.isArray(channels) &&
          channels.length <= 4 &&
          channels.every((ch: unknown) => typeof ch === 'string' && validChannels.includes(ch as SocialChannel))
        ) {
          updates.socialOptions = {
            ...this.state.socialOptions,
            channels: channels as SocialChannel[]
          };
        } else {
          console.warn('Invalid social order format in localStorage, using defaults');
        }
      } catch (e) {
        console.warn('Failed to parse saved social order:', e);
      }
    }

    // Load format lock states
    const formatLockUpdates: Partial<Record<'name' | 'title' | 'department', boolean>> = {};
    (['name', 'title', 'department'] as const).forEach(field => {
      const key = `${STORAGE_KEYS.FORMAT_LOCK_PREFIX}${field}`;
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        formatLockUpdates[field] = saved !== 'false';
      }
    });

    if (Object.keys(formatLockUpdates).length > 0) {
      updates.formatLockState = {
        ...this.state.formatLockState,
        ...formatLockUpdates
      };
    }

    // Apply all updates immutably
    if (Object.keys(updates).length > 0) {
      this.state = {
        ...this.state,
        ...updates
      };
    }
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
