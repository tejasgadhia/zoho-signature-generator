/**
 * Application State Management
 * Centralized state with immutable patterns and localStorage persistence
 */

import type { AppState, FormData, FieldToggles, SocialOptions, SignatureStyle, SocialChannel } from '../types';
import { STORAGE_KEYS, SCHEMA_VERSION, VALID_ACCENT_COLORS } from '../constants';

/**
 * SECURITY NOTE - localStorage:
 * Only non-sensitive preferences are persisted (accent color, social order, format locks).
 * FormData (name, email, phone) is transient and NOT persisted.
 * All stored values are validated on read (whitelist for colors, schema for JSON, strict boolean).
 */

// ===== VALIDATION HELPERS =====

const VALID_SOCIAL_CHANNELS: SocialChannel[] = ['linkedin', 'youtube', 'twitter', 'instagram', 'facebook'];

/**
 * Check if a value is a valid Zoho accent color
 */
function isValidAccentColor(value: string): boolean {
  return VALID_ACCENT_COLORS.has(value);
}

/**
 * Parse and validate a social channel order JSON string.
 * Returns the validated array or null if invalid.
 */
function parseValidSocialOrder(value: string): SocialChannel[] | null {
  try {
    const channels = JSON.parse(value);
    if (
      Array.isArray(channels) &&
      channels.length <= 5 &&
      channels.every((ch: unknown) => typeof ch === 'string' && VALID_SOCIAL_CHANNELS.includes(ch as SocialChannel))
    ) {
      return channels as SocialChannel[];
    }
  } catch {
    // Invalid JSON
  }
  return null;
}

/**
 * Check if a string is a valid boolean representation
 */
function isValidBooleanString(value: string): boolean {
  return value === 'true' || value === 'false';
}

/**
 * Detect legacy encrypted values (base64 blobs or pipe-separated signed data).
 * Valid plaintext values like "#E42527", "true", or '["linkedin"]' won't match.
 */
function isLegacyEncryptedValue(value: string): boolean {
  // Pipe separator indicates signed+encrypted format: "signature|encryptedData"
  if (value.includes('|')) return true;
  // Long base64-like strings (20+ chars of base64 alphabet) indicate raw encrypted data
  if (/^[A-Za-z0-9+/]{20,}={0,2}$/.test(value)) return true;
  return false;
}

/**
 * Filter an object to only include explicitly allowed keys.
 * Prevents prototype pollution by using hasOwnProperty check.
 */
