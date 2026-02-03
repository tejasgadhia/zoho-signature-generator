/**
 * Input Validation Utilities
 * Pure validation functions for form inputs
 */

import { EMAIL_REGEX, PHONE_REGEX, EMAIL_PREFIX_REGEX } from '../constants';

/**
 * Validate email format
 * @param email - Email address to validate
 * @returns true if email format is valid
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validate phone number format
 * Accepts formats like: +1 (512) 555-1234, +1-512-555-1234, 512-555-1234, etc.
 * Minimum 10 digits required (excluding country code +)
 * @param phone - Phone number to validate
 * @returns true if phone has at least 10 digits
 */
export function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters except + at the start
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Check if we have at least 10 digits (US number) or starts with + and has 10+ digits
  return PHONE_REGEX.test(cleaned);
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns true if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    // Add https:// if missing for validation
    const normalized = url.match(/^https?:\/\//) ? url : 'https://' + url.replace(/^\/+/, '');
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate email prefix (before @zohocorp.com)
 * Strict validation: ONLY lowercase letters, numbers, and dots
 * Explicitly disallows: hyphens, underscores, plus signs, uppercase, all other special chars
 *
 * @param prefix - Email prefix to validate
 * @returns Error message if invalid, null if valid
 */
export function validateEmailPrefix(prefix: string): string | null {
  if (!prefix || prefix.length < 2) {
    return 'Email needs at least 2 characters (e.g., js, john.smith)';
  }

  // Strict email prefix validation: ONLY lowercase letters, numbers, and dots
  if (!EMAIL_PREFIX_REGEX.test(prefix)) {
    return 'Use only letters, numbers, and dots (e.g., john.smith or jsmith2)';
  }

  // Check for trailing dots, leading dots, or consecutive dots
  if (prefix.startsWith('.') || prefix.endsWith('.') || prefix.includes('..')) {
    return 'Dots can\'t be at the start, end, or in a row (e.g., john.smith ✓, .john ✗)';
  }

  return null;
}

/**
 * Validate LinkedIn URL domain
 * Only allows linkedin.com URLs to prevent phishing attacks
 * @param url - LinkedIn URL to validate
 * @returns Error message if invalid, null if valid
 */
export function validateLinkedInUrl(url: string): string | null {
  if (!url || url.trim() === '') {
    return null; // Empty is valid (optional field)
  }

  try {
    // Normalize URL (add https:// if missing)
    const normalized = url.match(/^https?:\/\//) ? url : 'https://' + url.replace(/^\/+/, '');
    const urlObj = new URL(normalized);

    // Check if hostname is linkedin.com or subdomain of linkedin.com
    const hostname = urlObj.hostname.toLowerCase();
    if (hostname !== 'linkedin.com' && !hostname.endsWith('.linkedin.com')) {
      return 'Must be a LinkedIn URL (e.g., linkedin.com/in/yourname)';
    }

    return null;
  } catch {
    return 'Invalid URL format (e.g., linkedin.com/in/yourname)';
  }
}

/**
 * Validate Zoho Bookings URL
 * Only allows Zoho subdomain URLs for security
 * @param url - Bookings URL to validate
 * @returns Error message if invalid, null if valid
 */
export function validateBookingsUrl(url: string): string | null {
  if (!url || url.trim() === '') {
    return null; // Empty is valid (optional field)
  }

  try {
    // Normalize URL (add https:// if missing)
    const normalized = url.match(/^https?:\/\//) ? url : 'https://' + url.replace(/^\/+/, '');
    const urlObj = new URL(normalized);

    // Check if hostname is zoho.com or subdomain of zoho.com
    const hostname = urlObj.hostname.toLowerCase();
    if (hostname !== 'zoho.com' && !hostname.endsWith('.zoho.com')) {
      return 'Must be a Zoho Bookings URL (e.g., bookings.zoho.com/yourname)';
    }

    return null;
  } catch {
    return 'Invalid URL format (e.g., bookings.zoho.com/yourname)';
  }
}
