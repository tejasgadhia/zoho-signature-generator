# Visual Testing Checklist - Zoho Signature Generator

**Created**: 2026-01-26
**Purpose**: Manual testing checklist for visual regression after CSS changes
**Status**: Use this until automated screenshot comparison is working

---

## Why This Document Exists

The agent-browser screenshot command has issues (validation error: selector null) in version 0.7.5. Until this is resolved, use manual screenshot comparison with browser DevTools.

**Automated approach blocked by**: `agent-browser screenshot` command error
**Fallback**: Manual screenshots with browser DevTools (Cmd+Shift+5 on Mac, or browser DevTools screenshot)

---

## Manual Screenshot Capture Process

### Step 1: Open Deployed Site in Browser

```bash
open https://tejasgadhia.github.io/zoho-signature-generator/
```

Or in Chrome:
1. Open Chrome
2. Navigate to https://tejasgadhia.github.io/zoho-signature-generator/
3. Open DevTools (Cmd+Opt+I)
4. Open Command Palette (Cmd+Shift+P)
5. Type "screenshot" and select "Capture full size screenshot"

### Step 2: Capture Baseline Screenshots

Save each screenshot with descriptive filename in `baseline-screenshots/` directory:

#### 1. Empty Form (Light Mode)
**Filename**: `01-initial-empty-form.png`
**State**:
- All fields empty
- No validation errors
- Light mode (default)
- No help panels expanded

**How to capture**:
1. Open site
2. Don't fill any fields
3. Capture full page screenshot

---

#### 2. All Fields Filled (Valid Data)
**Filename**: `02-filled-valid-data.png`
**State**:
- Name: "John Doe"
- Title: "Senior Product Manager"
- Department: "Product Management"
- Email: "john.doe" (prefix only)
- Phone: "+1 234 567 8900"
- LinkedIn: "johndoe"
- Twitter: "johndoe"
- Bookings: "johndoe123"
- All validation passing (green checkmarks or no errors)

**How to capture**:
1. Fill all fields with valid data
2. Click outside form to blur last field (trigger validation)
3. Capture full page screenshot

**What to verify**:
- All input borders clean (no double borders)
- Validation icons positioned correctly
- No layout shifts
- Help icons aligned properly

---

#### 3. Focus State (Name Field)
**Filename**: `03-focus-name-field.png`
**State**:
- Name field focused (red border, box-shadow)
- All other fields empty
- No validation showing yet

**How to capture**:
1. Refresh page (empty form)
2. Click in Name field
3. Capture full page screenshot

**What to verify**:
- Focus ring visible (red border + box-shadow)
- Border doesn't double
- No layout shift when focusing

---

#### 4. Help Panel Expanded (Email Field)
**Filename**: `04-help-panel-expanded.png`
**State**:
- Email field filled with "john.doe"
- Help panel below email field expanded (blue ? icon clicked)
- All other fields empty

**How to capture**:
1. Fill email field
2. Click blue ? icon next to email field
3. Capture full page screenshot

**What to verify**:
- Help panel expands smoothly
- Help icon (blue ?) DOES NOT shift left
- Panel spans full width under input row
- Subsequent fields pushed down correctly

---

#### 5. Validation Error (Phone Field)
**Filename**: `05-validation-error-phone.png`
**State**:
- Name: "John Doe"
- Phone: "invalid" (should show red error)
- All other fields valid or empty
- Error message showing under phone field

**How to capture**:
1. Fill Name with "John Doe"
2. Fill Phone with "invalid"
3. Click in Name field (blur phone to trigger validation)
4. Capture full page screenshot

**What to verify**:
- Phone field has red border
- Red ✗ icon shows in phone field
- Error message visible and readable
- No green checkmarks on valid fields (Issue C from NEXT-STEPS.md)

---

#### 6. Tab Navigation Focus Order
**Filename**: `06-tab-navigation-focus.png`
**State**:
- Multiple fields filled
- Focus on Title field (tabbed from Name)
- Capture while holding focus

**How to capture**:
1. Fill Name: "John Doe"
2. Press Tab (focus moves to Title)
3. Capture full page screenshot immediately

**What to verify**:
- Focus moves to Title field correctly
- Previous field (Name) loses focus style
- No layout shifts during tab navigation
- All fields remain aligned

---

#### 7. Dark Mode Preview
**Filename**: `07-dark-mode-preview.png`
**State**:
- All fields filled with valid data
- Dark mode toggle ON (in preview section, NOT form)
- Signature preview showing dark background

