# CSS Architecture Documentation - Zoho Signature Generator

**Created**: 2026-01-26
**Purpose**: Complete map of current CSS before any refactoring attempts
**Status**: Current working version (commit 45aa368)

---

## Executive Summary

**TL;DR**: This project has **3 different input layout patterns** causing maintenance complexity and refactoring risks. The CSS is 2163 lines with overlapping specificity rules. This document maps everything to enable safe, incremental fixes.

**Why this document exists**: The January 26, 2026 session attempted a big-bang refactoring without full understanding of the CSS architecture, resulting in broken layouts and a forced rollback. This document ensures we never make that mistake again.

**Critical insight**: The three patterns aren't just different visually - they have different HTML structures, specificity hierarchies, and focus behaviors. Any consolidation must account for ALL these differences.

---

## The Three Input Patterns

### Pattern 1: Regular Inputs (.input-wrapper)

**Used by**: Name, Title, Department, Phone (4 fields)
**CSS Location**: Lines 349-539
**HTML Structure**:
```html
<div class="input-wrapper">
  <input type="text" placeholder="John Doe">
  <button class="clear-btn">×</button>
  <span class="validation-icon"></span>
</div>
```

**Key CSS Rules**:
- **Container** (`.input-wrapper`):
  - `position: relative` - Enables absolute positioning of child elements
  - `display: flex` - Horizontal layout for input + icons
  - `align-items: center` - Vertical centering
  - `flex: 1` - Takes full available width in grid
  - **NO BORDER** on container itself

- **Input** (`.input-wrapper input[type="text/email/tel/url"]`):
  - `width: 100%` - Fills container
  - `padding: 0.625rem 32px 0.625rem 0.875rem` - Fixed right padding for icons
  - **BORDER**: `1px solid var(--color-border)` ⚠️ This is the source of double-border issues!
  - `border-radius: var(--radius-md)` - 10px rounded corners
  - `min-height: 42px` - Touch-friendly
  - `background: #FFFFFF` - Always white (even in dark mode preview)
  - `color: #333333` - Dark text

**Focus States**:
```css
/* Line 484 */
.input-wrapper input:focus {
    border-color: var(--zoho-red);
    box-shadow: 0 0 0 3px var(--zoho-red-light);
    outline: none;
}
```

**Validation States**:
```css
/* Invalid (lines 491-498) */
.input-wrapper input:invalid:not(:placeholder-shown):not(:focus) {
    border-color: var(--color-error);
}

.input-wrapper input:invalid:not(:placeholder-shown):focus {
    border-color: var(--color-error);
    box-shadow: 0 0 0 3px var(--color-error-light);
}

/* Valid (lines 501-503) */
.input-wrapper input:valid:not(:placeholder-shown):not(:focus) {
    border-color: var(--color-success);
}
```

**Disabled States** (lines 412-420):
```css
.input-wrapper input[type="text"]:disabled,
.input-wrapper input[type="email"]:disabled,
.input-wrapper input[type="tel"]:disabled,
.input-wrapper input[type="url"]:disabled {
    background: #F3F4F6;
    color: #9CA3AF;
    cursor: not-allowed;
    border-color: #E5E7EB;
}
```

**Child Elements**:
- **Clear Button** (`.clear-btn`, lines 510-539):
  - `position: absolute; right: 0.5rem` - Positioned in right padding
  - `min-width: 44px; min-height: 44px` - WCAG AA touch target
  - `opacity: 0` by default, `opacity: 1` when input has value
  - `pointer-events: none` → `pointer-events: auto` on show

- **Validation Icon** (`.validation-icon`, lines in app.js):
  - Positioned in right padding area
  - Shows green ✓ or red ✗
  - Managed by JavaScript (not pure CSS)

**Specificity Hierarchy**:
1. `.input-wrapper input[type="text"]` (0,0,2,1) - Base styles
2. `.input-wrapper input:focus` (0,0,2,1) - Focus state
3. `.input-wrapper input:invalid:not(:placeholder-shown):not(:focus)` (0,0,4,1) - Higher specificity
4. `.input-wrapper input[aria-invalid="true"]` (0,0,2,1) - ARIA override (lines 2084-2096)

