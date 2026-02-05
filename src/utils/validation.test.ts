import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPhone, isValidUrl, validateEmailPrefix } from './validation';

describe('isValidEmail', () => {
  it('should return true for valid email formats', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('john.doe@zohocorp.com')).toBe(true);
    expect(isValidEmail('user123@domain.co.uk')).toBe(true);
  });

  it('should return false for invalid email formats', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('missing@domain')).toBe(false);
    expect(isValidEmail('@nodomain.com')).toBe(false);
    expect(isValidEmail('spaces in@email.com')).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('should return true for valid phone numbers with 7+ digits', () => {
    expect(isValidPhone('1234567890')).toBe(true);
    expect(isValidPhone('+1 (512) 555-1234')).toBe(true);
    expect(isValidPhone('+1-512-555-1234')).toBe(true);
    expect(isValidPhone('512.555.1234')).toBe(true);
    expect(isValidPhone('+44 20 7946 0958')).toBe(true);
  });

  it('should return true for short international numbers (7+ digits)', () => {
    expect(isValidPhone('1234567')).toBe(true);      // 7 digits - minimum valid
    expect(isValidPhone('123456789')).toBe(true);     // 9 digits - valid international
  });

  it('should return false for phone numbers with fewer than 7 digits', () => {
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone('123456')).toBe(false);       // 6 digits - too short
    expect(isValidPhone('555-12')).toBe(false);       // 5 digits
  });

  it('should return false for numbers exceeding E.164 max (15 digits)', () => {
    expect(isValidPhone('1234567890123456')).toBe(false);  // 16 digits
  });
});

describe('isValidUrl', () => {
  it('should return true for valid URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://example.com')).toBe(true);
    expect(isValidUrl('example.com')).toBe(true);
    expect(isValidUrl('www.example.com/path')).toBe(true);
    expect(isValidUrl('https://sub.domain.example.com/path?query=1')).toBe(true);
  });

  it('should return false for invalid URLs', () => {
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('not a url')).toBe(false);
    expect(isValidUrl('://missing-scheme.com')).toBe(false);
  });
});

describe('validateEmailPrefix', () => {
  it('should return null for valid email prefixes', () => {
    expect(validateEmailPrefix('john')).toBe(null);
    expect(validateEmailPrefix('john.doe')).toBe(null);
    expect(validateEmailPrefix('jsmith2')).toBe(null);
    expect(validateEmailPrefix('john.doe.smith')).toBe(null);
  });

  it('should return error for prefixes that are too short', () => {
    expect(validateEmailPrefix('')).not.toBe(null);
    expect(validateEmailPrefix('a')).not.toBe(null);
  });

  it('should return error for prefixes with invalid characters', () => {
    expect(validateEmailPrefix('John')).not.toBe(null);  // uppercase
    expect(validateEmailPrefix('john_doe')).not.toBe(null);  // underscore
    expect(validateEmailPrefix('john-doe')).not.toBe(null);  // hyphen
    expect(validateEmailPrefix('john+doe')).not.toBe(null);  // plus
  });

  it('should return error for prefixes with invalid dot placement', () => {
    expect(validateEmailPrefix('.john')).not.toBe(null);  // leading dot
    expect(validateEmailPrefix('john.')).not.toBe(null);  // trailing dot
    expect(validateEmailPrefix('john..doe')).not.toBe(null);  // consecutive dots
  });
});
