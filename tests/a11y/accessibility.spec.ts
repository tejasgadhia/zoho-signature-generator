import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests - WCAG 2.2 AA Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for app to initialize
    await page.waitForLoadState('networkidle');
  });

  test('Homepage passes axe scan', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Preview light mode passes axe scan', async ({ page }) => {
    // Ensure preview light mode is active (click the label, not the
    // visually-hidden checkbox, since the label intercepts pointer events)
    const themeToggle = page.locator('#themeToggle');
    const isChecked = await themeToggle.isChecked();
    if (isChecked) {
      await page.locator('.theme-toggle').click();
      await page.waitForTimeout(100); // Wait for theme transition
    }

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Preview dark mode passes axe scan', async ({ page }) => {
    // Ensure preview dark mode is active (click the label, not the
    // visually-hidden checkbox, since the label intercepts pointer events)
    const themeToggle = page.locator('#themeToggle');
    const isChecked = await themeToggle.isChecked();
    if (!isChecked) {
      await page.locator('.theme-toggle').click();
      await page.waitForTimeout(100); // Wait for theme transition
    }

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  const signatureStyles = ['classic', 'modern', 'compact', 'minimal', 'professional', 'creative'];

  for (const style of signatureStyles) {
    test(`${style} signature style passes axe scan`, async ({ page }) => {
      // Select signature style (radio button)
      await page.check(`input[name="signatureStyle"][value="${style}"]`);
      await page.waitForTimeout(200); // Wait for preview update

      // Scan only the preview area
      const results = await new AxeBuilder({ page })
        .include('#signaturePreview')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();

      expect(results.violations).toEqual([]);
    });
  }

  test('Form inputs have proper labels', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('form')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Modal dialogs pass axe scan', async ({ page }) => {
    // Open Zoho Mail instructions modal (always visible, not inside accordion)
    const zohoMailButton = page.locator('[data-client="zoho-mail"]');
    await zohoMailButton.click();
    await page.waitForSelector('.modal-backdrop', { state: 'visible' });

    const results = await new AxeBuilder({ page })
      .include('.modal-backdrop')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Toggle switches pass axe scan', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('.toggle-switch')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Social media toggles pass axe scan', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('.social-compact-grid')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Color contrast meets WCAG AA standards', async ({ page }) => {
    // Specific test for color contrast
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .disableRules(['document-title']) // Allow other violations, only check contrast
      .analyze();

    const contrastViolations = results.violations.filter(v => v.id === 'color-contrast');
    expect(contrastViolations).toEqual([]);
  });

  test('All images have alt text', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withRules(['image-alt'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Page has valid lang attribute', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withRules(['html-has-lang', 'html-lang-valid'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Links have discernible text', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withRules(['link-name'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('Form elements have visible labels', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withRules(['label', 'label-title-only'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
