/**
 * Signature Generator Tests
 * Comprehensive testing for all signature styles and edge cases
 */

import { describe, it, expect } from 'vitest';
import { SignatureGenerator } from '../src/signature-generator';
import type { SignatureStyle, SocialOptions } from '../src/types';
import {
  standardData,
  longNameData,
  allSocialsData,
  minimalData,
  xssData,
  emptyData,
  specialCharsData,
  unicodeData
} from './fixtures/signature-data';

// Test configuration
const accentColors = ['#E42527', '#089949', '#226DB4', '#F9B21D'];
const signatureStyles: SignatureStyle[] = [
  'classic',
  'modern',
  'compact',
  'minimal',
  'professional',
  'creative'
];

const defaultSocialOptions: SocialOptions = {
  enabled: true,
  channels: ['linkedin', 'twitter', 'instagram', 'facebook'],
  displayType: 'text'
};

describe('SignatureGenerator - Structure Validation', () => {
  it('all styles: generate table-based HTML', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Signature may start with <style> for dark mode, then <table>
      expect(html).toMatch(/<table/);
      expect(html).toContain('cellpadding="0"');
      expect(html).toContain('cellspacing="0"');
    });
  });

  it('all styles: use inline styles (not external CSS)', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should have inline style attributes
      expect(html).toMatch(/style="[^"]*font-family:/);
      expect(html).toMatch(/style="[^"]*color:/);

      // Should NOT have external stylesheet links (embedded <style> for dark mode is OK)
      expect(html).not.toContain('<link rel="stylesheet"');
    });
  });

  it('all styles: include Verdana font', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      expect(html).toContain('Verdana');
    });
  });

  it('all styles: include Zoho logo (except minimal)', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Minimal style doesn't include logo images (but may have CSS classes)
      if (style === 'minimal') {
        expect(html).not.toMatch(/<img[^>]*zoho-logo/i);
        return;
      }

      // All other styles should have logo images with both light and dark variants
      expect(html).toMatch(/<img[^>]*zoho-logo-light/i);
      expect(html).toMatch(/<img[^>]*zoho-logo-dark/i);
    });
  });
});

describe('SignatureGenerator - Dark Mode Support', () => {
  it('all styles: include dark mode CSS (always, regardless of isPreview)', () => {
    signatureStyles.forEach(style => {
      const htmlPreview = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        true  // isPreview=true
      );
      const htmlCopy = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false  // isPreview=false
      );

      // Both should include dark mode style block
      expect(htmlPreview).toContain('<style>');
      expect(htmlCopy).toContain('<style>');

      // Preview mode should NOT include media query (only .dark-mode class)
      expect(htmlPreview).not.toContain('@media (prefers-color-scheme: dark)');
      expect(htmlPreview).toContain('.dark-mode .sig-name');

      // Copy mode should include BOTH media query AND .dark-mode class
      expect(htmlCopy).toContain('@media (prefers-color-scheme: dark)');
      expect(htmlCopy).toContain('.dark-mode .sig-name');
    });
  });

  it('all styles: include dual logos for light/dark', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Minimal style doesn't include logos, skip it
      if (style === 'minimal') {
        expect(html).not.toContain('zoho-logo');
        return;
      }

      // All other styles should have both light and dark logo variants
      expect(html).toContain('zoho-logo-light');
      expect(html).toContain('zoho-logo-dark');
    });
  });

  it('all styles: include .dark-mode class on text elements', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        true
      );

      // Should have dark-mode-ready classes on text elements
      expect(html).toContain('class="sig-name"');
      expect(html).toContain('class="sig-title"');
      expect(html).toContain('class="sig-link"');
    });
  });
});

describe('SignatureGenerator - Production URLs', () => {
  it('styles with logos: use consistent URL format', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        standardData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Minimal style has no logo, skip it
      if (style === 'minimal') {
        return;
      }

      // In dev mode: relative URLs (./assets)
      // In prod mode: absolute URLs (tejasgadhia.github.io/zoho-signature-generator)
      // Either is valid - just check logos are present with some URL
      const hasRelativeUrls = html.includes('src="./assets/zoho-logo');
      const hasAbsoluteUrls = html.includes('tejasgadhia.github.io/zoho-signature-generator');

      expect(hasRelativeUrls || hasAbsoluteUrls).toBe(true);
    });
  });
});

