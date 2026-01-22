# Zoho Email Signature Generator

A professional email signature generator for Zoho employees. Create beautiful, email-compatible HTML signatures with live preview and multiple styles.

![Version](https://img.shields.io/badge/version-0.6.0-blue.svg)
![License](https://img.shields.io/badge/license-Internal-green.svg)

**Live Demo**: [https://tejasgadhia.github.io/signature-generator](https://tejasgadhia.github.io/signature-generator)

## What's New (v0.4.0)

### Layout & Branding
- 🏢 **Three-Column Desktop Layout**: Sidebar (320px) + Form (~450px) + Preview (flex)
- 🎨 **Official Zoho Branding**: Zoho logo, official colors, professional appearance
- 📱 **No Scrolling**: All content visible in viewport on 1440x900+ displays
- ⚠️ **Community Tool Disclaimer**: Clear indication this is unofficial

### Form UX Improvements
- 📧 **Email Auto-Generation**: firstname.lastname@zohocorp.com (auto-populated from name)
- 🔗 **Smart URL Inputs**: LinkedIn and Twitter use username-only inputs with fixed prefixes
- ℹ️ **Info Icon Tooltips**: Helpful guidance on all special fields
- ✅ **Always-Visible Fields**: All form fields visible (no collapsing)

### Social Media Section
- 🎴 **Horizontal Card Layout**: 4-column grid with click-to-toggle
- 🎯 **Live Reordering**: Drag-and-drop left/right with smooth animations
- ⌨️ **Full Keyboard Support**: Space + Arrow keys for keyboard users
- 🔊 **Screen Reader Support**: ARIA announcements for accessibility (WCAG 2.2)

### Import Instructions
- 🟦 **Zoho Mail Button**: Official logo, prominent placement
- 🟩 **Zoho Desk Button**: Official logo, prominent placement
- 📮 **Other Email Clients**: Gmail, Apple Mail, Outlook (secondary buttons)

## Features

- **🌓 Dark Mode Support**: Signatures automatically adapt to dark mode in Gmail and Apple Mail with WCAG AA compliant text colors
- **4 Signature Styles**: Classic, Compact, Modern, and Minimal layouts
- **iOS-Style Toggle Switches**: Professional UI with full keyboard accessibility
- **Live Preview**: Real-time updates with light/dark mode toggle
- **Visual Form Validation**: Immediate feedback with red/green border states
- **Smart Validation**: Email domain enforcement and flexible phone formatting
- **URL Cleanup**: Automatic removal of tracking parameters from LinkedIn URLs
- **Zoho Social Integration**: Include official Zoho social handles with drag-and-drop reordering
- **One-Click Copy**: Copy HTML signature to clipboard
- **Import Instructions**: Step-by-step guides for Zoho Mail, Gmail, macOS Mail, iOS Mail, and Outlook
- **Zero Dependencies**: Pure vanilla HTML, CSS, and JavaScript
- **Email Compatible**: Table-based layouts with inline styles
- **Privacy-First**: All processing happens locally in your browser

## Email Client Compatibility

### Dark Mode Support

| Email Client | Platform | Dark Mode | Status |
|--------------|----------|-----------|--------|
| Gmail | Web + Mobile | ✅ Full Support | Signatures adapt with media queries |
| Apple Mail | macOS + iOS | ✅ Full Support | Signatures adapt with media queries |
| Outlook | Web | ⚠️ Partial | May strip some styles, test required |
| Outlook | Desktop | ❌ Fallback | Shows light mode (inline styles only) |

**What this means:**
- ✅ **Gmail & Apple Mail users** see beautiful dark mode signatures with white text and light logo
- ⚠️ **Outlook Web users** may see partial dark mode (depends on version)
- ❌ **Outlook Desktop users** see standard light mode signatures (still readable)

## Quick Start

1. Open `index.html` in your web browser
2. Fill in your information (only Name is required)
3. Toggle optional fields on/off using the switches
4. Choose your preferred signature style
5. Click "Copy Signature" to copy the HTML
6. Click "How to Import?" for email client instructions

## Form Fields

- **Name** (required) - Your full name
- **Job Title** (optional) - Your position at Zoho
- **Department** (optional) - Your team or department
- **Email Address** (optional) - Your work email (must be @zohocorp.com)
- **Phone Number** (optional) - Your contact number (international formats accepted)
- **LinkedIn Profile** (optional) - Your LinkedIn URL (tracking parameters auto-removed)
- **Twitter/X Handle** (optional) - Your Twitter/X handle
- **Company Website** (optional) - Defaults to zoho.com

### Smart Validation

- **Email**: Must end with `@zohocorp.com` (Zoho employees only)
- **Phone**: Accepts various formats (+1, +91, etc.), requires 10+ digits
- **LinkedIn**: Automatically removes `?utm_*` and `?trk=*` tracking parameters
- **URLs**: Auto-adds `https://` if missing

## Signature Styles

### Classic
Traditional layout with logo on top. Clean and professional with vertical stacking.

### Compact
Minimal design with everything in one line. Perfect for email clients with limited space.

### Modern
Logo on the left with a vertical red line separator. Contemporary and eye-catching.

### Minimal
Clean text-only design without logo. Name appears in Zoho red for brand recognition.

## Zoho Social Media

- **Master Toggle**: Enable/disable all Zoho social handles
- **Individual Channels**: Toggle Twitter/X, LinkedIn, Facebook, Instagram separately
- **Display Options**: Choose between text links or icons

## Email Client Compatibility

Works with:
- Gmail (Web, iOS, Android)
- Apple Mail (macOS, iOS, iPadOS)
- Outlook (Windows, macOS, Web, iOS, Android)
- Zoho Mail
- Yahoo Mail
- ProtonMail
- Thunderbird

## Troubleshooting

**Signature not copying**
- Ensure JavaScript is enabled
- Try a modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Check clipboard permissions in browser settings

**Toggle switches not working**
- Verify JavaScript is enabled
- Check browser console (F12) for errors

**Preview not updating**
- Verify all form fields have proper values
- Check browser console for errors

**Signature looks different in email client**
- This is normal - email clients have varying CSS support
- Core layout and content will be preserved
- Test in your specific email client before using

**Social media links not appearing**
- Ensure the master toggle is checked
- Verify at least one social channel is selected

## Privacy & Security

- ✅ No server communication - all processing happens locally
- ✅ No data collection - zero tracking or cookies
- ✅ Theme preference stored in localStorage only

## Changelog

### v0.4.0 (January 22, 2026)
- Three-column desktop layout (Sidebar + Form + Preview)
- Official Zoho logo and branding throughout
- Email auto-generation from name (firstname.lastname@zohocorp.com)
- LinkedIn/Twitter username-only inputs with fixed URL prefixes
- Horizontal social media card layout with click-to-toggle
- Drag-and-drop reordering (left/right movement)
- Info icon tooltips on all special fields
- Zoho Mail & Zoho Desk import buttons with official SVG logos
- Community tool disclaimer box in sidebar
- Style usage recommendations on signature cards
- Light mode only for site UI (dark mode toggle affects preview only)
- All form fields always visible (no collapsing)

### v0.3.0 (January 21, 2026)
- Premium drag-and-drop social media reordering
- iOS-style toggle list for social channels
- Full keyboard support (Space + Arrow keys)
- ARIA live regions for screen reader announcements
- Haptic feedback on mobile devices
- Consistent channel ordering when toggled on/off
- Order persistence to localStorage

### v0.2.0 (January 21, 2026)
- Design system with 370+ CSS custom property tokens
- Keyboard-accessible toggle switches (Enter/Space keys)
- ARIA attributes for screen reader support (`role="switch"`, `aria-checked`)
- Visual validation feedback (red/green borders on form inputs)
- Fixed modal focus trap memory leak
- Improved clear button tap targets (28x28px minimum)
- Refactored demo page to use design system tokens
- Replaced all hardcoded colors with semantic design tokens

### v0.1.0 (January 17, 2026)
- Initial release with 4 signature styles
- iOS-style toggle switches for optional fields
- Live preview with dark mode support
- Zoho social media integration
- Copy to clipboard functionality
- Import instructions modal
- Smart validation (email domain, phone format, URL cleanup)
- Privacy-first design (100% client-side processing)

## Future Enhancements

See `PHASE-2-PLAN.md` for detailed v0.5.0 roadmap.

### v0.5.0 (Planned)
- [ ] Fix logo display issues (Mail logo rendering)
- [ ] Improve text readability (darker label colors)
- [ ] Pin disclaimer to bottom of sidebar
- [ ] Compact social media cards
- [ ] Reposition tooltips to right side
- [ ] Title case enforcement for name fields
- [ ] Bookings URL with fixed base pattern
- [ ] Official Gmail/Apple Mail/Outlook logos
- [ ] Dark mode text contrast (WCAG compliance)
- [ ] Logo inversion for dark mode

### Future Releases
- [ ] Save/load multiple signature profiles
- [ ] Export as image (PNG/JPG)
- [ ] QR code generation
- [ ] Bulk generation for teams (CSV import)
- [ ] Custom color scheme picker
- [ ] Additional signature styles (5 & 6)

## Development

### Before Pushing Changes

Always run the pre-push check script to catch deployment issues:

```bash
./pre-push-check.sh
```

This script verifies:
- ✅ JavaScript syntax is valid
- ✅ CSS braces are balanced
- ✅ `.nojekyll` file exists (required for GitHub Pages)
- ✅ All required files are present
- ⚠️ Hidden directory imports are flagged

### Testing Locally

```bash
# Option 1: Open directly in browser
open index.html

# Option 2: Serve with live reload
npx serve
# Visit http://localhost:3000
```

### Deployment

Changes pushed to `main` automatically deploy to GitHub Pages:
- **Live URL**: https://tejasgadhia.github.io/signature-generator/
- **Deployment time**: 1-2 minutes after push
- **Cache**: Hard refresh (Cmd+Shift+R) if changes don't appear

See `CLAUDE.md` for detailed development guidelines and troubleshooting.

## License

Internal tool for Zoho employees. Not for public distribution.

## Credits

- Design pattern inspired by Lovable prompt
- Zoho branding from official guidelines
- Toggle UI from iOS design patterns

---

**Version**: 0.4.0
**Release Date**: January 22, 2026
**Repository**: https://github.com/tejasgadhia/signature-generator
**Status**: See `docs/STATUS.md` for current project status
