/**
 * TypeScript Type Definitions
 * All interfaces and types for the Zoho Signature Generator
 */

/**
 * Form data interface representing user input
 */
export interface FormData {
  name: string;
  title: string;
  department: string;
  email: string;
  phone: string;
  linkedin: string;
  twitter: string;
  bookings: string;
  website: string;
}

/**
 * Field toggles for optional fields
 * Each boolean indicates whether the field is enabled/visible
 */
export interface FieldToggles {
  title: boolean;
  department: boolean;
  email: boolean;
  phone: boolean;
  linkedin: boolean;
  twitter: boolean;
  bookings: boolean;
  website: boolean;
}

/**
 * Signature style options
 * Each style has a different visual layout
 */
export type SignatureStyle =
  | 'classic'       // Logo-top stacked layout, universal format
  | 'professional'  // Two-column layout, no accent bar
  | 'compact'       // Space-efficient single-line layout
  | 'modern'        // Two-column with vertical accent bar separator
  | 'creative'      // Bold left accent bar with logo stacked
  | 'minimal';      // Text-only, no logo


/**
 * Social media display type
 */
export type SocialDisplayType = 'text' | 'icons';

/**
 * Social media channel names
 */
export type SocialChannel = 'linkedin' | 'twitter' | 'instagram' | 'facebook';

/**
 * Social media options configuration
 */
export interface SocialOptions {
  enabled: boolean;
  channels: SocialChannel[];
  displayType: SocialDisplayType;
}

/**
 * Format lock state for title case auto-formatting
 */
export interface FormatLockState {
  name: boolean;
  title: boolean;
  department: boolean;
}

/**
 * Application state
 * Central state management for the signature generator
 */
export interface AppState {
  formData: FormData;
  fieldToggles: FieldToggles;
  signatureStyle: SignatureStyle;
  socialOptions: SocialOptions;
  isDarkModePreview: boolean;
  accentColor: string; // Hex color string (e.g., '#E42527')
  formatLockState: FormatLockState;
}

/**
 * Signature generation configuration
 * Parameters for generating a signature
 */
export interface SignatureConfig {
  data: FormData;
  style: SignatureStyle;
  socialOptions: SocialOptions;
  accentColor: string;
  isPreview: boolean;
}

/**
 * Social media channel data
 */
export interface SocialChannelData {
  url: string;
  text: string;
  icon: string;
}

/**
 * Logo URLs for light and dark modes
 */
export interface LogoUrls {
  light: string;
  dark: string;
}

/**
 * Help content configuration
 */
export interface HelpContent {
  title: string;
  content: string;
}

/**
 * DOM element references
 */
export interface DOMElements {
  form: HTMLFormElement | null;
  preview: HTMLElement | null;
  previewContainer: HTMLElement | null;
  copyButton: HTMLButtonElement | null;
  themeToggle: HTMLInputElement | null;
  toast: HTMLElement | null;
  importButtons: NodeListOf<HTMLButtonElement>;
}
