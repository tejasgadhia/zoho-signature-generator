# Import Instructions Modal Redesign

**Date:** January 22, 2026
**Version:** 1.0
**Status:** Design Complete - Ready for Implementation
**Estimated Effort:** ~3-4 hours

---

## Executive Summary

Complete visual redesign of the import instructions modal to fix critical contrast issues, improve scannability, add email client branding, and establish a professional, accessible design system that matches the application's modern aesthetic.

**Key Improvements:**
- ✅ Fix WCAG AAA contrast violations (current modals have ~2:1 contrast ratios)
- ✅ Add email client logo badges for visual recognition
- ✅ Implement numbered step circles with brand colors
- ✅ Style keyboard shortcuts as `<kbd>` elements
- ✅ Color-coded tip boxes with icons
- ✅ Responsive design for mobile devices
- ✅ Subtle staggered animations for polish

---

## Problem Statement

### Current Issues (Screenshots Analysis)

**Zoho Mail Modal:**
- ❌ Extremely low contrast text (light gray on white, ~2:1 ratio)
- ❌ Outdated red border box with red background tint
- ❌ Redundant "Step 1:", "Step 2:" prefixes
- ❌ No email client branding/logo
- ❌ Poor visual hierarchy - all text looks similar

**Gmail Modal:**
- ❌ Dark title on dark blue background (terrible contrast)
- ❌ Inconsistent styling compared to Zoho Mail modal
- ❌ No visual branding
- ❌ Hard to scan quickly

**General Problems:**
- ❌ Doesn't match the modern design system (`var(--color-*)` tokens)
- ❌ Not accessible (fails WCAG AA, let alone AAA)
- ❌ Keyboard shortcuts not visually distinct
- ❌ Tip boxes blend into content

---

## Design Goals

1. **Accessibility First**: WCAG AAA contrast (11:1 for primary text, 7:1 for secondary)
2. **Scannable**: Clear visual hierarchy, numbered steps, visual anchors
3. **Professional**: Classy, timeless aesthetic (not gimmicky)
4. **Branded**: Email client logos and brand colors
5. **Consistent**: Match existing design system tokens
6. **Mobile-Friendly**: Responsive down to 320px width

---

## Research & Best Practices

