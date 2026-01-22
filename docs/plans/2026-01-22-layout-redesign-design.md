# Layout Redesign - Design Document

**Date**: January 22, 2026
**Version**: Phase 1
**Status**: Design Complete - Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Problems Being Solved](#problems-being-solved)
3. [Design Goals](#design-goals)
4. [Layout Structure](#layout-structure)
5. [Color Scheme & Branding](#color-scheme--branding)
6. [Sidebar Content](#sidebar-content)
7. [Form Section](#form-section)
8. [Preview Section](#preview-section)
9. [Email Dark Mode Implementation](#email-dark-mode-implementation)
10. [Technical Implementation Notes](#technical-implementation-notes)
11. [Phase 2 Features](#phase-2-features)
12. [References](#references)

---

## Overview

This design document outlines a comprehensive layout redesign for the Zoho Email Signature Generator (v0.4.0). The redesign moves from a two-column layout to a three-column desktop-optimized layout with improved information architecture, official Zoho branding, and enhanced email client compatibility.

### Key Changes

- **Three-column layout**: Sidebar (320px) + Form (~450px) + Preview (flex)
- **Light mode only for site**: Dark mode toggle affects signature preview only
- **Sidebar with persistent instructions**: Import instructions always visible
- **Official Zoho branding**: Colors from official branding kit
- **Gmail-optimized dark mode**: Signature dark mode optimized for Gmail compatibility
- **Enhanced form validation**: Tooltips and inline validation feedback
- **Scalable style selector**: 3x2 grid supporting 6 signature styles

---

## Problems Being Solved

### Current Issues (v0.3.0)

1. **Header cutoff**: Title text gets cut off on page refresh due to insufficient vertical space
2. **Dark mode confusion**: Site-wide dark mode interferes with light/dark mode testing for signatures
3. **Hidden import instructions**: "How to Import" buried in modal, not easily discoverable
4. **Gradient background**: Interferes with proper light/dark mode theming and readability
5. **Limited style scalability**: 2x2 grid with awkward single item on third row if expanded
6. **No Zoho Bookings support**: Missing important meeting scheduling link option
7. **Unofficial tool warning**: No disclaimer that this is a community tool

### User Pain Points

- Users need to scroll vertically to see all content
- Import instructions require clicking modal, breaking workflow
- Testing signature dark mode also changes entire site appearance
- No clear indication this isn't an official Zoho tool

---

## Design Goals

### Primary Goals

1. **Eliminate vertical scrolling**: All content visible in viewport (desktop 13" MacBook minimum)
2. **Improve information hierarchy**: Persistent sidebar with instructions, clear priority of Zoho products
3. **Official branding compliance**: Use official Zoho colors and branding guidelines
4. **Email client compatibility**: Optimize signature dark mode for Gmail (most common external client)
5. **Desktop-first focus**: No mobile/tablet support (signatures updated at desktop)

### Success Metrics

- Zero vertical scrolling on 1440x900+ displays
- Import instructions visible without modal interaction
- Light mode site UI with independent dark mode signature preview
- Clear visual distinction between Zoho Mail/Desk (primary) and other email clients
- 6 signature styles supported with symmetrical grid layout

---

## Layout Structure

### Three-Column Desktop Layout

**Target Resolution**: 1440x900 minimum (13" MacBook)
**Viewport Usage**: 100vw × 100vh (no scrolling)

```
┌────────────────────────────────────────────────────────────┐
│ [Sidebar 320px fixed]  │  [Form ~450px]  │  [Preview flex] │
│                        │                 │                  │
│ • Logo/Title           │  Your Info      │  Live Preview   │
│ • Subtitle             │  Form fields    │  + Style cards  │
│ • Disclaimer box       │  Toggles        │  + Dark mode    │
│ • Quick Start          │  Social media   │  + Copy button  │
│ • Import buttons       │                 │                  │
│   (Zoho Mail/Desk)     │  [Scrollable]   │  [No scroll]    │
│   (Other clients)      │                 │                  │
│                        │                 │                  │
│ [Internal scroll only] │                 │                  │
└────────────────────────────────────────────────────────────┘
```

### Column Specifications

**Sidebar (320px fixed)**
- Fixed width, full viewport height
- Light gray background (#FAFAFA)
- Internal scroll if content overflows
- Always visible (no collapse)

**Form Section (~450px)**
- Flexible width between sidebar and preview
- White background (#FFFFFF)
- Internal scroll if fields exceed viewport
- Card-style with shadow

**Preview Section (remaining flex)**
- Takes remaining width (typically ~500-600px)
- White background (#FFFFFF)
- No scrolling (signature scales to fit)
- Card-style with shadow

---

## Color Scheme & Branding

### Official Zoho Brand Colors

From [Zoho Branding Kit](https://www.zoho.com/branding/):

**Primary Colors:**
- **Zoho Red**: `#E42527` - Primary brand color (CTAs, active toggles, accents)
- **Zoho Green**: `#089949` - Success states, Zoho Desk branding
- **Zoho Blue**: `#226DB4` - Links, info states
- **Zoho Yellow**: `#F9B21D` - Warnings, disclaimer box

**Neutrals:**
- **Black**: `#000000` - Headings
- **Dark Grey**: `#333333` - Body text
- **Light Grey**: `#FAFAFA` - Sidebar background
- **White**: `#FFFFFF` - Card backgrounds, elevated surfaces

**Product-Specific Colors:**
- **Zoho Mail**: `#1976D2` (Blue - Material Blue 700)
- **Zoho Desk**: `#089949` (Green - Official Zoho Green)

### Color Application

**Page Layout:**
- Body background: `#FFFFFF` (solid white, no gradient)
- Sidebar background: `#FAFAFA` (light grey)
- Form/Preview cards: `#FFFFFF` with `box-shadow`

**Interactive Elements:**
- Primary CTA ("Copy Signature"): `#E42527` (Zoho Red)
- Toggle switches (active): `#E42527`
- Selected style card border: `#E42527`
- Zoho Mail button: `#1976D2` (filled blue)
- Zoho Desk button: `#089949` (filled green)
- Other email client buttons: `#CCCCCC` outline, grey

**Validation States:**
- Valid input: Green border `#089949` + checkmark
- Invalid input: Red border `#E42527` + X icon
- Neutral: Default grey border

**Disclaimer Box:**
- Background: `#F9B21D` (Zoho Yellow)
- Text: `#333333` (Dark Grey)
- Border radius: 8px
- Warning icon: ⚠️

---

## Sidebar Content

### Sidebar Structure (320px width)

```
┌─────────────────────────────────┐
│ [Zoho Logo - 80-100px]          │
│                                 │
│ Zoho Email Signature Generator  │
│ Create a professional email     │
│ signature for your Zoho account │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ⚠️ DISCLAIMER               │ │
│ │ This is an unofficial       │ │
│ │ community tool, not         │ │
│ │ endorsed by Zoho Corp.      │ │
│ └─────────────────────────────┘ │
│                                 │
│ Quick Start:                    │
│ • Fill in your information      │
│ • Choose a signature style      │
│ • Toggle dark mode to preview   │
│ • Copy and import to email      │
│                                 │
│ ─────────────────────────────   │
│                                 │
│ Import Instructions             │
│                                 │
│ [🔵 Zoho Mail           ] 48px  │
│ [🟢 Zoho Desk           ] 48px  │
│                                 │
│ ─── Other Email Clients ───     │
│                                 │
│ [○ Gmail                ] 36px  │
│ [○ Apple Mail           ] 36px  │
│ [○ Outlook              ] 36px  │
│                                 │
└─────────────────────────────────┘
```

### Element Specifications

**Zoho Logo:**
- Size: 80-100px width
- Format: SVG or PNG with transparent background
- Position: Top of sidebar, centered
- Margin: 24px top/bottom

**Heading:**
- Text: "Zoho Email Signature Generator"
- Font size: 24px
- Font weight: Bold (700)
- Color: `#E42527` (Zoho Red)
- Margin bottom: 8px

**Subtitle:**
- Text: "Create a professional email signature for your Zoho account"
- Font size: 14px
- Font weight: Regular (400)
- Color: `#666666` (Medium Grey)
- Margin bottom: 24px

**Disclaimer Box:**
- Background: `#F9B21D` (Zoho Yellow)
- Padding: 16px
- Border radius: 8px
- Icon: ⚠️ warning emoji (16px, left-aligned)
- Text: "This is an unofficial community tool, not endorsed by Zoho Corporation."
- Font size: 12px
- Color: `#333333`
- Margin bottom: 24px

**Quick Start Section:**
- Heading: "Quick Start:" (14px, semi-bold)
- List: 4 bullet points
- Font size: 13px
- Line height: 1.6
- Color: `#333333`
- Margin bottom: 24px

**Separator Line:**
- Border: 1px solid `#E0E0E0`
- Margin: 24px vertical

**Import Instructions Heading:**
- Text: "Import Instructions"
- Font size: 16px
- Font weight: Semi-bold (600)
- Color: `#333333`
- Margin bottom: 16px

### Import Buttons

**Primary Buttons (Zoho Products):**

**Zoho Mail Button:**
- Background: `#1976D2` (Blue)
- Color: `#FFFFFF` (White text)
- Height: 48px
- Width: 100%
- Border radius: 8px
- Icon: Zoho Mail logo (24px) + text "Zoho Mail"
- Font size: 16px
- Font weight: Semi-bold (600)
- Box shadow: `0 2px 4px rgba(0,0,0,0.1)`
- Hover: Darken to `#1565C0`, elevation increase

**Zoho Desk Button:**
- Background: `#089949` (Green)
- Color: `#FFFFFF` (White text)
- Height: 48px
- Width: 100%
- Border radius: 8px
- Icon: Zoho Desk logo (24px) + text "Zoho Desk"
- Font size: 16px
- Font weight: Semi-bold (600)
- Box shadow: `0 2px 4px rgba(0,0,0,0.1)`
- Hover: Darken to `#087A3A`, elevation increase
- Margin top: 8px

**Section Label:**
- Text: "Other Email Clients"
- Font size: 12px
- Font weight: Regular (400)
- Color: `#999999`
- Text align: Center
- Margin: 24px vertical
- Border top: 1px solid `#E0E0E0`
- Padding top: 16px

**Other Client Buttons:**
- Background: `#FFFFFF` (White)
- Border: 1px solid `#CCCCCC`
- Color: `#666666` (Grey text)
- Height: 36px
- Width: 100%
- Border radius: 6px
- Icon: Email client logo (20px) + text
- Font size: 14px
- Font weight: Regular (400)
- Hover: Background `#F5F5F5`, border `#999999`
- Margin: 8px vertical

### Modal Behavior

**When import button clicked:**
1. Overlay modal appears with backdrop
2. Modal centered on screen
3. Close button (X) in top right
4. ESC key closes modal
5. Backdrop click closes modal
6. Modal contains step-by-step instructions for specific email client
7. Modal uses white background, shadow, rounded corners
8. Instructions numbered 1, 2, 3... with clear steps
9. "Got it" button at bottom to close

---

## Form Section

### Form Layout (~450px width)

```
┌─────────────────────────────────┐
│ Your Information                │
│                                 │
│ Full Name * (required)          │
│ [Sarah Mitchell         ] ✓     │
│                                 │
│ [🔴] Job Title                  │
│ [Account Executive      ] ✓     │
│                                 │
│ [🔴] Department                 │
│ [Enterprise Sales       ]       │
│                                 │
│ [🔴] Email Address              │
│ [sarah.mitchell@...     ] ✓     │
│ ⓘ Must be @zohocorp.com         │
│                                 │
│ [🔴] Phone Number               │
│ [+1 (512) 555-0123      ] ✓     │
│ ⓘ Min 10 digits, +country code  │
│                                 │
│ [🔴] LinkedIn Profile           │
│ [linkedin.com/in/...    ] ✓     │
│ ⓘ linkedin.com/in/yourname      │
│                                 │
│ [🔴] Twitter/X Handle           │
│ [@sarahmitchell         ]       │
│                                 │
│ [🔴] Zoho Bookings Link         │
│ [zoho.com/bookings/...  ] ✓     │
│ ⓘ For scheduling meetings       │
│                                 │
│ Company Website (locked)        │
│ [zoho.com               ] 🔒    │
│                                 │
│ ─────────────────────────────   │
│                                 │
│ Zoho Social Media               │
│ [🔴] Include Zoho social links  │
│      Drag to reorder            │
│                                 │
│ [≡] Twitter/X           [🔴]    │
│ [≡] LinkedIn            [🔴]    │
│ [≡] Facebook            [🔴]    │
│ [≡] Instagram           [🔴]    │
│                                 │
└─────────────────────────────────┘
```

### Form Field Specifications

**Section Heading:**
- Text: "Your Information"
- Font size: 20px
- Font weight: Bold (700)
- Color: `#333333`
- Margin bottom: 24px

**Field Structure:**
- Label + Toggle (for optional fields)
- Input field with validation indicator
- Tooltip/help text (for fields with validation)
- Spacing: 16px between fields

**Full Name Field (Required):**
- Label: "Full Name * (required)"
- Input: Text field, 100% width
- Validation: Real-time after blur
- Valid: Green border + ✓
- Invalid: Red border + ✗ + tooltip "Name is required"
- No toggle (always required)

**Optional Fields (with toggle):**
- Toggle switch left of label
- Toggle color: `#E42527` when ON, `#CCCCCC` when OFF
- When toggle OFF: Input disabled, grayed out (but still visible)
- When toggle ON: Input enabled, normal colors
- Toggle uses iOS-style switch design

**Email Address Field:**
- Validation: Must end with `@zohocorp.com`
- Tooltip: "Must be @zohocorp.com" (shows on focus/invalid)
- Valid: Green border + ✓
- Invalid: Red border + ✗ + tooltip "Email must be @zohocorp.com"
- Real-time validation on blur

**Phone Number Field:**
- Validation: Minimum 10 digits (excluding + and country code)
- Accepts various formats: +1 (512) 555-0123, +91-9876543210, etc.
- Tooltip: "Min 10 digits, +country code supported"
- Valid: Green border + ✓
- Invalid: Red border + ✗ + tooltip "Phone must have at least 10 digits"

**LinkedIn Profile Field:**
- Validation: Valid URL starting with linkedin.com
- Auto-cleanup: Removes tracking parameters (?utm_*, ?trk=*)
- Tooltip: "linkedin.com/in/yourname"
- Valid: Green border + ✓
- Invalid: Red border + ✗ + tooltip "Enter valid LinkedIn URL"

**Twitter/X Handle Field:**
- No strict validation (optional format)
- Accepts @username or username
- Auto-adds @ if missing

**Zoho Bookings Link Field:**
- Validation: Valid URL
- Tooltip: "For scheduling meetings"
- Valid: Green border + ✓
- Invalid: Red border + ✗ + tooltip "Enter valid URL"

**Company Website Field:**
- Locked to: `zoho.com`
- Read-only input with lock icon 🔒
- Background: `#F5F5F5` (disabled grey)
- Cannot be edited (ensures brand consistency)

### Zoho Social Media Section

**Master Toggle:**
- Label: "Include Zoho social links"
- Toggle: iOS-style switch, `#E42527` when ON
- When OFF: Individual social channels hidden/collapsed
- When ON: Shows list of 4 social channels

**Social Channel List (when enabled):**
- Drag handle (≡) on left
- Channel name (Twitter/X, LinkedIn, Facebook, Instagram)
- Individual toggle on right
- Drag-and-drop reordering (smooth 200ms animations)
- Order persists to localStorage
- Text-only links in signature output (no image icons)

**Drag-and-Drop Behavior:**
- Space to grab (keyboard)
- Arrow keys to move (keyboard)
- Space to drop (keyboard)
- ESC to cancel (keyboard)
- Mouse drag with live reordering
- Haptic feedback on mobile (if applicable)
- ARIA announcements for screen readers

### Form Behavior

**Real-Time Updates:**
- Preview updates on input (debounced 300ms)
- Validation runs on blur (focus lost)
- Toggle changes update preview immediately
- Social media reorder updates preview immediately

**State Persistence:**
- Form data NOT stored (privacy-first)
- Theme preference stored in localStorage
- Social media order stored in localStorage
- Toggle states stored in localStorage

---

## Preview Section

### Preview Layout (flex width, ~500-600px)

```
┌─────────────────────────────────────┐
│ Preview                [○] Dark Mode│
│                                     │
│ Choose a Style:                     │
│ ┌───────┐ ┌───────┐ ┌───────┐     │
│ │Classic│ │Compact│ │Modern │     │
│ │  [✓]  │ │       │ │       │     │
│ └───────┘ └───────┘ └───────┘     │
│ ┌───────┐ ┌───────┐ ┌───────┐     │
│ │Minimal│ │Style 5│ │Style 6│     │
│ │       │ │       │ │       │     │
│ └───────┘ └───────┘ └───────┘     │
│                                     │
│ ┌─────────────────────────────────┐│
│ │                                 ││
│ │    [Live Signature Preview]     ││
│ │                                 ││
│ │    Scales to fit available      ││
│ │    space, no scrolling          ││
│ │                                 ││
│ │                                 ││
│ │                                 ││
│ └─────────────────────────────────┘│
│                                     │
│ ⚠️ Dark mode optimized for Gmail.   │
│    Outlook/Apple Mail may display   │
│    slightly differently.            │
│                                     │
│ [        Copy Signature        ]   │
└─────────────────────────────────────┘
```

### Element Specifications

**Section Heading:**
- Text: "Preview"
- Font size: 20px
- Font weight: Bold (700)
- Color: `#333333`
- Display: Inline with dark mode toggle

**Dark Mode Toggle:**
- Position: Top right of preview section
- iOS-style switch
- Label: "Dark Mode"
- Color when ON: `#E42527` (Zoho Red)
- Only affects signature preview (not site UI)
- State persists in localStorage

**Style Selector Grid:**
- Layout: 3 columns × 2 rows (6 styles total)
- Grid gap: 12px between cards
- Card size: ~160px width × 100px height

**Style Card Design:**
- Border: 2px solid `#E0E0E0` (default)
- Border radius: 8px
- Padding: 12px
- Background: `#FFFFFF`
- Box shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Hover: Border `#CCCCCC`, elevation increase
- Selected: Border `#E42527` (Zoho Red) + checkmark ✓ in top right
- Cursor: Pointer

**Style Card Content:**
- Miniature thumbnail preview of layout
- Style name below thumbnail (12px, centered)
- Preview uses grayscale/simplified colors

**Style Options:**
1. **Classic** - Logo on top, vertical stack
2. **Compact** - Single-line horizontal layout
3. **Modern** - Logo left, vertical red line separator
4. **Minimal** - Text-only, no logo
5. **Style 5** - TBD in Phase 2
6. **Style 6** - TBD in Phase 2

**Preview Box:**
- Background: `#FFFFFF` (light mode) or `#1E1E1E` (dark mode toggle ON)
- Border: 1px solid `#E0E0E0`
- Border radius: 8px
- Padding: 32px
- Min height: 300px
- Max height: 500px
- Signature centered horizontally and vertically
- No scrolling (signature scales to fit)

**Warning Message:**
- Text: "⚠️ Dark mode optimized for Gmail. Outlook/Apple Mail may display slightly differently."
- Font size: 12px
- Color: `#666666`
- Icon: ⚠️ warning emoji
- Margin: 16px top

**Copy Signature Button:**
- Width: 100%
- Height: 48px
- Background: `#E42527` (Zoho Red)
- Color: `#FFFFFF` (White text)
- Font size: 16px
- Font weight: Semi-bold (600)
- Border radius: 8px
- Box shadow: `0 2px 4px rgba(228,37,39,0.2)`
- Hover: Darken to `#C81F21`, elevation increase
- Active: Scale down slightly (0.98)
- Icon: 📋 clipboard emoji (optional)

---

## Email Dark Mode Implementation

### Strategy

**Goal**: Optimize signature dark mode for Gmail (most common external email client)

**Approach**:
1. Default to light mode styling (inline styles)
2. Add dark mode support via `<style>` block with `@media (prefers-color-scheme: dark)`
3. Use colors that work with Gmail's auto-inversion behavior
4. Text-only social links (avoid icon inversion issues)
5. Test in Gmail, provide compatibility warning for other clients

### Technical Implementation

**HTML Structure:**
```html
<html>
<head>
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <style>
    :root { color-scheme: light dark; }

    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
      .signature-wrapper {
        background-color: #1E1E1E !important;
      }
      .signature-text {
        color: #E0E0E0 !important;
      }
      .signature-link {
        color: #4A9EFF !important;
      }
      .signature-separator {
        border-color: #555555 !important;
      }
      /* Logo: transparent PNG works on both backgrounds */
    }
  </style>
</head>
<body>
  <!-- Signature HTML with inline styles for light mode -->
  <table class="signature-wrapper" style="...">
    ...
  </table>
</body>
</html>
```

### Color Palette

**Light Mode (default, inline styles):**
- Text: `#333333` (Dark Grey)
- Links: `#226DB4` (Zoho Blue)
- Separator: `#E0E0E0` (Light Grey)
- Background: `#FFFFFF` (White)
- Accent: `#E42527` (Zoho Red for name/important text)

**Dark Mode (media query):**
- Text: `#E0E0E0` (Light Grey, not pure white)
- Links: `#4A9EFF` (Bright Blue, Gmail-safe)
- Separator: `#555555` (Medium Grey)
- Background: `#1E1E1E` (Dark Grey, not pure black)
- Accent: `#FF6B6B` (Lighter red for readability)

### Email Client Compatibility

**Gmail:**
- ✅ Best support for `prefers-color-scheme`
- ⚠️ May auto-invert colors in some cases
- ✅ Text-only links avoid icon issues
- **Optimization priority: HIGH**

**Outlook:**
- ⚠️ Limited dark mode support
- ⚠️ Often inverts entire email
- 🔄 May ignore media queries
- **Optimization priority: MEDIUM**

**Apple Mail:**
- ✅ Excellent support for media queries
- ✅ Respects color-scheme meta tags
- ✅ No aggressive auto-inversion
- **Optimization priority: LOW** (works well by default)

**Zoho Mail:**
- ❓ Unknown support (needs testing)
- Assume similar to Gmail behavior
- **Optimization priority: MEDIUM**

### Logo Handling

**Requirements:**
- Transparent PNG background
- Works on both light and dark backgrounds
- No inversion issues

**Solution:**
- Use full-color Zoho logo (red/green/blue/yellow cubes)
- Vivid colors work on both backgrounds
- No need for alternate logo versions

**Fallback:**
- If logo doesn't render well in dark mode, add subtle white glow/outline via CSS
- Use `filter: drop-shadow(0 0 1px rgba(255,255,255,0.3))` in dark mode media query

### Testing Checklist

- [ ] Gmail web (Chrome, Firefox, Safari)
- [ ] Gmail mobile app (iOS, Android)
- [ ] Outlook desktop (Windows, macOS)
- [ ] Outlook web
- [ ] Apple Mail (macOS, iOS)
- [ ] Zoho Mail (web, mobile)

---

## Technical Implementation Notes

### File Structure

```
zoho-signature-generator/
├── index.html                 # Main app (updated layout)
├── css/
│   └── styles.css            # Updated styles (three-column layout)
├── js/
│   ├── app.js                # State management (updated)
│   ├── signature.js          # Signature generation (dark mode support)
│   └── modal.js              # Modal controller (import instructions)
├── .ui-design/
│   └── tokens/
│       └── tokens.css        # Design tokens (existing)
├── docs/
│   └── plans/
│       └── 2026-01-22-layout-redesign-design.md  # This document
└── assets/
    └── zoho-logo.png         # Zoho logo (transparent PNG)
```

### CSS Architecture

**Main Stylesheet (styles.css):**
```css
/* Import design tokens */
@import '../.ui-design/tokens/tokens.css';

/* Reset */
* { margin: 0; padding: 0; box-sizing: border-box; }

/* Body - Light mode only */
body {
  font-family: var(--font-family-sans);
  background: #FFFFFF;  /* Solid white, no gradient */
  color: #333333;
  min-height: 100vh;
  overflow: hidden;  /* No page scrolling */
}

/* Three-column grid */
.layout-container {
  display: grid;
  grid-template-columns: 320px 1fr 1fr;
  height: 100vh;
  gap: 0;
}

/* Sidebar */
.sidebar {
  background: #FAFAFA;
  padding: 24px;
  overflow-y: auto;  /* Internal scroll only */
  border-right: 1px solid #E0E0E0;
}

/* Form section */
.form-section {
  background: #FFFFFF;
  padding: 32px;
  overflow-y: auto;  /* Internal scroll only */
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}

/* Preview section */
.preview-section {
  background: #FFFFFF;
  padding: 32px;
  overflow: hidden;  /* No scrolling */
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}

/* Style cards grid */
.style-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

/* Import buttons */
.import-btn-primary {
  height: 48px;
  border-radius: 8px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.import-btn-secondary {
  height: 36px;
  border: 1px solid #CCCCCC;
  border-radius: 6px;
  background: #FFFFFF;
}

/* Toggle switches - iOS style */
.toggle-switch {
  /* Existing iOS-style toggle CSS */
}

/* Validation states */
.input-valid {
  border-color: #089949;
}

.input-invalid {
  border-color: #E42527;
}

/* Tooltip */
.field-tooltip {
  font-size: 12px;
  color: #666666;
  margin-top: 4px;
}
```

### JavaScript Updates

**app.js - State Management:**
```javascript
const AppState = {
  formData: {},
  fieldToggles: {},
  signatureStyle: 'classic',
  socialOptions: {},
  isDarkModePreview: false,  // New: only affects preview
  socialOrder: ['twitter', 'linkedin', 'facebook', 'instagram']
};

function initApp() {
  loadStateFromStorage();
  setupFormListeners();
  setupDarkModeToggle();  // New: preview-only toggle
  setupImportButtons();    // New: modal triggers
  updatePreview();
}

function setupDarkModeToggle() {
  const toggle = document.getElementById('dark-mode-toggle');
  toggle.addEventListener('change', (e) => {
    AppState.isDarkModePreview = e.target.checked;
    updatePreviewBackground();
    saveStateToStorage();
  });
}

function updatePreviewBackground() {
  const previewBox = document.querySelector('.preview-box');
  if (AppState.isDarkModePreview) {
    previewBox.style.backgroundColor = '#1E1E1E';
  } else {
    previewBox.style.backgroundColor = '#FFFFFF';
  }
}
```

**signature.js - Dark Mode Support:**
```javascript
function generateSignature(data, style, darkMode) {
  const colorScheme = darkMode ? getDarkColors() : getLightColors();

  const htmlContent = `
    <html>
    <head>
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <style>
        :root { color-scheme: light dark; }
        @media (prefers-color-scheme: dark) {
          .signature-text { color: #E0E0E0 !important; }
          .signature-link { color: #4A9EFF !important; }
          .signature-separator { border-color: #555555 !important; }
        }
      </style>
    </head>
    <body>
      ${generateSignatureHTML(data, style, colorScheme)}
    </body>
    </html>
  `;

  return htmlContent;
}

function getLightColors() {
  return {
    text: '#333333',
    link: '#226DB4',
    separator: '#E0E0E0',
    accent: '#E42527'
  };
}

function getDarkColors() {
  return {
    text: '#E0E0E0',
    link: '#4A9EFF',
    separator: '#555555',
    accent: '#FF6B6B'
  };
}
```

**modal.js - Import Instructions:**
```javascript
const ModalController = {
  open(clientType) {
    const modal = document.getElementById('import-modal');
    const content = getImportInstructions(clientType);

    modal.querySelector('.modal-content').innerHTML = content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    this.setupCloseListeners(modal);
  },

  close(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  },

  setupCloseListeners(modal) {
    // ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.close(modal);
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.close(modal);
    });

    // Close button
    modal.querySelector('.close-btn').addEventListener('click', () => {
      this.close(modal);
    });
  }
};

function getImportInstructions(clientType) {
  const instructions = {
    'zoho-mail': `
      <h3>Import to Zoho Mail</h3>
      <ol>
        <li>Copy your signature using the button</li>
        <li>Go to Zoho Mail Settings</li>
        <li>Click on "Email Signature"</li>
        <li>Paste your signature</li>
        <li>Click Save</li>
      </ol>
    `,
    'zoho-desk': `
      <h3>Import to Zoho Desk</h3>
      <ol>
        <li>Copy your signature using the button</li>
        <li>Go to Zoho Desk Settings</li>
        <li>Navigate to Email Configuration</li>
        <li>Add your signature</li>
        <li>Enable for ticket responses</li>
      </ol>
    `,
    // ... other clients
  };

  return instructions[clientType] || 'Instructions not available.';
}
```

### Validation Logic

**Email Validation:**
```javascript
function validateEmail(email) {
  const regex = /^[^\s@]+@zohocorp\.com$/i;
  return regex.test(email);
}
```

**Phone Validation:**
```javascript
function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}
```

**URL Validation:**
```javascript
function validateURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function cleanLinkedInURL(url) {
  if (!url.includes('linkedin.com')) return url;

  try {
    const urlObj = new URL(url);
    urlObj.search = '';  // Remove tracking params
    return urlObj.toString().replace(/\/$/, '');
  } catch {
    return url;
  }
}
```

### Storage Management

**localStorage Keys:**
- `theme` - Not used anymore (light mode only)
- `signatureStyle` - Selected style ('classic', 'compact', etc.)
- `fieldToggles` - Object of field enable/disable states
- `socialOrder` - Array of social channel order
- `darkModePreview` - Boolean for signature preview dark mode

**Privacy Notes:**
- Form data is NOT stored (privacy-first)
- Only UI preferences stored
- No server communication
- No tracking or analytics

---

## Phase 2 Features

### Deferred to Future Release

**1. Field Reordering:**
- Drag-and-drop to reorder form fields
- Custom field order reflected in signature output
- Requires significant UI/UX work
- Lower priority (standardization is often preferred for corporate signatures)

**2. Corporate Signature Best Practices Research:**
- Research industry standards for email signatures
- Analyze what information is most valuable
- Balance between comprehensive and excessive
- Optimize for professional appearance
- Create 2 additional signature styles (Style 5 and Style 6) based on research

**3. Enhanced Dark Mode:**
- Multi-client preview (side-by-side Gmail, Outlook, Apple Mail)
- Client-specific dark mode rendering
- More comprehensive testing and optimization

**4. Additional Features (from README.md):**
- Save/load multiple signature profiles
- Export as image (PNG/JPG)
- QR code generation
- Bulk generation for teams (CSV import)
- Custom color scheme picker

---

## References

### Design Research Sources

**Email Dark Mode:**
- [How to prepare your email signature for dark mode](https://signature.email/guides/how-to-prepare-email-signature-dark-mode)
- [Ultimate Guide to Dark Mode for Email](https://www.litmus.com/blog/the-ultimate-guide-to-dark-mode-for-email-marketers)
- [How to build dark mode emails for developers](https://htmlemail.io/blog/dark-mode-email-styles)
- [Master the Art of Dark Mode Email Design and Coding](https://www.emailonacid.com/blog/article/email-development/dark-mode-for-email/)

**Zoho Branding:**
- [Official Zoho Branding Kit](https://www.zoho.com/branding/)
- [Zoho Corporation Logo Colors](https://www.schemecolor.com/zoho-corporation-logo-colors.php)
- [Zoho Mail Themes Documentation](https://www.zoho.com/mail/help/themes.html)
- [Zoho Desk Customization](https://www.zoho.com/desk/helpdesk-software-customization.html)

### Current Codebase

**Existing Files:**
- `index.html` - Current two-column layout
- `css/styles.css` - Current styling with gradient
- `js/app.js` - State management with site-wide dark mode
- `js/signature.js` - Signature generation (4 styles)
- `js/modal.js` - Modal controller for import instructions
- `.ui-design/tokens/tokens.css` - Design system tokens (370+ variables)

**Version History:**
- v0.3.0 - Premium drag-and-drop social media reordering
- v0.2.0 - Design system implementation
- v0.1.0 - Initial release

---

## Implementation Checklist

### Phase 1 - Layout Redesign

**HTML Structure:**
- [ ] Create three-column grid layout
- [ ] Build sidebar with logo, disclaimer, quick start
- [ ] Add import buttons (Zoho Mail, Zoho Desk, others)
- [ ] Update form section with all fields visible
- [ ] Add Zoho Bookings field
- [ ] Lock website field to zoho.com
- [ ] Update preview section with 3x2 style grid
- [ ] Add dark mode toggle (preview-only)
- [ ] Remove "How to Import?" button from preview

**CSS Updates:**
- [ ] Remove gradient background, use solid `#FFFFFF`
- [ ] Implement three-column grid (320px, flex, flex)
- [ ] Style sidebar with `#FAFAFA` background
- [ ] Style import buttons (primary vs secondary)
- [ ] Update form field styles (validation states)
- [ ] Style 3x2 signature style grid
- [ ] Add disclaimer box styling (yellow background)
- [ ] Update toggle switch colors to Zoho Red
- [ ] Ensure no page scrolling, only internal scroll

**JavaScript Updates:**
- [ ] Update `AppState` to remove site-wide dark mode
- [ ] Add `isDarkModePreview` state
- [ ] Update dark mode toggle to only affect preview
- [ ] Add Zoho Bookings field handling
- [ ] Lock website field validation to zoho.com
- [ ] Update validation tooltips
- [ ] Connect import buttons to modal controller
- [ ] Update `generateSignature()` for dark mode support
- [ ] Add email client-specific dark mode CSS

**Modal System:**
- [ ] Create import instruction modals for each client
- [ ] Add Zoho Mail instructions
- [ ] Add Zoho Desk instructions
- [ ] Add Gmail instructions
- [ ] Add Apple Mail instructions
- [ ] Add Outlook instructions
- [ ] Test modal keyboard navigation (ESC, Tab)

**Testing:**
- [ ] Verify no vertical scrolling on 1440x900 display
- [ ] Test all form validations
- [ ] Test dark mode toggle (preview only)
- [ ] Test style selector (all 4 current styles)
- [ ] Test social media drag-and-drop
- [ ] Test copy to clipboard
- [ ] Test import modals
- [ ] Test in Chrome, Firefox, Safari
- [ ] Verify Gmail dark mode compatibility
- [ ] Check localStorage persistence

**Documentation:**
- [ ] Update README.md with v0.4.0 changes
- [ ] Update CLAUDE.md with new architecture
- [ ] Add screenshots of new layout
- [ ] Document Phase 2 roadmap

---

## Success Criteria

**Phase 1 Complete When:**
1. ✅ Three-column layout implemented
2. ✅ No vertical scrolling on 13" MacBook (1440x900)
3. ✅ Light mode only for site UI
4. ✅ Dark mode toggle affects signature preview only
5. ✅ Import instructions in sidebar with modal buttons
6. ✅ Zoho Mail and Zoho Desk visually prioritized
7. ✅ Official Zoho branding colors applied
8. ✅ Disclaimer box visible with unofficial tool warning
9. ✅ Zoho Bookings field added
10. ✅ Website field locked to zoho.com
11. ✅ All form fields always visible (no collapsing)
12. ✅ Validation tooltips on all validated fields
13. ✅ 3x2 style grid supporting 6 styles
14. ✅ Gmail-optimized dark mode signature generation
15. ✅ Text-only social links in signature output

---

**End of Design Document**

*Ready for implementation approval and git worktree setup.*
