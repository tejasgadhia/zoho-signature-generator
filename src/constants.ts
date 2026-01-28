/**
 * Application Constants
 * All constant values used throughout the application
 */

import type { FormData } from './types';

/**
 * Acronyms to preserve in title case formatting
 * These will remain uppercase when smart title case is applied
 */
export const PRESERVED_ACRONYMS = [
  // Job Roles
  'VP',
  'SVP',
  'EVP',
  'CEO',
  'CTO',
  'CFO',
  'COO',
  'CMO',
  'CIO',
  // Tech Terms
  'iOS',
  'API',
  'UI',
  'UX',
  'IT',
  'HR',
  // Business Terms
  'B2B',
  'B2C',
  'SaaS',
  'SMB',
] as const;

/**
 * Words that should remain lowercase in title case (unless first word)
 */
export const LOWERCASE_WORDS = [
  // Articles
  'a',
  'an',
  'the',
  // Conjunctions
  'and',
  'but',
  'or',
  'nor',
  // Prepositions
  'of',
  'at',
  'by',
  'for',
  'in',
  'on',
  'to',
  'up',
  'with',
  'as',
] as const;

/**
 * Example data for preview when fields are empty
 * Shows users what their signature will look like
 */
export const EXAMPLE_DATA: FormData = {
  name: 'Jasmine Frank',
  title: 'Director of Marketing',
  department: 'Zoho One',
  email: 'jasmine.frank@zohocorp.com',
  phone: '+1 (281) 330-8004',
  linkedin: 'https://linkedin.com/in/jasminefrank',
  twitter: 'https://x.com/jasminefrank',
  bookings: 'https://bookings.zohocorp.com/#/jasminefrank',
  website: 'https://www.zoho.com',
};

/**
 * Zoho brand colors (email-compatible hex values)
 */
export const ZOHO_RED = '#E42527';
export const ZOHO_GREEN = '#089949';
export const ZOHO_BLUE = '#226DB4';
export const ZOHO_YELLOW = '#F9B21D';

/**
 * Default accent color
 */
export const DEFAULT_ACCENT_COLOR = ZOHO_RED;

/**
 * Default signature style
 */
export const DEFAULT_SIGNATURE_STYLE = 'classic';

/**
 * Default website URL
 */
export const DEFAULT_WEBSITE_URL = 'https://www.zoho.com';

/**
 * Zoho email domain
 */
export const ZOHO_EMAIL_DOMAIN = '@zohocorp.com';

/**
 * Bookings URL base
 */
export const BOOKINGS_URL_BASE = 'https://bookings.zohocorp.com/#/';

/**
 * LinkedIn URL base
 */
export const LINKEDIN_URL_BASE = 'https://linkedin.com/in/';

/**
 * X (Twitter) URL base
 */
export const X_URL_BASE = 'https://x.com/';

/**
 * Zoho social media URLs
 */
export const ZOHO_SOCIAL_URLS = {
  twitter: 'https://x.com/Zoho',
  linkedin: 'https://www.linkedin.com/company/zoho',
  facebook: 'https://www.facebook.com/zoho',
  instagram: 'https://www.instagram.com/zoho/',
} as const;

/**
 * Social media channel display data
 */
export const SOCIAL_CHANNEL_DATA = {
  twitter: { url: ZOHO_SOCIAL_URLS.twitter, text: 'X', icon: '𝕏' },
  linkedin: { url: ZOHO_SOCIAL_URLS.linkedin, text: 'LinkedIn', icon: 'in' },
  facebook: { url: ZOHO_SOCIAL_URLS.facebook, text: 'Facebook', icon: 'f' },
  instagram: { url: ZOHO_SOCIAL_URLS.instagram, text: 'Instagram', icon: 'IG' },
} as const;

/**
 * Canonical order for social channels (determines display order)
 */
export const CANONICAL_SOCIAL_ORDER = [
  'linkedin',
  'twitter',
  'instagram',
  'facebook',
] as const;

/**
 * localStorage keys
 */
export const STORAGE_KEYS = {
  THEME: 'zoho-signature-preview-theme',
  ACCENT_COLOR: 'signature-accent-color',
  SOCIAL_ORDER: 'socialChannelOrder',
  FORMAT_LOCK_PREFIX: 'format-lock-',
  FORMAT_LOCK_NAME: 'format-lock-name',
  FORMAT_LOCK_TITLE: 'format-lock-title',
  FORMAT_LOCK_DEPARTMENT: 'format-lock-department',
} as const;

/**
 * Logo asset URLs (production)
 */
export const LOGO_URLS_PRODUCTION = {
  light: 'https://tejasgadhia.github.io/zoho-signature-generator/assets/zoho-logo-light.png',
  dark: 'https://tejasgadhia.github.io/zoho-signature-generator/assets/zoho-logo-dark.png',
} as const;

/**
 * Logo asset URLs (development)
 */
export const LOGO_URLS_DEVELOPMENT = {
  light: './assets/zoho-logo-light.png',
  dark: './assets/zoho-logo-dark.png',
} as const;

/**
 * Default logo height (pixels)
 */
export const DEFAULT_LOGO_HEIGHT = 32;

/**
 * Animation durations (milliseconds)
 */
export const ANIMATION_DURATIONS = {
  TOAST: 3000,
  COPY_SUCCESS: 2000,
  HELP_PANEL_DELAY: 200,
  DRAG_DROP_ANIMATION: 200,
} as const;

/**
 * Keyboard shortcuts
 */
export const KEYBOARD_SHORTCUTS = {
  FOCUS_FIRST_INPUT: 'k', // Cmd/Ctrl + K
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  SPACE: ' ',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
} as const;

/**
 * Validation constraints
 */
export const VALIDATION = {
  MIN_EMAIL_PREFIX_LENGTH: 2,
  MIN_PHONE_DIGITS: 10,
} as const;

/**
 * Email prefix regex (lowercase letters, numbers, dots only)
 */
export const EMAIL_PREFIX_REGEX = /^[a-z0-9.]+$/;

/**
 * Email validation regex
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex (10+ digits, optional + at start)
 */
export const PHONE_REGEX = /^\+?\d{10,}$/;
