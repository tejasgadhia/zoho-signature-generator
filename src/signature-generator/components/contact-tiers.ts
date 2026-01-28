/**
 * Contact Tiers Component
 * Builds tiered contact information with clear hierarchy:
 * - Tier 1: Primary Contact (Phone + Email)
 * - Tier 2a: CTA (Book a Meeting) - prominent, standalone
 * - Tier 2b: Social Profiles (LinkedIn + X) - secondary
 */

import type { FormData } from '../../types';
import { escapeHtml, sanitizePhone, sanitizeSocialUrl } from '../../utils';

/**
 * Build Tier 1 links: Primary Contact (Phone + Email)
 */
export function buildTier1Links(
  data: FormData,
  accentColor: string
): string {
  const tier1Links: string[] = [];

  if (data.phone) {
    tier1Links.push(
      `<a href="tel:${sanitizePhone(data.phone)}" rel="noopener noreferrer" class="sig-link" style="color: ${accentColor}; text-decoration: none;">${escapeHtml(data.phone)}</a>`
    );
  }

  if (data.email) {
    tier1Links.push(
      `<a href="mailto:${escapeHtml(data.email)}" rel="noopener noreferrer" class="sig-link" style="color: ${accentColor}; text-decoration: none;">${escapeHtml(data.email)}</a>`
    );
  }

  return tier1Links.length > 0
    ? tier1Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
    : '';
}

/**
 * Build Tier 2 CTA: Book a Meeting (prominent, standalone)
 * Styled as a clear call-to-action with calendar icon
 */
export function buildTier2CTA(
  data: FormData,
  accentColor: string
): string {
  if (!data.bookings) {
    return '';
  }

  return `<a href="${escapeHtml(data.bookings)}" rel="noopener noreferrer" class="sig-link sig-cta" style="color: ${accentColor}; text-decoration: none; font-weight: 500;">Schedule a Meeting</a>`;
}

/**
 * Build Tier 2 Social: Personal profiles (LinkedIn + X)
 * Secondary to the CTA, shown as simple text links
 */
export function buildTier2Social(
  data: FormData,
  accentColor: string
): string {
  const socialLinks: string[] = [];

  if (data.linkedin) {
    const linkedinUsername = sanitizeSocialUrl(data.linkedin, 'linkedin.com');
    const linkedinUrl = `https://www.linkedin.com/in/${linkedinUsername}`;
    socialLinks.push(
      `<a href="${linkedinUrl}" rel="noopener noreferrer" class="sig-link" style="color: ${accentColor}; text-decoration: none;">LinkedIn</a>`
    );
  }

  if (data.twitter) {
    const xHandle = sanitizeSocialUrl(data.twitter, 'x.com').replace('@', '');
    socialLinks.push(
      `<a href="https://x.com/${xHandle}" rel="noopener noreferrer" class="sig-link" style="color: ${accentColor}; text-decoration: none;">X</a>`
    );
  }

  return socialLinks.length > 0
    ? socialLinks.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
    : '';
}

/**
 * @deprecated Use buildTier2CTA and buildTier2Social instead
 * Kept for backward compatibility - combines CTA and social links
 */
export function buildTier2Links(
  data: FormData,
  accentColor: string
): string {
  const ctaHtml = buildTier2CTA(data, accentColor);
  const socialHtml = buildTier2Social(data, accentColor);

  const parts = [ctaHtml, socialHtml].filter(Boolean);
  return parts.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `);
}
