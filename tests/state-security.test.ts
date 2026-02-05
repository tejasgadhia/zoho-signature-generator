/**
 * State Security Tests
 * Prototype pollution protection for setSocialOptions() and importData()
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AppStateManager } from '../src/app/state';
import { SCHEMA_VERSION } from '../src/constants';

describe('AppStateManager - Prototype Pollution Protection', () => {
  let stateManager: AppStateManager;

  beforeEach(() => {
    stateManager = new AppStateManager();
    // Mock localStorage for importData() which calls save methods internally
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  describe('setSocialOptions()', () => {
    it('rejects __proto__ keys', () => {
      const malicious = JSON.parse('{"__proto__": {"polluted": true}, "enabled": false}');
      stateManager.setSocialOptions(malicious);

      // Object.prototype should NOT be polluted
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();

      // Valid key should still be applied
      expect(stateManager.getState().socialOptions.enabled).toBe(false);
    });

    it('accepts only valid keys and ignores junk', () => {
      const mixed = {
        channels: ['linkedin', 'twitter'],
        enabled: true,
        hackKey: 'malicious',
        constructor: 'bad',
      } as Record<string, unknown>;

      stateManager.setSocialOptions(mixed as never);
      const state = stateManager.getState();

      expect(state.socialOptions.channels).toEqual(['linkedin', 'twitter']);
      expect(state.socialOptions.enabled).toBe(true);
      // Junk keys should not exist on the socialOptions object's own properties
      expect(Object.prototype.hasOwnProperty.call(state.socialOptions, 'hackKey')).toBe(false);
    });
  });

  describe('importData()', () => {
    it('sanitizes nested objects to prevent prototype pollution', () => {
      const maliciousExport = JSON.stringify({
        version: SCHEMA_VERSION,
        timestamp: new Date().toISOString(),
        data: {
          formData: JSON.parse('{"__proto__": {"polluted": true}, "name": "Test User"}'),
          fieldToggles: { email: true },
          socialOptions: { enabled: true, channels: ['linkedin'], displayType: 'text' },
        },
      });

      const result = stateManager.importData(maliciousExport);
      expect(result).toBeNull(); // import succeeds

      // Object.prototype should NOT be polluted
      expect(({} as Record<string, unknown>).polluted).toBeUndefined();

      // Valid data should be applied
      expect(stateManager.getState().formData.name).toBe('Test User');
    });

    it('applies valid data correctly', () => {
      const validExport = JSON.stringify({
        version: SCHEMA_VERSION,
        timestamp: new Date().toISOString(),
        data: {
          formData: { name: 'Jane Doe', email: 'jane@zohocorp.com', title: 'Engineer', department: 'R&D', phone: '', linkedin: '', twitter: '', bookings: '', website: 'https://www.zoho.com' },
          fieldToggles: { title: true, department: true, email: true, phone: false, linkedin: false, twitter: false, bookings: false, website: false },
          signatureStyle: 'modern',
          socialOptions: { enabled: true, channels: ['linkedin'], displayType: 'text' },
          accentColor: '#089949',
          formatLockState: { name: true, title: false, department: true },
        },
      });

      const result = stateManager.importData(validExport);
      expect(result).toBeNull();

      const state = stateManager.getState();
      expect(state.formData.name).toBe('Jane Doe');
      expect(state.signatureStyle).toBe('modern');
      expect(state.accentColor).toBe('#089949');
      expect(state.formatLockState.title).toBe(false);
    });
  });
});
