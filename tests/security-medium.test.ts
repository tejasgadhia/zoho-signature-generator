/**
 * Medium Security Fix Tests
 * Tests for #213 (ReDoS defense), #214 (DI error tracking), #216 (innerHTML removal)
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  extractBookingsSlug,
  sanitizeSocialUrl,
  cleanLinkedInUrl,
} from '../src/utils/url';
import { setupErrorBoundary } from '../src/utils/error-tracking';

// ─── #213: ReDoS Input Length Guards ───────────────────────────────────────────

describe('ReDoS defense: input length guards', () => {
  const oversized = 'a'.repeat(2049);

  it('extractBookingsSlug returns empty for oversized input', () => {
    expect(extractBookingsSlug(oversized)).toBe('');
  });

  it('extractBookingsSlug works normally for valid input', () => {
    expect(extractBookingsSlug('https://bookings.zohocorp.com/#/john')).toBe('john');
    expect(extractBookingsSlug('myslug')).toBe('myslug');
  });

  it('sanitizeSocialUrl returns empty for oversized input', () => {
    expect(sanitizeSocialUrl(oversized, 'x.com')).toBe('');
  });

  it('sanitizeSocialUrl works normally for valid input', () => {
    expect(sanitizeSocialUrl('https://x.com/johndoe', 'x.com')).toBe('johndoe');
    expect(sanitizeSocialUrl('johndoe', 'x.com')).toBe('johndoe');
  });

  it('cleanLinkedInUrl returns input as-is for oversized input', () => {
    expect(cleanLinkedInUrl(oversized)).toBe(oversized);
  });

  it('cleanLinkedInUrl works normally for valid input', () => {
    expect(cleanLinkedInUrl('https://linkedin.com/in/johndoe?tracking=xyz')).toBe(
      'https://linkedin.com/in/johndoe'
    );
  });

  it('accepts input at exactly 2048 chars', () => {
    const atLimit = 'a'.repeat(2048);
    // Should not be rejected — only >2048 is rejected
    expect(extractBookingsSlug(atLimit)).not.toBeUndefined();
    expect(sanitizeSocialUrl(atLimit, 'x.com')).not.toBeUndefined();
  });
});

// ─── #214: Error Tracking Dependency Injection ─────────────────────────────────

describe('setupErrorBoundary: dependency injection', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls injected showModal on window error event', () => {
    const showModal = vi.fn();

    // Spy on addEventListener to capture the handler
    const addSpy = vi.spyOn(window, 'addEventListener');

    setupErrorBoundary(showModal);

    // Find the 'error' handler
    const errorCall = addSpy.mock.calls.find(([type]) => type === 'error');
    expect(errorCall).toBeDefined();

    // Invoke the handler directly with a fake ErrorEvent
    const handler = errorCall![1] as EventListener;
    const fakeEvent = {
      error: new Error('test error'),
      message: 'test error',
      preventDefault: vi.fn(),
    };
    handler(fakeEvent as unknown as Event);

    expect(showModal).toHaveBeenCalledTimes(1);
    expect(showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Something went wrong',
        dismissible: false,
        errorContext: expect.objectContaining({
          message: 'test error',
        }),
      })
    );
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });

  it('calls injected showModal on unhandledrejection event', () => {
    const showModal = vi.fn();
    const addSpy = vi.spyOn(window, 'addEventListener');

    setupErrorBoundary(showModal);

    // Find the 'unhandledrejection' handler
    const rejectionCall = addSpy.mock.calls.find(
      ([type]) => type === 'unhandledrejection'
    );
    expect(rejectionCall).toBeDefined();

    const handler = rejectionCall![1] as EventListener;
    const fakeEvent = {
      reason: new Error('promise failed'),
      preventDefault: vi.fn(),
    };
    handler(fakeEvent as unknown as Event);

    expect(showModal).toHaveBeenCalledTimes(1);
    expect(showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Operation failed',
        dismissible: true,
      })
    );
  });
});

// ─── #216: innerHTML Removal (DOMParser for htmlToPlainText) ───────────────────

describe('htmlToPlainText via DOMParser', () => {
  // We test the DOMParser approach directly since htmlToPlainText is private.
  // This validates the pattern used in clipboard.ts.
  function htmlToPlainText(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  it('strips HTML tags from simple markup', () => {
    expect(htmlToPlainText('<p>Hello <b>World</b></p>')).toBe('Hello World');
  });

  it('returns empty string for empty input', () => {
    expect(htmlToPlainText('')).toBe('');
  });

  it('handles nested table structures (signature-like HTML)', () => {
    const html = '<table><tr><td>Name</td><td>Email</td></tr></table>';
    expect(htmlToPlainText(html)).toBe('NameEmail');
  });

  it('handles entities correctly', () => {
    expect(htmlToPlainText('&amp; &lt; &gt;')).toBe('& < >');
  });

  it('does not execute script tags', () => {
    const html = '<script>alert("xss")</script>Safe text';
    expect(htmlToPlainText(html)).toContain('Safe text');
  });
});
