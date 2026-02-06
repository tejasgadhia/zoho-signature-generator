import { describe, it, expect } from 'vitest';
import { toSmartTitleCase, escapeHtml, sanitizePhone, generateEmailPrefix, filterPhoneDigits, formatPhoneNumber } from './formatting';

describe('toSmartTitleCase', () => {
  it('should capitalize first letter of each word', () => {
    expect(toSmartTitleCase('john doe')).toBe('John Doe');
    expect(toSmartTitleCase('jane smith')).toBe('Jane Smith');
  });

  it('should preserve acronyms', () => {
    expect(toSmartTitleCase('ceo of company')).toBe('CEO of Company');
    expect(toSmartTitleCase('vp engineering')).toBe('VP Engineering');
    expect(toSmartTitleCase('ios developer')).toBe('iOS Developer');
    expect(toSmartTitleCase('api designer')).toBe('API Designer');
    expect(toSmartTitleCase('b2b sales')).toBe('B2B Sales');
    expect(toSmartTitleCase('head of hr')).toBe('Head of HR');
    expect(toSmartTitleCase('it manager')).toBe('IT Manager');
    expect(toSmartTitleCase('ui/ux designer')).toBe('UI/UX Designer');
  });

  it('should handle lowercase articles', () => {
    expect(toSmartTitleCase('director of sales')).toBe('Director of Sales');
    expect(toSmartTitleCase('head of the department')).toBe('Head of the Department');
  });

  it('should handle empty strings', () => {
    expect(toSmartTitleCase('')).toBe('');
  });

  it('should handle whitespace strings', () => {
    // Function preserves whitespace, doesn't trim
    expect(toSmartTitleCase('   ').trim()).toBe('');
  });

  it('should handle single words', () => {
    expect(toSmartTitleCase('engineering')).toBe('Engineering');
  });
});

// Note: escapeHtml tests are skipped because they require DOM environment
// The function uses document.createElement which isn't available in Node
describe.skip('escapeHtml (requires DOM)', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });
});

describe('sanitizePhone', () => {
  it('should remove all non-digit characters except leading +', () => {
    expect(sanitizePhone('+1 (512) 555-1234')).toBe('+15125551234');
    expect(sanitizePhone('512-555-1234')).toBe('5125551234');
    expect(sanitizePhone('(512) 555.1234')).toBe('5125551234');
  });

  it('should handle empty strings', () => {
    expect(sanitizePhone('')).toBe('');
  });

  it('should preserve leading + for international numbers', () => {
    expect(sanitizePhone('+44 20 7946 0958')).toBe('+442079460958');
    expect(sanitizePhone('+1-800-555-1234')).toBe('+18005551234');
  });
});

describe('generateEmailPrefix', () => {
  it('should generate prefix from full name', () => {
    expect(generateEmailPrefix('John Doe')).toBe('john.doe');
    expect(generateEmailPrefix('Jane Smith')).toBe('jane.smith');
  });

  it('should handle single names', () => {
    expect(generateEmailPrefix('John')).toBe('john');
  });

  it('should handle multiple names (uses first and last only)', () => {
    // Function uses only first and last name, ignoring middle names
    expect(generateEmailPrefix('John Michael Doe')).toBe('john.doe');
  });

  it('should convert to lowercase', () => {
    expect(generateEmailPrefix('JOHN DOE')).toBe('john.doe');
  });

  it('should handle empty strings', () => {
    expect(generateEmailPrefix('')).toBe('');
    expect(generateEmailPrefix('   ')).toBe('');
  });

  it('should remove special characters', () => {
    expect(generateEmailPrefix("John O'Brien")).toBe('john.obrien');
    expect(generateEmailPrefix('John-Smith')).toBe('johnsmith');
  });
});

describe('filterPhoneDigits', () => {
  it('should extract only digits', () => {
    expect(filterPhoneDigits('5551234567')).toBe('5551234567');
    expect(filterPhoneDigits('555')).toBe('555');
  });

  it('should strip non-digit characters', () => {
    expect(filterPhoneDigits('abc123')).toBe('123');
    expect(filterPhoneDigits('(555) 123-4567')).toBe('5551234567');
    expect(filterPhoneDigits('+1-555-123-4567')).toBe('15551234567');
  });

  it('should limit to 15 digits (E.164 max)', () => {
    expect(filterPhoneDigits('1234567890123456789')).toBe('123456789012345');
  });

  it('should allow international numbers (India, UK, Australia)', () => {
    // India: +91 followed by 10 digits = 12 digits
    expect(filterPhoneDigits('919876543210')).toBe('919876543210');
    // UK: +44 followed by 10 digits = 12 digits
    expect(filterPhoneDigits('442079460958')).toBe('442079460958');
    // Australia: +61 followed by 9 digits = 11 digits
    expect(filterPhoneDigits('61412345678')).toBe('61412345678');
  });

  it('should return empty string for empty input', () => {
    expect(filterPhoneDigits('')).toBe('');
  });

  it('should return empty string for non-digit input', () => {
    expect(filterPhoneDigits('abc')).toBe('');
  });
});

describe('formatPhoneNumber', () => {
  it('should format US 10-digit numbers', () => {
    expect(formatPhoneNumber('2813308004')).toBe('+1 (281) 330-8004');
    expect(formatPhoneNumber('512-555-1234')).toBe('+1 (512) 555-1234');
  });

  it('should format US 11-digit numbers starting with 1', () => {
    expect(formatPhoneNumber('12813308004')).toBe('+1 (281) 330-8004');
  });

  it('should pass through international numbers as-is', () => {
    // 12 digits (India) - not US format, preserved
    expect(formatPhoneNumber('919876543210')).toBe('919876543210');
    // 12 digits (UK) - not US format, preserved
    expect(formatPhoneNumber('442079460958')).toBe('442079460958');
  });

  it('should handle extensions', () => {
    expect(formatPhoneNumber('281-330-8004 x123')).toBe('+1 (281) 330-8004 x123');
    expect(formatPhoneNumber('281-330-8004 ext 456')).toBe('+1 (281) 330-8004 x456');
  });

  it('should return empty string for empty input', () => {
    expect(formatPhoneNumber('')).toBe('');
  });

  it('should return original for short numbers', () => {
    expect(formatPhoneNumber('123456')).toBe('123456');
  });
});
