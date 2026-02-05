/**
 * Text Formatting Utilities
 * Pure text transformation functions
 */

import { PRESERVED_ACRONYMS, LOWERCASE_WORDS } from '../constants';

/**
 * Convert string to smart title case, preserving acronyms and handling lowercase words
 *
 * Examples:
 * - "director of marketing" → "Director of Marketing"
 * - "VP of iOS engineering" → "VP of iOS Engineering"
 * - "senior b2b account manager" → "Senior B2B Account Manager"
 *
 * @param str - String to convert
 * @returns Title-cased string with preserved acronyms
 */
export function toSmartTitleCase(str: string): string {
  if (!str || typeof str !== 'string') return str;

  // Split into words
  const words = str.toLowerCase().split(/\s+/);

  // Process each word
  const result = words.map((word, index) => {
    // Always capitalize first word
    if (index === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    // Check if it's a lowercase word
    if ((LOWERCASE_WORDS as readonly string[]).includes(word)) {
      return word;
    }

    // Capitalize first letter
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');

  // Restore preserved acronyms
  let finalResult = result;
  PRESERVED_ACRONYMS.forEach(acronym => {
    const regex = new RegExp('\\b' + acronym + '\\b', 'gi');
    finalResult = finalResult.replace(regex, acronym);
  });

  return finalResult;
}

/**
 * Escape HTML special characters to prevent XSS
 * @param text - Text to escape
 * @returns HTML-escaped text
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitize phone number for tel: links
 * Removes all characters except digits and +
 * @param phone - Phone number to sanitize
 * @returns Sanitized phone number (e.g., "+15125551234")
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Auto-generate email prefix from full name
 *
 * Examples:
 * - "John Smith" → "john.smith"
 * - "Jane Doe III" → "jane.doe"
 * - "Alice" → "alice"
 *
 * @param fullName - Full name to convert
 * @returns Email prefix (e.g., "john.smith")
 */
export function generateEmailPrefix(fullName: string): string {
  const cleaned = fullName.trim().toLowerCase();
  const parts = cleaned.split(/\s+/);

  if (parts.length >= 2) {
    const first = parts[0].replace(/[^a-z]/g, '');
    const last = parts[parts.length - 1].replace(/[^a-z]/g, '');
    return `${first}.${last}`;
  } else if (parts.length === 1 && parts[0]) {
    return parts[0].replace(/[^a-z]/g, '');
  }
  return '';
}

/**
 * Format US phone number to standard display format: +1 (XXX) XXX-XXXX
 * Handles extensions (x123, ext 123, ext. 123)
 *
 * Examples:
 * - "2813308004" → "+1 (281) 330-8004"
 * - "12813308004" → "+1 (281) 330-8004"
 * - "281-330-8004" → "+1 (281) 330-8004"
 * - "281-330-8004 x123" → "+1 (281) 330-8004 x123"
 * - "281330" → "281330" (too short, unchanged)
 *
 * @param phone - Phone number to format
 * @returns Formatted phone number or original if invalid
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone?.trim()) return phone || '';

  const trimmed = phone.trim();

  // Extract extension (x123, ext 123, ext. 123)
  const extMatch = trimmed.match(/\s*(x|ext\.?\s*)(\d+)\s*$/i);
  const extension = extMatch ? ` x${extMatch[2]}` : '';
  const mainNumber = extMatch ? trimmed.slice(0, extMatch.index).trim() : trimmed;

  // Extract digits only
  const digits = mainNumber.replace(/\D/g, '');

  // < 7 digits: don't format (validation handles error)
  if (digits.length < 7) return trimmed;

  // US: 10 digits
  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}${extension}`;
  }

  // US: 11 digits starting with 1
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}${extension}`;
  }

  // Unknown format: preserve as-is
  return trimmed;
}

/**
 * Filter phone input to digits only
 * Strips all non-digit characters for clean input
 *
 * @param input - Raw input value
 * @returns Digits only (max 15 per E.164 standard)
 */
export function filterPhoneDigits(input: string): string {
  const digits = input.replace(/\D/g, '');
  return digits.slice(0, 15);
}

/**
 * Minify HTML by removing unnecessary whitespace
 * Preserves content within tags, removes whitespace between tags
 *
 * @param html - HTML string to minify
 * @returns Minified HTML string
 */
export function minifyHtml(html: string): string {
  return html
    // Remove whitespace between tags
    .replace(/>\s+</g, '><')
    // Remove leading/trailing whitespace from each line
    .replace(/^\s+|\s+$/gm, '')
    // Collapse multiple whitespace into single space (within text content)
    .replace(/\s{2,}/g, ' ')
    // Remove empty lines
    .replace(/\n\s*\n/g, '\n')
    // Final trim
    .trim();
}