**Sources:**
- [Modal UX Best Practices - LogRocket](https://blog.logrocket.com/ux-design/modal-ux-design-patterns-examples-best-practices/)
- [Modal UX Design for SaaS in 2025 - Userpilot](https://userpilot.com/blog/modal-ux-design/)
- [Mastering Modal UX - Eleken](https://www.eleken.co/blog-posts/modal-ux)

**Key Findings:**
- Clear, brief, actionable instructions with visual cues
- Progress indicators for multi-step processes
- Don't overwhelm users - use clear visual hierarchy
- Match modal's tone and design to the rest of the interface
- Use descriptive titles and buttons

**Approach Selected:** Clean Professional List (Approach 1)
- Balances visual appeal with scannability
- Matches "classy, timeless" aesthetic preference
- Works with existing design system tokens
- WCAG AAA compliant with proper contrast
- Fast to implement and iterate on

---

## Visual Design Specification

### 1. Modal Structure

**Dimensions:**
```
Width: 600px (max-width)
Max Height: 85vh
Padding: 0 (handled by child elements)
Border Radius: var(--radius-lg)
Background: var(--color-bg-elevated)
Shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)
```

**Header Layout:**
```
[Logo Badge 40x40] [Modal Title "Import to Gmail"] ..................... [× Close]
Padding: 20px 24px
Border Bottom: 1px solid var(--color-border)
```

**Body Layout:**
```
Padding: 24px
Max Height: calc(85vh - 80px) /* Account for header */
Overflow: auto
```

### 2. Typography Hierarchy

```css
Modal Title:     24px, font-weight 700, color: var(--color-text-primary)
Time Estimate:   14px, font-weight 400, color: var(--color-text-secondary)
Step Numbers:    24px in 48x48px circles, white on brand color
Step Title:      16px, font-weight 500, color: var(--color-text-primary)
Step Detail:     14px, font-weight 400, color: var(--color-text-secondary)
Tip Box Text:    14px, font-weight 400, color: var(--color-text-primary)
```

### 3. Color System & Email Client Branding

**Brand Colors Per Client:**
```
Zoho Mail:   Primary: #E42527 (Zoho Red),    Secondary: #FEE2E2
Zoho Desk:   Primary: #E42527 (Zoho Red),    Secondary: #FEE2E2
Gmail:       Primary: #EA4335 (Gmail Red),   Secondary: #FEEAE9
Apple Mail:  Primary: #007AFF (Apple Blue),  Secondary: #E5F1FF
Outlook:     Primary: #0078D4 (Outlook Blue), Secondary: #E5F2FF
```

**Logo Badges:**
- Size: 40x40px
- Format: SVG preferred (crisp at all sizes)
- Position: Left of modal title with 12px gap
- Sources:
  - Zoho Mail: Scale down existing `assets/mail-full.svg`
  - Gmail: Simple Icons library (existing third-party logo)
  - Apple Mail: Create simple envelope icon SVG
  - Outlook: Simple Icons or Microsoft Fluent icons

**WCAG AAA Contrast:**
```
Modal title on background:  11:1 minimum
Step text on background:    11:1 minimum
Secondary text:             7:1 minimum
Link text:                  7:1 minimum (underlined)
```

**Step Number Circles:**
```css
Background: Brand color (e.g., #E42527 for Zoho)
Number: White (#FFFFFF) - ensures 4.5:1+ contrast
Size: 48x48px
Border Radius: 50%
Drop Shadow: 0 2px 4px rgba(0,0,0,0.1)
```

**Tip Box Color Coding:**
```css
💡 Pro Tip:  Background: #EFF6FF, Border-left: 4px solid #3B82F6 (blue)
⚠️ Warning:  Background: #FFFBEB, Border-left: 4px solid #F59E0B (amber)
✅ Success:  Background: #F0FDF4, Border-left: 4px solid #10B981 (green)
```

**Interactive States:**
```css
Links:
  - Default: Underlined, color: brand primary
  - Hover: Opacity 0.8, no color change
  - Focus: 2px solid ring, brand color at 50% opacity
```

---

## Component Design

### Step Component

**HTML Structure:**
```html
<li class="instruction-step">
  <div class="step-number" aria-hidden="true">1</div>
  <div class="step-content">
    <div class="step-title">Click the <strong>Copy Signature</strong> button</div>
    <div class="step-detail">This copies both HTML and plain text to your clipboard</div>
  </div>
</li>
```

**CSS:**
```css
.instruction-step {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  animation: fadeInUp 0.3s ease forwards;
  opacity: 0;
}

.step-number {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: var(--step-color, #E42527);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.step-content {
  flex: 1;
  padding-top: 4px; /* Align with circle center */
}

.step-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.step-detail {
  font-size: 14px;
  color: var(--color-text-secondary);
}
```

### Keyboard Shortcut Component

**HTML:**
```html
Paste using <kbd>Cmd+V</kbd> (Mac) or <kbd>Ctrl+V</kbd> (Windows)
```

**CSS:**
```css
kbd {
  display: inline-block;
  padding: 4px 8px;
  font-family: ui-monospace, monospace;
  font-size: 13px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
```

### Tip Box Component

**HTML:**
```html
<div class="tip-box-new pro-tip" role="note">
  <span class="tip-icon" aria-label="Pro tip">💡</span>
  <div class="tip-content">
    <strong>Pro Tip:</strong> Logo not showing? Check your internet connection — the logo loads from Zoho's servers.
  </div>
</div>
```

**CSS:**
```css
.tip-box-new {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border-left: 4px solid var(--tip-color);
  background: var(--tip-bg);
  margin-top: 24px;
}

.tip-box-new.pro-tip {
  --tip-color: #3B82F6;
  --tip-bg: #EFF6FF;
}

.tip-box-new.warning {
  --tip-color: #F59E0B;
  --tip-bg: #FFFBEB;
}

.tip-box-new.success {
  --tip-color: #10B981;
  --tip-bg: #F0FDF4;
}

.tip-icon {
  font-size: 20px;
  line-height: 1;
}

.tip-content {
  flex: 1;
  font-size: 14px;
  color: var(--color-text-primary);
}
```

---

## Content Structure & Writing Guidelines

### Information Hierarchy (Top to Bottom)

1. **Modal Header**: Logo + Client Name + Close Button
2. **Time Estimate** (optional): "~2 minutes • 6 steps"
3. **Numbered Steps**: Main instructional content
4. **Tip Box**: Pro tips or warnings
5. **Troubleshooting Link** (future): "Having issues? View troubleshooting guide →"

### Content Writing Style

**Action-First:**
- ✅ "Click Settings"
- ❌ "You should click Settings"

**Bold UI Elements:**
- Click the **Settings** icon
- Navigate to **Email Signature**
- Click **Save Changes**

**Keyboard Shortcuts Inline:**
- Paste using `<kbd>Cmd+V</kbd>` (Mac) or `<kbd>Ctrl+V</kbd>` (Windows)
- Not: "Paste (Cmd+V or Ctrl+V)"

**Icons for Clarity:**
- ⚙️ for Settings
- 📧 for email actions
- 💾 for Save

**No Unnecessary Words:**
- ✅ "Click Save"
- ❌ "Click on the Save button"

### Step Complexity Handling

**Simple Steps:**
```
Just the action: "Click Save"
```

**Complex Steps:**
```
Action + context: "Scroll to Signature section — it's near the bottom of the page"
```

**Multi-Part Steps:**
```
Use em dashes or sub-bullets:
"Open Gmail and click ⚙️ Settings → See all settings"
```

---

## Content Improvements - Before/After Examples

### Zoho Mail Instructions

**Before:**
```
Step 2: Open Zoho Mail and click the Settings icon (gear ⚙️) in the top-right corner
Step 6: Paste your signature using Ctrl+V (Windows) or Cmd+V (Mac)
💡 Pro Tip: If the logo doesn't appear, make sure you're connected to the internet.
```

**After:**
```
Open Zoho Mail and click ⚙️ Settings in the top-right corner
Paste your signature using <kbd>Cmd+V</kbd> (Mac) or <kbd>Ctrl+V</kbd> (Windows)
💡 Pro Tip: Logo not showing? Check your internet connection — the logo loads from Zoho's servers.
```

### Gmail Instructions

**Before:**
```
Import to Gmail (dark text on dark blue - unreadable)
1. Click the Copy Signature button
2. Open Gmail and click the gear icon (⚙️) → See all settings
```

**After:**
```
Import to Gmail (proper contrast, Gmail logo badge in header)
~2 minutes • 6 steps

1. Click the Copy Signature button
2. Open Gmail and click ⚙️ Settings → See all settings
```

---

## Accessibility Specification

### ARIA Labels & Roles

**Modal:**
```html
<div id="import-modal" class="modal" role="dialog" aria-labelledby="modalTitle" aria-hidden="true">
```

**Time Estimate:**
```html
<div class="modal-time-estimate" aria-label="Estimated time 2 minutes, 6 steps total">
  ~2 minutes • 6 steps
</div>
```

**Step List:**
```html
<ol class="instruction-steps" aria-label="Import instructions">
  <li class="instruction-step">
    <div class="step-number" aria-hidden="true">1</div>
    <div class="step-content">...</div>
  </li>
</ol>
```

**Tip Box:**
```html
<div class="tip-box-new pro-tip" role="note">
  <span class="tip-icon" aria-label="Pro tip">💡</span>
  ...
</div>
```

### Keyboard Navigation

- **Tab**: Navigate through focusable elements
- **Escape**: Close modal
- **Focus trap**: Prevent tabbing outside modal when open
- **Focus restoration**: Return focus to trigger button on close

### Screen Reader Support

- Step numbers announced as "Step 1 of 6"
- Tip boxes announced with role="note"
- Logo badges have alt text: "Gmail logo"
- Close button has aria-label="Close modal"

---

## Responsive Design

### Breakpoints

**Desktop (640px+):**
```css
.modal-content {
  width: 600px;
  max-height: 85vh;
}

.step-number {
  width: 48px;
  height: 48px;
  font-size: 24px;
}
```

**Mobile (< 640px):**
```css
.modal-content {
  width: 95vw;
  max-height: 90vh;
  margin: 20px;
}

.modal-header-with-logo {
  flex-wrap: wrap; /* Logo and title stack if needed */
}

.step-number {
  width: 40px;
  height: 40px;
  font-size: 20px;
}

.step-title {
  font-size: 15px;
}

.step-detail {
  font-size: 13px;
}

.modal-logo-badge {
  width: 32px;
  height: 32px;
}
```

---

## Animation & Polish

### Staggered Step Animation

```css
.instruction-step {
  animation: fadeInUp 0.3s ease forwards;
  opacity: 0;
}

.instruction-step:nth-child(1) { animation-delay: 0.05s; }
.instruction-step:nth-child(2) { animation-delay: 0.1s; }
.instruction-step:nth-child(3) { animation-delay: 0.15s; }
.instruction-step:nth-child(4) { animation-delay: 0.2s; }
.instruction-step:nth-child(5) { animation-delay: 0.25s; }
.instruction-step:nth-child(6) { animation-delay: 0.3s; }
.instruction-step:nth-child(7) { animation-delay: 0.35s; }
.instruction-step:nth-child(8) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Disable animation for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .instruction-step {
    animation: none;
    opacity: 1;
  }
}
```

### Modal Open Animation

```css
.modal.active .modal-content {
  animation: modalFadeUp 0.3s ease;
}

@keyframes modalFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

---

## Asset Requirements

### Logo Files Needed

**Zoho Mail:**
- File: Scale down existing `assets/mail-full.svg` to 40x40px
- Already available

**Zoho Desk:**
- File: Scale down existing `assets/desk-full.svg` to 40x40px
- Already available

**Gmail:**
- File: `assets/gmail-logo.svg` (40x40px)
- Source: Simple Icons library or current third-party logos
- Colors: Gmail red #EA4335

**Apple Mail:**
- File: `assets/apple-mail-logo.svg` (40x40px)
- Create simple envelope icon with Apple blue
- Alternative: Use SF Symbols if available

**Outlook:**
- File: `assets/outlook-logo.svg` (40x40px)
- Source: Simple Icons or Microsoft Fluent icons
- Colors: Outlook blue #0078D4

---

## Implementation Plan

### Phase 1: CSS Foundation (~1 hour)

1. Add new CSS classes to `css/styles.css`:
   - `.modal-header-with-logo`
   - `.modal-logo-badge`
   - `.modal-time-estimate`
   - `.instruction-steps` (replace `.instruction-section ol`)
   - `.instruction-step`
   - `.step-number`
   - `.step-content`
   - `.step-title`
   - `.step-detail`
   - `.tip-box-new` (replace `.tip-box`)
   - `kbd` element styling

2. Update responsive breakpoints for mobile

3. Add staggered animation keyframes

### Phase 2: HTML Structure Update (~1 hour)

1. Update modal header in `index.html`:
   - Add logo badge container
   - Wrap title and logo in flex container

2. Update modal body to use new step structure:
   - Change from current format to new `<ol>` with `.instruction-step`

### Phase 3: JavaScript Content Update (~1.5 hours)

1. Update `js/modal.js` → `getClientInstructions()`:
   - Add logo badge HTML for each client
   - Add time estimates
   - Rewrite step content (remove "Step X:" prefixes)
   - Add keyboard shortcut `<kbd>` tags
   - Update tip boxes with new structure

2. Add CSS custom properties per client:
   - Inject `--step-color` based on email client
   - Inject logo badge image

### Phase 4: Logo Assets (~30 minutes)

1. Create/source logo SVG files
2. Add to `assets/` directory
3. Test rendering in modal header

### Phase 5: Testing & Polish (~30 minutes)

1. Test all 5 email client modals (Zoho Mail, Zoho Desk, Gmail, Apple Mail, Outlook)
2. Verify WCAG AAA contrast with browser DevTools
3. Test keyboard navigation and screen reader
4. Test responsive behavior on mobile (320px - 640px)
5. Verify animations respect `prefers-reduced-motion`

---

## File Changes

### Files to Modify

```
css/styles.css           - Add new CSS classes, update modal styles
js/modal.js              - Update getClientInstructions() content
index.html               - Update modal header structure (add logo badge container)
```

### Files to Create

```
assets/gmail-logo.svg       - Gmail logo 40x40px
assets/apple-mail-logo.svg  - Apple Mail logo 40x40px
assets/outlook-logo.svg     - Outlook logo 40x40px
```

### Files Already Available

```
assets/mail-full.svg        - Zoho Mail (scale to 40x40px)
assets/desk-full.svg        - Zoho Desk (scale to 40x40px)
```

---

## Testing Checklist

### Visual Testing

- [ ] All 5 email client modals render correctly
- [ ] Logo badges display at 40x40px
- [ ] Step numbers are circles with brand colors
- [ ] Text contrast passes WCAG AAA (11:1 primary, 7:1 secondary)
- [ ] Keyboard shortcuts styled as `<kbd>` elements
- [ ] Tip boxes have correct colors and left borders
- [ ] Animations are smooth (60fps)

### Accessibility Testing

- [ ] Screen reader announces steps as "Step 1 of 6"
- [ ] Tab navigation works (focus trap in modal)
- [ ] Escape key closes modal
- [ ] Focus returns to trigger button on close
- [ ] `prefers-reduced-motion` disables animations
- [ ] All interactive elements have 44x44px touch targets

### Responsive Testing

- [ ] Desktop (1440px): Modal 600px wide, comfortable spacing
- [ ] Tablet (768px): Modal adapts, still readable
- [ ] Mobile (375px): Modal 95vw, step circles 40px, text scales down
- [ ] Tiny screens (320px): Still functional and readable

### Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Content Quality

- [ ] No "Step X:" prefixes (redundant with numbers)
- [ ] Keyboard shortcuts use `<kbd>` tags
- [ ] Tip boxes provide value (not obvious info)
- [ ] Action-first language ("Click Save" not "You should click Save")
- [ ] UI elements bolded for scannability

---

## Success Metrics

**Contrast Ratios:**
- Current: ~2:1 (Zoho Mail text on background) ❌
- Target: 11:1 (WCAG AAA) ✅

**Scannability:**
- Current: Flat text, hard to scan ❌
- Target: Numbered circles, clear hierarchy ✅

**Visual Branding:**
- Current: No email client logos ❌
- Target: 40x40px logo badges ✅

**Accessibility:**
- Current: Basic keyboard support only ❌
- Target: Full ARIA, screen reader support, WCAG AAA ✅

**Mobile Experience:**
- Current: Small text, cramped spacing ❌
- Target: Responsive typography, touch-friendly ✅

---

## Future Enhancements

**Phase 2 (Post-Launch):**
- [ ] Add screenshots/GIFs showing each step
- [ ] "Having issues?" troubleshooting section
- [ ] Interactive checklist (check off completed steps)
- [ ] "Send test email" button in modal
- [ ] Video tutorials embedded in modal
- [ ] **Dark mode signature text brightness** - Increase `.sig-title` color from #E0E0E0 to #FFFFFF for better contrast (currently too dim/gray, should be strong white like `.sig-name`)
- [ ] **🔍 Competitive Analysis: HubSpot Generator** - Deep research on [HubSpot's email signature generator](https://www.hubspot.com/email-signature-generator) to identify feature gaps:
  - Profile picture uploads (we don't have)
  - Handwritten signature options (we don't have)
  - 12+ templates (we have 4)
  - Plain text output option (we only have HTML)
  - Multi-step wizard UX (we use single form)
  - See what features align with Zoho employee needs

**Phase 3 (Advanced):**
- [ ] Platform-specific instructions (Gmail Web vs Gmail Mobile)
- [ ] Auto-detect user's email client and show relevant modal
- [ ] Export instructions as PDF
- [ ] Multi-language support

---

## Design Validation

### Principles Alignment

✅ **Accessibility First**: WCAG AAA contrast, full ARIA support
✅ **Scannable**: Numbered circles, clear hierarchy, visual anchors
✅ **Professional**: Clean typography, subtle animations, timeless design
✅ **Branded**: Email client logos and brand-appropriate colors
✅ **Consistent**: Uses existing design system tokens (`var(--color-*)`)
✅ **Mobile-Friendly**: Responsive breakpoints, touch targets

### User Needs Met

✅ **New users**: Step-by-step guidance, clear instructions
✅ **Experienced users**: Scannable steps, can jump to relevant section
✅ **Accessibility users**: Screen reader support, keyboard navigation
✅ **Mobile users**: Responsive, touch-friendly, readable on small screens

---

## Appendix: Code Snippets

### Example Modal Content (Zoho Mail)

```javascript
'zoho-mail': {
    title: 'Import to Zoho Mail',
    logo: 'assets/mail-full.svg',
    brandColor: '#E42527',
    body: `
        <div class="modal-header-with-logo">
            <img src="assets/mail-full.svg" alt="Zoho Mail logo" class="modal-logo-badge">
            <div>
                <h2>Import to Zoho Mail</h2>
                <div class="modal-time-estimate" aria-label="Estimated time 2 minutes, 8 steps total">
                    ~2 minutes • 8 steps
                </div>
            </div>
        </div>

        <ol class="instruction-steps" aria-label="Import instructions" style="--step-color: #E42527;">
            <li class="instruction-step">
                <div class="step-number" aria-hidden="true">1</div>
                <div class="step-content">
                    <div class="step-title">Click the <strong>Copy Signature</strong> button</div>
                    <div class="step-detail">This copies both HTML and plain text to your clipboard</div>
                </div>
            </li>

            <li class="instruction-step">
                <div class="step-number" aria-hidden="true">2</div>
                <div class="step-content">
                    <div class="step-title">Open Zoho Mail and click ⚙️ <strong>Settings</strong> in the top-right corner</div>
                </div>
            </li>

            <li class="instruction-step">
                <div class="step-number" aria-hidden="true">3</div>
                <div class="step-content">
                    <div class="step-title">In the left sidebar menu, click <strong>Mail</strong> to expand options</div>
                </div>
            </li>

            <li class="instruction-step">
                <div class="step-number" aria-hidden="true">4</div>
                <div class="step-content">
                    <div class="step-title">Click on <strong>Signature</strong> from the expanded menu</div>
                </div>
            </li>

            <li class="instruction-step">
                <div class="step-number" aria-hidden="true">5</div>
                <div class="step-content">
                    <div class="step-title">Click inside the signature editor box</div>
                </div>
            </li>

            <li class="instruction-step">
                <div class="step-number" aria-hidden="true">6</div>
                <div class="step-content">
                    <div class="step-title">Paste your signature using <kbd>Cmd+V</kbd> (Mac) or <kbd>Ctrl+V</kbd> (Windows)</div>
                </div>
            </li>

            <li class="instruction-step">
                <div class="step-number" aria-hidden="true">7</div>
                <div class="step-content">
                    <div class="step-title">Click <strong>Save</strong> button at the bottom of the page</div>
                </div>
            </li>

            <li class="instruction-step">
                <div class="step-number" aria-hidden="true">8</div>
                <div class="step-content">
                    <div class="step-title">Compose a test email to verify the signature looks correct</div>
                </div>
            </li>
        </ol>

        <div class="tip-box-new pro-tip" role="note">
            <span class="tip-icon" aria-label="Pro tip">💡</span>
            <div class="tip-content">
                <strong>Pro Tip:</strong> Logo not showing? Check your internet connection — the logo loads from Zoho's servers.
            </div>
        </div>
    `
}
```

---

**End of Design Document**

**Status:** ✅ Design Complete - Ready for Implementation
**Next Steps:** Create implementation plan, set up git worktree, begin Phase 1 (CSS Foundation)
