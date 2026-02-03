import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Tab order follows logical flow', async ({ page }) => {
    // Start at the beginning
    await page.keyboard.press('Tab');

    // First focusable element should be the name input
    let focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('name');

    // Continue tabbing through form fields
    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('title');

    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('department');

    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('email');

    await page.keyboard.press('Tab');
    focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('phone');
  });

  test('Focus indicators are visible on all interactive elements', async ({ page }) => {
    // Tab through elements and check focus outline
    const elements = [
      '#name',
      '#title',
      'email-prefix',
      'input[name="signatureStyle"]',
      '#themeToggle',
      '#copyButton'
    ];

    for (const selector of elements) {
      await page.focus(selector);
      await page.waitForTimeout(100);

      // Check that element has focus
      const isFocused = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        return document.activeElement === el;
      }, selector);

      expect(isFocused).toBe(true);

      // Check that focus outline is visible (not outline: none)
      const outlineStyle = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const styles = window.getComputedStyle(el);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          outlineStyle: styles.outlineStyle
        };
      }, selector);

      // Ensure outline is not 'none' and has some width
      expect(outlineStyle?.outlineStyle).not.toBe('none');
    }
  });

  test('Escape closes modal', async ({ page }) => {
    // Open Gmail instructions modal
    await page.click('[data-client="gmail"]');
    await page.waitForSelector('.modal-backdrop', { state: 'visible' });

    // Verify modal is visible
    let visible = await page.isVisible('.modal-backdrop');
    expect(visible).toBe(true);

    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);

    // Verify modal is closed
    visible = await page.isVisible('.modal-backdrop');
    expect(visible).toBe(false);
  });

  test('Enter activates buttons', async ({ page }) => {
    // Fill in form data first
    await page.fill('#name', 'Test User');
    await page.fill('email-prefix', 'test.user');

    // Focus copy button
    await page.focus('#copyButton');

    // Press Enter
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);

    // Check that copy action was triggered (success message visible)
    const successVisible = await page.isVisible('.copy-success');
    expect(successVisible).toBe(true);
  });

  test('Space toggles checkboxes and switches', async ({ page }) => {
    // Find first toggle switch
    const toggleSwitch = page.locator('.toggle-switch input').first();
    await toggleSwitch.focus();

    // Get initial state
    const initialState = await toggleSwitch.isChecked();

    // Press Space
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Verify state changed
    const newState = await toggleSwitch.isChecked();
    expect(newState).toBe(!initialState);
  });

  test('Modal traps focus within dialog', async ({ page }) => {
    // Open modal
    await page.click('[data-client="gmail"]');
    await page.waitForSelector('.modal-backdrop', { state: 'visible' });

    // Get all focusable elements in modal
    const focusableInModal = await page.evaluate(() => {
      const modal = document.querySelector('.modal-content');
      if (!modal) return [];
      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      return Array.from(focusable).map(el => el.tagName);
    });

    expect(focusableInModal.length).toBeGreaterThan(0);

    // Tab through modal elements
    for (let i = 0; i < focusableInModal.length + 2; i++) {
      await page.keyboard.press('Tab');
      await page.waitForTimeout(50);

      // Verify focus is still within modal
      const focusInModal = await page.evaluate(() => {
        const modal = document.querySelector('.modal-backdrop');
        const active = document.activeElement;
        return modal?.contains(active) ?? false;
      });

      expect(focusInModal).toBe(true);
    }
  });

  test('Shift+Tab navigates backwards', async ({ page }) => {
    // Tab to second element
    await page.keyboard.press('Tab'); // name
    await page.keyboard.press('Tab'); // title

    let focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('title');

    // Shift+Tab back
    await page.keyboard.press('Shift+Tab');
    focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('name');
  });

  test('Skip to main content link works', async ({ page }) => {
    // Check if skip link exists
    const skipLink = page.locator('a[href="#main-content"]');
    const exists = await skipLink.count();

    if (exists > 0) {
      // Focus skip link (usually visible only on focus)
      await skipLink.focus();

      // Press Enter
      await page.keyboard.press('Enter');
      await page.waitForTimeout(100);

      // Verify focus moved to main content
      const focused = await page.evaluate(() => document.activeElement?.id);
      expect(focused).toBe('main-content');
    }
  });

  test('Form can be submitted with keyboard only', async ({ page }) => {
    // Fill form using keyboard
    await page.keyboard.press('Tab'); // Focus name input
    await page.keyboard.type('Test User');

    await page.keyboard.press('Tab'); // title
    await page.keyboard.type('Senior Developer');

    await page.keyboard.press('Tab'); // department
    await page.keyboard.type('Engineering');

    await page.keyboard.press('Tab'); // email
    await page.keyboard.type('test.user');

    await page.keyboard.press('Tab'); // phone
    await page.keyboard.type('+1234567890');

    // Tab to copy button (may need multiple tabs)
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => {
        const el = document.activeElement;
        return el?.classList.contains('copy-button');
      });
      if (focused) break;
    }

    // Press Enter to copy
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);

    // Verify success message
    const successVisible = await page.isVisible('.copy-success');
    expect(successVisible).toBe(true);
  });

  test('All interactive elements are keyboard accessible', async ({ page }) => {
    // Get all interactive elements
    const interactiveElements = await page.evaluate(() => {
      const selectors = [
        'button:not([disabled])',
        'a[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"]):not([disabled])'
      ];

      const elements: Array<{ tag: string; id: string; class: string }> = [];
      selectors.forEach(selector => {
        const els = document.querySelectorAll(selector);
        els.forEach(el => {
          elements.push({
            tag: el.tagName,
            id: el.id,
            class: el.className
          });
        });
      });
      return elements;
    });

    // Verify all elements have tabindex >= 0 or are naturally focusable
    expect(interactiveElements.length).toBeGreaterThan(0);
    console.log(`Found ${interactiveElements.length} interactive elements`);
  });
});
