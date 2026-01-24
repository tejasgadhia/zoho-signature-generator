# Zoho Email Signature Generator - Phase 2 Work Items

**Target Version:** v0.5.0
**Status:** Planning
**Date:** January 22, 2026

---

## Overview

Phase 2 focuses on polish, readability improvements, and completing deferred features from v0.4.0. These items emerged from user testing and feedback.

---

## Priority 1: Critical Fixes

### 1. Fix Logo Display Issues
**Problem:** Zoho Mail logo is half cut-off, Desk logo doesn't appear
**Files:** `index.html`, `css/styles.css`, `assets/`
**Tasks:**
- Debug logo rendering in import buttons
- Verify SVG dimensions and viewBox attributes
- Test logo display in Chrome, Firefox, Safari
- Add fallback if SVG fails to load

**Success Criteria:**
- Both logos render completely
- Logos are centered within buttons
- 24x24px display size (as designed)

---

### 2. Improve Text Readability
**Problem:** Field labels are gray and hard to read, especially "zoho.com" URL
**Files:** `css/styles.css`

**Changes Needed:**
- Field labels: Change from `#666` (gray) to `#333` (dark gray) or `#000` (black)
- URL fields: Increase text color contrast
- Locked website field: Make URL more visible

**Current Colors:**
```css
.input-group label {
    color: var(--color-text-secondary);  /* Too light */
}
```

**Target Colors:**
```css
.input-group label {
    color: #333333;  /* Much more readable */
}
```

**Success Criteria:**
- Field labels pass WCAG AA contrast ratio (4.5:1)
- All text readable without squinting
- Website URL clearly visible

---

### 3. Pin Disclaimer to Bottom of Sidebar
**Problem:** Disclaimer scrolls with content, should be fixed at bottom
**Files:** `css/styles.css`

**Implementation:**
```css
.sidebar {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.disclaimer-box {
    margin-top: auto;  /* Push to bottom */
    position: sticky;
    bottom: 0;
}
```

**Success Criteria:**
- Disclaimer always visible at bottom
- Doesn't overlap with scrollable content
- Works when sidebar content overflows

---

## Priority 2: UX Enhancements

### 4. Compact Social Media Cards
**Problem:** Cards are a bit large, could be more space-efficient
**Current:** 90px height, 28px icons
**Target:** ~70-75px height, 24px icons

**Files:** `css/styles.css`

**Changes:**
```css
.social-compact-card {
    height: 75px;  /* From 90px */
}

.social-compact-icon {
    font-size: 24px;  /* From 28px */
    margin-bottom: 4px;  /* From 6px */
}

.social-compact-label {
    font-size: 10px;  /* From 11px */
}
```

**Success Criteria:**
- Cards still easy to click/tap (44px touch target)
- Icons remain recognizable
- Text remains readable

---

### 5. Reposition Tooltips to Right Side
**Problem:** Tooltips overlap field and label on left/top
**Files:** `css/styles.css`

**Current Positioning:**
```css
.info-icon:hover::after {
    left: 24px;  /* Right of icon */
    top: 50%;
    transform: translateY(-50%);
}
```

**Better Positioning:**
```css
.info-icon:hover::after {
    right: auto;
    left: 100%;
    margin-left: 8px;
    top: 50%;
    transform: translateY(-50%);
}
```

**Success Criteria:**
- Tooltips never overlap form fields
- Tooltips never overlap labels
- Arrow points to info icon from right side
- Works on all input groups

---

### 6. Enforce Title Case for Name Fields
**Problem:** Name, title, department should auto-capitalize properly
**Files:** `js/app.js`

**Implementation:**
```javascript
function toTitleCase(str) {
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

// Apply on blur for Name, Title, Department fields
nameInput.addEventListener('blur', (e) => {
    e.target.value = toTitleCase(e.target.value);
    AppState.formData.name = e.target.value;
    updatePreview();
});
```

**Fields to Apply:**
- Full Name (required)
- Job Title (optional)
- Department (optional)

**Success Criteria:**
- "john smith" → "John Smith"
- "sarah MITCHELL" → "Sarah Mitchell"
- "SENIOR ACCOUNT EXECUTIVE" → "Senior Account Executive"
- Preserves intentional caps (e.g., "PhD", "CEO")

---

### 7. Implement Bookings URL with Fixed Base
**Problem:** Bookings URL should use same pattern as email/LinkedIn
**Current:** Free-form URL input
**Target:** Username input with fixed base

**URL Structure:**
```
https://bookings.zohocorp.com/#/3846319000027543122
                                  ^^^^^^^^^^^^^^^^^
                                  User-specific ID
```

**HTML Changes:**
```html
<label for="bookings-id">
    Zoho Bookings Link
    <span class="info-icon" data-tooltip="Enter your Bookings ID (e.g., 3846319000027543122). Full URL: bookings.zohocorp.com/#/your-id">ⓘ</span>
</label>
<div class="input-wrapper">
    <div class="toggle-switch" data-field="bookings" ...></div>
    <div class="url-prefix-input">
        <span class="url-prefix">bookings.zohocorp.com/#/</span>
        <input type="text"
               id="bookings-id"
               name="bookings-id"
               placeholder="3846319000027543122"
               class="url-username-field">
    </div>
</div>
```

