# Zoho Email Signature Generator - Developer Guidelines

**Live Demo**: https://tejasgadhia.github.io/zoho-signature-generator | **Version**: 0.11.0 | **Updated**: 2026-01-26

Professional, privacy-first web app for Zoho employees. 6 signature templates with Verdana font, 3-tier content hierarchy, 4 accent colors, live preview, one-click copy.

---

## Recent Changes

**Version**: 0.11.0 (2026-01-26)
**Latest**: Email auto-lowercase + enhanced validation for email and phone fields with text error messages
**Full history**: See [CHANGELOG.md](CHANGELOG.md)

---

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Design System**: CSS Custom Properties (370+ tokens in `.ui-design/`)
- **No Dependencies**: Zero npm packages or build tools
- **Browser APIs**: Clipboard API, localStorage, URL API, URLSearchParams API
- **Deployment**: GitHub Pages (main branch)

---

## Architecture Principles

### Module Organization (3 Modules)
1. **signature.js** - Pure utility (signature generation, validation)
2. **app.js** - Application state and orchestration
3. **modal.js** - Modal UI controller

### State Management
```javascript
const AppState = {
    formData: {},           // User input data
    fieldToggles: {},       // Optional field states
    signatureStyle: '',     // Selected layout
    socialOptions: {},      // Zoho social media config
    accentColor: '#E42527', // Selected brand color (Red/Green/Blue/Yellow)
    isDarkMode: false       // Theme preference
};

// formData includes:
// - website: Tracked URL with UTM params (auto-generated)
// - bookings: Full URL constructed from bookings-id input
```

### localStorage Keys
```javascript
'theme'                      // 'dark' or null (light mode)
'signature-accent-color'     // Hex color (#E42527, #089949, #226DB4, #F9B21D)
'social-order'               // JSON array of channel order
'format-lock-name'           // boolean (default: true)
'format-lock-title'          // boolean (default: true)
'format-lock-department'     // boolean (default: true)
```

### Key Implementation Patterns

**URL Prefix Input**: `<span class="url-prefix">` + `<input>` (user types ID only, JS constructs full URL)

**Smart Title Case**: `toSmartTitleCase()` preserves 18 acronyms (VP, CEO, iOS, API, B2B, etc.)

**UTM Tracking**: `getTrackedWebsiteURL()` adds `utm_source/medium/campaign` params to zoho.com

**Clipboard Operations**: Modern API (`navigator.clipboard.write()` with HTML+text blobs), fallback (`execCommand('copy')`)

**Toggle System**: `setupFieldToggles()` listens to `.toggle-switch input[data-field]`, updates `AppState.fieldToggles`, disables/clears field when off

**Modal System**: `ModalController.open/close()` with backdrop click, Escape key, focus trapping, scroll prevention

**Dark Mode**: Every signature includes dual logos (light/dark), CSS style block, CSS classes on text, inline fallbacks

**Email Client Compatibility**: Table-based HTML (not div), inline styles (no external CSS), maximum compatibility with Gmail/Outlook/Apple Mail

---

## Project-Specific Validation

**Email**: REQUIRED `@zohocorp.com` domain enforcement
```javascript
function isValidEmail(email) {
    return /^[^\s@]+@zohocorp\.com$/i.test(email);
}
```

**Phone**: Format-flexible, minimum 10 digits (excluding + and country code)

**LinkedIn**: URL cleanup removes tracking parameters using URL constructor

---

## Signature Styles

**Classic**: Logo top, vertical stack, formal | **Compact**: Single-line, space-efficient | **Modern**: Logo left, red separator, 2-column | **Minimal**: Text-only, red accent line, no logo | **Professional**: Two-column layout | **Creative**: Bold left accent bar

**Implementation**: `switch(style)` in signature.js returns table-based HTML with inline styles

---

## Development Workflow

### Local Development
```bash
open index.html          # No build needed
# or
npx serve               # Simple HTTP server
```

### Testing Checklist
- [ ] 6 styles render correctly
- [ ] Toggles enable/disable fields
- [ ] Preview updates on input
- [ ] Clipboard copy works (modern + fallback)
- [ ] @zohocorp.com validation enforces domain
- [ ] Dark mode persists across sessions
- [ ] LinkedIn URL cleanup removes tracking
- [ ] Modal keyboard navigation (Escape, Tab)
- [ ] Title case respects format locks
- [ ] UTM tracking added to website URL
- [ ] Drag-drop reorder works
- [ ] Email client testing (Gmail, Outlook, Apple Mail, Thunderbird)

