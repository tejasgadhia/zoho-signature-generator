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
  generateEmailPrefix,
  formatPhoneNumber,
  liveFormatPhone
} from './formatting';
export type { LivePhoneFormatResult } from './formatting';

// URL utilities
export {
  normalizeUrl,
  sanitizeSocialUrl,
  cleanLinkedInUrl,
  getTrackedWebsiteURL,
  extractBookingsSlug
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

// Input validation layer
export { InputValidator, inputValidator } from './input-validator';
