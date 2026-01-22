/**
 * Signature Generator
 * Generates email-compatible HTML signatures with inline styles
 */

const SignatureGenerator = {
    // Zoho brand colors (email-compatible constants)
    ZOHO_RED: '#E42527',

    /**
     * Generate dark mode CSS style block
     * Includes media queries for prefers-color-scheme: dark
     * @returns {string} <style> block with dark mode overrides
     */
    getDarkModeStyles() {
        return `
<style>
  @media (prefers-color-scheme: dark) {
    /* Text colors - High contrast for WCAG AA compliance */
    .sig-name { color: #FFFFFF !important; }
    .sig-title { color: #E0E0E0 !important; }
    .sig-link { color: #4A9EFF !important; }
    .sig-separator { color: #666666 !important; }

    /* Logo switching - hide light, show dark */
    .sig-logo-light { display: none !important; }
    .sig-logo-dark { display: inline-block !important; }
  }

  /* Default: hide dark logo */
  .sig-logo-dark { display: none; }
</style>`.trim();
    },

    /**
     * Get logo URLs for both light and dark modes
     * Uses relative paths for local development and absolute URLs for production
     * @returns {Object} {light: string, dark: string}
     */
    getLogoUrls() {
        // Check if we're on GitHub Pages or local
        const isProduction = window.location.hostname.includes('github.io');
        const baseUrl = isProduction
            ? 'https://tejasgadhia.github.io/signature-generator/assets'
            : './assets';

        return {
            light: `${baseUrl}/zoho-logo-light.png`,
            dark: `${baseUrl}/zoho-logo-dark.png`
        };
    },

    /**
     * Generate dual logo HTML (light + dark versions)
     * Both logos included, CSS media query controls visibility
     * @param {string} websiteUrl - URL to wrap logos in
     * @param {number} height - Logo height in pixels
     * @returns {string} HTML with both logo variants
     */
    generateDualLogos(websiteUrl, height = 32) {
        const logos = this.getLogoUrls();
        return `
<a href="${websiteUrl}" style="text-decoration: none; display: inline-block;">
    <img src="${logos.light}"
         alt="Zoho"
         class="sig-logo-light"
         style="height: ${height}px; display: block; border: 0;"
         height="${height}">
    <img src="${logos.dark}"
         alt="Zoho"
         class="sig-logo-dark"
         style="height: ${height}px; display: none; border: 0;"
         height="${height}">
</a>`.trim();
    },

    /**
     * Generate HTML signature from form data
     * @param {Object} data - Form data object
     * @param {string} style - Signature style (classic, compact, modern, minimal)
     * @param {Object} socialOptions - Social media options {enabled, channels, displayType}
     * @returns {string} HTML signature with inline styles
     */
    generate(data, style = 'classic', socialOptions = {enabled: false, channels: [], displayType: 'text'}) {
        const logoUrl = 'https://www.zoho.com/sites/zweb/images/zoho_general_pages/zoho-logo-512.png';
        const websiteUrl = data.website || 'https://www.zoho.com';

        // Build contact details array
        const contacts = [];

        if (data.phone) {
            contacts.push(`<a href="tel:${this.sanitizePhone(data.phone)}" class="sig-link" style="color: #666666; text-decoration: none;">${this.escapeHtml(data.phone)}</a>`);
        }

        if (data.email) {
            contacts.push(`<a href="mailto:${this.escapeHtml(data.email)}" class="sig-link" style="color: #666666; text-decoration: none;">${this.escapeHtml(data.email)}</a>`);
        }

        if (data.linkedin) {
            const linkedinUrl = this.normalizeUrl(data.linkedin);
            contacts.push(`<a href="${linkedinUrl}" class="sig-link" style="color: #666666; text-decoration: none;">LinkedIn</a>`);
        }

        if (data.twitter) {
            const twitterHandle = data.twitter.replace('@', '');
            const twitterUrl = `https://twitter.com/${twitterHandle}`;
            contacts.push(`<a href="${twitterUrl}" class="sig-link" style="color: #666666; text-decoration: none;">@${this.escapeHtml(twitterHandle)}</a>`);
        }

        // Build Zoho social handles if requested
        let zohoSocialHtml = '';
        if (socialOptions.enabled && socialOptions.channels && socialOptions.channels.length > 0) {
            zohoSocialHtml = this.generateSocialLinks(socialOptions.channels, socialOptions.displayType);
        }

        // Generate signature based on style
        switch (style) {
            case 'compact':
                return this.generateCompactStyle(data, logoUrl, websiteUrl, contacts, zohoSocialHtml);
            case 'modern':
                return this.generateModernStyle(data, logoUrl, websiteUrl, contacts, zohoSocialHtml);
            case 'minimal':
                return this.generateMinimalStyle(data, websiteUrl, contacts, zohoSocialHtml);
            case 'classic':
            default:
                return this.generateClassicStyle(data, logoUrl, websiteUrl, contacts, zohoSocialHtml);
        }
    },

    /**
     * Generate social media links
     */
    generateSocialLinks(channels, displayType) {
        const socialData = {
            twitter: { url: 'https://x.com/Zoho', text: 'X', icon: '𝕏' },
            linkedin: { url: 'https://www.linkedin.com/company/zoho', text: 'LinkedIn', icon: 'in' },
            facebook: { url: 'https://www.facebook.com/zoho', text: 'Facebook', icon: 'f' },
            instagram: { url: 'https://www.instagram.com/zoho/', text: 'Instagram', icon: 'IG' }
        };

        const links = [];
        channels.forEach(channel => {
            if (socialData[channel]) {
                const social = socialData[channel];
                if (displayType === 'icons') {
                    links.push(`<a href="${social.url}" style="color: #666666; text-decoration: none; font-size: 16px; margin-right: 8px;" title="${social.text}">${social.icon}</a>`);
                } else {
                    links.push(`<a href="${social.url}" style="color: #666666; text-decoration: none;">${social.text}</a>`);
                }
            }
        });

        const separator = displayType === 'icons' ? '' : ' <span style="color: #cccccc;">•</span> ';
        const linksHtml = displayType === 'icons'
            ? links.join('')
            : links.join(separator);

        return `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e0e0e0;">
                <div style="font-size: 12px; color: #999999; margin-bottom: 6px;">Follow Zoho:</div>
                <div style="font-size: 12px;">
                    ${linksHtml}
                </div>
            </div>
        `;
    },

    /**
     * Generate Classic style signature
     */
    generateClassicStyle(data, logoUrl, websiteUrl, contacts, zohoSocialHtml) {
        const contactsHtml = contacts.length > 0
            ? contacts.join(' <span class="sig-separator" style="color: #cccccc;">•</span> ')
            : '';

        const titleParts = [];
        if (data.title) titleParts.push(this.escapeHtml(data.title));
        if (data.department) titleParts.push(this.escapeHtml(data.department));
        const titleLine = titleParts.join(' | ');

        return this.getDarkModeStyles() + `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">
    <tr>
        <td style="padding-bottom: 12px;">
            ${this.generateDualLogos(websiteUrl, 32)}
        </td>
    </tr>
    <tr>
        <td>
            <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td class="sig-name" style="font-size: 18px; font-weight: bold; color: #333333; padding-bottom: 4px;">
                        ${this.escapeHtml(data.name)}
                    </td>
                </tr>
                ${titleLine ? `
                <tr>
                    <td class="sig-title" style="font-size: 14px; color: #666666; padding-bottom: 8px;">
                        ${titleLine}
                    </td>
                </tr>
                ` : ''}
                ${contactsHtml ? `
                <tr>
                    <td style="font-size: 13px; color: #666666; padding-top: 4px;">
                        ${contactsHtml}
                    </td>
                </tr>
                ` : ''}
                ${zohoSocialHtml ? `
                <tr>
                    <td>
                        ${zohoSocialHtml}
                    </td>
                </tr>
                ` : ''}
            </table>
        </td>
    </tr>
</table>`.trim();
    },

    /**
     * Generate Compact style signature (single line)
     */
    generateCompactStyle(data, logoUrl, websiteUrl, contacts, zohoSocialHtml) {
        const titleParts = [];
        if (data.title) titleParts.push(this.escapeHtml(data.title));
        if (data.department) titleParts.push(this.escapeHtml(data.department));

        const parts = [this.escapeHtml(data.name)];
        if (titleParts.length) parts.push(titleParts.join(' | '));
        parts.push(...contacts);

        const allContent = parts.join(' <span style="color: #cccccc;">•</span> ');

        return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; font-size: 13px; line-height: 1.6; color: #333333;">
    <tr>
        <td style="padding-right: 12px; vertical-align: middle;">
            <a href="${websiteUrl}" style="text-decoration: none; display: inline-block;">
                <img src="${logoUrl}" alt="Zoho" style="height: 24px; display: block; border: 0;" height="24">
            </a>
        </td>
        <td style="vertical-align: middle;">
            <span style="font-weight: bold;">${allContent}</span>
            ${zohoSocialHtml}
        </td>
    </tr>
</table>`.trim();
    },

    /**
     * Generate Modern style signature (logo left, info right)
     */
    generateModernStyle(data, logoUrl, websiteUrl, contacts, zohoSocialHtml) {
        const contactsHtml = contacts.length > 0
            ? contacts.join(' <span style="color: #cccccc;">•</span> ')
            : '';

        const titleParts = [];
        if (data.title) titleParts.push(this.escapeHtml(data.title));
        if (data.department) titleParts.push(this.escapeHtml(data.department));
        const titleLine = titleParts.join(' | ');

        return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">
    <tr>
        <td style="padding-right: 16px; vertical-align: top; border-right: 3px solid ${this.ZOHO_RED};">
            <a href="${websiteUrl}" style="text-decoration: none; display: inline-block;">
                <img src="${logoUrl}" alt="Zoho" style="height: 48px; display: block; border: 0;" height="48">
            </a>
        </td>
        <td style="padding-left: 16px; vertical-align: top;">
            <div style="font-size: 16px; font-weight: bold; color: #333333; margin-bottom: 4px;">
                ${this.escapeHtml(data.name)}
            </div>
            ${titleLine ? `
            <div style="font-size: 13px; color: #666666; margin-bottom: 6px;">
                ${titleLine}
            </div>
            ` : ''}
            ${contactsHtml ? `
            <div style="font-size: 12px; color: #666666;">
                ${contactsHtml}
            </div>
            ` : ''}
            ${zohoSocialHtml}
        </td>
    </tr>
</table>`.trim();
    },

    /**
     * Generate Minimal style signature (text only, no logo)
     */
    generateMinimalStyle(data, websiteUrl, contacts, zohoSocialHtml) {
        const contactsHtml = contacts.length > 0
            ? contacts.join(' <span style="color: #cccccc;">•</span> ')
            : '';

        const titleParts = [];
        if (data.title) titleParts.push(this.escapeHtml(data.title));
        if (data.department) titleParts.push(this.escapeHtml(data.department));
        const titleLine = titleParts.join(' | ');

        return `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 1.6; color: #333333;">
    <tr>
        <td>
            <div style="font-size: 16px; font-weight: bold; color: ${this.ZOHO_RED}; margin-bottom: 4px;">
                ${this.escapeHtml(data.name)}
            </div>
            ${titleLine ? `
            <div style="font-size: 13px; color: #666666; margin-bottom: 6px;">
                ${titleLine}
            </div>
            ` : ''}
            ${contactsHtml ? `
            <div style="font-size: 12px; color: #666666; margin-bottom: 8px;">
                ${contactsHtml}
            </div>
            ` : ''}
            <div style="font-size: 12px; color: #999999;">
                <a href="${websiteUrl}" style="color: ${this.ZOHO_RED}; text-decoration: none; font-weight: 500;">Zoho Corporation</a>
            </div>
            ${zohoSocialHtml}
        </td>
    </tr>
</table>`.trim();
    },

    /**
     * Generate preview HTML
     * Note: Preview container background is controlled by CSS (.preview-container.dark-mode)
     * Signature itself should maintain email-compatible colors (works on both light/dark)
     */
    generatePreview(data, style = 'classic', socialOptions = {enabled: false, channels: [], displayType: 'text'}) {
        if (!data.name) {
            return `
                <div style="text-align: center; padding: 40px 20px; color: #999999;">
                    <p style="font-size: 16px; margin: 0;">Fill in your name to preview the signature</p>
                </div>
            `;
        }

        return this.generate(data, style, socialOptions);
    },

    /**
     * Escape HTML special characters
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Sanitize phone number for tel: link
     */
    sanitizePhone(phone) {
        return phone.replace(/[^\d+]/g, '');
    },

    /**
     * Normalize URL (add https:// if missing)
     */
    normalizeUrl(url) {
        if (!url.match(/^https?:\/\//)) {
            return 'https://' + url.replace(/^\/+/, '');
        }
        return url;
    },

    /**
     * Validate email format
     */
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    /**
     * Validate phone number format
     * Accepts formats like: +1 (512) 555-1234, +1-512-555-1234, 512-555-1234, etc.
     */
    isValidPhone(phone) {
        // Remove all non-digit characters except + at the start
        const cleaned = phone.replace(/[^\d+]/g, '');
        // Check if we have at least 10 digits (US number) or starts with + and has 10+ digits
        return /^\+?\d{10,}$/.test(cleaned);
    },

    /**
     * Clean LinkedIn URL by removing tracking parameters
     * Converts https://linkedin.com/in/username?tracking=xyz to https://linkedin.com/in/username
     */
    cleanLinkedInUrl(url) {
        try {
            const urlObj = new URL(this.normalizeUrl(url));
            if (urlObj.hostname.includes('linkedin.com')) {
                // Keep only the pathname, remove query parameters
                return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}`.replace(/\/$/, '');
            }
            return url;
        } catch {
            return url;
        }
    },

    /**
     * Validate URL format
     */
    isValidUrl(url) {
        try {
            new URL(this.normalizeUrl(url));
            return true;
        } catch {
            return false;
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SignatureGenerator;
}