function sanitizeKeys<T>(
  obj: Partial<T>,
  allowedKeys: readonly string[]
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of allowedKeys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      (result as Record<string, unknown>)[key] = (obj as Record<string, unknown>)[key];
    }
  }
  return result;
}

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
      channels: ['linkedin', 'youtube', 'twitter', 'instagram', 'facebook'],
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
   * Sanitizes keys to prevent prototype pollution
   */
  setSocialOptions(options: Partial<SocialOptions>): void {
    const SAFE_KEYS = ['enabled', 'channels', 'displayType'] as const;
    const sanitized = sanitizeKeys<SocialOptions>(options, SAFE_KEYS);
    this.state = {
      ...this.state,
      socialOptions: {
        ...this.state.socialOptions,
        ...sanitized
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
   * One-time cleanup of legacy encrypted localStorage values.
   * Detects corrupted base64/pipe-separated data from v3.3.0 encryption
   * and removes it so defaults are used instead.
   */
  cleanupLegacyEncryptedData(): void {
    const cleanupKey = 'encryption-cleanup-v1';
    if (localStorage.getItem(cleanupKey) === 'complete') return;

    const keysToCheck = [
      STORAGE_KEYS.ACCENT_COLOR,
      STORAGE_KEYS.SOCIAL_ORDER,
      STORAGE_KEYS.FORMAT_LOCK_NAME,
      STORAGE_KEYS.FORMAT_LOCK_TITLE,
      STORAGE_KEYS.FORMAT_LOCK_DEPARTMENT,
    ];

    for (const key of keysToCheck) {
      const value = localStorage.getItem(key);
      if (value && isLegacyEncryptedValue(value)) {
        localStorage.removeItem(key);
      }
    }

    // Clean up old migration flag from v3.3.0
    localStorage.removeItem('encryption-migration-v1');

    localStorage.setItem(cleanupKey, 'complete');
  }

  /**
   * Load state from localStorage with validation (synchronous)
   */
  loadFromStorage(): void {
    const updates: Partial<AppState> = {};

    // Load accent color (validated against whitelist)
    const savedColor = localStorage.getItem(STORAGE_KEYS.ACCENT_COLOR);
    if (savedColor && isValidAccentColor(savedColor)) {
      updates.accentColor = savedColor;
    } else if (savedColor) {
      // Invalid value — remove it
      localStorage.removeItem(STORAGE_KEYS.ACCENT_COLOR);
    }

    // Load social channel order (validated JSON array)
    const savedOrder = localStorage.getItem(STORAGE_KEYS.SOCIAL_ORDER);
    if (savedOrder) {
      const channels = parseValidSocialOrder(savedOrder);
      if (channels) {
        updates.socialOptions = {
          ...this.state.socialOptions,
          channels,
        };
      } else {
        localStorage.removeItem(STORAGE_KEYS.SOCIAL_ORDER);
      }
    }

    // Load format lock states (validated boolean strings)
    const formatLockUpdates: Partial<Record<'name' | 'title' | 'department', boolean>> = {};
    for (const field of ['name', 'title', 'department'] as const) {
      const key = `${STORAGE_KEYS.FORMAT_LOCK_PREFIX}${field}`;
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        if (isValidBooleanString(saved)) {
          formatLockUpdates[field] = saved === 'true';
        } else {
          localStorage.removeItem(key);
        }
      }
    }

    if (Object.keys(formatLockUpdates).length > 0) {
      updates.formatLockState = {
        ...this.state.formatLockState,
        ...formatLockUpdates,
      };
    }

    // Apply all updates immutably
    if (Object.keys(updates).length > 0) {
      this.state = {
        ...this.state,
        ...updates,
      };
    }
  }

  /**
   * Save accent color to localStorage (plaintext, validated on read)
   */
  private saveAccentColor(color: string): void {
    localStorage.setItem(STORAGE_KEYS.ACCENT_COLOR, color);
  }

  /**
   * Save social channel order to localStorage (plaintext, validated on read)
   */
  saveSocialOrder(): void {
    localStorage.setItem(
      STORAGE_KEYS.SOCIAL_ORDER,
      JSON.stringify(this.state.socialOptions.channels),
    );
  }

  /**
   * Save format lock state to localStorage (plaintext, validated on read)
   */
  private saveFormatLock(field: 'name' | 'title' | 'department', enabled: boolean): void {
    const key = `${STORAGE_KEYS.FORMAT_LOCK_PREFIX}${field}`;
    localStorage.setItem(key, String(enabled));
  }

  // ===== DATA EXPORT/IMPORT =====

  /**
   * Export all app data as JSON
   * Includes version for migration support
   * @returns JSON string of complete app state
   */
  exportData(): string {
    const exportData = {
      version: SCHEMA_VERSION,
      timestamp: new Date().toISOString(),
      data: {
        formData: this.state.formData,
        fieldToggles: this.state.fieldToggles,
        signatureStyle: this.state.signatureStyle,
        socialOptions: this.state.socialOptions,
        accentColor: this.state.accentColor,
        formatLockState: this.state.formatLockState,
      }
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Import app data from JSON
   * Validates structure and applies to state
   * @param jsonString - JSON export string
   * @returns Error message if invalid, null if successful
   */
  importData(jsonString: string): string | null {
    try {
      const imported = JSON.parse(jsonString);

      // Validate structure
      if (!imported.version || !imported.data) {
        return 'Invalid export file: missing version or data';
      }

      // Check version compatibility
      if (imported.version > SCHEMA_VERSION) {
        return `Export was created with a newer version (v${imported.version}). Please update the app.`;
      }

      // Validate data fields
      const { data } = imported;
      if (!data.formData || !data.fieldToggles || !data.socialOptions) {
        return 'Invalid export file: missing required data fields';
      }

      // Apply data to state (immutable update)
      // Sanitize each sub-object to prevent prototype pollution
      const FORM_KEYS = ['name', 'title', 'department', 'email', 'phone', 'linkedin', 'twitter', 'bookings', 'website'] as const;
      const TOGGLE_KEYS = ['title', 'department', 'email', 'phone', 'linkedin', 'twitter', 'bookings', 'website'] as const;
      const SOCIAL_KEYS = ['enabled', 'channels', 'displayType'] as const;
      const LOCK_KEYS = ['name', 'title', 'department'] as const;

      this.state = {
        ...this.state,
        formData: data.formData ? { ...this.state.formData, ...sanitizeKeys<FormData>(data.formData, FORM_KEYS) } : this.state.formData,
        fieldToggles: data.fieldToggles ? { ...this.state.fieldToggles, ...sanitizeKeys<FieldToggles>(data.fieldToggles, TOGGLE_KEYS) } : this.state.fieldToggles,
        signatureStyle: data.signatureStyle || this.state.signatureStyle,
        socialOptions: data.socialOptions ? { ...this.state.socialOptions, ...sanitizeKeys<SocialOptions>(data.socialOptions, SOCIAL_KEYS) } : this.state.socialOptions,
        accentColor: data.accentColor || this.state.accentColor,
        formatLockState: data.formatLockState ? { ...this.state.formatLockState, ...sanitizeKeys(data.formatLockState, LOCK_KEYS) } : this.state.formatLockState,
      };

      // Save to localStorage
      this.saveAccentColor(this.state.accentColor);
      this.saveSocialOrder();
      Object.entries(this.state.formatLockState).forEach(([field, enabled]) => {
        this.saveFormatLock(field as 'name' | 'title' | 'department', enabled);
      });

      return null; // Success
    } catch (error) {
      if (error instanceof SyntaxError) {
        return 'Invalid JSON format';
      }
      return `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  /**
   * Check and migrate schema if needed
   * Called on app initialization
   */
  migrateSchema(): void {
    const storedVersion = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
    const currentVersion = SCHEMA_VERSION;

    if (!storedVersion) {
      // First time user or legacy data - set current version
      localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, String(currentVersion));
      return;
    }

    const storedNum = parseInt(storedVersion, 10);
    if (storedNum < currentVersion) {
      // Migration needed - add migration logic here when schema changes
      // Schema migration from v${storedNum} to v${currentVersion}

      // Example migration logic (add when needed):
      // if (storedNum === 1 && currentVersion === 2) {
      //   // Migrate v1 -> v2
      // }

      // Update version
      localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, String(currentVersion));
    }
  }

  /**
   * Clear all app data from localStorage
   * WARNING: This cannot be undone
   */
  clearAllData(): void {
    // Clear all app-specific keys
    Object.values(STORAGE_KEYS).forEach(key => {
      if (typeof key === 'string') {
        localStorage.removeItem(key);
      }
    });

    // Clear format lock keys
    ['name', 'title', 'department'].forEach(field => {
      localStorage.removeItem(`${STORAGE_KEYS.FORMAT_LOCK_PREFIX}${field}`);
    });

    // Reset to default state
    this.state = createDefaultState();
  }
}