---

### Pattern 2: Email Split Input (.email-split-input)

**Used by**: Email field only (1 field)
**CSS Location**: Lines 1151-1187
**HTML Structure**:
```html
<div class="email-split-input">
  <input type="text" class="email-prefix-field" placeholder="firstname.lastname">
  <span class="email-domain-suffix">@zohocorp.com</span>
  <span class="validation-icon"></span>
</div>
```

**Key CSS Rules**:
- **Container** (`.email-split-input`):
  - `display: flex` - Horizontal layout
  - `align-items: center` - Vertical centering
  - **BORDER**: `1px solid var(--color-border)` ⚠️ Border on container, NOT on input
  - `border-radius: var(--radius-md)` - 10px rounded corners
  - `background: white` - White background
  - `overflow: hidden` - Clips children to border-radius
  - `flex: 1` - Takes full available width

**Critical Difference from Pattern 1**:
- ✅ Border on **container** (.email-split-input)
- ❌ NO border on **input** (.email-prefix-field)

**Focus States**:
```css
/* Line 1162 */
.email-split-input:focus-within {
    border-color: var(--zoho-red);
    box-shadow: 0 0 0 3px var(--zoho-red-light);
}
```
**Note**: Uses `:focus-within` on container, not `:focus` on input!

**Child Elements**:
- **Input** (`.email-prefix-field`, lines 1167-1176):
  - `flex: 1` - Takes available space
  - **NO BORDER** - Container provides border
  - `padding: 0.625rem 0.5rem 0.625rem 0.875rem` - Different padding than Pattern 1
  - `outline: none` - Suppressed because container handles focus
  - `background: transparent` - Shows container background
  - `min-height: 38px` - 4px shorter than Pattern 1 (42px)

- **Suffix** (`.email-domain-suffix`, lines 1178-1186):
  - `padding: 0.625rem 32px 0.625rem 0.5rem` - Matches validation icon space
  - `color: #999` - Gray text
  - `background: #F5F5F5` - Light gray background
  - `border-left: 1px solid #E0E0E0` - Separator
  - `font-family: monospace` - Fixed-width font
  - `white-space: nowrap` - Prevents wrapping

**Specificity Hierarchy**:
1. `.email-split-input` (0,0,1,0) - Container base
2. `.email-split-input:focus-within` (0,0,1,1) - Focus state
3. `.email-prefix-field` (0,0,1,0) - Input base

**Why Different**:
- Email validation requires domain enforcement (@zohocorp.com)
- User only types prefix, not full email
- Suffix must be visually distinct (gray background)

---

### Pattern 3: URL Prefix Input (.url-prefix-input)

**Used by**: LinkedIn, Twitter (X), Bookings (3 fields)
**CSS Location**: Lines 1304-1340
**HTML Structure**:
```html
<div class="url-prefix-input">
  <span class="url-prefix">linkedin.com/in/</span>
  <input type="text" class="url-username-field" placeholder="username">
  <span class="validation-icon"></span>
</div>
```

**Key CSS Rules**:
- **Container** (`.url-prefix-input`):
  - `display: flex` - Horizontal layout
  - `align-items: center` - Vertical centering
  - **BORDER**: `1px solid var(--color-border)` ⚠️ Border on container, NOT on input (same as Pattern 2)
  - `border-radius: var(--radius-md)` - 10px rounded corners
  - `background: white` - White background
  - `overflow: hidden` - Clips children to border-radius
  - `flex: 1` - Takes full available width

**Critical Difference from Pattern 1**:
- ✅ Border on **container** (.url-prefix-input)
- ❌ NO border on **input** (.url-username-field)
- ✅ Prefix on **left** (opposite of email suffix on right)

**Focus States**:
```css
/* Line 1315 */
.url-prefix-input:focus-within {
    border-color: var(--zoho-red);
    box-shadow: 0 0 0 3px var(--zoho-red-light);
}
```
**Note**: Uses `:focus-within` on container (same as Pattern 2)