describe('SignatureGenerator - Edge Cases', () => {
  it('handles long names without breaking layout', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        longNameData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      expect(html).toContain(longNameData.name);
      // Signature may start with <style> for dark mode, then <table>
      expect(html).toMatch(/<table/); // Still valid table structure
    });
  });

  it('handles all social channels enabled', () => {
    const allSocialOptions: SocialOptions = {
      enabled: true,
      channels: ['linkedin', 'twitter', 'instagram', 'facebook'],
      displayType: 'text'
    };

    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        allSocialsData,
        style,
        allSocialOptions,
        accentColors[0],
        false
      );

      // Should include all social links
      expect(html).toContain('linkedin.com');
      expect(html).toContain('x.com');
      expect(html).toContain('instagram.com');
      expect(html).toContain('facebook.com');
    });
  });

  it('handles minimal data (only required fields)', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        minimalData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      expect(html).toContain(minimalData.name);
      expect(html).toContain(minimalData.email);
      // Signature may start with <style> for dark mode, then <table>
      expect(html).toMatch(/<table/);
    });
  });

  it('handles empty data gracefully', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        emptyData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should still generate valid HTML structure
      // Signature may start with <style> for dark mode, then <table>
      expect(html).toMatch(/<table/);

      // Minimal style doesn't include logo
      if (style !== 'minimal') {
        expect(html).toContain('sig-logo');
      }
    });
  });

  it('handles special characters (apostrophes, hyphens, ampersands)', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        specialCharsData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should escape HTML entities
      expect(html).toContain('&');
      expect(html).not.toContain('R&D">'); // Should be properly escaped
    });
  });

  it('handles Unicode characters and emoji', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        unicodeData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      expect(html).toContain('田中');
      expect(html).toContain('🚀');
    });
  });
});

describe('SignatureGenerator - Security (XSS Prevention)', () => {
  it('escapes HTML in user input fields', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        xssData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should NOT contain unescaped script tags
      expect(html).not.toMatch(/<script[^>]*>(?!<)/);

      // Should escape < and >
      expect(html).toContain('&lt;');
      expect(html).toContain('&gt;');

      // Should escape quotes in attributes
      expect(html).not.toContain('"><script>');
    });
  });

  it('blocks javascript: URLs in links', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        xssData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should NOT contain javascript: protocol
      expect(html).not.toMatch(/href="javascript:/i);
    });
  });

  it('blocks data: URLs in links', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        xssData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should NOT contain data: protocol
      expect(html).not.toMatch(/href="data:/i);
    });
  });

  it('sanitizes onerror and other event handlers', () => {
    signatureStyles.forEach(style => {
      const html = SignatureGenerator.generate(
        xssData,
        style,
        defaultSocialOptions,
        accentColors[0],
        false
      );

      // Should NOT contain unescaped event handlers as HTML attributes
      // (escaped text like "&lt;img onerror=...&gt;" is safe)
      expect(html).not.toMatch(/<[^>]*\sonerror\s*=/i);
      expect(html).not.toMatch(/<[^>]*\sonclick\s*=/i);
      expect(html).not.toMatch(/<[^>]*\sonload\s*=/i);

      // Verify that malicious HTML is properly escaped
      expect(html).toContain('&lt;img');
      expect(html).toContain('&gt;');
    });
  });
});

describe('SignatureGenerator - Accent Colors', () => {
  it('applies custom accent colors correctly', () => {
    accentColors.forEach(color => {
      const html = SignatureGenerator.generate(
        standardData,
        'classic',
        defaultSocialOptions,
        color,
        false
      );

      // Should contain the accent color in styles
      expect(html).toContain(color);
    });
  });
});

describe('SignatureGenerator - Snapshot Tests', () => {
  describe('Classic Style', () => {
    it('classic: light mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'classic',
        defaultSocialOptions,
        accentColors[0],
        false
      );
      expect(html).toMatchSnapshot();
    });

    it('classic: dark mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'classic',
        defaultSocialOptions,
        accentColors[0],
        true
      );
      expect(html).toMatchSnapshot();
    });
  });

  describe('Modern Style', () => {
    it('modern: light mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'modern',
        defaultSocialOptions,
        accentColors[0],
        false
      );
      expect(html).toMatchSnapshot();
    });

    it('modern: dark mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'modern',
        defaultSocialOptions,
        accentColors[0],
        true
      );
      expect(html).toMatchSnapshot();
    });
  });

  describe('Compact Style', () => {
    it('compact: light mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'compact',
        defaultSocialOptions,
        accentColors[0],
        false
      );
      expect(html).toMatchSnapshot();
    });

    it('compact: dark mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'compact',
        defaultSocialOptions,
        accentColors[0],
        true
      );
      expect(html).toMatchSnapshot();
    });
  });

  describe('Minimal Style', () => {
    it('minimal: light mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'minimal',
        defaultSocialOptions,
        accentColors[0],
        false
      );
      expect(html).toMatchSnapshot();
    });

    it('minimal: dark mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'minimal',
        defaultSocialOptions,
        accentColors[0],
        true
      );
      expect(html).toMatchSnapshot();
    });
  });

  describe('Professional Style', () => {
    it('professional: light mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'professional',
        defaultSocialOptions,
        accentColors[0],
        false
      );
      expect(html).toMatchSnapshot();
    });

    it('professional: dark mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'professional',
        defaultSocialOptions,
        accentColors[0],
        true
      );
      expect(html).toMatchSnapshot();
    });
  });

  describe('Creative Style', () => {
    it('creative: light mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'creative',
        defaultSocialOptions,
        accentColors[0],
        false
      );
      expect(html).toMatchSnapshot();
    });

    it('creative: dark mode snapshot', () => {
      const html = SignatureGenerator.generate(
        standardData,
        'creative',
        defaultSocialOptions,
        accentColors[0],
        true
      );
      expect(html).toMatchSnapshot();
    });
  });
});