### Git Workflow

**Branch Strategy**: main = production (GitHub Pages), feature branches optional, direct commits OK for small fixes

**Commit Convention**: `feat:` | `fix:` | `docs:` | `style:` | `refactor:` | `test:` | `chore:`

---

## Common Tasks

**New Signature Style**:
1. Add `<option>` in HTML style selector
2. Add `case 'new-style':` in signature.js `generate()` function
3. Return table-based HTML with inline styles
4. Test in Gmail, Outlook, Apple Mail

**New Form Field**:
1. Add `<input>` in HTML form section
2. Add toggle switch if optional
3. Update signature generation to include field
4. Update validation if needed

**New Social Channel**:
1. Add to `SOCIAL_CHANNELS` in signature.js
2. Add toggle card in HTML social grid
3. Update `AppState.socialOptions` initialization

---

## GitHub Pages Deployment

**CRITICAL**: `.nojekyll` file required (Jekyll blocks `.ui-design` directory otherwise)

### Pre-Push Checklist
```bash
node --check js/*.js  # Validate syntax
python3 -c "assert open('css/styles.css').read().count('{') == open('css/styles.css').read().count('}'), 'Unmatched braces'"
test -f .nojekyll  # Verify exists
open index.html  # Manual test
```

### Common Issues
1. **Dot dirs 404**: Need `.nojekyll` in root
2. **CSS @import fails**: Check relative paths (`../.ui-design/tokens/tokens.css`)
3. **Case sensitivity**: Linux is case-sensitive (use `git ls-files`)
4. **Caching**: Hard refresh (Cmd+Shift+R), wait 2-3min for CDN

### Deployment Testing
```bash
curl -I <url>  # Verify CSS/JS files return 200, not 404
# Check Network tab in browser for any 404s
```

### Rollback
```bash
git revert <hash> && git push origin main
```

---

## Troubleshooting

**Preview not updating**: Check console errors, verify event listeners in `app.js`, inspect `AppState.formData`, check `updatePreview()` called

**Clipboard fails**: HTTPS/localhost required, test fallback, check console, verify permissions

**Email validation strict**: Check `validateEmail()` regex, test `name@zohocorp.com` formats, ensure `/i` flag

**LinkedIn not cleaned**: Verify `cleanLinkedInUrl()` called, check URL format, test various formats

**Dark mode resets**: Check `localStorage.getItem('theme')`, verify `saveDarkMode()`, check privacy settings

**Email client formatting**: Verify inline styles, check table structure, test in client editor, absolute URLs

**Title case fails**: Check lock icon (🔒 = enabled), verify `formatLockState`, check localStorage, ensure blur fires

**Bookings missing**: Check toggle enabled, verify ID entered, check `AppState.formData.bookings`

**Tooltips clipped**: Check `z-index: 1000+`, positioned above icon, no `overflow:hidden` parents

---

## File Change Impact Map

**`index.html`**: Form layout → update CSS selectors, DOM queries in `app.js` → Test: rendering, toggles, buttons

**`js/app.js`**: State/events → preview updates, validation → Test: all interactions

**`js/signature.js`**: HTML output → email compatibility → Test: clipboard, paste in clients

**`css/styles.css`**: Visual only → Test: light/dark, responsive, animations

**`js/modal.js`**: Modal behavior → Test: open/close, keyboard nav

---

## Resources & References

**Docs**: `README.md` (user-facing), `.ui-design/docs/design-system.md` (tokens)

**Design**: `.ui-design/design-system.json` (config), `.ui-design/tokens/tokens.css` (370+ tokens)

**Code**: `signature.js` (generation), `app.js` (state), `modal.js` (UI), `styles.css` (theme/animations)

**External**: [Email HTML Best Practices](https://www.campaignmonitor.com/css/), [Clipboard API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API), [Email Client CSS Support](https://www.caniemail.com/)

---

## Quick Reference

**Feature Dev**: New field/style/component? Email client compatibility? Validation needed?

**Bug Fixes**: Reproducible in console? Browser/client-specific? JS error?

**Design**: Mobile layout? Zoho brand consistency? Dark mode works?

Keep it simple, accessible, email-compatible.
