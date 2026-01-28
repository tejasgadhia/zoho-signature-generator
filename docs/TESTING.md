# Testing Infrastructure

This document describes the automated testing setup for the Zoho Email Signature Generator.

## Overview

The testing infrastructure includes:
1. **Visual Regression Testing** (BackstopJS) - Screenshot comparison testing
2. **E2E Testing** (Playwright) - User flow testing
3. **Accessibility Testing** (axe-core) - WCAG compliance checks

---

## Visual Regression Testing (BackstopJS)

Visual regression testing captures screenshots of the UI and compares them against baseline images to detect unintended visual changes.

### Setup

```bash
npm install
```

### Running Tests

```bash
# Start local server (required)
npm run serve

# In another terminal:

# Generate baseline screenshots (first time or after intentional changes)
npm run test:visual:reference

# Run visual regression tests
npm run test:visual

# Approve failed tests as new baseline
npm run test:visual:approve

# Open the HTML report
npm run test:visual:report
```

### Test Scenarios (20 total, 50 screenshots)

**Full Page Tests (2 viewports each)**
- `01-full-page-light` - Full application in light mode
- `02-full-page-dark` - Full application in dark mode

**Signature Style Tests - Light Mode (2 viewports each)**
- `03-style-classic-light` - Classic signature style
- `04-style-compact-light` - Compact signature style
- `05-style-modern-light` - Modern signature style
- `06-style-minimal-light` - Minimalist signature style
- `07-style-professional-light` - Professional signature style
- `08-style-creative-light` - Creative signature style

**Signature Style Tests - Dark Mode (2 viewports each)**
- `09-style-classic-dark` through `14-style-creative-dark`

**Accent Color Tests (2 viewports each)**
- `15-accent-red` - Red accent color (default)
- `16-accent-green` - Green accent color
- `17-accent-blue` - Blue accent color
- `18-accent-yellow` - Yellow accent color

**Interaction Tests (2 viewports each)**
- `19-form-with-data` - Form filled with test data
- `20-feedback-modal` - Feedback modal opened

### Viewports

- **Desktop**: 1440x900
- **Laptop**: 1280x800

### Configuration

The configuration is in `backstop.json`. Key settings:

```json
{
  "misMatchThreshold": 0.1,  // 0.1% pixel difference allowed
  "asyncCaptureLimit": 5,    // Parallel screenshot capture
  "engine": "puppeteer"
}
```

### Adding New Scenarios

1. Add scenario to `backstop.json` under `scenarios`
2. Create Puppeteer script in `backstop_data/engine_scripts/puppet/` if needed
3. Run `npm run test:visual:reference` to create baseline
4. Run `npm run test:visual` to verify

### Puppeteer Scripts

Custom scripts for UI interaction:
- `setDarkMode.js` - Toggle dark mode
- `selectStyle.js` - Select signature style (light mode)
- `selectStyleDark.js` - Select signature style + enable dark mode
- `selectAccentColor.js` - Select accent color
- `fillForm.js` - Fill form with test data
- `openFeedbackModal.js` - Open feedback modal

---

## E2E Testing (Playwright)

End-to-end tests verify user flows and interactions.

### Setup

```bash
npm install
npx playwright install  # Install browser binaries
```

### Running Tests

```bash
# Start local server (required)
npm run serve

# In another terminal:

# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive debugging)
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/dark-mode.spec.js

# Run with headed browser (visible)
npx playwright test --headed
```

### Test Coverage (33 tests)

**Clipboard Copy Tests** (4 tests)
- `should have copy button visible`
- `should show success message after copy`
- `should have signature content in preview`
- `should update preview when form data changes`

**Dark Mode Tests** (4 tests)
- `should toggle dark mode on preview`
- `should update signature preview for dark mode`
- `should persist dark mode preference`
- `should load dark mode from localStorage`

**Form Validation Tests** (7 tests)
- `should validate email domain - requires @zohocorp.com`
- `should accept valid @zohocorp.com email prefix`
- `should validate phone number format`
- `should show name field as required`
- `should toggle optional fields on/off`
- `should enable LinkedIn field only when toggle is on`
- `should show format lock icons on name, title, department`

**Modal Tests** (10 tests)
- Feedback modal: open, close button, Escape key, contact options
- Import modal: Zoho Mail, Zoho Desk, Gmail instructions, close button, backdrop click

**Signature Style Tests** (8 tests)
- `should have 6 signature styles available`
- `should default to classic style`
- `should update preview when style changes`
- `should select each style correctly`
- `should show style descriptions`
- Accent colors: count, default, change, preview update

### Configuration

The configuration is in `playwright.config.js`. Key settings:

```javascript
{
  testDir: './tests/e2e',
  baseURL: 'http://localhost:3003',
  use: {
    screenshot: 'only-on-failure',
    trace: 'on-first-retry'
  }
}
```

