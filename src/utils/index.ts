/**
 * Utility Functions - Barrel Export
 * Centralized export for all utility modules
 */

// Validation utilities
export {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  validateEmailPrefix
} from './validation';

// Formatting utilities
export {
  toSmartTitleCase,
  escapeHtml,
  sanitizePhone,
  generateEmailPrefix
} from './formatting';

// URL utilities
export {
  normalizeUrl,
  sanitizeSocialUrl,
  cleanLinkedInUrl,
  getTrackedWebsiteURL
} from './url';

// Storage utilities
export {
  getThemePreference,
  saveThemePreference,
  getAccentColor,
  saveAccentColor,
  getFormatLockState,
  saveFormatLockState,
  getSocialChannelOrder,
  saveSocialChannelOrder
} from './storage';

// Performance utilities
export { debounce } from './debounce';
