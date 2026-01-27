/**
 * Signature Generator
 * Generates email-compatible HTML signatures with inline styles
 */

const SignatureGenerator = {
    // Zoho brand colors (email-compatible constants)
    ZOHO_RED: '#E42527',

    /**
     * Generate dark mode CSS style block
     * @param {boolean} isPreview - If true, only use .dark-mode class (ignore system preference)
     * @returns {string} <style> block with dark mode overrides
     */
    getDarkModeStyles(isPreview = false) {
        if (isPreview) {
            // Preview mode: ONLY respond to .dark-mode class, ignore system preference
            return `
<style>
  /* Dark mode styles - ONLY for preview toggle (ignores system preference) */
  .dark-mode .sig-name { color: #FFFFFF !important; }
  .dark-mode .sig-title { color: #E0E0E0 !important; }
  /* Note: .sig-link uses inline accent color - no override needed */
  .dark-mode .sig-separator { color: #666666 !important; }
  .dark-mode .sig-logo-light { display: none !important; }
  .dark-mode .sig-logo-dark { display: inline-block !important; }

  /* Default: hide dark logo */
  .sig-logo-dark { display: none; }
</style>`.trim();
        } else {
            // Copy mode: Include media query for email clients
            return `
<style>
  /* Dark mode styles - applies when email client uses dark mode */
  @media (prefers-color-scheme: dark) {
    /* Text colors - High contrast for WCAG AA compliance */
    .sig-name { color: #FFFFFF !important; }
    .sig-title { color: #E0E0E0 !important; }
    /* Note: .sig-link uses inline accent color - no override needed */
    .sig-separator { color: #666666 !important; }

    /* Logo switching - hide light, show dark */
    .sig-logo-light { display: none !important; }
    .sig-logo-dark { display: inline-block !important; }
  }

  /* Also apply dark mode when container has .dark-mode class (for preview toggle) */
  .dark-mode .sig-name { color: #FFFFFF !important; }
  .dark-mode .sig-title { color: #E0E0E0 !important; }
  /* Note: .sig-link uses inline accent color - no override needed */
  .dark-mode .sig-separator { color: #666666 !important; }
  .dark-mode .sig-logo-light { display: none !important; }
  .dark-mode .sig-logo-dark { display: inline-block !important; }

  /* Default: hide dark logo */
  .sig-logo-dark { display: none; }
</style>`.trim();
        }
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
            ? 'https://tejasgadhia.github.io/zoho-signature-generator/assets'
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
     * @param {string} accentColor - Accent color for links
     * @param {boolean} isPreview - If true, exclude media query dark mode (preview only)
     * @returns {string} HTML signature with inline styles
     */
    generate(data, style = 'classic', socialOptions = {enabled: false, channels: [], displayType: 'text'}, accentColor = '#E42527', isPreview = false) {
        const logoUrl = 'https://www.zoho.com/sites/zweb/images/zoho_general_pages/zoho-logo-512.png';
        const websiteUrl = 'https://www.zoho.com';

        // Build contact details array
        const contacts = [];

        if (data.phone) {
            contacts.push(`<a href="tel:${this.sanitizePhone(data.phone)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">${this.escapeHtml(data.phone)}</a>`);
        }

        if (data.email) {
            contacts.push(`<a href="mailto:${this.escapeHtml(data.email)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">${this.escapeHtml(data.email)}</a>`);
        }

        if (data.linkedin) {
            const linkedinPath = this.sanitizeSocialUrl(data.linkedin, 'linkedin.com');
            const linkedinUrl = `https://www.linkedin.com/${linkedinPath}`;
            contacts.push(`<a href="${linkedinUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">LinkedIn</a>`);
        }

        if (data.twitter) {
            const xHandle = this.sanitizeSocialUrl(data.twitter, 'x.com').replace('@', '');
            const xUrl = `https://x.com/${xHandle}`;
            contacts.push(`<a href="${xUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">@${this.escapeHtml(xHandle)}</a>`);
        }

        // Build Zoho social handles if requested
        let zohoSocialHtml = '';
        if (socialOptions.enabled && socialOptions.channels && socialOptions.channels.length > 0) {
            zohoSocialHtml = this.generateSocialLinks(socialOptions.channels, socialOptions.displayType, accentColor);
        }

        // Generate signature based on style
        switch (style) {
            case 'professional':
                return this.generateProfessionalStyle(data, websiteUrl, zohoSocialHtml, accentColor, isPreview);
            case 'minimalist':
            case 'minimal':
                return this.generateMinimalStyle(data, websiteUrl, zohoSocialHtml, accentColor, isPreview);
            case 'compact':
                return this.generateCompactStyle(data, websiteUrl, zohoSocialHtml, accentColor, isPreview);
            case 'modern':
                return this.generateModernStyle(data, websiteUrl, zohoSocialHtml, accentColor, isPreview);
            case 'creative':
                return this.generateCreativeStyle(data, websiteUrl, zohoSocialHtml, accentColor, isPreview);
            // Legacy templates (kept for backward compatibility)
            case 'executive':
                return this.generateExecutiveStyle(data, websiteUrl, accentColor, isPreview);
            case 'bold':
                return this.generateBoldStyle(data, websiteUrl, socialOptions, accentColor, isPreview);
            case 'classic':
            default:
                return this.generateClassicStyle(data, logoUrl, websiteUrl, contacts, zohoSocialHtml, accentColor, isPreview);
        }
    },

    /**
     * Generate social media links (Tier 3: Company Brand)
     * "Follow Zoho:" section with corporate social accounts
     */
    generateSocialLinks(channels, displayType, accentColor = '#E42527') {
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
                    links.push(`<a href="${social.url}" class="sig-link" style="color: ${accentColor}; text-decoration: none; font-size: 14px; margin-right: 8px;" title="${social.text}">${social.icon}</a>`);
                } else {
                    links.push(`<a href="${social.url}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">${social.text}</a>`);
                }
            }
        });

        const separator = displayType === 'icons' ? '' : ` <span class="sig-separator" style="color: ${accentColor};">•</span> `;
        const linksHtml = displayType === 'icons'
            ? links.join('')
            : links.join(separator);

        return `
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #E0E0E0;">
                <div style="font-size: 11px; color: #888888; margin-bottom: 4px;">Follow Zoho:</div>
                <div style="font-size: 11px;">
                    ${linksHtml}
                </div>
            </div>
        `;
    },

    /**
     * Generate Classic style signature (DEFAULT)
     * Logo-top stacked layout, 3-tier content hierarchy
     * Best for everyone - universal format
     */
    generateClassicStyle(data, logoUrl, websiteUrl, contacts, zohoSocialHtml, accentColor = '#E42527', isPreview = false) {
        // Build title line
        const titleParts = [];
        if (data.title) titleParts.push(this.escapeHtml(data.title));
        if (data.department) titleParts.push(this.escapeHtml(data.department));
        const titleLine = titleParts.join(' | ');

        // Tier 1: Primary Contact (Phone + Email)
        const tier1Links = [];
        if (data.phone) {
            tier1Links.push(`<a href="tel:${this.sanitizePhone(data.phone)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="phone">${this.escapeHtml(data.phone)}</a>`);
        }
        if (data.email) {
            tier1Links.push(`<a href="mailto:${this.escapeHtml(data.email)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="email">${this.escapeHtml(data.email)}</a>`);
        }
        const tier1Html = tier1Links.length > 0
            ? tier1Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
            : '';

        // Tier 2: Personal Connections (LinkedIn + X + Bookings)
        const tier2Links = [];
        if (data.linkedin) {
            const linkedinPath = this.sanitizeSocialUrl(data.linkedin, 'linkedin.com');
            const linkedinUrl = `https://www.linkedin.com/${linkedinPath}`;
            tier2Links.push(`<a href="${linkedinUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="linkedin">LinkedIn</a>`);
        }
        if (data.twitter) {
            const xHandle = this.sanitizeSocialUrl(data.twitter, 'x.com').replace('@', '');
            tier2Links.push(`<a href="https://x.com/${xHandle}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="twitter">X</a>`);
        }
        if (data.bookings) {
            tier2Links.push(`<a href="${this.escapeHtml(data.bookings)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="bookings">Book a Meeting</a>`);
        }
        const tier2Html = tier2Links.length > 0
            ? tier2Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
            : '';

        return this.getDarkModeStyles(isPreview) + `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Verdana, Geneva, sans-serif; font-size: 13px; line-height: 1.6; color: #333333;">
    <tr>
        <td style="padding-bottom: 10px;">
            ${this.generateDualLogos(websiteUrl, 34)}
        </td>
    </tr>
    <tr>
        <td>
            <div class="sig-name" style="font-size: 15px; font-weight: bold; color: #333333; margin-bottom: 3px;" data-preview-field="name">
                ${this.escapeHtml(data.name)}
            </div>
            ${titleLine ? `
            <div class="sig-title" style="font-size: 13px; color: #666666; margin-bottom: 7px;" data-preview-field="${data.title ? 'title' : ''}${data.title && data.department ? ' ' : ''}${data.department ? 'department' : ''}">
                ${titleLine}
            </div>
            ` : ''}
            ${tier1Html ? `
            <div style="font-size: 12px; margin-bottom: 4px;">
                ${tier1Html}
            </div>
            ` : ''}
            ${tier2Html ? `
            <div style="font-size: 12px; margin-bottom: 2px;">
                ${tier2Html}
            </div>
            ` : ''}
            ${zohoSocialHtml}
        </td>
    </tr>
</table>`.trim();
    },

    /**
     * Generate Professional style signature (TWO-COLUMN)
     * Logo left, info right, no accent bar
     * Best for Sales, Account Management, client-facing roles
     */
    generateProfessionalStyle(data, websiteUrl, zohoSocialHtml, accentColor = '#E42527', isPreview = false) {
        // Build title line
        const titleParts = [];
        if (data.title) titleParts.push(this.escapeHtml(data.title));
        if (data.department) titleParts.push(this.escapeHtml(data.department));
        const titleLine = titleParts.join(' | ');

        // Tier 1: Primary Contact (Phone + Email)
        const tier1Links = [];
        if (data.phone) {
            tier1Links.push(`<a href="tel:${this.sanitizePhone(data.phone)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="phone">${this.escapeHtml(data.phone)}</a>`);
        }
        if (data.email) {
            tier1Links.push(`<a href="mailto:${this.escapeHtml(data.email)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="email">${this.escapeHtml(data.email)}</a>`);
        }
        const tier1Html = tier1Links.length > 0
            ? tier1Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
            : '';

        // Tier 2: Personal Connections (LinkedIn + X + Bookings)
        const tier2Links = [];
        if (data.linkedin) {
            const linkedinPath = this.sanitizeSocialUrl(data.linkedin, 'linkedin.com');
            const linkedinUrl = `https://www.linkedin.com/${linkedinPath}`;
            tier2Links.push(`<a href="${linkedinUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="linkedin">LinkedIn</a>`);
        }
        if (data.twitter) {
            const xHandle = this.sanitizeSocialUrl(data.twitter, 'x.com').replace('@', '');
            tier2Links.push(`<a href="https://x.com/${xHandle}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="twitter">X</a>`);
        }
        if (data.bookings) {
            tier2Links.push(`<a href="${this.escapeHtml(data.bookings)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="bookings">Book a Meeting</a>`);
        }
        const tier2Html = tier2Links.length > 0
            ? tier2Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
            : '';

        return this.getDarkModeStyles(isPreview) + `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Verdana, Geneva, sans-serif; font-size: 13px; line-height: 1.6; color: #333333;">
    <tr>
        <td style="padding-right: 14px; vertical-align: top; width: 75px;">
            ${this.generateDualLogos(websiteUrl, 38)}
        </td>
        <td style="vertical-align: top;">
            <div class="sig-name" style="font-size: 15px; font-weight: bold; color: #333333; margin-bottom: 3px;" data-preview-field="name">
                ${this.escapeHtml(data.name)}
            </div>
            ${titleLine ? `
            <div class="sig-title" style="font-size: 13px; color: #666666; margin-bottom: 7px;" data-preview-field="${data.title ? 'title' : ''}${data.title && data.department ? ' ' : ''}${data.department ? 'department' : ''}">
                ${titleLine}
            </div>
            ` : ''}
            ${tier1Html ? `
            <div style="font-size: 12px; margin-bottom: 4px;">
                ${tier1Html}
            </div>
            ` : ''}
            ${tier2Html ? `
            <div style="font-size: 12px; margin-bottom: 2px;">
                ${tier2Html}
            </div>
            ` : ''}
            ${zohoSocialHtml}
        </td>
    </tr>
</table>`.trim();
    },

    /**
     * Generate Compact style signature (SPACE-EFFICIENT)
     * Small logo left, multi-line stacked info right
     * Best for mobile-heavy users and quick responders
     */
    generateCompactStyle(data, websiteUrl, zohoSocialHtml, accentColor = '#E42527', isPreview = false) {
        // Build title line (inline with name)
        const titleParts = [];
        if (data.title) titleParts.push(this.escapeHtml(data.title));
        if (data.department) titleParts.push(this.escapeHtml(data.department));
        const titleLine = titleParts.join(' | ');

        // Tier 1: Primary Contact (Phone + Email)
        const tier1Links = [];
        if (data.phone) {
            tier1Links.push(`<a href="tel:${this.sanitizePhone(data.phone)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="phone">${this.escapeHtml(data.phone)}</a>`);
        }
        if (data.email) {
            tier1Links.push(`<a href="mailto:${this.escapeHtml(data.email)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="email">${this.escapeHtml(data.email)}</a>`);
        }
        const tier1Html = tier1Links.length > 0
            ? tier1Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
            : '';

        // Tier 2: Personal Connections (LinkedIn + X + Bookings)
        const tier2Links = [];
        if (data.linkedin) {
            const linkedinPath = this.sanitizeSocialUrl(data.linkedin, 'linkedin.com');
            const linkedinUrl = `https://www.linkedin.com/${linkedinPath}`;
            tier2Links.push(`<a href="${linkedinUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="linkedin">LinkedIn</a>`);
        }
        if (data.twitter) {
            const xHandle = this.sanitizeSocialUrl(data.twitter, 'x.com').replace('@', '');
            tier2Links.push(`<a href="https://x.com/${xHandle}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="twitter">X</a>`);
        }
        if (data.bookings) {
            tier2Links.push(`<a href="${this.escapeHtml(data.bookings)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="bookings">Book a Meeting</a>`);
        }
        const tier2Html = tier2Links.length > 0
            ? tier2Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
            : '';

        return this.getDarkModeStyles(isPreview) + `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Verdana, Geneva, sans-serif; font-size: 12px; line-height: 1.6; color: #333333;">
    <tr>
        <td style="padding-right: 10px; vertical-align: middle;">
            ${this.generateDualLogos(websiteUrl, 26)}
        </td>
        <td style="vertical-align: middle;">
            <div style="margin-bottom: 3px;">
                <span class="sig-name" style="font-weight: bold; color: #333333;" data-preview-field="name">${this.escapeHtml(data.name)}</span>
                ${titleLine ? `<span class="sig-separator" style="color: ${accentColor};"> • </span><span class="sig-title" style="color: #666666;" data-preview-field="${data.title ? 'title' : ''}${data.title && data.department ? ' ' : ''}${data.department ? 'department' : ''}">${titleLine}</span>` : ''}
            </div>
            ${tier1Html ? `
            <div style="margin-bottom: 3px;">
                ${tier1Html}
            </div>
            ` : ''}
            ${tier2Html ? `
            <div style="margin-bottom: 3px;">
                ${tier2Html}
            </div>
            ` : ''}
            ${zohoSocialHtml}
        </td>
    </tr>
</table>`.trim();
    },

    /**
     * Generate Modern style signature (2026 TREND)
     * Two-column with vertical accent bar separator
     * Best for Product, Engineering Leadership, tech-savvy professionals
     */
    generateModernStyle(data, websiteUrl, zohoSocialHtml, accentColor = '#E42527', isPreview = false) {
        // Build title line
        const titleParts = [];
        if (data.title) titleParts.push(this.escapeHtml(data.title));
        if (data.department) titleParts.push(this.escapeHtml(data.department));
        const titleLine = titleParts.join(' | ');

        // Tier 1: Primary Contact (Phone + Email)
        const tier1Links = [];
        if (data.phone) {
            tier1Links.push(`<a href="tel:${this.sanitizePhone(data.phone)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="phone">${this.escapeHtml(data.phone)}</a>`);
        }
        if (data.email) {
            tier1Links.push(`<a href="mailto:${this.escapeHtml(data.email)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="email">${this.escapeHtml(data.email)}</a>`);
        }
        const tier1Html = tier1Links.length > 0
            ? tier1Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
            : '';

        // Tier 2: Personal Connections (LinkedIn + X + Bookings)
        const tier2Links = [];
        if (data.linkedin) {
            const linkedinPath = this.sanitizeSocialUrl(data.linkedin, 'linkedin.com');
            const linkedinUrl = `https://www.linkedin.com/${linkedinPath}`;
            tier2Links.push(`<a href="${linkedinUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="linkedin">LinkedIn</a>`);
        }
        if (data.twitter) {
            const xHandle = this.sanitizeSocialUrl(data.twitter, 'x.com').replace('@', '');
            tier2Links.push(`<a href="https://x.com/${xHandle}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="twitter">X</a>`);
        }
        if (data.bookings) {
            tier2Links.push(`<a href="${this.escapeHtml(data.bookings)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="bookings">Book a Meeting</a>`);
        }
        const tier2Html = tier2Links.length > 0
            ? tier2Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
            : '';

        return this.getDarkModeStyles(isPreview) + `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Verdana, Geneva, sans-serif; font-size: 13px; line-height: 1.6; color: #333333;">
    <tr>
        <td style="padding-right: 14px; vertical-align: top; width: 75px;">
            ${this.generateDualLogos(websiteUrl, 38)}
        </td>
        <td style="width: 2px; background: ${accentColor}; opacity: 0.3;">&nbsp;</td>
        <td style="padding-left: 14px; vertical-align: top;">
            <div class="sig-name" style="font-size: 15px; font-weight: bold; color: #333333; margin-bottom: 3px;" data-preview-field="name">
                ${this.escapeHtml(data.name)}
            </div>
            ${titleLine ? `
            <div class="sig-title" style="font-size: 13px; color: #666666; margin-bottom: 7px;" data-preview-field="${data.title ? 'title' : ''}${data.title && data.department ? ' ' : ''}${data.department ? 'department' : ''}">
                ${titleLine}
            </div>
            ` : ''}
            ${tier1Html ? `
            <div style="font-size: 12px; margin-bottom: 4px;">
                ${tier1Html}
            </div>
            ` : ''}
            ${tier2Html ? `
            <div style="font-size: 12px; margin-bottom: 2px;">
                ${tier2Html}
            </div>
            ` : ''}
            ${zohoSocialHtml}
        </td>
    </tr>
</table>`.trim();
    },

    /**
     * Generate Creative style signature (BOLD LEFT BAR)
     * Thick left accent bar with logo stacked above name
     * Best for Marketing, Design, Events teams
     */
    generateCreativeStyle(data, websiteUrl, zohoSocialHtml, accentColor = '#E42527', isPreview = false) {
        // Build title line
        const titleParts = [];
        if (data.title) titleParts.push(this.escapeHtml(data.title));
        if (data.department) titleParts.push(this.escapeHtml(data.department));
        const titleLine = titleParts.join(' | ');

        // Tier 1: Primary Contact (Phone + Email)
        const tier1Links = [];
        if (data.phone) {
            tier1Links.push(`<a href="tel:${this.sanitizePhone(data.phone)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="phone">${this.escapeHtml(data.phone)}</a>`);
        }
        if (data.email) {
            tier1Links.push(`<a href="mailto:${this.escapeHtml(data.email)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="email">${this.escapeHtml(data.email)}</a>`);
        }
        const tier1Html = tier1Links.length > 0
            ? tier1Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
            : '';

        // Tier 2: Personal Connections (LinkedIn + X + Bookings)
        const tier2Links = [];
        if (data.linkedin) {
            const linkedinPath = this.sanitizeSocialUrl(data.linkedin, 'linkedin.com');
            const linkedinUrl = `https://www.linkedin.com/${linkedinPath}`;
            tier2Links.push(`<a href="${linkedinUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="linkedin">LinkedIn</a>`);
        }
        if (data.twitter) {
            const xHandle = this.sanitizeSocialUrl(data.twitter, 'x.com').replace('@', '');
            tier2Links.push(`<a href="https://x.com/${xHandle}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="twitter">X</a>`);
        }
        if (data.bookings) {
            tier2Links.push(`<a href="${this.escapeHtml(data.bookings)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="bookings">Book a Meeting</a>`);
        }
        const tier2Html = tier2Links.length > 0
            ? tier2Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
            : '';

        return this.getDarkModeStyles(isPreview) + `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Verdana, Geneva, sans-serif; font-size: 13px; line-height: 1.6; color: #333333;">
    <tr>
        <td style="width: 4px; background: ${accentColor};">&nbsp;</td>
        <td style="padding-left: 14px; vertical-align: top;">
            <div style="margin-bottom: 10px;">
                ${this.generateDualLogos(websiteUrl, 32)}
            </div>
            <div class="sig-name" style="font-size: 15px; font-weight: bold; color: #333333; margin-bottom: 3px;" data-preview-field="name">
                ${this.escapeHtml(data.name)}
            </div>
            ${titleLine ? `
            <div class="sig-title" style="font-size: 13px; color: #666666; margin-bottom: 7px;" data-preview-field="${data.title ? 'title' : ''}${data.title && data.department ? ' ' : ''}${data.department ? 'department' : ''}">
                ${titleLine}
            </div>
            ` : ''}
            ${tier1Html ? `
            <div style="font-size: 12px; margin-bottom: 4px;">
                ${tier1Html}
            </div>
            ` : ''}
            ${tier2Html ? `
            <div style="font-size: 12px; margin-bottom: 2px;">
                ${tier2Html}
            </div>
            ` : ''}
            ${zohoSocialHtml}
        </td>
    </tr>
</table>`.trim();
    },

    /**
     * Generate Minimalist style signature (TEXT-ONLY)
     * No logo, text-focused, tighter spacing
     * Best for Engineering, Technical Support, text-focused communication
     */
    generateMinimalStyle(data, websiteUrl, zohoSocialHtml, accentColor = '#E42527', isPreview = false) {
        // Build title line
        const titleParts = [];
        if (data.title) titleParts.push(this.escapeHtml(data.title));
        if (data.department) titleParts.push(this.escapeHtml(data.department));
        const titleLine = titleParts.join(' | ');

        // Tier 1: Primary Contact (Phone + Email)
        const tier1Links = [];
        if (data.phone) {
            tier1Links.push(`<a href="tel:${this.sanitizePhone(data.phone)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="phone">${this.escapeHtml(data.phone)}</a>`);
        }
        if (data.email) {
            tier1Links.push(`<a href="mailto:${this.escapeHtml(data.email)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="email">${this.escapeHtml(data.email)}</a>`);
        }
        const tier1Html = tier1Links.length > 0
            ? tier1Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
            : '';

        // Tier 2: Personal Connections (LinkedIn + X + Bookings)
        const tier2Links = [];
        if (data.linkedin) {
            const linkedinPath = this.sanitizeSocialUrl(data.linkedin, 'linkedin.com');
            const linkedinUrl = `https://www.linkedin.com/${linkedinPath}`;
            tier2Links.push(`<a href="${linkedinUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="linkedin">LinkedIn</a>`);
        }
        if (data.twitter) {
            const xHandle = this.sanitizeSocialUrl(data.twitter, 'x.com').replace('@', '');
            tier2Links.push(`<a href="https://x.com/${xHandle}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="twitter">X</a>`);
        }
        if (data.bookings) {
            tier2Links.push(`<a href="${this.escapeHtml(data.bookings)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="bookings">Book a Meeting</a>`);
        }
        const tier2Html = tier2Links.length > 0
            ? tier2Links.join(` <span class="sig-separator" style="color: ${accentColor};">•</span> `)
            : '';

        return this.getDarkModeStyles(isPreview) + `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Verdana, Geneva, sans-serif; font-size: 13px; line-height: 1.6; color: #333333; max-width: 450px;">
    <tr>
        <td>
            <div class="sig-name" style="font-size: 16px; font-weight: bold; color: #333333; margin-bottom: 2px;" data-preview-field="name">
                ${this.escapeHtml(data.name)}
            </div>
            ${titleLine ? `
            <div class="sig-title" style="font-size: 13px; color: #666666; margin-bottom: 8px;" data-preview-field="${data.title ? 'title' : ''}${data.title && data.department ? ' ' : ''}${data.department ? 'department' : ''}">
                ${titleLine}
            </div>
            ` : ''}
            ${tier1Html ? `
            <div style="font-size: 12px; margin-bottom: 4px;">
                ${tier1Html}
            </div>
            ` : ''}
            ${tier2Html ? `
            <div style="font-size: 12px; margin-bottom: 2px;">
                ${tier2Html}
            </div>
            ` : ''}
            ${zohoSocialHtml}
        </td>
    </tr>
</table>`.trim();
    },

    /**
     * Generate Executive style signature
     * Target: VPs, C-Suite, Senior Leadership
     * Design: Large name, center-aligned, minimal info, accent line, no social media
     */
    generateExecutiveStyle(data, websiteUrl, accentColor = '#E42527', isPreview = false) {
        const logos = this.getLogoUrls();

        return this.getDarkModeStyles(isPreview) + `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; max-width: 500px; margin: 0 auto;">
    <tr>
        <td style="padding: 20px 0; text-align: center;">
            <!-- Name (large, bold) -->
            <div class="sig-name" style="font-size: 20px; font-weight: 700; color: #000000; margin-bottom: 4px;" data-preview-field="name">
                ${this.escapeHtml(data.name)}
            </div>

            <!-- Accent line below name -->
            <div style="width: 60px; height: 2px; background: ${accentColor}; margin: 8px auto 12px auto;"></div>

            <!-- Title (if provided) -->
            ${data.title ? `
            <div class="sig-title" style="font-size: 14px; color: #666666; margin-bottom: 12px;" data-preview-field="title">
                ${this.escapeHtml(data.title)}
            </div>
            ` : ''}

            <!-- Logo -->
            <div style="margin: 16px 0;">
                <a href="${websiteUrl}" style="text-decoration: none; display: inline-block;">
                    <img src="${logos.light}"
                         alt="Zoho"
                         class="sig-logo-light"
                         style="height: 40px; display: block; border: 0;"
                         height="40">
                    <img src="${logos.dark}"
                         alt="Zoho"
                         class="sig-logo-dark"
                         style="height: 40px; display: none; border: 0;"
                         height="40">
                </a>
            </div>

            <!-- Contact info (vertical stack, centered) -->
            ${data.email ? `
            <div style="margin-bottom: 4px;">
                <a href="mailto:${this.escapeHtml(data.email)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="email">
                    ${this.escapeHtml(data.email)}
                </a>
            </div>
            ` : ''}

            ${data.phone ? `
            <div style="margin-bottom: 4px;">
                <a href="tel:${this.sanitizePhone(data.phone)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="phone">
                    ${this.escapeHtml(data.phone)}
                </a>
            </div>
            ` : ''}

            ${websiteUrl ? `
            <div style="margin-bottom: 4px;">
                <a href="${websiteUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">
                    zoho.com
                </a>
            </div>
            ` : ''}
        </td>
    </tr>
</table>`.trim();
    },

    /**
     * Generate Bold style signature
     * Target: Marketing, Events Team
     * Design: Colored name/title block with contrast-aware text color
     */
    generateBoldStyle(data, websiteUrl, socialOptions, accentColor = '#E42527', isPreview = false) {
        const logos = this.getLogoUrls();

        // Determine text color based on background (yellow needs dark text for contrast)
        const textColor = accentColor === '#F9B21D' ? '#333333' : '#FFFFFF';

        // Build contact links (will be colored in accent color)
        const contacts = [];
        if (data.email) {
            contacts.push(`<a href="mailto:${this.escapeHtml(data.email)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="email">${this.escapeHtml(data.email)}</a>`);
        }
        if (data.phone) {
            contacts.push(`<a href="tel:${this.sanitizePhone(data.phone)}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="phone">${this.escapeHtml(data.phone)}</a>`);
        }
        if (data.linkedin) {
            const linkedinPath = this.sanitizeSocialUrl(data.linkedin, 'linkedin.com');
            const linkedinUrl = `https://www.linkedin.com/${linkedinPath}`;
            contacts.push(`<a href="${linkedinUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;" data-preview-field="linkedin">LinkedIn</a>`);
        }
        if (websiteUrl) {
            contacts.push(`<a href="${websiteUrl}" class="sig-link" style="color: ${accentColor}; text-decoration: none;">zoho.com</a>`);
        }

        // Build social media icons if enabled
        let socialHtml = '';
        if (socialOptions.enabled && socialOptions.channels && socialOptions.channels.length > 0) {
            const socialData = {
                twitter: { url: 'https://x.com/Zoho', text: 'X', icon: '𝕏' },
                linkedin: { url: 'https://www.linkedin.com/company/zoho', text: 'LinkedIn', icon: 'in' },
                facebook: { url: 'https://www.facebook.com/zoho', text: 'Facebook', icon: 'f' },
                instagram: { url: 'https://www.instagram.com/zoho/', text: 'Instagram', icon: 'IG' }
            };

            const socialLinks = socialOptions.channels.map(channel => {
                const channelData = socialData[channel];
                if (!channelData) return '';

                return `<a href="${channelData.url}" class="sig-link" style="display: inline-block; margin: 0 4px; width: 24px; height: 24px; background: ${accentColor}; color: ${textColor}; text-align: center; line-height: 24px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: 600;">${channelData.icon}</a>`;
            }).filter(link => link !== '').join('');

            if (socialLinks) {
                socialHtml = `
                <div style="margin-top: 8px;">
                    ${socialLinks}
                </div>
                `;
            }
        }

        return this.getDarkModeStyles(isPreview) + `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; max-width: 500px;">
    <tr>
        <td style="padding: 12px 0;">
            <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
                <tr>
                    <!-- Logo (left) -->
                    <td style="width: 60px; vertical-align: middle; padding-right: 12px;">
                        <a href="${websiteUrl}" style="text-decoration: none; display: block;">
                            <img src="${logos.light}"
                                 alt="Zoho"
                                 class="sig-logo-light"
                                 style="height: 32px; display: block; border: 0;"
                                 height="32">
                            <img src="${logos.dark}"
                                 alt="Zoho"
                                 class="sig-logo-dark"
                                 style="height: 32px; display: none; border: 0;"
                                 height="32">
                        </a>
                    </td>

                    <!-- Info block -->
                    <td style="vertical-align: middle;">
                        <!-- Colored name/title block -->
                        <div style="background: ${accentColor}; color: ${textColor}; padding: 12px 16px; border-radius: 8px; margin-bottom: 8px;">
                            <div class="sig-name" style="font-size: 16px; font-weight: 700; margin-bottom: 2px;" data-preview-field="name">
                                ${this.escapeHtml(data.name)}
                            </div>
                            ${data.title ? `
                            <div class="sig-title" style="font-size: 13px; opacity: 0.9;" data-preview-field="title">
                                ${this.escapeHtml(data.title)}
                            </div>
                            ` : ''}
                        </div>

                        <!-- Contact info (horizontal) -->
                        ${contacts.length > 0 ? `
                        <div style="font-size: 13px; color: #666666;">
                            ${contacts.join('<span class="sig-separator" style="margin: 0 6px; color: #CCCCCC;">•</span>')}
                        </div>
                        ` : ''}

                        <!-- Social media -->
                        ${socialHtml}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>`.trim();
    },

    /**
     * Generate preview HTML
     * Note: Preview container background is controlled by CSS (.preview-container.dark-mode)
     * Signature itself should maintain email-compatible colors (works on both light/dark)
     */
    generatePreview(data, style = 'classic', socialOptions = {enabled: false, channels: [], displayType: 'text'}, accentColor = '#E42527') {
        if (!data.name) {
            return `
                <div style="text-align: center; padding: 40px 20px; color: #999999;">
                    <p style="font-size: 16px; margin: 0;">Fill in your name to preview the signature</p>
                </div>
            `;
        }

        // Pass isPreview=true to exclude media query dark mode
        return this.generate(data, style, socialOptions, accentColor, true);
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
     * Sanitize social media URL by extracting username/handle
     * Prevents double URL bug when users paste full URLs
     *
     * Examples:
     * - "https://x.com/username" → "username"
     * - "https://www.linkedin.com/in/username/" → "in/username"
     * - "username" → "username" (unchanged)
     *
     * @param {string} input - User input (username or full URL)
     * @param {string} domain - Social media domain (e.g., 'x.com', 'linkedin.com')
     * @returns {string} - Sanitized username/path
     */
    sanitizeSocialUrl(input, domain) {
        if (!input) return '';

        try {
            // Try to parse as URL
            const urlObj = new URL(input.startsWith('http') ? input : 'https://' + input);

            // Check if hostname matches the expected domain (with or without www.)
            const hostname = urlObj.hostname.replace(/^www\./, '');
            if (hostname === domain || hostname === 'www.' + domain) {
                // Extract the path (remove leading slash)
                return urlObj.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
            }
        } catch {
            // Not a valid URL, treat as username/handle
        }

        // Remove any remaining URL artifacts (protocol, www., domain)
        return input
            .replace(/^https?:\/\//i, '')        // Remove protocol
            .replace(/^www\./i, '')               // Remove www.
            .replace(new RegExp(`^${domain}/?`, 'i'), '') // Remove domain
            .replace(/^\/+/, '')                  // Remove leading slashes
            .replace(/\/+$/, '');                 // Remove trailing slashes
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