**Child Elements**:
- **Prefix** (`.url-prefix`, lines 1320-1328):
  - `padding: 0.625rem 0.5rem 0.625rem 0.875rem` - Left-aligned padding
  - `font-size: 13px` - Smaller than input text (0.95rem)
  - `color: #999` - Gray text
  - `background: #F5F5F5` - Light gray background (matches email suffix)
  - `border-right: 1px solid #E0E0E0` - Separator (opposite side from email)
  - `font-family: monospace` - Fixed-width font
  - `white-space: nowrap` - Prevents wrapping

- **Input** (`.url-username-field`, lines 1330-1339):
  - `flex: 1` - Takes available space
  - **NO BORDER** - Container provides border
  - `padding: 0.625rem 32px 0.625rem 0.875rem` - Matches Pattern 1 padding!
  - `outline: none` - Suppressed because container handles focus
  - `background: transparent` - Shows container background
  - `min-height: 38px` - 4px shorter than Pattern 1 (42px), matches Pattern 2

**Specificity Hierarchy**:
1. `.url-prefix-input` (0,0,1,0) - Container base
2. `.url-prefix-input:focus-within` (0,0,1,1) - Focus state
3. `.url-username-field` (0,0,1,0) - Input base

**Why Different**:
- User only types username/ID, not full URL
- Prefix (linkedin.com/in/, x.com/, etc.) must be visually distinct
- Cleaner UX than making user type full URL
- JavaScript constructs full URL from prefix + user input

---

## Pattern Comparison Table

| Feature | Pattern 1 (Regular) | Pattern 2 (Email) | Pattern 3 (URL) |
|---------|-------------------|------------------|----------------|
| **Fields** | Name, Title, Dept, Phone | Email only | LinkedIn, X, Bookings |
| **Border location** | ❌ Input element | ✅ Container | ✅ Container |
| **Focus pseudo-class** | `:focus` on input | `:focus-within` on container | `:focus-within` on container |
| **Input min-height** | 42px | 38px | 38px |
| **Input border** | Yes (1px solid) | No (transparent) | No (transparent) |
| **Input outline** | Default (shows on focus) | None (suppressed) | None (suppressed) |
| **Container overflow** | visible | hidden | hidden |
| **Prefix/suffix** | None | Suffix (right, @zohocorp.com) | Prefix (left, URL) |
| **Prefix/suffix style** | N/A | Gray bg, border-left | Gray bg, border-right |
| **Clear button** | Yes | No | No |
| **Validation icon** | Yes (JS-managed) | Yes (JS-managed) | Yes (JS-managed) |

---

## The Double Border Problem

**Issue Location**: css/styles.css lines 349-369, 493-514

**Root Cause**: Pattern 1 applies border to **both** container and input:

```css
/* Line 349 - Container (NO border here) */
.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
    /* NO border property */
}

/* Line 363 - Input (HAS border) */
.input-wrapper input[type="text"] {
    border: 1px solid var(--color-border);  /* ⚠️ Border on input */
    border-radius: var(--radius-md);
}

/* Lines 484-498 - Focus/validation states also add borders */
.input-wrapper input:focus {
    border-color: var(--zoho-red);  /* Changes existing border */
}
```

**Why This Breaks**:
1. When input has border + border-radius, corners render on input
2. When container has padding/spacing, input border doesn't align with container edges
3. Validation states change input border, but container doesn't know about it
4. Clear button overlaps border area, creating visual artifacts

**Patterns 2 & 3 Avoid This**:
- Border on **container** only (`.email-split-input`, `.url-prefix-input`)
- Input has **NO border** (`.email-prefix-field`, `.url-username-field`)
- Focus state uses `:focus-within` on container
- Clean rounded corners because container clips children (`overflow: hidden`)

