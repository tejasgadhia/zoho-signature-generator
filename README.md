# Zoho Email Signature Generator

**Professional email signatures for Zoho employees**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg) ![License](https://img.shields.io/badge/license-O'Saasy-green.svg)

**Live Demo**: https://tejasgadhia.github.io/zoho-signature-generator/

---

## Overview

Privacy-first web app for creating professional, email-compatible signatures. Features 6 layout templates, 4 brand colors, dark mode support, and comprehensive accessibility (WCAG 2.2 AA compliant).

**Built with**: Vanilla JavaScript, CSS Custom Properties, Zero Dependencies

---

## Key Features

### ✨ Design & Customization
- **6 Signature Layouts** - Classic, Professional, Minimalist, Compact, Modern, Creative
- **4 Zoho Brand Colors** - Red, Green, Blue, Yellow (customizable accent colors)
- **Dark Mode Support** - Gmail, Apple Mail, Outlook (automatic theme detection)
- **370+ Design Tokens** - Comprehensive design system with CSS Custom Properties

### 🎯 Smart Input Features
- **Auto-formatting** - Phone numbers, email addresses, LinkedIn URLs
- **Smart Title Case** - Preserves 18 common acronyms (CEO, VP, iOS, B2B, etc.)
- **UTM Tracking** - Automatic campaign parameters on Zoho website links
- **Real-time Validation** - Instant feedback with WCAG-compliant error messages

### ♿ Accessibility (WCAG 2.2 AA)
- **Expandable Help System** - Inline hints + 44×44px help buttons with detailed instructions
- **Keyboard Navigation** - Full keyboard support (Tab, Space, Enter, Escape)
- **Screen Reader Friendly** - Proper ARIA labels, live regions, semantic HTML
- **Touch-Friendly** - All interactive elements meet 44×44px minimum touch target size

### 🔒 Privacy-First
- **100% Client-Side** - No server communication, no data collection, no tracking
- **Zero Dependencies** - Vanilla JavaScript, no npm packages or build tools
- **localStorage Only** - Theme preference and color selection saved locally

### 📧 Email Client Compatibility
Tested in **9 email clients**: Gmail, Apple Mail, Outlook (Windows/macOS/Web/iOS/Android), Zoho Mail, Yahoo Mail, ProtonMail, Thunderbird.

**Dark Mode Support**:
- ✅ Gmail (Web + Mobile): Full support
- ✅ Apple Mail (macOS + iOS): Full support
- ⚠️ Outlook Web: Partial support
- ❌ Outlook Desktop: Light mode only

---

## How to Use

1. **Fill in your information** (only Full Name is required)
2. **Toggle optional fields** on/off (Email, Phone, LinkedIn, X, Bookings)
3. **Choose signature style** (6 layout options)
4. **Select accent color** (Red/Green/Blue/Yellow)
5. **Click "Copy Signature"**
6. **Click "How to Import?"** for client-specific instructions (Zoho Mail, Gmail, Apple Mail, Outlook, Zoho Desk)

---

## Email Client Instructions

### Zoho Mail (~1 minute • 5 steps)
1. Settings → Email Signature
2. Click "Insert HTML" button (`</>` icon)
3. Paste signature HTML
4. Click "Insert" → "Update"
5. Done!

### Gmail (~45 seconds • 4 steps)
1. Settings → See all settings → Signature
2. Create new signature
3. Paste directly (no "Insert HTML" button needed)
4. Save changes

### Apple Mail (~1 minute • 5 steps)
1. Mail → Settings → Signatures
2. Create new signature
3. Paste signature
4. ✅ **IMPORTANT**: Uncheck "Always match my default font"
5. Done!

### Outlook (~30 seconds • 3 steps)
1. Settings → View all Outlook settings → Compose and reply
2. Paste signature (renders automatically)
3. Save

See **"How to Import?"** modal in the app for detailed instructions with screenshots.

---

## Troubleshooting

### Common Issues

**Signature not copying**
- ✅ Enable JavaScript
- ✅ Use modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- ✅ Check clipboard permissions in browser settings

**Toggle switches not working**
- ✅ Enable JavaScript
- ✅ Check browser console for errors
- ✅ Try hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

**Preview not updating**
- ✅ Check browser console for errors
- ✅ Verify form values are entered correctly
- ✅ Try toggling dark mode preview

**Signature looks different in email client**
- ✅ Normal behavior - email clients vary in CSS support
- ✅ Core layout and content always preserved
- ✅ Use "How to Import?" for client-specific guidance

---

## Development

### Local Testing
```bash
# Option 1: Direct open
open index.html

# Option 2: Local server (recommended)
npx serve
# Visit http://localhost:3000
```

### Deployment
Changes to `main` branch automatically deploy to GitHub Pages (1-2 minutes).

### Pre-Push Checks
```bash
./pre-push-check.sh
# Verifies: JS syntax, CSS validity, required files (.nojekyll)
```

### Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Design System**: CSS Custom Properties (370+ tokens in `.ui-design/`)
- **No Dependencies**: Zero npm packages or build tools
- **Browser APIs**: Clipboard API, localStorage, URL/URLSearchParams
- **Deployment**: GitHub Pages (main branch)

### Key Files
- `index.html` - Main form UI
- `js/app.js` - Application state, event handlers
- `js/signature.js` - Signature HTML generation (6 styles)
- `js/modal.js` - Modal UI controller
- `js/help-content.js` - Expandable help text content
- `css/styles.css` - All styling (2163 lines)
- `.ui-design/tokens/tokens.css` - Design system tokens

See **[CLAUDE.md](CLAUDE.md)** for detailed development guidelines.

---

## Project Documentation

- **[CHANGELOG.md](CHANGELOG.md)** - Full version history with detailed release notes
- **[CLAUDE.md](CLAUDE.md)** - Developer guidelines (architecture, patterns, workflows)
- **[LICENSE.md](LICENSE.md)** - O'Saasy License Agreement

---

## Browser Support

**Minimum Requirements**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features Used**:
- ES6+ JavaScript (async/await, modules, arrow functions)
- CSS Grid & Flexbox
- CSS Custom Properties
- Clipboard API
- localStorage

---

## Privacy

All processing happens locally in your browser. No server communication, no data collection, no tracking, no cookies.

**What's stored locally**:
- Theme preference (dark/light mode)
- Accent color selection (Red/Green/Blue/Yellow)
- Social media channel order (drag-drop customization)
- Smart title case format locks (preserve/override)

**What's NOT stored**:
- Your name, email, phone, or any personal information
- Your signature content or preferences

---

## Contributing

This project is currently maintained by Tejas Gadhia for Zoho employees. While the code is open source, external contributions are not actively sought at this time.

**Found a bug?** Open an issue on GitHub with:
- Browser version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

---

## License

This project is licensed under the [O'Saasy License Agreement](https://osaasy.dev/).

**TL;DR**: You can use, modify, and distribute this project freely. You can self-host it for personal or commercial use. However, you cannot offer it as a competing hosted/managed SaaS product.

See [LICENSE.md](LICENSE.md) for full details.

---

## Changelog Highlights

### v1.0.0 (2026-01-27) 🎉
**Stable release before refactoring**
- Added HTML5 autocomplete attributes (WCAG 2.2 AA compliance)
- Click-away help panels (modern UX pattern)
- Visual form grouping with subtle dividers
- Full accessibility compliance verified

### v0.12.0 (2026-01-26)
- Comprehensive help text system (inline hints + expandable panels)
- Enhanced validation error messages (visual icons + user-friendly text)
- WCAG 2.2 AA compliant (44×44px touch targets, keyboard nav, screen readers)

### v0.11.0 (2026-01-26)
- Email auto-lowercase on blur
- Stricter email validation (only a-z, 0-9, dots)
- Phone validation improvements (text error messages)

### v0.9.0 (2026-01-24)
- Template redesign with 3-tier content hierarchy
- Verdana font (Zoho Mail default)
- 6 redesigned templates

### v0.8.0 (2026-01-23)
- 4 brand colors (Red/Green/Blue/Yellow)
- New Executive & Bold templates
- localStorage color persistence

See **[CHANGELOG.md](CHANGELOG.md)** for complete version history.

---

**Made with ❤️ for Zoho Employees**
