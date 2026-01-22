# Zoho Email Signature Generator - Developer Guidelines

## Project Overview

Zoho Email Signature Generator is a professional, privacy-first web application that allows Zoho employees to create beautiful, email-compatible HTML email signatures. It offers 4 signature styles with live preview, iOS-style toggles, and one-click copy to clipboard.

**Live Demo**: https://tejasgadhia.github.io/signature-generator
**Version**: 0.2.1
**Last Updated**: January 22, 2026

## Recent Changes (v0.2.1)

### Polish Improvements
- **Design system consistency** - All hardcoded colors and spacing replaced with design tokens
- **Button accessibility** - Increased tap targets to 44x44px minimum (WCAG compliance)
- **Copy button loading state** - Shows "Copying..." feedback during clipboard operation
- **Visual validation feedback** - Error messages display below inputs with ARIA support
- **Defensive coding** - Null checks prevent crashes if DOM elements missing

### Bug Fixes
- **GitHub Pages deployment** - Added `.nojekyll` file to serve `.ui-design` directory
- **Pre-deployment checklist** - Added comprehensive testing steps to catch deployment issues

## Recent Changes (v0.2.0)

### Design System
- **New design system** - 370+ CSS custom properties in `.ui-design/tokens/tokens.css`
- **Design tokens** - Full color palette (50-950 shades), typography scale, spacing (Tailwind-compatible)
- **Dark mode support** - Semantic color tokens that auto-switch
- **Documentation** - Full design system docs in `.ui-design/docs/design-system.md`

### Accessibility Improvements
- **Keyboard-accessible toggles** - All toggle switches now support Enter/Space keys
- **ARIA attributes** - Added `role="switch"`, `aria-checked`, `tabindex="0"` to toggles
- **Visual validation feedback** - Form inputs show red/green borders on invalid/valid

### Bug Fixes
- **Modal memory leak** - Fixed focus trap event listener cleanup
- **Hardcoded colors** - Replaced all hardcoded colors with design tokens
- **Clear button** - Improved tap target size (28x28px minimum)

### Code Quality
- **Refactored demo page** - `social-media-demo.html` now uses design system tokens
- **Consistent theming** - All UI elements use semantic color variables

---

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Design System**: CSS Custom Properties (370+ tokens in `.ui-design/`)
- **No Dependencies**: Zero npm packages or build tools
- **Browser APIs**: Clipboard API, localStorage, URL API
- **Deployment**: GitHub Pages (main branch)
- **Version**: 0.2.0

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
    isDarkMode: false       // Theme preference
};
```

### Email Client Compatibility
- **Table-based HTML** (not div-based)
- **Inline styles** (no external CSS)
- **Maximum compatibility** with Gmail, Outlook, Apple Mail, etc.

## Code Conventions

### JavaScript

**Naming**:
- camelCase: `escapeHtml()`, `sanitizePhone()`, `updatePreview()`
- PascalCase for modules: `SignatureGenerator`, `AppState`, `ModalController`
- Descriptive names reflecting functionality

**Module Pattern**:
```javascript
const ModuleName = {
    method1() { /* logic */ },
    method2() { /* logic */ }
};
```

**Key Functions**:
- `SignatureGenerator.generate(data, style, socialOptions)` - Create signature HTML
- `AppState.updatePreview()` - Reactive preview updates
- `ModalController.open(modalId)` - Modal lifecycle management

### Validation

**Email Validation**:
```javascript
function isValidEmail(email) {
    return /^[^\s@]+@zohocorp\.com$/i.test(email);
}
```
- **REQUIRED**: `@zohocorp.com` domain enforcement

**Phone Validation**:
- Format-flexible (accepts various formats)
- Minimum 10 digits (excluding + and country code)

**URL Validation**:
- Uses URL constructor for validation
- Auto-adds `https://` if missing
- LinkedIn URL cleanup (removes tracking parameters)

### CSS

**Design System**:
The project uses a comprehensive design token system located in `.ui-design/tokens/tokens.css`.

```css
/* Import design tokens (already done in styles.css) */
@import '../.ui-design/tokens/tokens.css';

/* Use tokens for colors */
background: var(--color-bg-elevated);
color: var(--color-text-primary);
border: 1px solid var(--color-border);

/* Use tokens for spacing (Tailwind-compatible) */
padding: var(--spacing-4);  /* 16px */
gap: var(--spacing-2);      /* 8px */

/* Use tokens for semantic colors */
background: var(--color-primary-500);  /* Zoho Red */
background: var(--color-success);       /* Green */
background: var(--color-error);         /* Red */
```