**Why Pattern 1 Wasn't Fixed Earlier**:
- It works "well enough" visually (border isn't obviously doubled)
- Focus states function correctly (red border shows)
- Only becomes apparent when trying to refactor to unified system
- Refactoring revealed the architectural inconsistency

---

## Specificity Conflicts & Cascade Issues

### Problem Areas

**1. Input Type Selectors** (lines 356-369):
```css
.input-wrapper input[type="text"],
.input-wrapper input[type="email"],
.input-wrapper input[type="tel"],
.input-wrapper input[type="url"] {
    /* Base styles */
}
```
**Issue**: Specificity (0,0,2,1) - Attribute selector adds complexity
**Why**: Need to override for different input types
**Consequence**: Hard to add new input type without duplicating selectors

**2. Pseudo-Class Chains** (lines 491-503):
```css
/* Specificity: 0,0,4,1 */
.input-wrapper input:invalid:not(:placeholder-shown):not(:focus) {
    border-color: var(--color-error);
}
```
**Issue**: Very high specificity due to multiple pseudo-classes
**Why**: Need precise control over when validation shows
**Consequence**: Hard to override without !important or longer chain

**3. ARIA Overrides** (lines 2084-2096):
```css
/* Specificity: 0,0,2,1 */
.input-wrapper input[aria-invalid="true"] {
    border-color: var(--color-error);
}
```
**Issue**: JavaScript sets aria-invalid, CSS must respond
**Conflict**: Lower specificity than pseudo-class chains
**Consequence**: :invalid:not() rules may override ARIA state

**4. Focus-Within vs Focus** (lines 484, 1162, 1315):
```css
/* Pattern 1 - Specificity: 0,0,2,1 */
.input-wrapper input:focus { }

/* Patterns 2 & 3 - Specificity: 0,0,1,1 */
.email-split-input:focus-within { }
.url-prefix-input:focus-within { }
```
**Issue**: Different pseudo-classes for same behavior
**Why**: Pattern 1 focuses input, Patterns 2/3 focus container
**Consequence**: Can't consolidate without HTML changes

---

## Grid Layout & Help System Interactions

**Form Row Grid** (lines 254-289):
```css
.form-row {
    display: grid;
    grid-template-columns: 140px 1fr auto;  /* Label | Input | Help Icon */
    gap: 12px;
    align-items: start;
}
```

**Critical Behaviors**:
1. **Column 1** (140px fixed): Labels
2. **Column 2** (1fr flexible): Input wrappers (all 3 patterns)
3. **Column 3** (auto): Help icons (24px + 8px margin = 32px)

**Help Icon Shifting Problem** (NEXT-STEPS.md Issue B):
- **Root cause**: Column 3 is `auto` width, not fixed
- **When help panel opens**: Grid recalculates column widths
- **Result**: Help icon shifts left as panel takes space
- **Why it happens**: `grid-column: 1 / -1` on `.help-panel` spans all columns
- **Solution options**:
  1. Fix column 3 to `32px` instead of `auto`
  2. Remove help icon from grid (absolute positioning)
  3. Help panel overlays grid (position: absolute on panel)

**Help Panel** (lines 1225-1230):
```css
.help-panel {
    grid-column: 1 / -1;  /* Spans all columns */
    background: #333;
    color: white;
    padding: 0;  /* Collapsed state */
    margin: 0;
}
```

**Expanded State** (lines 1237-1247):
```css
.help-panel.expanded {
    padding: 16px;
    margin-top: 8px;
    max-height: 500px;
    opacity: 1;
    animation: slideDown 0.2s ease-out;
}
```

**Why This Causes Shifts**:
- Expanded panel pushes subsequent rows down (correct)
- But also affects column sizing because it spans grid columns (bug)
- Auto-width column 3 recalculates based on available space

---

## Validation Icon System

**Implementation**: JavaScript-managed (not pure CSS)
**Location**: js/app.js lines 1416-1426 (per NEXT-STEPS.md)

**Current Behavior**:
- Green ✓ checkmark shows for valid fields
- Red ✗ shows for invalid fields
- Icon positioned in input's right padding area (32px)

**CSS Support** (implied, not explicit rules):
```css
.validation-icon {
    position: absolute;
    right: 8px;  /* Positioned in 32px padding */
    /* Styles managed by JavaScript */
}
```

**Problem** (NEXT-STEPS.md Issue C):
- Shows green checkmark for ALL valid inputs
- User finds this excessive/unnecessary
- Preference: Only show errors (red ✗), hide success indicators

**Why Green Checkmarks Exist**:
- Positive reinforcement for correct input
- Accessibility: Visual confirmation field is valid
- Standard pattern in many forms (Stripe, Material Design)

**User Preference**:
- Minimal validation UI
- Only show problems, not successes
- Less visual clutter

---

## Dark Mode Implementation

**Scope**: Only affects signature preview, NOT form UI

**Body Class Toggle** (lines 36-47):
```css
body {
    color: #333333;
    background: #FFFFFF;
}

body.dark-mode {
    color: #F5F5F5;
    background: #1A1A1A;
}
```

**Form UI**: Always light background (intentional)
- Input backgrounds: Always `#FFFFFF`
- Labels: Always dark text `#333333`
- No dark mode variants for form elements

**Preview Section**: Responds to dark mode
- Signature background changes
- Text colors invert
- Logo swaps (light/dark versions)

**Why Form Stays Light**:
- Consistency with design tools (Figma, Canva stay light)
- Better readability for form inputs
- Dark mode is for signature preview only (mimics email client)

---

## File Size & Organization

**Total Lines**: 2163 lines (css/styles.css)

**Breakdown by Section**:
1. Imports & Reset (1-38): 38 lines
2. Layout Container & Sidebar (39-150): 111 lines
3. Form Sections & Rows (151-348): 197 lines
4. **Pattern 1: Regular Inputs** (349-539): 190 lines
5. Toggle Switches (540-630): 90 lines
6. Social Cards & Grid (631-850): 219 lines
7. Buttons & Controls (851-1150): 299 lines
8. **Pattern 2: Email Split** (1151-1187): 36 lines
9. Help System (1188-1303): 115 lines
10. **Pattern 3: URL Prefix** (1304-1340): 36 lines
11. Preview Section (1341-1700): 359 lines
12. Signature Styles (1701-2000): 299 lines
13. Dark Mode Overrides (2001-2163): 162 lines

**Duplication Estimates**:
- Pattern overlaps: ~100 lines (border, focus, padding rules)
- Validation states: ~50 lines (repeated across patterns)
- Disabled states: ~30 lines (repeated type selectors)
- Focus states: ~40 lines (different pseudo-classes, same intent)

**Total Potential Reduction**: ~220 lines (10% of file)

**Refactoring Risk**: HIGH
- Patterns have different HTML structures (can't unify CSS without HTML changes)
- Specificity conflicts make atomic changes risky
- Grid layout interactions hard to predict
- Previous refactoring attempt broke 8+ visual behaviors

---

## Dependencies & External Imports

**Design System Tokens** (line 9):
```css
@import '../.ui-design/tokens/tokens.css';
```

**Provides**:
- Color variables: `var(--color-border)`, `var(--color-error)`, etc.
- Spacing scale: `var(--spacing-xs)`, `var(--spacing-sm)`, etc.
- Typography: `var(--font-family-sans)`, `var(--line-height-normal)`
- Shadows, transitions, radii

**Local Overrides** (lines 23-28):
```css
:root {
    --radius-sm: 6px;   /* Default: 4px */
    --radius-md: 10px;  /* Default: 8px */
    --radius-lg: 16px;  /* Default: 12px */
}
```

**Why Overrides Exist**:
- Design system defaults too subtle
- Zoho brand prefers more pronounced rounded corners
- Signature templates need consistent radii

**Breaking Change Risk**:
- If token file changes variable names, styles.css breaks
- No automated checks for variable existence
- Manual testing required after token updates

---

## Browser Compatibility Notes

**Target**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge)

**Modern Features Used**:
- CSS Grid (`display: grid`) - Well supported
- Flexbox (`display: flex`) - Well supported
- Custom Properties (`var(--name)`) - Well supported
- `:focus-within` - Well supported (IE11 needs polyfill, but not targeted)
- Attribute selectors (`[type="text"]`) - Well supported
- `:not()` pseudo-class - Well supported

**No Fallbacks For**:
- IE11 (not supported)
- Legacy Edge (pre-Chromium)
- Mobile Safari < 14

**Email Client Compatibility**:
- Signature HTML must work in Gmail, Outlook, Apple Mail
- Uses table-based layouts (not CSS Grid)
- Inline styles only (external CSS not supported)
- Different CSS subset than form UI

---

## Testing Strategy Gaps

**Current Testing**: Manual browser testing only

**What's Not Tested**:
- Automated visual regression (no baseline screenshots)
- CSS specificity conflicts (manual inspection only)
- Grid layout edge cases (help panel expansion, field toggling)
- Focus order during Tab/Shift+Tab (manual keyboard testing only)
- Email client rendering (manual copy-paste to Gmail/Outlook)

**Why Testing Failed in Last Session**:
- No baseline screenshots to compare against
- Manual testing missed:
  - Double borders (subtle visual artifact)
  - Help icon shifting (only visible when panel opens)
  - Focus state edge cases (specific key sequences)
  - Grid layout recalculations (async CSS changes)

**What Would Have Prevented Failure**:
1. Baseline screenshots of all form states
2. Screenshot comparison after each incremental change
3. Automated CSS regression tests (Percy, BackstopJS)
4. Explicit test checklist for all 3 patterns

---

## Recommendations for Future Refactoring

### DO
1. ✅ **Document FIRST, change SECOND** (this document proves it)
2. ✅ **Take baseline screenshots before any change**
3. ✅ **Fix one issue at a time** (double borders → help icons → validation)
4. ✅ **Test thoroughly between each change** (not just at the end)
5. ✅ **Commit after each working fix** (small, revertable commits)
6. ✅ **Use specificity calculator** (https://specificity.keegan.st/)
7. ✅ **Check grid impact** (inspect with DevTools grid overlay)

### DON'T
1. ❌ **Don't change HTML + CSS simultaneously** (too many variables)
2. ❌ **Don't assume "simple CSS changes" are simple** (they never are)
3. ❌ **Don't trust memory** (document everything, verify everything)
4. ❌ **Don't skip baseline screenshots** (can't verify fixes without them)
5. ❌ **Don't commit broken states** (even temporarily)
6. ❌ **Don't refactor without understanding cascade** (specificity surprises)
7. ❌ **Don't test only happy path** (focus states, validation, edge cases matter)

### Incremental Path Forward

**Phase 1: Fix Issues in Current Architecture** (don't consolidate patterns yet)
1. Fix double borders (remove input border, keep wrapper visual border via box-shadow)
2. Fix help icon shifting (change grid column 3 from `auto` to `32px`)
3. Fix unnecessary checkmarks (JavaScript change: only show errors)

**Phase 2: Set Up Testing Infrastructure**
1. Take baseline screenshots (all fields, all states, light/dark)
2. Set up screenshot comparison workflow (manual or automated)
3. Document test cases (focus sequences, validation combinations)

**Phase 3: Consolidate Patterns** (only after Phase 1 & 2 complete)
1. Choose target pattern (likely Pattern 2/3 approach: border on container)
2. Migrate one field at a time (not all 8 simultaneously)
3. Test each migration thoroughly before next field
4. Keep commits small and revertable

**Phase 4: Reduce Duplication** (only after Phase 3 complete)
1. Extract common validation styles
2. Consolidate focus states
3. Remove unused rules
4. Simplify specificity (flatten pseudo-class chains)

---

## Visual Diagrams

### Pattern 1: Regular Input (DOM Structure)
```
┌─ .form-row (grid: 140px 1fr auto) ─────────────────┐
│                                                      │
│  [Label]          [.input-wrapper]          [Help]  │
│  (140px)          (flex: 1)                 (auto)  │
│                   ┌─────────────────────┐            │
│                   │ <input> (border)    │ [×] [✓]   │
│                   └─────────────────────┘            │
│                   Border on INPUT                    │
└──────────────────────────────────────────────────────┘
```

### Pattern 2: Email Split Input (DOM Structure)
```
┌─ .form-row (grid: 140px 1fr auto) ─────────────────────┐
│                                                          │
│  [Label]          [.email-split-input]          [Help]  │
│  (140px)          (flex: 1, border on container) (auto) │
│                   ┌──────────────┬────────────┐         │
│                   │ <input>      │ @zoho...   │ [✓]     │
│                   │ (no border)  │ (suffix)   │         │
│                   └──────────────┴────────────┘         │
│                   Border on CONTAINER                    │
└──────────────────────────────────────────────────────────┘
```

### Pattern 3: URL Prefix Input (DOM Structure)
```
┌─ .form-row (grid: 140px 1fr auto) ─────────────────────┐
│                                                          │
│  [Label]          [.url-prefix-input]           [Help]  │
│  (140px)          (flex: 1, border on container) (auto) │
│                   ┌────────────┬──────────────┐         │
│                   │ linkedin.. │ <input>      │ [✓]     │
│                   │ (prefix)   │ (no border)  │         │
│                   └────────────┴──────────────┘         │
│                   Border on CONTAINER                    │
└──────────────────────────────────────────────────────────┘
```

### Grid Layout with Help Panel Expansion
```
BEFORE (Collapsed):
┌─────────────────────────────────────────────┐
│ [Label 140px] [Input 1fr] [Help Icon auto] │
│ [Label 140px] [Input 1fr] [Help Icon auto] │
└─────────────────────────────────────────────┘

AFTER (Expanded):
┌─────────────────────────────────────────────┐
│ [Label 140px] [Input 1fr] [Help Icon auto] │ ← Icon shifts left!
│ [────── Help Panel (grid-column: 1/-1) ───] │
│ [Label 140px] [Input 1fr] [Help Icon auto] │
└─────────────────────────────────────────────┘

WHY: Auto-width column recalculates when help panel spans columns
FIX: Change column 3 from 'auto' to '32px' (fixed width)
```

---

## Appendix: Complete CSS Selector Map

**Pattern 1 Selectors** (Lines 349-539):
- `.input-wrapper` (container)
- `.input-wrapper input[type="text"]` (input base)
- `.input-wrapper input[type="email"]` (input base)
- `.input-wrapper input[type="tel"]` (input base)
- `.input-wrapper input[type="url"]` (input base)
- `.input-wrapper input:focus` (focus state)
- `.input-wrapper input:disabled` (disabled state)
- `.input-wrapper input[readonly]` (readonly state)
- `.input-wrapper input:invalid:not(:placeholder-shown):not(:focus)` (invalid blur)
- `.input-wrapper input:invalid:not(:placeholder-shown):focus` (invalid focus)
- `.input-wrapper input:valid:not(:placeholder-shown):not(:focus)` (valid blur)
- `.input-wrapper input::placeholder` (placeholder text)
- `.input-wrapper input:not(:placeholder-shown) ~ .clear-btn` (show clear button)
- `.clear-btn` (clear button base)
- `.clear-btn:hover` (clear button hover)

**Pattern 2 Selectors** (Lines 1151-1187):
- `.email-split-input` (container)
- `.email-split-input:focus-within` (focus state)
- `.email-prefix-field` (input)
- `.email-domain-suffix` (suffix span)

**Pattern 3 Selectors** (Lines 1304-1340):
- `.url-prefix-input` (container)
- `.url-prefix-input:focus-within` (focus state)
- `.url-prefix` (prefix span)
- `.url-username-field` (input)

**ARIA Overrides** (Lines 2084-2096):
- `.input-wrapper input[aria-invalid="true"]` (error state)
- `.input-wrapper input[aria-invalid="true"]:focus` (error focus)
- `.input-wrapper input:not([aria-invalid]):focus:valid` (valid focus)

**Help System** (Lines 1188-1303):
- `.help-icon` (blue ? icon)
- `.help-icon:hover` (hover state)
- `.help-icon-placeholder` (grid spacer)
- `.help-panel` (collapsed help text)
- `.help-panel.expanded` (expanded help text)

**Grid Layout** (Lines 254-289):
- `.form-row` (grid container)
- `.form-label` (column 1)
- Input wrappers (column 2, all 3 patterns)
- `.help-icon` (column 3)

---

## Change Log

**2026-01-26**: Initial documentation created after failed refactoring attempt (commit 45aa368)

**Purpose**: Ensure this mistake never happens again. Document everything before changing anything.

**Next Steps**: See NEXT-STEPS.md for incremental fix plan (double borders → help icons → validation → consolidation).
