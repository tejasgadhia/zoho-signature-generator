/**
 * Compact Signature Style
 * Space-efficient single-line layout
 * Best for mobile-heavy users and quick responders
 */

import type { FormData } from '../../types';
import { escapeHtml } from '../../utils';
import { getDarkModeStyles } from '../components/dark-mode';
import { generateDualLogos } from '../components/logos';
import { buildTier1Links, buildTier2CTA, buildTier2Social } from '../components/contact-tiers';

export function generate(
  data: FormData,
  websiteUrl: string,
  zohoSocialHtml: string,
  accentColor: string,
  isPreview: boolean
): string {
  // Build title line (inline with name)
  const titleParts: string[] = [];
  if (data.title) titleParts.push(escapeHtml(data.title));
  if (data.department) titleParts.push(escapeHtml(data.department));
  const titleLine = titleParts.join(' | ');

  // Tier 1: Primary Contact (Phone + Email)
  const tier1Html = buildTier1Links(data, accentColor);

  // Tier 2a: CTA (Book a Meeting) - prominent, standalone
  const ctaHtml = buildTier2CTA(data, accentColor);

  // Tier 2b: Personal Social (LinkedIn + X)
  const socialHtml = buildTier2Social(data, accentColor);

  return (
    getDarkModeStyles(isPreview) +
    `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Verdana, Geneva, sans-serif; font-size: 12px; line-height: 1.6; color: #333333;">
    <tr>
        <td style="padding-right: 10px; vertical-align: middle;">
            ${generateDualLogos(websiteUrl, 26)}
        </td>
        <td style="vertical-align: middle;">
            <div style="margin-bottom: 3px;">
                <span class="sig-name" style="font-weight: bold; color: #333333;">${escapeHtml(data.name)}</span>
                ${titleLine ? `<span class="sig-separator" style="color: ${accentColor};"> • </span><span class="sig-title" style="color: #666666;">${titleLine}</span>` : ''}
            </div>
            ${
              tier1Html
                ? `
            <div style="margin-bottom: 3px;">
                ${tier1Html}
            </div>
            `
                : ''
            }
            ${
              ctaHtml
                ? `
            <div style="margin-bottom: 3px;">
                ${ctaHtml}
            </div>
            `
                : ''
            }
            ${
              socialHtml
                ? `
            <div style="margin-bottom: 3px;">
                ${socialHtml}
            </div>
            `
                : ''
            }
            ${zohoSocialHtml}
        </td>
    </tr>
</table>`.trim()
  );
}
