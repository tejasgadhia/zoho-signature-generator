/**
 * Input Validator
 * Centralized validation layer for all form inputs
 * Validates before state updates to ensure data integrity
 */

import type { FormData, ValidationResult } from '../types';

/**
 * Email validation regex - must be @zohocorp.com domain
 */
const ZOHOCORP_EMAIL_REGEX = /^[a-z0-9.]+@zohocorp\.com$/i;

/**
 * General email format regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation - minimum 10 digits
 */
const PHONE_MIN_DIGITS = 10;

/**
 * URL validation helper
 */
function isValidUrl(url: string): boolean {
  try {
    const normalized = url.match(/^https?:\/\//) ? url : 'https://' + url.replace(/^\/+/, '');
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
}

/**
 * Centralized input validator class
 * Provides consistent validation interface for all form fields
 */
export class InputValidator {
  /**
   * Validate any form field
   * @param field - Field name to validate
   * @param value - Value to validate
   * @returns ValidationResult with status and message
   */
  validate(field: keyof FormData, value: string): ValidationResult {
    const trimmedValue = value.trim();

    switch (field) {
      case 'email':
        return this.validateEmail(trimmedValue);
      case 'phone':
        return this.validatePhone(trimmedValue);
      case 'linkedin':
        return this.validateLinkedIn(trimmedValue);
      case 'twitter':
        return this.validateTwitter(trimmedValue);
      case 'bookings':
        return this.validateBookings(trimmedValue);
      case 'website':
        return this.validateWebsite(trimmedValue);
      case 'name':
        return this.validateName(trimmedValue);
      case 'title':
      case 'department':
        return this.validateText(field, trimmedValue);
      default:
        return this.createResult(field, trimmedValue, true, null);
    }
  }

  /**
   * Validate multiple fields at once
   * @param data - Partial form data to validate
   * @returns Array of validation results (only failed validations)
   */
  validateAll(data: Partial<FormData>): ValidationResult[] {
    const results: ValidationResult[] = [];

    for (const [field, value] of Object.entries(data)) {
      if (value !== undefined) {
        const result = this.validate(field as keyof FormData, value);
        if (!result.isValid) {
          results.push(result);
        }
      }
    }

    return results;
  }

  /**
   * Check if a value is valid for a field (simple boolean check)
   */
  isValid(field: keyof FormData, value: string): boolean {
    return this.validate(field, value).isValid;
  }

  // ===== PRIVATE VALIDATORS =====

  private validateEmail(value: string): ValidationResult {
    if (!value) {
      return this.createResult('email', value, true, null);
    }

    // Check for @zohocorp.com domain
    if (!ZOHOCORP_EMAIL_REGEX.test(value)) {
      // Check if it's a valid email format but wrong domain
      if (EMAIL_REGEX.test(value)) {
        return this.createResult('email', value, false, 'Must use @zohocorp.com domain');
      }
      return this.createResult('email', value, false, 'Invalid email format. Example: john.doe@zohocorp.com');
    }

    // Check email prefix rules (lowercase, no consecutive dots, etc.)
    const prefix = value.split('@')[0];
    if (prefix.length < 2) {
      return this.createResult('email', value, false, 'Email prefix needs at least 2 characters');
    }
    if (prefix.startsWith('.') || prefix.endsWith('.') || prefix.includes('..')) {
      return this.createResult('email', value, false, 'Dots cannot be at start, end, or consecutive');
    }

    return this.createResult('email', value, true, null);
  }

  private validatePhone(value: string): ValidationResult {
    if (!value) {
      return this.createResult('phone', value, true, null);
    }

    // Count digits only (ignore + and formatting)
    const digits = value.replace(/\D/g, '');
    if (digits.length < PHONE_MIN_DIGITS) {
      return this.createResult('phone', value, false, `Must have at least ${PHONE_MIN_DIGITS} digits. Example: +1 (281) 330-8004`);
    }

    return this.createResult('phone', value, true, null);
  }

  private validateLinkedIn(value: string): ValidationResult {
    if (!value) {
      return this.createResult('linkedin', value, true, null);
    }

    // Accept username or full URL
    if (value.includes('linkedin.com') && !isValidUrl(value)) {
      return this.createResult('linkedin', value, false, 'Invalid LinkedIn URL format');
    }

    return this.createResult('linkedin', value, true, null);
  }

  private validateTwitter(value: string): ValidationResult {
    if (!value) {
      return this.createResult('twitter', value, true, null);
    }

    // Accept username (with or without @) or full URL
    if ((value.includes('x.com') || value.includes('twitter.com')) && !isValidUrl(value)) {
      return this.createResult('twitter', value, false, 'Invalid X/Twitter URL format');
    }

    return this.createResult('twitter', value, true, null);
  }

  private validateBookings(value: string): ValidationResult {
    if (!value) {
      return this.createResult('bookings', value, true, null);
    }

    // If it's a full URL, validate URL format
    if (value.includes('bookings.zohocorp.com')) {
      if (!isValidUrl(value)) {
        return this.createResult('bookings', value, false, 'Invalid Bookings URL format');
      }
      // Extract the calendar ID from the URL for slug validation
      const match = value.match(/bookings\.zohocorp\.com\/#\/([^\/\?#]+)/i);
      if (match) {
        const slug = match[1];
        return this.validateBookingsSlug(slug);
      }
      return this.createResult('bookings', value, true, null);
    }

    // Validate as calendar ID/slug directly
    return this.validateBookingsSlug(value);
  }

  /**
   * Validate bookings calendar ID format
   * Must be URL-safe: letters, numbers, hyphens only
   */
  private validateBookingsSlug(slug: string): ValidationResult {
    // Must be at least 2 characters
    if (slug.length < 2) {
      return this.createResult('bookings', slug, false, 'Calendar ID must be at least 2 characters');
    }

    // Must be URL-safe: letters, numbers, hyphens only (no underscores per Zoho Bookings format)
    const slugRegex = /^[a-zA-Z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return this.createResult('bookings', slug, false, 'Use only letters, numbers, and hyphens (e.g., john-doe)');
    }

    // Cannot start or end with hyphen
    if (slug.startsWith('-') || slug.endsWith('-')) {
      return this.createResult('bookings', slug, false, 'Cannot start or end with a hyphen');
    }

    return this.createResult('bookings', slug, true, null);
  }

  private validateWebsite(value: string): ValidationResult {
    if (!value) {
      return this.createResult('website', value, true, null);
    }

    if (!isValidUrl(value)) {
      return this.createResult('website', value, false, 'Invalid URL format');
    }

    return this.createResult('website', value, true, null);
  }

  private validateName(value: string): ValidationResult {
    if (!value) {
      return this.createResult('name', value, true, null);
    }

    if (value.length < 2) {
      return this.createResult('name', value, false, 'Name must be at least 2 characters');
    }

    return this.createResult('name', value, true, null);
  }

  private validateText(field: keyof FormData, value: string): ValidationResult {
    // Generic text validation - just checks for reasonable length
    if (value && value.length > 100) {
      return this.createResult(field, value, false, 'Text is too long (max 100 characters)');
    }

    return this.createResult(field, value, true, null);
  }

  /**
   * Create a validation result object
   */
  private createResult(
    field: keyof FormData,
    value: string,
    isValid: boolean,
    message: string | null
  ): ValidationResult {
    return { field, value, isValid, message };
  }
}

// Export singleton instance for convenience
export const inputValidator = new InputValidator();