**Theme System**:
Semantic color tokens auto-switch between light and dark modes:
- `--color-bg` - Page background
- `--color-bg-elevated` - Cards, modals, inputs
- `--color-text-primary` - Main text
- `--color-text-secondary` - Secondary text
- `--color-border` - Borders and dividers

**Toggle Switches**:
- iOS-style design with CSS pseudo-elements
- Smooth transitions (0.3s)
- Fully keyboard accessible (Enter/Space keys)
- ARIA `role="switch"` and `aria-checked` attributes

## Signature Styles

### 1. Classic
- Logo on top (centered)
- Vertical stacking of information
- Traditional, formal appearance

### 2. Compact
- Single-line layout with logo
- Space-efficient
- Modern, minimal

### 3. Modern
- Logo on left
- Red vertical separator (Zoho brand color)
- Two-column text layout

### 4. Minimal
- Text-only (no logo)
- Red accent line
- Ultra-clean appearance

### Implementation Pattern
```javascript
switch(style) {
    case 'classic':
        return `<table>...</table>`;  // Table-based HTML
    case 'compact':
        return `<table>...</table>`;
    // etc.
}
```

## Clipboard Operations

### Modern Approach (Preferred)
```javascript
const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
const plainBlob = new Blob([plainText], { type: 'text/plain' });

await navigator.clipboard.write([
    new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': plainBlob
    })
]);
```

### Fallback (execCommand)
```javascript
const temp = document.createElement('div');
temp.innerHTML = htmlContent;
document.body.appendChild(temp);
document.execCommand('copy');
document.body.removeChild(temp);
```

## Development Workflow

### Local Development
```bash
# No build needed
open index.html

# Or serve locally
npx serve
# Visit http://localhost:3000
```

### Testing Checklist
- [ ] All 4 signature styles render correctly
- [ ] Toggle switches enable/disable fields
- [ ] Live preview updates on input
- [ ] Copy to clipboard works (test both modern + fallback)
- [ ] Email validation enforces @zohocorp.com
- [ ] Dark mode persists across sessions
- [ ] LinkedIn URL cleanup works
- [ ] Modal keyboard navigation (Tab, Escape)

### Email Client Testing
Test copied signatures in:
- Gmail (web + mobile)
- Outlook (desktop + web + mobile)
- Apple Mail (macOS + iOS)
- Thunderbird

## Toggle System

### Implementation
```javascript
function setupFieldToggles() {
    document.querySelectorAll('.toggle-switch input').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const fieldId = e.target.dataset.field;
            const isEnabled = e.target.checked;

            AppState.fieldToggles[fieldId] = isEnabled;

            const field = document.getElementById(fieldId);
            field.disabled = !isEnabled;

            if (!isEnabled) {
                field.value = '';  // Clear data when disabled
            }

            updatePreview();
        });
    });
}
```

### State Tracking
- Each toggle controls a specific input field
- State stored in `AppState.fieldToggles`
- Data cleared when field disabled
- Preview updates automatically

## URL Handling

### LinkedIn URL Cleanup
```javascript
function cleanLinkedInUrl(url) {
    if (!url.includes('linkedin.com')) return url;

    try {
        const urlObj = new URL(url);
        // Remove tracking parameters
        urlObj.search = '';
        return urlObj.toString().replace(/\/$/, '');  // Remove trailing slash
    } catch {
        return url;
    }
}
```

### URL Normalization
- Add `https://` if protocol missing
- Validate with URL constructor
- Clean LinkedIn tracking parameters

## Modal System

### Features
- Backdrop click to close
- Escape key to close
- Focus trapping (Tab cycles within modal)
- Body scroll prevention

### Implementation
```javascript
const ModalController = {
    open(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';  // Prevent scroll
        this.trapFocus(modal);
    },

    close(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        document.body.style.overflow = '';
    },

    trapFocus(modal) {
        // Tab cycling logic
    }
};
```

## Best Practices

### DO

