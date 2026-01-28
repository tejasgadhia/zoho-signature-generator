/**
 * Contact Tiers Component
 * Builds tiered contact information (Tier 1: Primary, Tier 2: Personal)
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
 * Build Tier 2 links: Personal Connections (LinkedIn + X + Bookings)
 */
export function buildTier2Links(
  data: FormData,
  accentColor: string
): string {
  const tier2Links: string[] = [];

  if (data.linkedin) {
    // sanitizeSocialUrl extracts just the username (e.g., "johndoe" from full URL)
    const linkedinUsername = sanitizeSocialUrl(data.linkedin, 'linkedin.com');
    const linkedinUrl = `https://www.linkedin.com/in/${linkedinUsername}`;
    tier2Links.push(
      `<a href="${linkedinUrl}" rel="noopener noreferrer" class="sig-link" style="color: ${accentColor}; text-decoration: none;">LinkedIn</a>`
    );
  }

  if (data.twitter) {
    const xHandle = sanitizeSocialUrl(data.twitter, 'x.com').replace('@', '');
    tier2Links.push(
      `<a href="https://x.com/${xHandle}" rel="noopener noreferrer" class="sig-link" style="color: ${accentColor}; text-decoration: none;">X</a>`
    );
  }

  if (data.bookings) {
    tier2Links.push(
      `<a href="${escapeHtml(data.bookings)}" rel="noopener noreferrer" class="sig-link" style="color: ${accentColor}; text-decoration: none;">Book a Meeting</a>`
    );
  }

  return tier2Links.length > 0
    ? tier2Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
    : '';
}