**How to capture**:
1. Fill all fields with valid data
2. Scroll down to preview section
3. Toggle "Dark Mode" checkbox
4. Capture full page screenshot

**What to verify**:
- Form section STAYS LIGHT (inputs still white background)
- Preview section shows dark theme
- Signature preview has dark background
- Logo swaps to light version in preview

---

#### 8. Multiple Help Panels Open
**Filename**: `08-multiple-help-panels.png`
**State**:
- Email help panel expanded
- Phone help panel expanded
- LinkedIn help panel expanded (toggle enabled first)
- All three help panels visible simultaneously

**How to capture**:
1. Enable LinkedIn toggle (switch on)
2. Click blue ? icon next to Email
3. Click blue ? icon next to Phone
4. Click blue ? icon next to LinkedIn
5. Capture full page screenshot

**What to verify**:
- All three help panels visible
- Help icons DO NOT shift left
- Panels don't overlap
- Grid layout stable

---

## Comparison Checklist (After CSS Changes)

After making CSS fixes (double borders, help icon shifting, etc.), capture NEW screenshots with same filenames in `comparison-screenshots/` directory.

### Comparison Tool Options

**Option 1: Manual Side-by-Side (Quick)**
```bash
# Open both folders in Finder
open baseline-screenshots/
open comparison-screenshots/

# View side-by-side, visually compare each pair
```

**Option 2: Image Diff Tool (Recommended)**
```bash
# Install ImageMagick if not present
brew install imagemagick

# Compare two screenshots
compare baseline-screenshots/01-initial-empty-form.png \
        comparison-screenshots/01-initial-empty-form.png \
        diff-01.png

# View diff (red/blue overlay shows changes)
open diff-01.png
```

**Option 3: Online Diff Tool**
- Upload both images to https://www.diffchecker.com/image-diff/
- Visual diff with pixel-by-pixel comparison

---

## Issues to Watch For (Per CSS-ARCHITECTURE.md)

### Issue A: Double Borders on Input Fields
**Location**: Name, Title, Department, Phone fields (Pattern 1 inputs)
**Symptom**: Input border appears thicker or doubled, especially at corners
**Root cause**: Border on both `.input-wrapper` and `input` element
**Fix**: Remove border from input, keep on wrapper only
**Verify in screenshots**: 01, 02, 03, 05

---

### Issue B: Help Icons Shift Left
**Location**: All fields with help icons (Email, Phone, LinkedIn, Twitter, Bookings)
**Symptom**: Blue ? icon moves left when help panel expands
**Root cause**: Grid column 3 is `auto` width, recalculates when panel expands
**Fix**: Change grid column 3 from `auto` to `32px` (fixed width)
**Verify in screenshots**: 04, 08

---

### Issue C: Unnecessary Validation Checkmarks
**Location**: All input fields when valid data entered
**Symptom**: Green ✓ checkmark shows on every valid field (excessive)
**Root cause**: JavaScript shows success indicators (lines 1416-1426 in app.js)
**Fix**: Only show errors (red ✗), hide success checkmarks
**Verify in screenshots**: 02, 05 (should only see red ✗ on invalid, nothing on valid)

---

## Test Coverage Matrix

| Screenshot | Pattern 1 | Pattern 2 | Pattern 3 | Focus | Validation | Help Panel |
|-----------|-----------|-----------|-----------|-------|------------|------------|
| 01 - Empty | ✓ | ✓ | ✓ | | | |
| 02 - Filled | ✓ | ✓ | ✓ | | ✓ | |
| 03 - Focus Name | ✓ | | | ✓ | | |
| 04 - Help Email | | ✓ | | | | ✓ |
| 05 - Error Phone | ✓ | | | | ✓ | |
| 06 - Tab Nav | ✓ | | | ✓ | | |
| 07 - Dark Mode | ✓ | ✓ | ✓ | | | |
| 08 - Multi Help | | ✓ | ✓ | | | ✓ |

**Pattern 1**: Regular inputs (Name, Title, Department, Phone)
**Pattern 2**: Email split input (Email field)
**Pattern 3**: URL prefix inputs (LinkedIn, Twitter, Bookings)

---

## Quick Verification Script (Browser Console)

Run this in browser console to check current CSS state:

```javascript
// Check Pattern 1 inputs (should have no border if fixed)
document.querySelectorAll('.input-wrapper input').forEach(input => {
  const styles = getComputedStyle(input);
  console.log(`${input.placeholder}: border = ${styles.border}`);
});

// Check grid column 3 width (should be 32px if fixed)
document.querySelectorAll('.form-row').forEach(row => {
  const styles = getComputedStyle(row);
  console.log(`Grid template: ${styles.gridTemplateColumns}`);
});

// Check validation icons shown/hidden
document.querySelectorAll('.validation-icon').forEach(icon => {
  console.log(`Validation icon: display = ${getComputedStyle(icon).display}`);
});
```

