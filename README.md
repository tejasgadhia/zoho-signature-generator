# Zoho Email Signature Generator

A tool for Zoho employees to create HTML email signatures with live preview and multiple layout styles.

![Version](https://img.shields.io/badge/version-0.8.0-blue.svg)
![License](https://img.shields.io/badge/license-Internal-green.svg)

**Live Demo**: [https://tejasgadhia.github.io/signature-generator](https://tejasgadhia.github.io/signature-generator)

---

## What's New in v0.8.0

### Color Theming System

The signature generator now includes 4 Zoho brand colors for customizing link colors:

- Red (#E42527) - Default Zoho brand color
- Green (#089949) - Zoho green
- Blue (#226DB4) - Zoho blue
- Yellow (#F9B21D) - Zoho yellow

All contact links (phone, email, social media) use your selected accent color. Color preference persists across sessions.

### New Signature Styles

Two additional signature templates:

- **Executive** - Elegant centered layout with accent line, designed for VPs and C-Suite
- **Bold** - Eye-catching design with colored name block, ideal for Marketing and Events

### What's New in v0.7.0

### Import Instructions Redesign

The import instructions modals have been redesigned with improved accessibility and clarity:

- Email client logos and brand colors
- Numbered steps with visual hierarchy
- WCAG AAA contrast compliance
- Keyboard shortcut styling
- Responsive design (320px to 1440px)
- Updated instructions for current email client interfaces

---

## Features

**Signature Options**
- 6 layout styles: Classic, Compact, Modern, Minimal, Executive, Bold
- 4 Zoho brand colors for link customization (Red, Green, Blue, Yellow)
- Dark mode support for Gmail and Apple Mail
- Zoho social media links with drag-and-drop ordering
- Live preview with theme toggle

**Form Controls**
- Toggle switches for optional fields
- Email validation (@zohocorp.com required)
- Flexible phone number formatting
- LinkedIn URL cleanup (removes tracking parameters)
- Auto-generated email from name

**Accessibility**
- Keyboard navigation
- Screen reader support
- WCAG AA compliant contrast
- Visual form validation

**Technical**
- Client-side processing (no server communication)
- Zero dependencies (vanilla JavaScript)
- Email-compatible HTML (table-based layouts with inline styles)

---

## How to Use

1. Fill in your information (name is required)
2. Toggle optional fields on or off
3. Choose a signature style
4. Choose an accent color (Red, Green, Blue, or Yellow)
5. Click "Copy Signature"
6. Click "How to Import?" for your email client

---

## Form Fields

- **Name** (required) - Full name
- **Job Title** (optional) - Position at Zoho
- **Department** (optional) - Team or department
- **Email** (optional) - Work email (must be @zohocorp.com)
- **Phone** (optional) - Contact number (accepts international formats)
- **LinkedIn** (optional) - Profile URL (tracking parameters removed automatically)
- **Twitter/X** (optional) - Handle
- **Website** (optional) - Defaults to zoho.com

---

## Signature Styles

**Classic** - Logo on top, vertical layout, traditional appearance

**Compact** - Single-line layout, space-efficient

**Modern** - Logo on left, colored separator line, two-column text

**Minimal** - Text-only, no logo, name with accent color

**Executive** - Centered layout with accent line below name, designed for senior leadership

**Bold** - Colored name block with logo, eye-catching design for creative teams

---

## Email Client Compatibility

### Tested Clients
- Gmail (Web, iOS, Android)
- Apple Mail (macOS, iOS)
- Outlook (Windows, macOS, Web, iOS, Android)
- Zoho Mail
- Yahoo Mail
- ProtonMail
- Thunderbird

### Dark Mode Support

| Client | Platform | Support |
|--------|----------|---------|
| Gmail | Web + Mobile | Full support |
| Apple Mail | macOS + iOS | Full support |
| Outlook | Web | Partial (depends on version) |
| Outlook | Desktop | Light mode only |

---

## Troubleshooting

**Signature not copying**
- Enable JavaScript
- Use a modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Check clipboard permissions

**Toggle switches not working**
- Enable JavaScript
- Check browser console for errors

**Preview not updating**
- Check browser console for errors
- Verify form field values

**Signature looks different in email client**
- Normal behavior - email clients vary in CSS support
- Core layout and content preserved
- Test in your specific client before using

---

## Privacy

- All processing happens locally in your browser
- No server communication
- No tracking or cookies
- Theme preference stored in localStorage only

---

## Development

### Local Testing

```bash
# Open directly in browser
open index.html

# Or serve locally
npx serve
# Visit http://localhost:3000
```

### Deployment

Changes to `main` branch automatically deploy to GitHub Pages in 1-2 minutes.

### Pre-Push Checks

```bash
./pre-push-check.sh
```

Verifies JavaScript syntax, CSS validity, and required files.

See `CLAUDE.md` for detailed development guidelines.

---

## Changelog

### v0.7.0 (January 22, 2026)
- Redesigned import instructions modals
- Added email client branding
- WCAG AAA contrast compliance
- Responsive design improvements
- Updated content for current email client UIs

### v0.6.0 (January 22, 2026)
- Dark mode support for email signatures
- Dual logo system (light and dark variants)
- CSS media queries for automatic theme switching

### v0.5.0 (January 22, 2026)
- Three-column desktop layout
- Email auto-generation from name
- Social media drag-and-drop reordering
- Info icon tooltips
- Zoho Mail and Zoho Desk import buttons

### v0.4.0 (January 21, 2026)
- Layout redesign with official branding
- Smart title case with acronym preservation
- UTM tracking for analytics
- Bookings URL support

### v0.3.0 (January 21, 2026)
- Social media section redesign
- iOS-style toggle switches
- Full keyboard support
- ARIA live regions for screen readers

### v0.2.0 (January 21, 2026)
- Design system with CSS custom properties
- Keyboard-accessible toggles
- Visual validation feedback

### v0.1.0 (January 17, 2026)
- Initial release
- 4 signature styles
- Live preview
- Copy to clipboard
- Import instructions

---

## License

Internal tool for Zoho employees. Not for public distribution.

---

**Version**: 0.7.0
**Repository**: https://github.com/tejasgadhia/signature-generator