**JavaScript Changes:**
```javascript
// Construct full Bookings URL from ID
const bookingsIdInput = document.getElementById('bookings-id');
if (bookingsIdInput) {
    bookingsIdInput.addEventListener('input', (e) => {
        const bookingsId = e.target.value.trim();
        AppState.formData.bookings = bookingsId ? `https://bookings.zohocorp.com/#/${bookingsId}` : '';
        updatePreview();
    });
}
```

**Success Criteria:**
- User enters only ID: `3846319000027543122`
- Full URL constructed: `https://bookings.zohocorp.com/#/3846319000027543122`
- Validation: ID should be numeric and ~19 characters
- Field disabled by default (toggle to enable)

---

## Priority 3: Professional Polish

### 8. Source Official Logos for Email Clients
**Problem:** Gmail, Apple Mail, Outlook still use emoji fallbacks
**Files:** `assets/`, `index.html`, `css/styles.css`

**Tasks:**
1. **Gmail:** Find official Google Mail logo
   - Source: Google Brand Resources
   - Format: SVG preferred
   - Colors: Google blue (#4285F4)

2. **Apple Mail:** Find official Apple Mail icon
   - Source: Apple Design Resources
   - Format: SVG or PNG with transparency
   - Colors: Apple blue gradient

3. **Outlook:** Find official Microsoft Outlook logo
   - Source: Microsoft Brand Center
   - Format: SVG preferred
   - Colors: Microsoft blue (#0078D4)

**Implementation:**
```html
<button class="import-btn import-btn-secondary" data-client="gmail">
    <img src="assets/gmail-logo.svg" alt="" class="import-btn-logo">
    Gmail
</button>

<button class="import-btn import-btn-secondary" data-client="apple-mail">
    <img src="assets/apple-mail-logo.svg" alt="" class="import-btn-logo">
    Apple Mail
</button>

<button class="import-btn import-btn-secondary" data-client="outlook">
    <img src="assets/outlook-logo.svg" alt="" class="import-btn-logo">
    Outlook
</button>
```

**Fallback Strategy:**
- If official logos unavailable, use high-quality icon library (e.g., Simple Icons)
- Maintain consistent 24x24px sizing
- Ensure logos work on both light/dark backgrounds

**Success Criteria:**
- All email clients have professional logos
- Logos match official brand guidelines
- No copyright/trademark violations

---

## Deferred from v0.4.0

### 9. Dark Mode Text Contrast (WCAG Compliance)
**Problem:** Text in dark mode preview may not meet WCAG AA contrast
**Files:** `js/signature.js`

**Implementation:**
Add media query support to signature HTML:
```javascript
function getDarkModeStyles() {
    return `
        @media (prefers-color-scheme: dark) {
            .signature-text {
                color: #FFFFFF !important;
            }
            .signature-name {
                color: #FFFFFF !important;
            }
            .signature-title {
                color: #E0E0E0 !important;
            }
            .signature-link {
                color: #4A9EFF !important;
            }
        }
    `;
}
```

**Email Client Support:**
- ✅ Gmail (web + mobile)
- ✅ Apple Mail (iOS 13+, macOS 10.15+)
- ⚠️ Outlook (limited support)

**Success Criteria:**
- Text contrast passes WCAG AA (4.5:1) in dark mode
- Signatures readable in Gmail dark mode
- Fallback colors work in non-supporting clients

---

### 10. Logo Inversion for Dark Mode
**Problem:** Zoho logo text turns black on dark background
**Files:** `js/signature.js`

**Implementation:**
Use conditional logo variant:
```javascript
function getLogoURL(isDarkMode) {
    if (isDarkMode) {
        return 'https://www.zohowebstatic.com/sites/zweb/images/commonroot/zoho-logo-darkbg.svg';
    } else {
        return 'https://www.zohowebstatic.com/sites/zweb/images/commonroot/zoho-logo-web.svg';
    }
}
```

**Alternative (if external URLs blocked):**
- Download both logo variants to `assets/`
- Embed as base64 data URIs
- Use CSS media queries to swap logos

**Success Criteria:**
- Logo visible on dark backgrounds
- Logo maintains brand colors
- Works in email clients that support dark mode

---

## Testing Checklist (Phase 2)

Before marking Phase 2 complete, verify:

### Visual Regression
- [ ] All logos display correctly (no cut-off)
- [ ] Text is readable (black/dark gray labels)
- [ ] Disclaimer pinned to bottom of sidebar
- [ ] Social cards are more compact but still usable
- [ ] Tooltips appear on right side without overlap

### Functionality
- [ ] Title case applied to Name, Title, Department fields
- [ ] Bookings URL constructs correctly from ID
- [ ] All logos load (including Gmail, Apple Mail, Outlook)

### Accessibility
- [ ] Text contrast meets WCAG AA
- [ ] Tooltips don't obscure content
- [ ] Keyboard navigation still works

### Cross-Browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

---

## Implementation Order

**Session 1: Critical Fixes (1-3)**
1. Fix logo display issues
2. Improve text readability
3. Pin disclaimer to bottom

**Session 2: UX Enhancements (4-7)**
4. Compact social media cards
5. Reposition tooltips
6. Enforce title case
7. Bookings URL with fixed base

**Session 3: Professional Polish (8-10)**
8. Source official email client logos
9. Dark mode text contrast
10. Logo inversion for dark mode

---

## Success Metrics

**v0.5.0 is complete when:**
- ✅ All logos display correctly
- ✅ Text readability improved (WCAG AA)
- ✅ Disclaimer always visible at bottom
- ✅ Social cards more compact
- ✅ Tooltips positioned correctly
- ✅ Title case enforced
- ✅ Bookings URL uses fixed base pattern
- ✅ All email clients have professional logos
- ✅ (Stretch) Dark mode fully supported

---

**Estimated Effort:** 3-4 hours
**Priority:** High (usability issues blocking production use)
