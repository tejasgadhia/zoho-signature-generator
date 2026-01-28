/**
 * Social Links Component
 * Generates Zoho corporate social media links (Tier 3: Company Brand)
 */

/**
 * Generate social media links HTML (Tier 3: Company Brand)
 * "Follow Zoho:" section with corporate social accounts
 */
export function generateSocialLinks(
  channels: string[],
  displayType: string,
  accentColor: string = '#E42527'
): string {
  const socialData: Record<string, { url: string; text: string; icon: string }> = {
    twitter: { url: 'https://x.com/Zoho', text: 'X', icon: '𝕏' },
    linkedin: {
      url: 'https://www.linkedin.com/company/zoho',
      text: 'LinkedIn',
      icon: 'in',
    },
    facebook: { url: 'https://www.facebook.com/zoho', text: 'Facebook', icon: 'f' },
    instagram: {
      url: 'https://www.instagram.com/zoho/',
      text: 'Instagram',
      icon: 'IG',
    },
  };

  const links: string[] = [];
  channels.forEach((channel) => {
    if (socialData[channel]) {
      const social = socialData[channel];
      if (displayType === 'icons') {
        links.push(
          `<a href="${social.url}" rel="noopener noreferrer" class="sig-link" style="color: ${accentColor}; text-decoration: none; font-size: 14px; margin-right: 8px;" title="${social.text}">${social.icon}</a>`
        );
      } else {
        links.push(
          `<a href="${social.url}" rel="noopener noreferrer" class="sig-link" style="color: ${accentColor}; text-decoration: none;">${social.text}</a>`
        );
      }
    }
  });

  const separator =
    displayType === 'icons' ? '' : ` <span class="sig-separator" style="color: ${accentColor};">•</span> `;
  const linksHtml = displayType === 'icons' ? links.join('') : links.join(separator);

  // Minimized styling - smaller font, lighter colors, less visual weight
  return `
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #EBEBEB;">
                <div style="font-size: 10px; color: #999999; margin-bottom: 2px;">Follow Zoho:</div>
                <div style="font-size: 10px;">
                    ${linksHtml}
                </div>
            </div>
        `;
}
