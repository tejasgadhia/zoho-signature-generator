import { describe, it, expect } from 'vitest';
import { InputValidator, inputValidator } from './input-validator';

describe('InputValidator', () => {
  const validator = new InputValidator();

  describe('validate email', () => {
    it('should accept valid @zohocorp.com emails', () => {
      expect(validator.validate('email', 'john.doe@zohocorp.com').isValid).toBe(true);
      expect(validator.validate('email', 'jsmith@zohocorp.com').isValid).toBe(true);
      expect(validator.validate('email', 'test123@zohocorp.com').isValid).toBe(true);
    });

    it('should reject non-zohocorp emails', () => {
      const result = validator.validate('email', 'john@gmail.com');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('@zohocorp.com');
    });

    it('should reject invalid email formats', () => {
      expect(validator.validate('email', 'invalid').isValid).toBe(false);
      expect(validator.validate('email', '@zohocorp.com').isValid).toBe(false);
    });

    it('should accept empty email (optional field)', () => {
      expect(validator.validate('email', '').isValid).toBe(true);
    });

    it('should reject emails with short prefix', () => {
      expect(validator.validate('email', 'j@zohocorp.com').isValid).toBe(false);
    });

    it('should reject emails with bad dot placement', () => {
      expect(validator.validate('email', '.john@zohocorp.com').isValid).toBe(false);
      expect(validator.validate('email', 'john.@zohocorp.com').isValid).toBe(false);
      expect(validator.validate('email', 'john..doe@zohocorp.com').isValid).toBe(false);
    });
  });

  describe('validate phone', () => {
    it('should accept valid phone numbers', () => {
      expect(validator.validate('phone', '+1 (281) 330-8004').isValid).toBe(true);
      expect(validator.validate('phone', '2813308004').isValid).toBe(true);
      expect(validator.validate('phone', '+44 20 7946 0958').isValid).toBe(true);
    });

    it('should reject phone numbers with fewer than 10 digits', () => {
      const result = validator.validate('phone', '123456789');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('10');
    });

    it('should accept empty phone (optional field)', () => {
      expect(validator.validate('phone', '').isValid).toBe(true);
    });
  });

  describe('validate name', () => {
    it('should accept valid names', () => {
      expect(validator.validate('name', 'John Doe').isValid).toBe(true);
      expect(validator.validate('name', 'Jane').isValid).toBe(true);
    });

    it('should reject names that are too short', () => {
      expect(validator.validate('name', 'J').isValid).toBe(false);
    });

    it('should accept empty name', () => {
      expect(validator.validate('name', '').isValid).toBe(true);
    });
  });

  describe('validate text fields', () => {
    it('should accept valid title and department', () => {
      expect(validator.validate('title', 'Software Engineer').isValid).toBe(true);
      expect(validator.validate('department', 'Engineering').isValid).toBe(true);
    });

    it('should reject text that is too long', () => {
      const longText = 'a'.repeat(101);
      expect(validator.validate('title', longText).isValid).toBe(false);
    });
  });

  describe('validate URLs', () => {
    it('should accept valid LinkedIn URLs', () => {
      expect(validator.validate('linkedin', 'johndoe').isValid).toBe(true);
      expect(validator.validate('linkedin', 'https://linkedin.com/in/johndoe').isValid).toBe(true);
    });

    it('should accept valid Twitter usernames', () => {
      expect(validator.validate('twitter', 'johndoe').isValid).toBe(true);
      expect(validator.validate('twitter', '@johndoe').isValid).toBe(true);
    });

    it('should accept valid bookings calendar IDs', () => {
      expect(validator.validate('bookings', 'my-booking-id').isValid).toBe(true);
      expect(validator.validate('bookings', 'johndoe').isValid).toBe(true);
      expect(validator.validate('bookings', 'john-doe-123').isValid).toBe(true);
    });

    it('should accept valid full bookings URLs', () => {
      expect(validator.validate('bookings', 'https://bookings.zohocorp.com/#/my-id').isValid).toBe(true);
    });

    it('should accept valid website URLs', () => {
      expect(validator.validate('website', 'https://zoho.com').isValid).toBe(true);
      expect(validator.validate('website', 'zoho.com').isValid).toBe(true);
    });
  });

  describe('validate bookings calendar ID', () => {
    it('should accept valid calendar IDs', () => {
      expect(validator.validate('bookings', 'johndoe').isValid).toBe(true);
      expect(validator.validate('bookings', 'john-doe').isValid).toBe(true);
      expect(validator.validate('bookings', 'john123').isValid).toBe(true);
      expect(validator.validate('bookings', 'JohnDoe').isValid).toBe(true);
    });

    it('should reject calendar IDs that are too short', () => {
      const result = validator.validate('bookings', 'j');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('2 characters');
    });

    it('should reject calendar IDs with invalid characters', () => {
      const result = validator.validate('bookings', 'john_doe');
      expect(result.isValid).toBe(false);
      expect(result.message).toContain('letters, numbers, and hyphens');
    });

    it('should reject calendar IDs with spaces', () => {
      expect(validator.validate('bookings', 'john doe').isValid).toBe(false);
    });

    it('should reject calendar IDs starting or ending with hyphen', () => {
      expect(validator.validate('bookings', '-johndoe').isValid).toBe(false);
      expect(validator.validate('bookings', 'johndoe-').isValid).toBe(false);
    });

    it('should accept empty bookings (optional field)', () => {
      expect(validator.validate('bookings', '').isValid).toBe(true);
    });
  });

  describe('validateAll', () => {
    it('should return empty array when all fields are valid', () => {
      const results = validator.validateAll({
        name: 'John Doe',
        email: 'john.doe@zohocorp.com',
        phone: '+1 (281) 330-8004'
      });
      expect(results).toHaveLength(0);
    });

    it('should return array of failed validations', () => {
      const results = validator.validateAll({
        email: 'invalid-email',
        phone: '123'
      });
      expect(results).toHaveLength(2);
      expect(results[0].field).toBe('email');
      expect(results[1].field).toBe('phone');
    });
  });

  describe('isValid helper', () => {
    it('should return boolean for quick validation check', () => {
      expect(validator.isValid('email', 'john@zohocorp.com')).toBe(true);
      expect(validator.isValid('email', 'invalid')).toBe(false);
    });
  });

  describe('singleton instance', () => {
    it('should export a singleton instance', () => {
      expect(inputValidator).toBeInstanceOf(InputValidator);
      expect(inputValidator.isValid('name', 'Test')).toBe(true);
    });
  });
});