### Adding New Tests

1. Create test file in `tests/e2e/` directory
2. Use Playwright test API:
   ```javascript
   const { test, expect } = require('@playwright/test');

   test('test name', async ({ page }) => {
       await page.goto('/');
       // Test logic
   });
   ```
3. Run tests with `npm run test:e2e`

### Common Patterns

**Hidden checkboxes (custom toggles)**:
```javascript
// Use JavaScript evaluation for hidden checkboxes
await page.evaluate(() => {
    const toggle = document.querySelector('#themeToggle');
    toggle.checked = !toggle.checked;
    toggle.dispatchEvent(new Event('change', { bubbles: true }));
});
```

**Modal backdrop clicks**:
```javascript
// Use JavaScript evaluation for backdrop behind modal
await page.evaluate(() => {
    document.querySelector('.modal-backdrop').click();
});
```

**Force-checking radio buttons**:
```javascript
// Use check with force when labels intercept clicks
await page.locator('input[value="modern"]').check({ force: true });
```

---

## Accessibility Testing (axe-core)

Automated accessibility testing using axe-core integrated with Playwright.

### Setup

Axe-core is installed as part of the project dependencies:

```bash
npm install
npx playwright install
```

### Running Tests

```bash
# Start local server (required)
npm run serve

# In another terminal:

# Run accessibility tests
npm run test:a11y

# Run with detailed report
npm run test:a11y:report

# Run all tests including accessibility
npm run test:e2e
```

### Test Coverage (17 tests)

**Core Checks** (6 tests)
- Form labels
- Accessible images (alt text)
- Accessible links
- Accessible buttons
- HTML lang attribute
- Valid ARIA roles and attributes

**Full WCAG Scan** (5 tests)
- Initial page load
- Form filled state
- Dark mode
- Feedback modal open
- Import modal open

**Known Issues Report** (1 test)
- Generates report of documented accessibility issues
- Tracks issue count for regression detection

**Keyboard Navigation** (5 tests)
- Tab navigation through form
- Escape key closes modals
- Enter key activates buttons
- Space key activates buttons
- Tab navigation in forms

### Known Accessibility Issues

The following issues are documented and tracked for future fixing:

1. **aria-prohibited-attr** (serious)
   - `div.toggle-switch` uses `aria-label` without a valid role
   - Fix: Add `role="switch"` to toggle elements

2. **color-contrast** (serious)
   - Some color buttons (especially green) have insufficient contrast
   - Affected: ~10 elements
   - Fix: Adjust button text colors or use different contrast approach

3. **landmark-one-main** (moderate)
   - Document lacks a `<main>` landmark
   - Fix: Wrap main content in `<main>` element

4. **region** (moderate)
   - Some content is outside landmark regions
   - Fix: Ensure all content is within landmarks

5. **target-size** (serious)
   - Format lock icons are smaller than 24x24px minimum
   - Affected: 3 elements
   - Fix: Increase icon size or add spacing

### Configuration

Tests use axe-core tags for WCAG compliance checking:

```javascript
// Tags used for WCAG 2.2 AA compliance
.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])

// Known issues excluded from failing tests
.disableRules(['aria-prohibited-attr', 'color-contrast', 'landmark-one-main', 'region', 'target-size'])
```

### Adding New Tests

```javascript
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('custom accessibility test', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
        .withRules(['specific-rule-id'])
        .analyze();

    expect(results.violations).toEqual([]);
});
```

### Useful Resources

- [axe-core Rules](https://dequeuniversity.com/rules/axe/4.11/)
- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)

---

## CI/CD Integration

Tests can be integrated into GitHub Actions:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - name: Start server
        run: npx serve -l 3003 &
      - name: Wait for server
        run: sleep 3
      - name: Run E2E tests
        run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  visual-regression:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - name: Start server
        run: npx serve -l 3003 &
      - name: Wait for server
        run: sleep 3
      - name: Run visual regression tests
        run: npm run test:visual
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: backstop-report
          path: backstop_data/html_report/

  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - name: Start server
        run: npx serve -l 3003 &
      - name: Wait for server
        run: sleep 3
      - name: Run accessibility tests
        run: npm run test:a11y:report
```

---

## Troubleshooting

### Server not running
```
Error: net::ERR_CONNECTION_REFUSED
```
Start the server with `npm run serve` before running tests.

### Different port
If port 3003 is in use, update `backstop.json`:
```json
"url": "http://localhost:YOUR_PORT"
```

### Screenshots don't match
1. Check if the change is intentional
2. If yes, run `npm run test:visual:approve`
3. If no, investigate the code change that caused it

### Puppeteer errors
- `TypeError: page.waitForTimeout is not a function` - Use `await new Promise(r => setTimeout(r, ms))` instead
- `Node is not clickable` - Use `page.evaluate()` to click elements
