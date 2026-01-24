# Changelog

All notable changes to the Zoho Email Signature Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
