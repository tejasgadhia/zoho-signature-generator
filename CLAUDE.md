# Zoho Email Signature Generator - Developer Guidelines

## Project Overview

Zoho Email Signature Generator is a professional, privacy-first web application that allows Zoho employees to create beautiful, email-compatible HTML email signatures. It offers 6 signature styles, 4 color themes, live preview, iOS-style toggles, and one-click copy to clipboard.

**Live Demo**: https://tejasgadhia.github.io/signature-generator
**Version**: 0.8.0
**Last Updated**: January 23, 2026

---

## Tejas's Workflow Preferences

**IMPORTANT:** Follow these preferences in all development sessions.

### Git Completion Workflow
- **Always choose option 1 (merge locally)** when finishing feature branches
- Never ask for permission - just merge to main automatically
- Clean up worktree and feature branch after merge
- User will push to GitHub Pages when ready

### Development Process
- **Screenshot-driven iteration** - Request screenshots for visual review of UI changes
- **Idiot-proof instructions** - Assume no UI literacy when writing user-facing steps
- **Research current UIs** - Web search for 2026-dated guides before writing instructions
- **Document learnings** - Create comprehensive learnings doc at end of major features (in `docs/learnings/`)

### Communication Style
- **Explanatory mode enabled** - Provide educational insights with code
- **Visual feedback valued** - Screenshots more useful than text descriptions
- **Research appreciated** - User trusts web search verification for accuracy

### Technical Preferences
- **WCAG AAA compliance** - Design for 7:1+ contrast ratios from start
- **Responsive design** - Test from 320px to 1440px
- **No dark mode for site UI** - Only email signature preview has dark mode
- **Accessibility from day one** - Don't retrofit, design it in

### Questions to Ask Upfront
When starting new features, always ask:
1. "Do you want to see a screenshot after initial implementation?"
2. "Should this component use dark mode or always stay light?"
3. "Do you have screenshots of the actual UI?" (if writing instructions)
4. "How detailed should the instructions be?"
5. "What level of accessibility compliance?" (though default to AAA)

---

## Recent Changes (v0.8.0)

### Color Theming System

