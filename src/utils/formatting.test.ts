import { describe, it, expect } from 'vitest';
import { toSmartTitleCase, escapeHtml, sanitizePhone, generateEmailPrefix, liveFormatPhone } from './formatting';

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

describe('liveFormatPhone', () => {
  it('should auto-add +1 prefix when typing digits', () => {
    expect(liveFormatPhone('5', 1).formatted).toBe('+1 5');
    expect(liveFormatPhone('55', 2).formatted).toBe('+1 55');
    expect(liveFormatPhone('555', 3).formatted).toBe('+1 555');
  });

  it('should format with spaces: +1 XXX XXX XXXX', () => {
    expect(liveFormatPhone('5551234567', 10).formatted).toBe('+1 555 123 4567');
    expect(liveFormatPhone('555123', 6).formatted).toBe('+1 555 123');
  });

  it('should strip non-digit characters', () => {
    expect(liveFormatPhone('abc123', 6).formatted).toBe('+1 123');
    expect(liveFormatPhone('(555) 123-4567', 14).formatted).toBe('+1 555 123 4567');
    expect(liveFormatPhone('+1-555-123-4567', 15).formatted).toBe('+1 555 123 4567');
  });

  it('should strip leading 1 from 11-digit numbers', () => {
    expect(liveFormatPhone('15551234567', 11).formatted).toBe('+1 555 123 4567');
    expect(liveFormatPhone('+15551234567', 12).formatted).toBe('+1 555 123 4567');
  });

  it('should limit to 10 digits', () => {
    expect(liveFormatPhone('55512345678901', 14).formatted).toBe('+1 555 123 4567');
  });

  it('should return empty string for empty input', () => {
    expect(liveFormatPhone('', 0).formatted).toBe('');
  });

  it('should return empty string for non-digit input', () => {
    expect(liveFormatPhone('abc', 3).formatted).toBe('');
  });

  it('should calculate correct cursor position', () => {
    // After typing first digit, cursor should be after "+1 X"
    expect(liveFormatPhone('5', 1).cursorPosition).toBe(4);

    // After typing 3 digits, cursor should be after area code
    expect(liveFormatPhone('555', 3).cursorPosition).toBe(6);

    // After typing 4 digits, cursor should be after space
    expect(liveFormatPhone('5551', 4).cursorPosition).toBe(8);

    // After typing 7 digits, cursor should be after second space
    expect(liveFormatPhone('5551234', 7).cursorPosition).toBe(12);

    // Full 10 digits
    expect(liveFormatPhone('5551234567', 10).cursorPosition).toBe(15);
  });

  it('should handle cursor in middle of input', () => {
    // If cursor is at position 3 in "555", there are 3 digits before cursor
    const result = liveFormatPhone('5551234567', 3);
    expect(result.formatted).toBe('+1 555 123 4567');
    // 3 digits before cursor maps to position 6 (after "+1 555")
    expect(result.cursorPosition).toBe(6);
  });
});
