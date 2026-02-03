/**
 * Application State Management
 * Centralized state with immutable patterns and localStorage persistence
 */

import type { AppState, FormData, FieldToggles, SocialOptions, SignatureStyle, SocialChannel } from '../types';
import { STORAGE_KEYS, SCHEMA_VERSION } from '../constants';
import { setEncryptedSigned, getEncryptedVerified } from '../utils/encrypted-storage';

/**
 * SECURITY NOTE - localStorage Encryption:
 * Currently only non-sensitive data is persisted to localStorage:
 * - Accent color, social order, format locks (preferences, not PII)
 * - FormData (name, email, phone) is transient and NOT persisted
 *
 * Encryption utilities available in:
 * - utils/crypto.ts - Low-level AES-GCM encryption
 * - utils/encrypted-storage.ts - High-level encrypted localStorage wrapper
 *
 * Export/Import uses JSON format (can be encrypted if saved to disk)
 */

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
  private migrationComplete: boolean = false;

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
   * Migrate plaintext localStorage keys to encrypted storage
   * Runs once per session, preserves original data until migration confirmed
   * IMPORTANT: Must be called before loadFromStorage()
   */
  async migrateLocalStorageToEncrypted(): Promise<void> {
    if (this.migrationComplete) return;

    const migrationKey = 'encryption-migration-v1';
    const alreadyMigrated = localStorage.getItem(migrationKey);

    // Skip if already migrated
    if (alreadyMigrated === 'complete') {
      this.migrationComplete = true;
      return;
    }

    // Migration happens silently in production

    let migratedCount = 0;
    const keysToMigrate = [
      STORAGE_KEYS.ACCENT_COLOR,
      STORAGE_KEYS.SOCIAL_ORDER,
      STORAGE_KEYS.FORMAT_LOCK_NAME,
      STORAGE_KEYS.FORMAT_LOCK_TITLE,
      STORAGE_KEYS.FORMAT_LOCK_DEPARTMENT
    ];

    for (const key of keysToMigrate) {
      try {
        const plaintext = localStorage.getItem(key);

        // Skip if key doesn't exist or already encrypted
        if (!plaintext) continue;

        // Check if already encrypted (signed data contains pipe separator)
        if (plaintext.includes('|')) {
          // Key already encrypted, skip
          continue;
        }

        // Encrypt and sign the plaintext value
        await setEncryptedSigned(key, plaintext);
        migratedCount++;
        // Migrated key silently
      } catch (error) {
        console.error(`Failed to migrate key ${key}:`, error);
        // Continue with other keys even if one fails
      }
    }

    // Mark migration as complete
    localStorage.setItem(migrationKey, 'complete');
    this.migrationComplete = true;

    // Migration complete (${migratedCount} keys encrypted)
  }

  /**
   * Load state from localStorage (immutable updates)
   * IMPORTANT: Must call migrateLocalStorageToEncrypted() first
   */
  async loadFromStorage(): Promise<void> {
    let updates: Partial<AppState> = {};

    // Load accent color (encrypted)
    const savedColor = await getEncryptedVerified(STORAGE_KEYS.ACCENT_COLOR);
    if (savedColor) {
      updates.accentColor = savedColor;
    }

    // Load social channel order (encrypted)
    const savedOrder = await getEncryptedVerified(STORAGE_KEYS.SOCIAL_ORDER);
    if (savedOrder) {
      try {
        const channels = JSON.parse(savedOrder);
        // Validate: must be array, max 5 items, only valid channel names
        const validChannels: SocialChannel[] = ['linkedin', 'youtube', 'twitter', 'instagram', 'facebook'];
        if (
          Array.isArray(channels) &&
          channels.length <= 5 &&
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

    // Load format lock states (encrypted)
    const formatLockUpdates: Partial<Record<'name' | 'title' | 'department', boolean>> = {};
    for (const field of ['name', 'title', 'department'] as const) {
      const key = `${STORAGE_KEYS.FORMAT_LOCK_PREFIX}${field}`;
      const saved = await getEncryptedVerified(key);
      if (saved !== null) {
        formatLockUpdates[field] = saved !== 'false';
      }
    }

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
   * Save accent color to localStorage (encrypted)
   */
  private async saveAccentColor(color: string): Promise<void> {
    await setEncryptedSigned(STORAGE_KEYS.ACCENT_COLOR, color);
  }

  /**
   * Save social channel order to localStorage (encrypted)
   */
  async saveSocialOrder(): Promise<void> {
    await setEncryptedSigned(
      STORAGE_KEYS.SOCIAL_ORDER,
      JSON.stringify(this.state.socialOptions.channels)
    );
  }

  /**
   * Save format lock state to localStorage (encrypted)
   */
  private async saveFormatLock(field: 'name' | 'title' | 'department', enabled: boolean): Promise<void> {
    const key = `${STORAGE_KEYS.FORMAT_LOCK_PREFIX}${field}`;
    await setEncryptedSigned(key, String(enabled));
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
      this.state = {
        ...this.state,
        formData: data.formData || this.state.formData,
        fieldToggles: data.fieldToggles || this.state.fieldToggles,
        signatureStyle: data.signatureStyle || this.state.signatureStyle,
        socialOptions: data.socialOptions || this.state.socialOptions,
        accentColor: data.accentColor || this.state.accentColor,
        formatLockState: data.formatLockState || this.state.formatLockState,
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