**Expected results BEFORE fixes**:
- Pattern 1 inputs: `border = 1px solid ...` (❌ should be `none`)
- Grid template: `140px 1fr auto` (❌ column 3 should be `32px`)
- Validation icons: Mix of `display: block` and `display: none` (❌ should hide green checkmarks)

**Expected results AFTER fixes**:
- Pattern 1 inputs: `border = none` (✓)
- Grid template: `140px 1fr 32px` (✓)
- Validation icons: Only red ✗ visible, green ✓ hidden (✓)

---

## Session Workflow

### Before Making CSS Changes
1. ✅ Capture all 8 baseline screenshots
2. ✅ Store in `baseline-screenshots/` directory
3. ✅ Review to confirm current working state
4. ✅ Document any existing visual issues
5. ✅ Commit baseline screenshots to git

### After Each CSS Fix (Incremental)
1. Make ONE CSS change (e.g., fix double borders only)
2. Deploy to GitHub Pages (git push)
3. Wait 2-3 minutes for deployment
4. Capture NEW screenshots in `comparison-screenshots/`
5. Use image diff tool to compare with baseline
6. If change looks good:
   - ✅ Commit CSS change
   - ✅ Replace baseline screenshots with comparison screenshots
   - ✅ Move to next fix
7. If change breaks something:
   - ❌ Revert CSS change
   - ❌ Document what went wrong
   - ❌ Try different approach

### After All Fixes Complete
1. Capture final screenshots
2. Compare with original baseline
3. Verify all three issues fixed:
   - [ ] No double borders (Issue A)
   - [ ] Help icons don't shift (Issue B)
   - [ ] No green checkmarks (Issue C)
4. Run full manual test checklist (below)
5. Deploy to production

---

## Full Manual Test Checklist

**Run this checklist after each CSS change, before committing.**

### Visual Tests
- [ ] All input borders clean (no doubling)
- [ ] Help icons stay in position when panels expand
- [ ] Only error icons show (no success checkmarks)
- [ ] Focus states have clean borders (no artifacts)
- [ ] Tab navigation doesn't cause layout shifts
- [ ] Dark mode toggle works (preview only)
- [ ] All three input patterns render correctly

### Interaction Tests
- [ ] Can fill all fields with valid data
- [ ] Validation shows errors correctly (red ✗)
- [ ] Help panels expand/collapse smoothly
- [ ] Signature preview updates in real-time
- [ ] Copy signature button works
- [ ] Theme toggle switches preview only
- [ ] Social icons reorder (drag-drop)

### Edge Cases
- [ ] Long text in fields doesn't break layout
- [ ] Invalid data shows appropriate errors
- [ ] Empty form shows no validation
- [ ] All toggles enable/disable fields correctly
- [ ] Focus order follows logical tab sequence

### Cross-Browser (if time allows)
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)

---

## Next Steps After Baseline Captured

1. **Document baseline state** (commit screenshots + this checklist)
2. **Fix Issue A first** (double borders - least risky)
3. **Capture comparison screenshots** (after Issue A fixed)
4. **Verify no regressions** (compare with baseline)
5. **Fix Issue B** (help icon shifting - medium risk)
6. **Fix Issue C** (validation checkmarks - JavaScript change, lowest risk)
7. **Final verification** (all issues resolved, no new issues)

---

## Troubleshooting

### "I see differences but can't tell what changed"
- Use ImageMagick `compare` tool with `-fuzz 5%` to ignore minor pixel differences
- Focus on structural changes (borders, positions, widths) not anti-aliasing

### "Screenshots look identical but issue still present"
- Check viewport size (browser zoom at 100%)
- Clear browser cache (Cmd+Shift+R)
- Wait for CSS animations to complete before screenshot

### "Help panel expansion shifts everything"
- This is EXPECTED behavior for form rows below the panel
- Issue B is about help ICON shifting, not rows shifting
- Compare help icon position in screenshots 01 vs 04

---

## Automation TODO (Future)

Once agent-browser screenshot issue is resolved:
1. Convert this checklist to automated script
2. Use Playwright for screenshot comparison
3. Set up Percy or BackstopJS for visual regression
4. Add to CI/CD pipeline (GitHub Actions)

For now: **Manual testing is sufficient and safer** than attempting big refactoring without visual verification.