- **Validate inputs**: Email domain, phone format, URL structure
- **Test in email clients**: Not just browsers
- **Use table-based HTML**: For maximum email compatibility
- **Inline all styles**: External CSS won't work in emails
- **Escape user input**: Prevent XSS with `escapeHtml()`
- **Maintain privacy**: All processing client-side
- **Test both clipboard methods**: Modern + fallback

### DON'T

- Add external dependencies (keep it vanilla)
- Use div-based layouts for signatures (email clients struggle)
- Skip email validation (enforce @zohocorp.com)
- Store user data (privacy-first principle)
- Use external stylesheets in signatures
- Forget to test in Outlook (strictest email client)

## Quick Start for Development

### Resuming After Break
1. Check git status: `git status`
2. Review recent commits: `git log --oneline -5`
3. Check `social-media-demo.html` for pending design decisions
4. Open `index.html` in browser to test current state
5. Review `AppState` in browser console to debug issues

### Local Development
```bash
# No build needed - just open in browser
open index.html

# Or serve with live reload
npx serve
# Visit http://localhost:3000
```

### Testing Workflow
1. Make changes to JS/CSS/HTML
2. Refresh browser (Cmd+R)
3. Check console for errors (Cmd+Option+J)
4. Test in multiple browsers (Chrome, Firefox, Safari)
5. Test clipboard copy in email client

---

## Common Tasks

### Implementing Social Media Design Choice

**Context**: User needs to choose from 6 designs in `social-media-demo.html`

**Steps**:
1. Ask user: "Which design option do you prefer? (1-6)"
2. Copy HTML/CSS from chosen design in `social-media-demo.html`
3. Replace social media section in `index.html`
4. Update event handlers in `js/app.js` if needed
5. Test toggle functionality
6. Test signature generation with social links
7. Commit with message: `feat: implement [design name] for social media section`

### Adding a New Signature Style

1. Add style option to HTML:
```html
<option value="new-style">New Style Name</option>
```

2. Add generation logic in `signature.js`:
```javascript
case 'new-style':
    return `
        <table style="...">
            <!-- Table-based HTML with inline styles -->
        </table>
    `;
```

3. Test in all major email clients

### Adding a New Field

1. Add HTML input:
```html
<div class="form-group">
    <label for="new-field">New Field</label>
    <input type="text" id="new-field" />
</div>
```

2. Add toggle if optional:
```html
<label class="toggle-switch">
    <input type="checkbox" data-field="new-field" checked>
    <span class="slider"></span>
</label>
```

3. Update signature generation to use new field

### Adding Social Media Links

1. Add to Zoho social options:
```javascript
const socialOptions = {
    twitter: 'https://twitter.com/zoho',
    newPlatform: 'https://newplatform.com/zoho'
};
```

2. Add icon/link in signature generation logic

## Security Considerations

### XSS Prevention
```javascript
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

### Input Sanitization
- Validate email domain strictly
- Sanitize phone numbers (remove non-digits)
- Validate URLs with URL constructor
- Escape all user inputs before rendering

### Privacy
- No cookies
- No tracking
- No data storage (except theme preference in localStorage)
- No server communication

## Accessibility

- **ARIA Labels**: On all interactive elements
- **Keyboard Navigation**: Full keyboard support (including toggle switches)
- **Focus Management**: Modal focus trapping with proper cleanup
- **Semantic HTML**: `<button>`, `<label>`, `<form>`
- **Toggle Switches**: `role="switch"`, `aria-checked`, keyboard support (Enter/Space)
- **Form Validation**: HTML5 validation with visual feedback (red/green borders)
- **Reduced Motion**: Respects `prefers-reduced-motion` preference

## Performance

- **Zero Dependencies**: Fast load (~50KB total)
- **Efficient DOM Updates**: Single innerHTML update per preview
- **CSS-Based Animations**: GPU-accelerated
- **Minimal JavaScript**: ~1,000 lines of app code

## Git Workflow

- Main branch for production (GitHub Pages)
- Feature branches for development
- Descriptive commit messages
- Test locally before pushing

## GitHub Pages Deployment

### Critical Requirements

**REQUIRED: `.nojekyll` file in repository root**
- GitHub Pages uses Jekyll by default, which blocks directories starting with `.` or `_`
- Our `.ui-design` directory would return 404 without this file
- The `.nojekyll` file disables Jekyll processing and serves all files

### Pre-Push Checklist

**ALWAYS run this checklist before pushing to main:**

```bash
# 1. Verify JavaScript syntax
node --check js/app.js && node --check js/modal.js && node --check js/signature.js

