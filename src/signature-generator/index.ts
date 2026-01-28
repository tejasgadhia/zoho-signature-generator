/**
 * Signature Generator - Main Entry Point
 * Orchestrates signature generation across all styles and components
 * Includes error boundaries for resilient signature generation
 */

import type { FormData, SignatureStyle, SocialOptions } from '../types';
import { generateSocialLinks } from './components/social-links';
import { escapeHtml } from '../utils/formatting';

// Import all style generators
import * as ClassicStyle from './styles/classic';
import * as ProfessionalStyle from './styles/professional';
import * as CompactStyle from './styles/compact';
import * as ModernStyle from './styles/modern';
import * as CreativeStyle from './styles/creative';
import * as MinimalStyle from './styles/minimal';

/**
 * Custom error class for signature generation failures
 */
export class SignatureGenerationError extends Error {
  constructor(
    message: string,
    public readonly style: SignatureStyle,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'SignatureGenerationError';
  }
}

/**
 * Style generator function type
 */
type StyleGenerator = (
  data: FormData,
  websiteUrl: string,
  zohoSocialHtml: string,
  accentColor: string,
  isPreview: boolean
) => string;

/**
 * Map of style names to generator functions
 */
const STYLE_GENERATORS: Record<SignatureStyle, StyleGenerator> = {
  classic: ClassicStyle.generate,
  professional: ProfessionalStyle.generate,
  compact: CompactStyle.generate,
  modern: ModernStyle.generate,
  creative: CreativeStyle.generate,
  minimal: MinimalStyle.generate
};

/**
 * Generate a fallback signature when style generation fails
 * Uses minimal HTML that works in all email clients
 */
function generateFallbackSignature(data: FormData, accentColor: string): string {
  const name = escapeHtml(data.name || '');
  const title = escapeHtml(data.title || '');
  const department = escapeHtml(data.department || '');
  const email = escapeHtml(data.email || '');
  const phone = escapeHtml(data.phone || '');

  return `
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: Verdana, Geneva, sans-serif; font-size: 14px; color: #333333;">
      <tr>
        <td style="padding-bottom: 8px;">
          <strong style="font-size: 16px; color: ${accentColor};">${name}</strong>
        </td>
      </tr>
      ${title ? `<tr><td>${title}${department ? ` | ${department}` : ''}</td></tr>` : ''}
      ${email ? `<tr><td><a href="mailto:${email}" style="color: ${accentColor}; text-decoration: none;">${email}</a></td></tr>` : ''}
      ${phone ? `<tr><td>${phone}</td></tr>` : ''}
    </table>
  `.trim();
}

/**
 * Main SignatureGenerator class
 * Provides static methods for generating email signatures with error boundaries
 */
export class SignatureGenerator {
  /**
   * Generate HTML signature from form data
   * Includes error boundary - falls back to simple signature if style fails
   */
  static generate(
    data: FormData,
    style: SignatureStyle = 'classic',
    socialOptions: SocialOptions = { enabled: false, channels: [], displayType: 'text' },
    accentColor: string = '#E42527',
    isPreview: boolean = false
  ): string {
    const websiteUrl = data.website || 'https://www.zoho.com';

    // Build Zoho social handles if requested (with error boundary)
    let zohoSocialHtml = '';
    try {
      if (socialOptions.enabled && socialOptions.channels && socialOptions.channels.length > 0) {
        zohoSocialHtml = generateSocialLinks(
          socialOptions.channels,
          socialOptions.displayType,
          accentColor
        );
      }
    } catch (error) {
      console.warn('Failed to generate social links, continuing without them:', error);
      zohoSocialHtml = '';
    }

    // Get the generator for the requested style
    const generator = STYLE_GENERATORS[style];
    if (!generator) {
      console.warn(`Unknown style "${style}", falling back to classic`);
      return this.generateWithFallback(
        STYLE_GENERATORS.classic,
        data,
        websiteUrl,
        zohoSocialHtml,
        accentColor,
        isPreview,
        'classic'
      );
    }

    return this.generateWithFallback(
      generator,
      data,
      websiteUrl,
      zohoSocialHtml,
      accentColor,
      isPreview,
      style
    );
  }

  /**
   * Generate signature with fallback on error
   */
  private static generateWithFallback(
    generator: StyleGenerator,
    data: FormData,
    websiteUrl: string,
    zohoSocialHtml: string,
    accentColor: string,
    isPreview: boolean,
    styleName: SignatureStyle
  ): string {
    try {
      return generator(data, websiteUrl, zohoSocialHtml, accentColor, isPreview);
    } catch (error) {
      console.error(`Style "${styleName}" failed to generate:`, error);

      // Try classic style as secondary fallback (unless we're already classic)
      if (styleName !== 'classic') {
        try {
          console.warn(`Falling back to classic style`);
          return STYLE_GENERATORS.classic(data, websiteUrl, zohoSocialHtml, accentColor, isPreview);
        } catch (classicError) {
          console.error('Classic style also failed:', classicError);
        }
      }

      // Ultimate fallback: minimal inline signature
      console.warn('Using emergency fallback signature');
      return generateFallbackSignature(data, accentColor);
    }
  }

  /**
   * Generate preview HTML
   * Note: Preview container background is controlled by CSS (.preview-container.dark-mode)
   * Signature itself should maintain email-compatible colors (works on both light/dark)
   */
  static generatePreview(
    data: FormData,
    style: SignatureStyle = 'classic',
    socialOptions: SocialOptions = { enabled: false, channels: [], displayType: 'text' },
    accentColor: string = '#E42527'
  ): string {
    if (!data.name) {
      return `
        <div style="text-align: center; padding: 40px 20px; color: #999999;">
          <p style="font-size: 16px; margin: 0;">Fill in your name to preview the signature</p>
        </div>
      `;
    }

    // Pass isPreview=true to exclude media query dark mode
    return this.generate(data, style, socialOptions, accentColor, true);
  }

  /**
   * Validate that a style can be generated successfully
   * Useful for testing or pre-validation
   */
  static validateStyle(style: SignatureStyle): boolean {
    return style in STYLE_GENERATORS;
  }
}