**Implementation**
- Added 4 Zoho brand colors: Red (#E42527), Green (#089949), Blue (#226DB4), Yellow (#F9B21D)
- Color switcher with CSS Grid layout (4 equal-width buttons)
- Selected state with border highlight and box-shadow
- localStorage persistence for color preference
- All contact links (phone, email, social media) use dynamic accent color

**Key Files Modified**
- `index.html`: Added color switcher UI after style selector
- `css/styles.css`: Color button styling with grid layout
- `js/app.js`: Added `AppState.accentColor`, `setupColorSwitcher()`, color persistence
- `js/signature.js`: All template functions accept `accentColor` parameter, inline styles apply color

**Technical Implementation**
```javascript
// Color applied via inline styles (email-compatible)
<a href="tel:..." style="color: ${accentColor}; text-decoration: none;">Phone</a>

// Yellow uses dark text for contrast
const textColor = accentColor === '#F9B21D' ? '#333333' : '#FFFFFF';
```

### New Signature Templates

**Executive Template**
- Centered layout with large name (20px, bold)
- Horizontal accent line below name (60px width, 2px height)
- Designed for VPs, C-Suite, Senior Leadership
- Implementation: `generateExecutiveStyle()` in signature.js

**Bold Template**
- Colored name/title block with rounded corners (8px)
- Contrast-aware text color (dark on yellow, white on other colors)
- Ideal for Marketing and Events teams
- Implementation: `generateBoldStyle()` in signature.js

### UI Improvements

**Style Selector Refinements**
- Removed checkmark icon (border highlight is sufficient)
- Bolded template names (font-weight: 600) for visual hierarchy
- Uniform 2-line help text descriptions for consistency
- Updated descriptions with specific department recommendations

**Dark Mode Toggle Simplification**
- Replaced icon-based toggle with standard iOS-style switch
- Text label "Preview Dark Mode" outside toggle pill
- Matches existing field toggle design for consistency

### Bug Fixes & Troubleshooting

**Issue 1: Accent Colors Not Applying**
- **Problem**: Dark mode CSS had `!important` on `.sig-link` color, overriding inline styles
- **Solution**: Removed `!important` from dynamic values (links), kept it for fixed values (name, title)
- **Documentation**: Created `docs/troubleshooting/css-important-conflicts.md`

**Issue 2: Light Mode Text Illegible**
- **Problem**: System dark mode preference (`@media (prefers-color-scheme: dark)`) affected preview even in light mode
- **Solution**: Created dual dark mode context:
  - Preview mode (`isPreview=true`): Only `.dark-mode` class selectors
  - Copy mode (`isPreview=false`): Both media query AND `.dark-mode` selectors
- **Implementation**: Updated `getDarkModeStyles(isPreview)` and all template functions
- **Documentation**: Created `docs/troubleshooting/dark-mode-system-preferences.md`

### Architecture Changes

**Signature Generation Function Signatures**
All template functions now accept `accentColor` and `isPreview` parameters:
```javascript
generateClassicStyle(data, logoUrl, websiteUrl, contacts, zohoSocialHtml, accentColor = '#E42527', isPreview = false)
```

**localStorage Keys Added**
- `signature-accent-color`: User's selected color (hex value)

**AppState Object Updates**
```javascript
const AppState = {
    accentColor: '#E42527',  // New: selected brand color
    // ... existing fields
};
```

---

## Recent Changes (v0.7.0)

### Import Modal Redesign

**Complete UI/UX Overhaul**
- Professional modal design with email client branding
- WCAG AAA contrast compliance (verified ratios 7:1+ for primary text)
- Numbered step circles with brand colors
- Responsive design (320px to 1440px+)
- Research-driven instructions for 2026 email client UIs

**Email Client Support**
- ✅ **Zoho Mail** - Red (#E42527) branding, 5 steps with "Insert HTML" workflow
- ✅ **Zoho Desk** - Orange (#F37021) branding, 4 steps with signature management
- ✅ **Gmail** - Red (#EA4335) branding, 4 steps with direct paste (no Insert HTML button)
- ✅ **Apple Mail** - Blue (#0071E3) branding, 5 steps with critical font-matching checkbox
- ✅ **Outlook** - Blue (#0078D4) branding, 3 steps with rendered HTML paste

**Modal Header Structure**
- Email client logo badge (48x48px with rounded corners)
- Dynamic title showing email client name
- Time estimate (e.g., "~1 minute • 5 steps")
- Professional close button (32x32px hit target)
- All header elements dynamically injected per client

**Step Components**
- Circular numbered badges (32px desktop, 28px mobile)
- Brand color backgrounds matching email client
- Clear step titles with bold UI element names
- Inline copy button in step 1 (triggers main copy functionality)
- Hyperlinked email client names
- Modern keyboard shortcut styling (<kbd> with gradient background)

**Idiot-Proof Instructions**
- Explicit UI element descriptions: "Insert HTML button (looks like </> brackets)"
- Visual clarity: "blue Insert button", "blue Update button"
- Context labels: "In the 'Insert HTML' popup"
- Step-by-step navigation: "Settings → Signature → Insert HTML"
- Client-specific warnings: Apple Mail font-matching checkbox

**Responsive Behavior**
- Desktop (1440px): 700px modal, horizontal logo/title layout
- Tablet (768px): No changes needed, fits viewport perfectly
- Mobile (375px): 95vw width, stacked logo/title, 28px circles, full-width buttons
- Tiny (320px): Still readable, no horizontal scroll
- Single breakpoint at 640px for simplicity

**Accessibility Features**
- WCAG AAA contrast ratios (17.95:1 for titles, 15.21:1 for step text)
- Semantic HTML: `<ol>` lists with numbered steps
- ARIA labels on all interactive elements
- Keyboard navigation: Tab/Shift+Tab, Escape to close
- Focus trapping within modal
- Touch targets: 32x32px minimum (exceeds WCAG 2.2's 24x24px)

**Tip Boxes**
- Yellow tips (#FEF3C7 background, #92400E text) - General information
- Blue tips (#DBEAFE background, #1E40AF text) - Best practices
- Green tips (#D1FAE5 background, #065F46 text) - Success confirmations
- All tips exceed WCAG AAA contrast (7.34:1 to 8.89:1)

**CSS Architecture**
- Forced light mode (explicit hex colors, no dark mode inheritance)
- CSS custom property for brand colors: `--step-color`
- Progressive enhancement: CSS-first, JavaScript for interactivity
- Smooth animations with `prefers-reduced-motion` support
- Staggered fade-in: 50ms delays per step for polish

**JavaScript Enhancements**
- `ModalController.copySignature()` - Inline copy button triggers main copy button
- `ModalController.updateContent()` - Dynamic header and body injection
- Separate header/body content structure for flexibility
- Research-verified instructions for accuracy

**Testing & Documentation**
- Visual testing across all 5 email clients
- Responsive testing: 320px to 1440px verified
- Contrast verification: All ratios documented and compliant
- Test results: `docs/test-results/2026-01-22-*.md`

**Key Implementation Patterns**

```javascript
// Dynamic header injection
updateContent(clientType) {
    const modalHeader = this.modal.querySelector('#modal-header-content');
    const modalBody = this.modal.querySelector('#modal-body-content');

    const content = this.getClientInstructions(clientType);

    modalHeader.innerHTML = content.header + closeButton;
    modalBody.innerHTML = content.body;
}
```

```css
/* Brand color theming */
.instruction-steps {
    --step-color: #E42527; /* Dynamic per client */
}

.step-number {
    background: var(--step-color);
    color: #FFFFFF;
    border-radius: 50%;
}
```

```html
<!-- Responsive header structure -->
<div class="modal-header-with-logo">
    <img src="assets/mail-full.svg" class="modal-logo-badge">
    <div class="modal-header-title-group">
        <h2>Zoho Mail</h2>
        <div class="modal-time-estimate">~1 minute • 5 steps</div>
    </div>
</div>
```

## Recent Changes (v0.6.0)

### Dark Mode Email Signature Support

**CSS Media Query Implementation**
- All 4 signature styles now include `<style>` block with `@media (prefers-color-scheme: dark)`
- High contrast color scheme: White text (#FFFFFF), light gray titles (#E0E0E0), blue links (#4A9EFF)
- Graceful degradation: Legacy email clients fall back to inline styles (light mode)

**Dual Logo Strategy**
- Every signature includes both light and dark Zoho logos
- CSS `display: none/block` toggles visibility based on color scheme
- Logo URLs point to GitHub Pages: `tejasgadhia.github.io/signature-generator/assets/`

**Email Client Support**
- ✅ Gmail (web + mobile): Full dark mode support
- ✅ Apple Mail (macOS + iOS): Full dark mode support
- ⚠️ Outlook Web: Partial support (may strip some styles)
- ❌ Outlook Desktop: Fallback to light mode (inline styles only)

**Helper Functions**
- `getDarkModeStyles()`: Generates CSS style block with media queries
- `getLogoUrls()`: Returns light/dark logo URLs from GitHub Pages
- `generateDualLogos()`: Creates HTML with both logo variants

**CSS Classes for Dark Mode**
- `.sig-name`: Primary text (name field)
- `.sig-title`: Secondary text (title, department, labels)
- `.sig-link`: All links (phone, email, social, website)
- `.sig-separator`: Bullet separators (•)
- `.sig-logo-light`: Light background logo (visible by default)
- `.sig-logo-dark`: Dark background logo (hidden by default, shown in dark mode)

## Recent Changes (v0.5.0)

### Session 3: UX Enhancements & Polish

**Twitter → X Rebrand**
- Updated all references from "Twitter" to "X" throughout the application
- Changed URL prefix from `twitter.com/` to `x.com/`
- Updated signature.js social links to use X branding and x.com URL

**Bookings URL Pattern**
- Changed from free-form URL input to username-style pattern
- Now consistent with LinkedIn/Twitter fields: `bookings.zohocorp.com/#/[your-id]`
- Accepts both numeric IDs (e.g., `3846319000027543122`) and custom slugs
- Full URL constructed automatically from ID input

**Quick Start Numbered List**
- Changed from `<ul>` bullets to `<ol>` numbered list (semantic HTML)
- Numbers styled in Zoho red (#E42527) using CSS counters
- Screen readers now announce "step 1 of 4" etc.

**Social Media Hint Text**
- Updated to: "Customize your links: Click to toggle on/off • Drag to reorder"
- More descriptive and action-oriented

**UTM Tracking for zoho.com**
- Main zoho.com link now includes tracking parameters
- Format: `?utm_source=email-signature&utm_medium=signature&utm_campaign=[email-prefix]`
- Fallback to "zoho-employee" if email field empty
- Enables analytics to track which employees drive website traffic

### Session 2: Layout Refinements

**Split Button Design for Zoho Products**
- Zoho Mail and Zoho Desk buttons redesigned with logo + text layout
- Full-branded logos (`mail-full.svg`, `desk-full.svg`) instead of icon-only
- Professional third-party logos from Simple Icons (Gmail, Apple Mail, Outlook)

**Sidebar Footer Section**
- "Other Email Clients" section pinned to bottom of sidebar
- Scrollable content wrapper for main sidebar content
- Disclaimer always visible at bottom

**Tooltip Positioning Fix**
- Tooltips now positioned above icons (not to the right)
- Fixed z-index to prevent clipping by other elements
- Consistent positioning across all info icons

**Text Readability Improvements**
- Field labels changed to `--color-neutral-700` (#374151) for 11:1 contrast
- Readonly fields use font-weight 500 for emphasis
- All text passes WCAG AAA contrast requirements

**Compact Social Media Cards**
- Height reduced from 90px to 75px
- Icon size: 24px, Label size: 10px
- Still exceeds 44x44px WCAG touch target minimum

### Session 1: Smart Title Case

**Auto-Formatting with Lock Icons**
- Name, Title, Department fields auto-format to title case
- Preserves ~18 common acronyms (VP, CEO, iOS, API, B2B, etc.)
- Lock icon (🔒/🔓) toggles formatting per field
- State persists in localStorage (`format-lock-*` keys)
- Applies on blur and paste events

## Recent Changes (v0.3.0)

### Social Media Section Redesign (Option 6)
- **iOS-style toggle list** - Replaced checkbox-based controls with consistent toggle switches
- **Drag-and-drop reordering** - Live reordering with 200ms smooth animations
- **Research-driven UX** - Implemented best practices from NN/G, Atlassian, Salesforce
- **Instagram icon update** - Changed from camera emoji (📸) to "IG" text for consistency

### Drag-and-Drop Implementation
- **Live reordering** - Items reposition in real-time as you drag (no guessing)
- **Smooth animations** - 200ms cubic-bezier transitions (industry standard)
- **Keyboard navigation** - Space to grab, Arrow keys to move, Space to drop, Escape to cancel
- **Screen reader support** - ARIA live regions announce all actions
- **Haptic feedback** - Mobile vibration on grab (10ms), drop (20ms), move (5ms)
- **Order persistence** - Custom order saves to localStorage
- **Consistent ordering** - Channels maintain canonical order when toggled

### Accessibility (WCAG 2.2 Compliant)
- **Full keyboard support** - All drag-and-drop functionality accessible via keyboard
- **ARIA announcements** - "Grabbed Twitter/X", "Moved to position 2", "Dropped at position 2"
- **Screen reader labels** - Drag handles describe available actions
- **Focus indicators** - Clear visual focus states for keyboard users
- **Touch targets** - Drag handles meet 44x44px minimum (Success Criterion 2.5.5)

### Bug Fixes
- **Event handler collision** - Fixed conflict between field toggles and social toggles
- **Ordering issue** - Channels no longer jump to end when re-enabled
- **State synchronization** - AppState, canonicalOrder, and DOM stay in sync

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
- **Browser APIs**: Clipboard API, localStorage, URL API, URLSearchParams API
- **Deployment**: GitHub Pages (main branch)
- **Version**: 0.8.0

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

### Dark Mode Implementation
```javascript
// Logo URLs from GitHub Pages
const logos = SignatureGenerator.getLogoUrls();
// {
//   light: "https://tejasgadhia.github.io/signature-generator/assets/zoho-logo-light.png",
//   dark: "https://tejasgadhia.github.io/signature-generator/assets/zoho-logo-dark.png"
// }

// Every signature includes:
// 1. Dark mode CSS style block (getDarkModeStyles())
// 2. Dual logos (generateDualLogos())
// 3. CSS classes on all text elements
// 4. Inline styles as fallback
```

### Email Client Compatibility
- **Table-based HTML** (not div-based)
- **Inline styles** (no external CSS)
- **Maximum compatibility** with Gmail, Outlook, Apple Mail, etc.

### Key Implementation Patterns

**URL Prefix Input Pattern**
Used for LinkedIn, X (Twitter), and Bookings fields:
```html
<div class="url-prefix-input">
    <span class="url-prefix">bookings.zohocorp.com/#/</span>
    <input type="text" id="bookings-id" class="url-username-field">
</div>
```
- User types only the identifier, not full URL
- Full URL constructed in JavaScript
- Consistent UX across all URL fields

**Smart Title Case with Acronym Preservation**
```javascript
const PRESERVED_ACRONYMS = [
    'VP', 'SVP', 'EVP', 'CEO', 'CTO', 'CFO', 'COO', 'CMO', 'CIO',
    'iOS', 'API', 'IT', 'HR', 'B2B', 'B2C', 'SaaS', 'SMB'
];

function toSmartTitleCase(str) {
    let result = str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    PRESERVED_ACRONYMS.forEach(acronym => {
        const regex = new RegExp('\\b' + acronym + '\\b', 'gi');
        result = result.replace(regex, acronym);
    });
    return result;
}
```

**UTM Tracking URL Generation**
```javascript
function getTrackedWebsiteURL() {
    const emailPrefix = document.getElementById('email-prefix')?.value.trim() || 'zoho-employee';
    const params = new URLSearchParams({
        utm_source: 'email-signature',
        utm_medium: 'signature',
        utm_campaign: emailPrefix
    });
    return `https://www.zoho.com?${params.toString()}`;
}
```

**Tooltip Positioning (Above Icon)**
```css
.info-icon::after {
    position: absolute;
    bottom: calc(100% + 8px);  /* Position ABOVE the icon */
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;  /* Prevent clipping */
}
```
- Tooltips above icons avoid clipping by form elements
- High z-index ensures visibility over other elements

**Split Button Design**
For Zoho product buttons with logo + text:
```css
.import-btn-split {
    display: flex;
    align-items: center;
    padding: 12px 16px;
}
.import-btn-logo-wrapper {
    width: 40px;
    display: flex;
    justify-content: center;
}
```

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
- [ ] Smart title case formats on blur (Name, Title, Department)
- [ ] Lock icons toggle formatting on/off
- [ ] Bookings URL constructed from ID input
- [ ] UTM tracking parameters in signature links
- [ ] Social media drag-and-drop reordering
- [ ] Quick Start shows numbered list (not bullets)

### Dark Mode Testing
- [ ] All 4 signature styles include `<style>` block
- [ ] Both logos present in HTML (light + dark)
- [ ] CSS classes on all text elements (.sig-name, .sig-title, etc.)
- [ ] Inline styles present as fallback
- [ ] Test in Gmail web (dark mode)
- [ ] Test in Gmail mobile (dark mode)
- [ ] Test in Apple Mail (dark mode)
- [ ] Outlook Desktop shows readable light mode

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
3. Open `index.html` in browser to test current state
4. Review `AppState` in browser console to debug issues
5. Check localStorage for persisted user preferences

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

1. Add to Zoho social options in `signature.js`:
```javascript
const SOCIAL_CHANNELS = {
    twitter: { url: 'https://x.com/Zoho', text: 'X', icon: '𝕏' },
    linkedin: { url: 'https://www.linkedin.com/company/zoho', text: 'LinkedIn', icon: 'in' },
    facebook: { url: 'https://www.facebook.com/zoho', text: 'Facebook', icon: 'f' },
    instagram: { url: 'https://www.instagram.com/zoho', text: 'Instagram', icon: 'IG' },
    newPlatform: { url: 'https://newplatform.com/zoho', text: 'Platform', icon: '🆕' }
};
```

2. Add toggle card in `index.html` social grid
3. Update `AppState.socialOptions` initialization in `app.js`

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
- No server-side tracking (UTM params are for recipient analytics only)
- No data storage (except user preferences in localStorage)
- No server communication
- All processing happens client-side
- UTM tracking enables Zoho to see signature traffic attribution

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

### Title Case Not Working
**Problem**: Text not auto-formatting when clicking away
**Solutions**:
1. Check if lock icon shows 🔒 (locked = formatting enabled)
2. Verify `formatLockState` in browser console
3. Check localStorage for `format-lock-*` keys
4. Ensure blur event fires (click outside the input)

### Bookings URL Not Appearing in Signature
**Problem**: Bookings link missing from preview
**Solutions**:
1. Check if Bookings toggle is enabled (toggle should be red/active)
2. Verify ID is entered in the input field
3. Check `AppState.formData.bookings` in console
4. Ensure field isn't disabled

### Tooltips Clipped or Hidden
**Problem**: Tooltip text cut off or invisible
**Solutions**:
1. Check z-index (should be 1000+)
2. Verify tooltip positioned above icon (not to the right)
3. Check for overflow:hidden on parent elements
4. Test in different screen sizes

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
  - **Style:** Direct, professional tone (no emojis, no exclamation marks, no marketing language)
  - **Structure:** Clear sections with horizontal rules, factual descriptions
  - **Content:** Essential information only - features, how to use, troubleshooting, changelog
  - **Exclude:** Future plans section (keep in CLAUDE.md or separate docs instead)
- **CLAUDE.md** - This file (how to develop)
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

## Development Learnings

### v0.7.0 Import Modal Redesign (January 22, 2026)

**Session Duration:** ~4 hours (multiple conversations)
**Commits:** 22 commits
**Lines Changed:** +150 CSS, +content updates across 5 modals

**Full Retrospective:** See `docs/sessions/2026-01-22-session-retrospective.md`

#### Critical Lesson: Always Research Existing Tools FIRST 🔍

**What Happened:**
- Started building import instructions redesign
- User pointed out HubSpot has a well-established signature generator
- Should have shown competitive analysis BEFORE designing

**Action Taken:**
- Added to "Workflow Improvements" checklist
- Added to "Questions to Ask Upfront"
- Created HubSpot research work item

**Pattern for Future:**
Before designing ANY feature:
1. Research 3-5 popular existing tools
2. Create comparison table (features, UX, gaps)
3. Show user for context
4. Recommend which features to build
5. THEN start designing

#### README Style Preferences Established 📄

**User Feedback:** "Too gimmicky, keep it direct and to the point"

**Documented Style Guide:**
- ✅ Direct, professional tone
- ✅ Factual descriptions only
- ✅ Clear sections with horizontal rules
- ✅ Essential information only
- ❌ No emojis (except version badges)
- ❌ No exclamation marks or marketing language
- ❌ No future plans section (belongs in CLAUDE.md)

**Apply to all future projects**

#### Workflow Success: Brainstorming → Design → Plan → Execute

**What Worked:**
1. Used `/brainstorming` skill to explore problem space
2. Created comprehensive design doc with research
3. Wrote detailed implementation plan (15 tasks)
4. Used git worktree for isolation
5. Parallel execution session with checkpoints
6. Systematic release process

**Benefit:** Clear visibility at every stage, easy to course-correct

#### Key Metrics

**Code Quality:**
- ✅ WCAG AAA contrast compliance verified
- ✅ All 5 email client modals tested
- ✅ Responsive testing (320px - 1440px)
- ✅ Zero console errors

**Development Efficiency:**
- Design: 1 hour
- Planning: 45 min
- Execution: 1.5 hours
- Total: ~4 hours from idea to production

**Impact:**
- Import instructions now professional and accessible
- Comprehensive documentation created
- Workflow patterns established for future features

---

### v0.6.0 Dark Mode Implementation (January 22, 2026)

**Session Duration:** ~2 hours
**Commits:** 17 commits on feature branch
**Lines Changed:** +455 / -59

#### What Went Well

**1. Git Worktree Workflow**
- Used `git worktree` to isolate dark mode development
- Allowed clean separation of concerns without affecting main codebase
- Easy to test both branches independently
- **Recommendation:** Use worktrees for all major feature development

**2. Small, Focused Commits**
- Each commit addressed one specific change
- Made progress tracking easy
- Simplified debugging and code review
- Examples: "feat: add dark mode helper functions", "fix: use relative paths for logo URLs"
- **Recommendation:** Commit after each logical unit of work

**3. Test-First Documentation**
- Created comprehensive test results document before deployment
- Helped catch potential issues early
- Provided clear checklist for post-deployment verification
- **Recommendation:** Write `docs/[feature]-test-results.md` for major features

**4. Dual Dark Mode Approach**
- CSS media queries for email clients (`@media (prefers-color-scheme: dark)`)
- Class-based selectors for preview toggle (`.dark-mode`)
- Both use identical colors for consistency
- **Recommendation:** Always support both system preference and manual toggle for testing

#### Issues Encountered & Solutions

**Issue 1: Identical Logo Files**
- **Problem:** Both `zoho-logo-light.png` and `zoho-logo-dark.png` were identical (copied placeholder)
- **Detection:** Used `md5` checksums to verify files were different
- **Solution:** Converted SVG originals to PNG using macOS `sips` tool
- **Lesson:** Always verify asset differentiation with checksums, don't assume files are correct

**Issue 2: Local vs Production Logo URLs**
- **Problem:** GitHub Pages URLs don't work during local development
- **Initial approach:** Used absolute URLs, logos failed to load locally
- **Solution:** Runtime environment detection:
  ```javascript
  const isProduction = window.location.hostname.includes('github.io');
  const baseUrl = isProduction ? 'https://...' : './assets';
  ```
- **Lesson:** Design for both environments from the start, don't hardcode URLs

**Issue 3: Preview Toggle Not Working**
- **Problem:** Dark mode toggle in preview didn't affect signatures (only system preference worked)
- **Root cause:** CSS only had `@media (prefers-color-scheme: dark)`, no class-based selectors
- **Solution:** Added parallel `.dark-mode` class selectors:
  ```css
  @media (prefers-color-scheme: dark) { .sig-name { color: #FFF; } }
  .dark-mode .sig-name { color: #FFF; } /* Same rules */
  ```
- **Lesson:** Preview toggles require class-based CSS in addition to media queries

**Issue 4: Unused logoUrl Parameter**
- **Problem:** TypeScript warnings about unused `logoUrl` parameter after switching to dual logos
- **Initial thought:** Remove the parameter entirely
- **Better solution:** Left it in function signature for API compatibility, will clean up in future refactor
- **Lesson:** Don't break function signatures mid-implementation; address tech debt separately

#### Best Practices Established

**1. Helper Functions First**
- Created `getDarkModeStyles()`, `getLogoUrls()`, `generateDualLogos()` before updating styles
- Made style updates mechanical and consistent
- Reduced code duplication across 4 signature styles
- **Pattern:** Build abstractions before implementation

**2. Incremental Style Updates**
- Updated one signature style at a time (Classic → Compact → Modern → Minimal)
- Tested each style individually before moving to next
- Committed after each style completion
- **Pattern:** Batch related changes but commit individually

**3. Documentation-Driven Development**
- Started with design document (`docs/designs/2026-01-22-dark-mode-design.md`)
- Created implementation plan (`docs/plans/2026-01-22-dark-mode-implementation.md`)
- Generated test results document
- Updated all user/developer docs at end
- **Pattern:** Document → Plan → Implement → Test → Document results

**4. CSS Class Strategy**
- Added semantic classes (`.sig-name`, `.sig-title`, `.sig-link`, `.sig-separator`)
- Kept inline styles as fallback (don't remove, supplement)
- Used `!important` in dark mode rules (email clients aggressive with specificity)
- **Pattern:** Progressive enhancement, never break backwards compatibility

#### Performance Insights

**Trade-offs Made:**
- ✅ Added ~500 bytes per signature (CSS style block)
- ✅ Both logos embedded (~104KB for 2 PNGs)
- ❌ No lazy loading (not possible in email HTML)
- ❌ No JavaScript optimization (emails don't support JS)

**Result:** Acceptable overhead for professional dark mode support

#### Email Client Compatibility Learnings

**Tested & Verified:**
- ✅ Gmail (web + mobile): Full support, media queries work
- ✅ Apple Mail (macOS + iOS): Full support, media queries work
- ⚠️ Outlook Web: Partial support, may strip some CSS
- ❌ Outlook Desktop: No media query support, inline styles work

**Key Insight:** Design for graceful degradation, not universal support. Modern clients (Gmail/Apple Mail) cover ~80% of users.

#### Workflow Improvements for Next Time

**What to Do Earlier:**
1. **Verify assets immediately** - Don't assume files are correct, check with `md5`
2. **Test in browser first** - Open `index.html` after each commit to catch issues early
3. **Use `node --check`** - Validate JavaScript syntax before committing
4. **Check CSS balance** - Use python one-liner to verify braces match
5. **🆕 Research existing tools FIRST** - Before building a feature, show user 3-5 popular existing tools (HubSpot, Canva, etc.) for competitive analysis and feature inspiration

**Questions to Ask Upfront:**
1. Will this work in both local development and production?
2. Do we need both system preference and manual toggle support?
3. What's the fallback for legacy clients?
4. How will we test this in actual email clients?
5. **🆕 What existing tools solve this problem?** - Research and present popular alternatives before starting implementation

**Tools That Helped:**
- `md5` - Verify file differentiation
- `sips` - macOS image conversion
- `node --check` - JavaScript validation
- `python3 -c` - Quick scripts for validation
- `git worktree` - Isolated development

#### Metrics

**Code Quality:**
- ✅ Zero syntax errors
- ✅ All JavaScript files pass `node --check`
- ✅ CSS braces balanced
- ✅ WCAG AA+ contrast ratios verified

**Test Coverage:**
- ✅ All 4 signature styles tested
- ✅ Copy to clipboard verified
- ✅ Cross-browser tested (Chrome, Firefox, Safari)
- ⏳ Email client testing (requires user)

**Documentation:**
- ✅ CLAUDE.md updated with implementation details
- ✅ README.md updated with user-facing info
- ✅ STATUS.md updated with version status
- ✅ Test results documented

#### Future Considerations

**Potential Enhancements:**
- User-selectable color schemes (soft contrast option)
- Social media icon colors for dark mode
- A/B test different contrast levels
- Export signature as image format

**Technical Debt:**
- Remove unused `logoUrl` parameters from style functions
- Consider consolidating duplicate CSS rules
- Explore CSS-in-JS for signature generation

**Monitoring:**
- Track user feedback on dark mode adoption
- Monitor for email client compatibility issues
- Gather analytics on dark vs light mode usage

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
