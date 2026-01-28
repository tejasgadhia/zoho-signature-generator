/**
 * Professional Signature Style
 * Two-column layout, no accent bar
 * Best for Sales, Account Management, client-facing roles
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
  // Build title line
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
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Verdana, Geneva, sans-serif; font-size: 13px; line-height: 1.6; color: #333333;">
    <tr>
        <td style="padding-right: 14px; vertical-align: top; width: 75px;">
            ${generateDualLogos(websiteUrl, 38)}
        </td>
        <td style="vertical-align: top;">
            <div class="sig-name" style="font-size: 15px; font-weight: bold; color: #333333; margin-bottom: 3px;">
                ${escapeHtml(data.name)}
            </div>
            ${
              titleLine
                ? `
            <div class="sig-title" style="font-size: 13px; color: #666666; margin-bottom: 7px;">
                ${titleLine}
            </div>
            `
                : ''
            }
            ${
              tier1Html
                ? `
            <div style="font-size: 12px; margin-bottom: 4px;">
                ${tier1Html}
            </div>
            `
                : ''
            }
            ${
              ctaHtml
                ? `
            <div style="font-size: 12px; margin-bottom: 4px;">
                ${ctaHtml}
            </div>
            `
                : ''
            }
            ${
              socialHtml
                ? `
            <div style="font-size: 12px; margin-bottom: 2px;">
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