# 2. Check for broken CSS (unmatched braces)
python3 -c "
content = open('css/styles.css').read()
braces = content.count('{') - content.count('}')
assert braces == 0, f'Unmatched braces: {braces}'
print('✓ CSS braces balanced')
"

# 3. Verify .nojekyll exists
test -f .nojekyll && echo "✓ .nojekyll exists" || echo "❌ MISSING .nojekyll"

# 4. Check for hidden directory CSS imports
grep -r "@import.*'\.\." css/ && echo "⚠️  Check: Hidden dirs accessible?" || echo "✓ No hidden dir imports"

# 5. Test locally in browser
open index.html
# MANUALLY verify: styling loads, forms work, dark mode toggles

# 6. If all pass, push
git push origin main
```

### GitHub Pages Gotchas

**Problem 1: Dot-prefixed directories (`.ui-design`, `.github`)**
- **Symptom**: CSS fails to load, 404 errors in browser console
- **Cause**: Jekyll blocks hidden directories by default
- **Fix**: Ensure `.nojekyll` file exists in root
- **Test**: Visit `https://tejasgadhia.github.io/signature-generator/.ui-design/tokens/tokens.css` (should NOT 404)

**Problem 2: CSS `@import` with relative paths**
- **Symptom**: Styles don't load on GitHub Pages but work locally
- **Cause**: Path resolution differs between local and GitHub Pages
- **Fix**: Test `@import` paths are correct: `@import '../.ui-design/tokens/tokens.css';`
- **Test**: Check browser Network tab for 404 errors

**Problem 3: Case-sensitive file paths**
- **Symptom**: Works on Mac/Windows, breaks on GitHub Pages (Linux)
- **Cause**: GitHub Pages is case-sensitive, local filesystems may not be
- **Fix**: Ensure file paths match exact case: `styles.css` not `Styles.css`
- **Test**: `git ls-files` shows correct case

**Problem 4: Caching issues after deployment**
- **Symptom**: Old version still visible after push
- **Cause**: Browser cache or GitHub Pages CDN cache
- **Fix**: Hard refresh (Cmd+Shift+R / Ctrl+Shift+R), wait 2-3 minutes for CDN
- **Test**: Check deployment timestamp in GitHub Actions

### Testing Deployed Site

After pushing, wait 1-2 minutes for deployment, then test:

```bash
# 1. Check if CSS loads
curl -I https://tejasgadhia.github.io/signature-generator/css/styles.css
# Should return: HTTP/2 200

# 2. Check if design tokens load
curl -I https://tejasgadhia.github.io/signature-generator/.ui-design/tokens/tokens.css
# Should return: HTTP/2 200 (NOT 404)

# 3. Open in browser and check console
open https://tejasgadhia.github.io/signature-generator/
# Should have NO 404 errors in Network tab
```

### Rollback Procedure

If a push breaks production:

```bash
# 1. Find last working commit
git log --oneline -10

# 2. Revert to that commit
git revert <broken-commit-hash>

# 3. Push revert
git push origin main

# 4. Wait 1-2 minutes for deployment
```

### Key Files That Must Be Accessible

These files MUST return HTTP 200 on GitHub Pages:
- ✓ `index.html`
- ✓ `css/styles.css`
- ✓ `.ui-design/tokens/tokens.css` (requires `.nojekyll`)
- ✓ `js/app.js`
- ✓ `js/modal.js`
- ✓ `js/signature.js`

## Troubleshooting

### Preview Not Updating
**Problem**: Live preview doesn't change when typing
**Solutions**:
1. Check browser console for JavaScript errors
2. Verify event listeners are attached (check `js/app.js`)
3. Inspect `AppState.formData` in console
4. Check if `updatePreview()` is being called

### Copy to Clipboard Fails
**Problem**: "Copy Signature" button doesn't work
**Solutions**:
1. Check if HTTPS or localhost (clipboard API requires secure context)
2. Test fallback method (should auto-engage)
3. Check browser console for errors
4. Verify clipboard permissions in browser settings

### Email Validation Too Strict
**Problem**: Valid Zoho emails rejected
**Solutions**:
1. Check regex pattern in `validateEmail()` function
2. Test with various formats: `name@zohocorp.com`, `first.last@zohocorp.com`
3. Ensure case-insensitive matching (`/i` flag)

