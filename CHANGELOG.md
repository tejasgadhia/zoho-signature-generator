# Changelog

All notable changes to the Zoho Email Signature Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-01-27 🎉 **Stable Release - Pre-Refactor Checkpoint**

### ✨ Added

#### Form Accessibility & Autocomplete (#33)
- **HTML5 autocomplete attributes** added to all form inputs:
  - `name` → `autocomplete="name"`
  - `title` → `autocomplete="organization-title"`
  - `department` → `autocomplete="organization"`
  - `email` → `autocomplete="email"`
  - `phone` → `autocomplete="tel"`
- **Benefits**:
  - ✅ WCAG 2.2 AA compliance (Success Criterion 1.3.5: Input Purpose Identification)
  - ✅ Browser autofill support (faster form completion)
  - ✅ Better screen reader compatibility
  - ✅ Improved user experience (one-click form population)

#### UX Improvements (#32, #24)
- **Click-away help panels** (#32):
  - Help panels now close when clicking outside (modern UX pattern)
  - Maintains existing Escape key functionality
  - Checks if click is outside both help panel and help icon
- **Visual form grouping** (#24):
  - Added subtle dividers (40% opacity) between form sections:
    - Contact Information (Name, Title, Department, Email, Phone)
    - Social Links (LinkedIn, X, Bookings)
    - Company Website (locked field)
    - Zoho Social Media (toggle cards)
  - Improves scanability without adding spacing
  - No layout changes, just visual guides

### 📝 Documentation
- Verified and documented intentional 1440px desktop-only design (#30)
- Closed false positive LinkedIn styling issue (#34) - confirmed no inconsistency
- Deferred feature enhancements to post-refactor (#28, #30)

### 🎯 Why 1.0.0?
This release marks a **stable checkpoint before major refactoring work**. All critical accessibility improvements and UX polish are complete. The application is production-ready and fully functional.

---

## [0.12.0] - 2026-01-26

### ✨ Added

#### Comprehensive Form UX Improvements (#10)

**Help Text System (WCAG 2.2 AA Compliant)**
- **Replaced CSS tooltips with accessible inline help**:
  - Removed 18px hover-only info icons (❌ inaccessible, below 44px WCAG minimum)
  - Added always-visible inline hints below all form fields (✅ no hover required)
  - Added 44x44px expandable help buttons with detailed instructions (✅ WCAG compliant)
- **Expandable help panels**: Click `?` button to show/hide detailed help for complex fields
- **Keyboard navigation**: Space/Enter to toggle, Escape to close all help panels
- **Screen reader support**: Proper ARIA labels, live regions announce state changes
- **Dark mode support**: Help buttons and panels styled for both themes

**Enhanced Validation Error Messages**
- **Visual feedback icons**:
  - ✓ green checkmark for valid fields (only shown when field has value)
  - ✗ red X for invalid fields
  - Icons hidden for empty fields (no visual clutter)
- **Improved error message phrasing** (user-friendly with examples):
  - Before: "Email prefix can only contain lowercase letters, numbers, and dots (no hyphens, underscores, or special characters)"
  - After: "Use only letters, numbers, and dots (e.g., john.smith or jsmith2)"
  - Before: "Dots cannot be at the start, end, or consecutive"
  - After: "Dots can't be at the start, end, or in a row (e.g., john.smith ✓, .john ✗)"
- **Success feedback**: Valid fields show green ✓ icon (adaptive validation timing)
- **Enhanced styling**: Error messages include red ✗ icon + improved typography

**Fields Updated** (5 total):
1. **Email Address**: Auto-generation explanation + format rules
2. **Phone Number**: International format guidance + examples
3. **LinkedIn Profile**: Step-by-step instructions to find username
4. **X Handle**: Format clarification (no @ symbol needed)
5. **Zoho Bookings Link**: How to find booking page ID in settings

### 🔧 Changed
- **Validation icon management**: Icons now actively managed by JavaScript (show/hide based on validation state)
- **ARIA enhancements**: Proper `aria-describedby` references for hints + errors
- **Error message insertion**: Errors now inserted after inline hints (better visual hierarchy)

### 🎨 Design
- **Help button styling**:
  - Background: Light blue (#E8F4FD) / Dark mode: Blue overlay
  - Hover: Slightly darker + scale(1.05) animation
  - Expanded: Blue background (#226DB4) + white text
  - 44x44px circular button with "?" icon
- **Help panel styling**:
  - Background: Light blue (#F8FBFD) / Dark mode: White overlay
  - Left border: 4px solid blue (#226DB4)
  - Expand animation: 200ms ease-out
- **Validation icons**:
  - Valid: Green (#089949) / Dark mode: Lighter green (#6EE7B7)
  - Invalid: Red (#DC2626) / Dark mode: Lighter red (#FCA5A5)
  - Size: 20x20px, positioned right side of input
- **Error message icons**:
  - Red ✗ icon (16px, bold) before error text
  - Flex layout with 6px gap

### ♿ Accessibility
- **WCAG 2.2 AA compliant**: All touch targets 44x44px minimum
- **Keyboard navigation**: Full keyboard support (Tab, Space, Enter, Escape)
- **Screen reader support**: ARIA labels, live regions, proper focus management
- **Color contrast**: All colors meet 4.5:1 (text) and 3:1 (UI components) minimum

### 📚 References
- Research: Nielsen Norman Group, Baymard Institute, Smashing Magazine
- Design pillars: Stripe (precision), GOV.UK (accessibility), Airbnb (hospitality)
- Unified design system: Consistent colors, spacing, typography across help + errors

---

## [0.11.1] - 2026-01-26

### ✨ Added

#### Auto-focus Full Name field (#20)
- **Immediate typing**: Full Name field automatically receives focus on page load
- **Keyboard-first workflow**: Users can start typing without manual clicking
- **Accessibility**: Screen readers properly announce the focused field
- **Implementation**: Uses standard HTML `autofocus` attribute for reliable, semantic behavior

---

## [0.11.0] - 2026-01-26

### ✨ Added

#### Email Auto-Lowercase + Enhanced Validation (#15)
- **Auto-lowercase on blur**: Uppercase letters (JOHN.DOE) automatically convert to lowercase (john.doe) when field loses focus
- **Stricter character restrictions**: Only allows `a-z`, `0-9`, and `.` (dots) - explicitly rejects hyphens, underscores, plus signs, and all special characters
- **Comprehensive dot validation**: Catches trailing dots ("john."), leading dots (".john"), and consecutive dots ("john..doe")
- **Minimum length check**: Email prefix must be at least 2 characters
- **Text error messages**: Clear, actionable error messages appear below field (matching phone validation UX)

#### Phone Validation Improvements (#18)
- **Text error messages**: Replaced icon-only validation (⚠ with tooltip) with text error messages below field
- **Consistent UX**: Phone and email validation now use same visual pattern (`displayValidationError()`)
- **Clear error format**: "Phone number must be at least 10 digits (e.g., 512-555-1234 or +1-512-555-1234)"
- **Maintains auto-formatting**: Blur-based formatting still works (converts to +1 (555) 123-4567)

### 🔧 Changed
- **Error message visibility**: Fixed CSS bug where `.error-message` had `display: none` globally - added `.error-message.visible { display: block; }` to show error text
- **Validation UX consistency**: Both email and phone fields now show text-based errors instead of icon-only feedback

### 🎨 Design
- **Error text styling**:
  - Light mode: `#DC2626` red
  - Dark mode: `#FCA5A5` light red
  - Font size: 0.875rem, line height: 1.4
- **Red borders**: Invalid inputs show red border (`aria-invalid="true"`)
- **Accessible**: WCAG AA compliant, screen reader friendly, ARIA labels

### 🐛 Fixed
- **Email validation error display**: Error messages now visible (previously hidden by global `display: none`)
- **Phone validation feedback**: Users no longer need to hover to see validation errors

---

## [0.9.0] - 2026-01-24

### ✨ Added

#### Template Redesign with 3-Tier Content Hierarchy
- **6 Redesigned Templates**: Classic, Professional, Minimalist, Compact, Modern, Creative
- **3-Tier Contact Structure**:
  - Tier 1: Primary Contact (Phone + Email)
  - Tier 2: Personal Connections (LinkedIn + X + Bookings)
  - Tier 3: Company Brand (Follow Zoho social links)
- **New Creative Template**: Bold 4px left accent bar with logo stacked above name
- **New Professional Template**: Two-column layout with logo left, info right

#### Typography Refresh
- **Verdana Font**: All templates now use `Verdana, Geneva, sans-serif` (Zoho Mail default)
- **Consistent Sizing**: Name 15-16px, Title/Contact 12-13px across all templates

### 🔧 Changed
- **Template Descriptions**: User-focused ("Best for Sales, Account Management") instead of design-focused
- **Default Template**: Classic set as default (universal, polished format)
- **Style Selector**: Replaced Executive/Bold with Professional/Creative
- **Logo Sizes**: Classic 34px, Professional/Modern 38px, Minimalist none, Compact 26px, Creative 32px
- **Preview Alignment**: Changed from centered to left-aligned (flex-start) for accurate email preview

### 🐛 Fixed
- **Form Data Mapping**: Fixed `loadInitialFormData()` to correctly map special input IDs (email-prefix, twitter-username, linkedin-username, bookings-id) to formData keys on page load
- **X/Twitter Field**: Changed `data.x` to `data.twitter` in all templates (form stores handle as 'twitter')
- **Modern Accent Bar**: Added `&nbsp;` content and CSS opacity to prevent td collapse

### 📋 Template Guide
| Template | Logo Size | Layout | Best For |
|----------|-----------|--------|----------|
| Classic | 34px | Logo-top stacked | Everyone (default) |
| Professional | 38px | Two-column | Sales, Account Management |
| Minimalist | None | Text-only | Engineering, Technical Support |
| Compact | 26px | Small logo, stacked | Mobile-heavy users |
| Modern | 38px | Two-column + accent bar | Product, Engineering Leadership |
| Creative | 32px | Bold left accent bar | Marketing, Design, Events |

---

## [0.8.0] - 2026-01-23

### ✨ Added

#### Color Theming System
- **4 Brand Colors**: Red (#E42527), Green (#089949), Blue (#226DB4), Yellow (#F9B21D)
- **Color Switcher**: CSS Grid layout with 4 equal-width buttons
- **Selected State**: Border highlight and box-shadow for active color
- **localStorage Persistence**: User's color preference saved across sessions
- **Dynamic Accent Colors**: All contact links (phone, email, social media) use selected accent color

#### New Signature Templates
- **Executive Template**: Centered layout with large name (20px bold), horizontal accent line below name (60px × 2px), designed for VPs/C-Suite/Senior Leadership
- **Bold Template**: Colored name/title block with rounded corners (8px), contrast-aware text color (dark on yellow, white on other colors), ideal for Marketing and Events teams

### 🔧 Changed
- **Style Selector**: Removed checkmark icon (border highlight sufficient), bolded template names (font-weight: 600), uniform 2-line help text descriptions
- **Dark Mode Toggle**: Replaced icon-based toggle with standard iOS-style switch, text label "Preview Dark Mode" outside toggle pill
- **Template Functions**: All now accept `accentColor` and `isPreview` parameters
- **AppState**: Added `accentColor` property (default: '#E42527')

### 🐛 Fixed
- **Accent Colors Not Applying**: Removed `!important` from `.sig-link` color in dark mode CSS (was overriding inline styles), kept it for fixed values (name, title)
- **Light Mode Text Illegible**: System dark mode preference (`@media (prefers-color-scheme: dark)`) was affecting preview even in light mode. Created dual dark mode context:
  - Preview mode (`isPreview=true`): Only `.dark-mode` class selectors
  - Copy mode (`isPreview=false`): Both media query AND `.dark-mode` selectors

### 📚 Documentation
- Created `docs/troubleshooting/css-important-conflicts.md`
- Created `docs/troubleshooting/dark-mode-system-preferences.md`

---

## [0.7.0] - 2026-01-22

### ✨ Added

#### Import Modal Redesign
- **Professional Design**: Email client branding with logo badges (48×48px with rounded corners)
- **WCAG AAA Compliance**: Verified contrast ratios 7:1+ for primary text (17.95:1 for titles, 15.21:1 for step text)
- **Numbered Step Circles**: Brand-colored badges (32px desktop, 28px mobile)
- **5 Email Client Instruction Sets**:
  - Zoho Mail: Red (#E42527), 5 steps with "Insert HTML" workflow
  - Zoho Desk: Orange (#F37021), 4 steps with signature management
  - Gmail: Red (#EA4335), 4 steps with direct paste (no Insert HTML button)
  - Apple Mail: Blue (#0071E3), 5 steps with critical font-matching checkbox
  - Outlook: Blue (#0078D4), 3 steps with rendered HTML paste
- **Responsive Design**: 320px to 1440px+ with single breakpoint at 640px
- **Tip Boxes**: Colored boxes for different message types (Yellow/Blue/Green with WCAG AAA contrast)

#### Idiot-Proof Instructions
- Explicit UI element descriptions: "Insert HTML button (looks like </> brackets)"
- Visual clarity: "blue Insert button", "blue Update button"
- Context labels: "In the 'Insert HTML' popup"
- Step-by-step navigation: "Settings → Signature → Insert HTML"
- Client-specific warnings: Apple Mail font-matching checkbox

### 🔧 Changed
- **Modal Header**: Dynamic title with email client name, time estimate (e.g., "~1 minute • 5 steps"), professional close button (32×32px hit target)
- **CSS Architecture**: Forced light mode (explicit hex colors, no dark mode inheritance), CSS custom property `--step-color` for brand colors
- **JavaScript**: `ModalController.copySignature()` for inline copy button, `ModalController.updateContent()` for dynamic header/body injection
- **Animations**: Progressive enhancement with CSS-first approach, smooth animations with `prefers-reduced-motion` support, staggered fade-in (50ms delays)

---

## [0.6.0] - 2026-01-22

### ✨ Added

#### Dark Mode Email Signature Support
- **CSS Media Queries**: All 6 signature styles now include `<style>` block with `@media (prefers-color-scheme: dark)`
- **High Contrast Colors**: White text (#FFFFFF), light gray titles (#E0E0E0), blue links (#4A9EFF)
- **Dual Logo Strategy**: Every signature includes both light and dark Zoho logos with CSS `display: none/block` toggle
- **Helper Functions**:
  - `getDarkModeStyles()`: Generates CSS style block with media queries
  - `getLogoUrls()`: Returns light/dark logo URLs from GitHub Pages
  - `generateDualLogos()`: Creates HTML with both logo variants
- **CSS Classes**: `.sig-name` (primary text), `.sig-title` (secondary text), `.sig-link` (all links), `.sig-separator` (bullets), `.sig-logo-light`, `.sig-logo-dark`

### 🔧 Changed
- **Logo URLs**: Point to GitHub Pages (`tejasgadhia.github.io/zoho-signature-generator/assets/`)
- **Template Functions**: Now accept `isPreview` parameter for dual dark mode context

### 📋 Email Client Compatibility
- ✅ Gmail (web + mobile): Full dark mode support
- ✅ Apple Mail (macOS + iOS): Full dark mode support
- ⚠️ Outlook Web: Partial support (may strip some styles)
- ❌ Outlook Desktop: Fallback to light mode (inline styles only)

### 🏆 Key Insight
Design for graceful degradation, not universal support. Modern clients (Gmail/Apple Mail) cover ~80% of users.

---

## [0.5.0] - 2026-01-21

### ✨ Added
- **UTM Tracking**: Main zoho.com link includes tracking parameters for email signature analytics
- **Smart Title Case**: Name, Title, Department fields auto-format with lock icon toggle, preserves ~18 common acronyms
- **Bookings URL Pattern**: Changed to username-style input (`bookings.zohocorp.com/#/[your-id]`)
- **Numbered Quick Start**: Changed from bullets to numbered list with Zoho red styling

### 🔧 Changed
- **Twitter → X Rebrand**: Updated all references and URLs
- **Split Button Design**: Zoho Mail and Zoho Desk buttons with logo + text layout
- **Sidebar Footer**: "Other Email Clients" section pinned to bottom
- **Tooltip Positioning**: Tooltips now positioned above icons (not to the right)
- **Social Media Cards**: Height reduced from 90px to 75px

---

## [0.4.0] - 2026-01-20

### ✨ Added
- Additional signature style templates (Classic, Compact, Modern, Minimal, Executive, Bold)

---

## [0.3.0] - 2026-01-22

### ✨ Added
- **iOS-Style Social Media Toggles**: Replaced checkboxes with toggle switch list
- **Drag-and-Drop Reordering**: Premium drag-and-drop with keyboard support (Space + Arrows)
- **WCAG 2.2 Compliant**: 44×44px touch targets, ARIA live regions, screen reader support
- **Order Persistence**: Custom channel order saves to localStorage

### 🔧 Changed
- Instagram icon: Camera emoji → "IG" text for consistency

---

## [0.2.0] - 2026-01-19

### ✨ Added
- **370+ CSS Design Tokens**: Comprehensive design system in `.ui-design/tokens/tokens.css`
- **Semantic Color Variables**: Auto-switch between light/dark modes
- **Keyboard-Accessible Toggles**: All toggle switches support Enter/Space keys with ARIA attributes
- **Visual Validation Feedback**: Form inputs show red/green borders on invalid/valid states

### 🐛 Fixed
- Modal memory leak (focus trap event listener cleanup)
- Hardcoded colors replaced with design tokens

---

## [0.1.0] - 2026-01-17

### 🎉 Initial Release

First public release of the Zoho Email Signature Generator. Privacy-first tool for creating professional email signatures.

**Core Features:**
- 4 signature styles (Classic, Compact, Modern, Minimal)
- Live preview system with real-time updates
- One-click copy to clipboard
- iOS-style toggle switches for optional fields
- Zoho social media integration with master toggle
- Email validation (@zohocorp.com required)
- Dark mode preview toggle
- Zero dependencies (vanilla JavaScript)
- Email-compatible HTML (table-based layouts, inline styles)

**Technical:**
- Browser APIs: Clipboard API with fallback, localStorage, URL API
- ~1K lines JavaScript, fully responsive
- Email client tested: Gmail, Apple Mail, Outlook, Zoho Mail, Yahoo Mail, ProtonMail, Thunderbird

---

**Full Changelog**: https://github.com/tejasgadhia/zoho-signature-generator/commits/main
