/**
 * Visual Regression Tests
 * Screenshot-based testing for signature rendering across styles and modes
 */

import { test, expect } from '@playwright/test';

// Test data
const testData = {
  name: 'Jasmine Frank',
  title: 'Director of Marketing',
  department: 'Zoho One',
  emailPrefix: 'jasmine.frank',
  phone: '+1 (281) 330-8004',
  linkedin: 'jasminefrank',
  twitter: 'jasminefrank',
};

const styles = ['classic', 'modern', 'compact', 'minimal', 'professional', 'creative'];

/**
 * Helper: Fill form with test data
 */
async function fillForm(page: any, data: typeof testData) {
  await page.fill('input[name="name"]', data.name);
  await page.fill('input[name="title"]', data.title);
  await page.fill('input[name="department"]', data.department);
  await page.fill('input[name="email-prefix"]', data.emailPrefix);
  await page.fill('input[name="phone"]', data.phone);

  // Enable and fill LinkedIn
  await page.click('[data-field="linkedin"]');
  await page.fill('input[name="linkedin-username"]', data.linkedin);

  // Enable and fill Twitter
  await page.click('[data-field="twitter"]');
  await page.fill('input[name="twitter-username"]', data.twitter);
}

/**
 * Helper: Select signature style
 */
async function selectStyle(page: any, style: string) {
  await page.check(`input[name="signatureStyle"][value="${style}"]`);
  // Wait for preview to update
  await page.waitForTimeout(500);
}

/**
 * Helper: Toggle dark mode
 */
async function toggleDarkMode(page: any, enabled: boolean) {
  const checkbox = page.locator('input#themeToggle');
  const isChecked = await checkbox.isChecked();

  if (isChecked !== enabled) {
    // Click the label (not the hidden checkbox) since label intercepts pointer events
    await page.locator('.theme-toggle').click();
    await page.waitForTimeout(300);
  }
}

test.describe('Signature Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for app to be ready
    await page.waitForSelector('#previewContainer', { state: 'visible' });

    // Fill form with test data
    await fillForm(page, testData);
  });

  // Test all styles in light mode
  for (const style of styles) {
    test(`${style} - light mode`, async ({ page }) => {
      await selectStyle(page, style);
      await toggleDarkMode(page, false);

      // Take screenshot of preview area
      const preview = page.locator('#previewContainer');
      await expect(preview).toHaveScreenshot(`${style}-light.png`, {
        maxDiffPixels: 100, // Allow small anti-aliasing differences
      });
    });
  }

  // Test all styles in dark mode
  for (const style of styles) {
    test(`${style} - dark mode`, async ({ page }) => {
      await selectStyle(page, style);
      await toggleDarkMode(page, true);

      // Take screenshot of preview area
      const preview = page.locator('#previewContainer');
      await expect(preview).toHaveScreenshot(`${style}-dark.png`, {
        maxDiffPixels: 100,
      });
    });
  }

  // Edge case: Long name
  test('classic - long name edge case', async ({ page }) => {
    await page.fill('input[name="name"]', 'Christopher Alexander Montgomery-Wellington Jr.');
    await page.fill('input[name="title"]', 'Senior Vice President of Strategic Product Development');
    await selectStyle(page, 'classic');

    const preview = page.locator('#previewContainer');
    await expect(preview).toHaveScreenshot('classic-long-name.png', {
      maxDiffPixels: 100,
    });
  });

  // Edge case: Minimal data
  test('classic - minimal data edge case', async ({ page }) => {
    // Clear all optional fields
    await page.fill('input[name="name"]', 'Alex Johnson');
    await page.fill('input[name="title"]', 'Engineer');
    await page.fill('input[name="department"]', '');
    await page.fill('input[name="phone"]', '');

    // Disable LinkedIn and Twitter (toggles are div[role="switch"], not inputs)
    await page.click('[data-field="linkedin"]');
    await page.click('[data-field="twitter"]');

    await selectStyle(page, 'classic');

    const preview = page.locator('#previewContainer');
    await expect(preview).toHaveScreenshot('classic-minimal.png', {
      maxDiffPixels: 100,
    });
  });

  // Edge case: All accent colors
  test('classic - all accent colors', async ({ page }) => {
    const colors = ['#E42527', '#089949', '#226DB4', '#F9B21D'];
    const colorNames = ['red', 'green', 'blue', 'yellow'];

    for (let i = 0; i < colors.length; i++) {
      await page.click(`button[data-color="${colors[i]}"]`);
      await page.waitForTimeout(300);

      const preview = page.locator('#previewContainer');
      await expect(preview).toHaveScreenshot(`classic-color-${colorNames[i]}.png`, {
        maxDiffPixels: 100,
      });
    }
  });
});

test.describe('Signature Interaction Tests', () => {
  test('copy button works', async ({ page }) => {
    await page.goto('/');
    await fillForm(page, testData);

    // Click copy button
    await page.click('#copyButton');

    // Check for success toast (if implemented)
    // Or verify clipboard content (requires permissions)

    // At minimum, verify button doesn't throw error
    await page.waitForTimeout(500);
  });

  test('style selector updates preview', async ({ page }) => {
    await page.goto('/');
    await fillForm(page, testData);

    for (const style of styles) {
      await selectStyle(page, style);

      // Verify preview updated (has content)
      const preview = page.locator('#previewContainer');
      const content = await preview.textContent();
      expect(content).toContain(testData.name);
    }
  });

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/');
    await fillForm(page, testData);

    // Toggle on
    await toggleDarkMode(page, true);
    let checkbox = page.locator('input#themeToggle');
    expect(await checkbox.isChecked()).toBe(true);

    // Toggle off
    await toggleDarkMode(page, false);
    expect(await checkbox.isChecked()).toBe(false);
  });
});