### LinkedIn URL Not Cleaned
**Problem**: Tracking parameters still present
**Solutions**:
1. Verify `cleanLinkedInUrl()` is called on form input
2. Check URL has valid format (starts with http:// or https://)
3. Test with various LinkedIn formats
4. Check browser console for URL parsing errors

### Dark Mode Not Persisting
**Problem**: Theme resets after page refresh
**Solutions**:
1. Check localStorage: `localStorage.getItem('theme')`
2. Verify `saveDarkMode()` function in `js/app.js`
3. Check browser privacy settings (some block localStorage)
4. Clear browser cache and test again

### Signature Looks Wrong in Email Client
**Problem**: Formatting breaks in Gmail/Outlook
**Solutions**:
1. Verify all styles are inline (no external CSS)
2. Check table structure (must be valid HTML)
3. Test in specific email client's signature editor
4. Ensure images use absolute URLs
5. Check for email client-specific CSS quirks

---

## File Change Impact Map

**When you change `index.html`:**
- Affects form layout and structure
- May need to update CSS selectors in `styles.css`
- May need to update DOM queries in `app.js`
- Test: Form rendering, toggle switches, button clicks

**When you change `js/app.js`:**
- Affects state management and event handling
- May impact live preview updates
- May affect form validation
- Test: All interactive features, preview updates

**When you change `js/signature.js`:**
- Affects signature HTML output
- May impact email client compatibility
- Does NOT affect form UI
- Test: Copy to clipboard, paste in email clients

**When you change `css/styles.css`:**
- Affects visual appearance only
- Does NOT affect functionality
- Test: Light/dark mode, responsive layout, animations

**When you change `js/modal.js`:**
- Affects modal open/close behavior only
- Does NOT affect form or signature generation
- Test: Modal open, close, keyboard navigation

---

## Code Quality Checklist

Before committing:
- [ ] Run code in browser (no console errors)
- [ ] Test in Chrome, Firefox, Safari
- [ ] Test clipboard copy in email client
- [ ] Verify dark mode toggle works
- [ ] Check responsive layout on mobile
- [ ] Validate email/phone/URL inputs
- [ ] Review commit message (descriptive, follows convention)
- [ ] Update README.md if user-facing changes
- [ ] Update CLAUDE.md if architecture changes

---

## Git Workflow

### Commit Message Convention
```
feat: add feature description
fix: bug description
docs: documentation update
style: CSS/visual changes (no code logic change)
refactor: code restructure (no feature change)
test: adding tests
chore: maintenance tasks
```

### Example Commits
```bash
git commit -m "feat: add LinkedIn URL cleanup on paste"
git commit -m "fix: dark mode text contrast in preview"
git commit -m "docs: update CLAUDE.md with troubleshooting guide"
git commit -m "style: improve mobile responsive layout"
```

### Branch Strategy
- **main** = production (GitHub Pages deploys from here)
- Feature branches optional (for major changes)
- Can commit directly to main for small fixes

---

## Resources & References

### Documentation Files
- **README.md** - User-facing instructions (how to use)
- **CLAUDE.md** - This file (how to develop)
- **social-media-demo.html** - Design option prototypes
- **.ui-design/docs/design-system.md** - Design token documentation

### Design System Files
- **.ui-design/design-system.json** - Master configuration
- **.ui-design/tokens/tokens.css** - CSS custom properties (370+ tokens)

### Key Code Sections
- **signature.js** - Signature generation examples
- **app.js** - State management patterns
- **modal.js** - UI controller implementation
- **styles.css** - Theme system and animations (imports design tokens)

### External Resources
- [Email HTML Best Practices](https://www.campaignmonitor.com/css/)
- [Clipboard API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [Email Client CSS Support](https://www.caniemail.com/)

---

## Questions?

**For feature development:**
- Is this a new field, style, or UI component?
- Will it affect email client compatibility?
- Does it need validation?

**For bug fixes:**
- Can you reproduce in browser console?
- Does it affect specific browsers/email clients?
- Is there a JavaScript error?

**For design changes:**
- Does it affect mobile layout?
- Is it consistent with Zoho brand?
- Does dark mode work correctly?

Keep it simple, accessible, and email-compatible!
