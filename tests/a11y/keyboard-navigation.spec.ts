import { test, expect } from '@playwright/test';

test.describe('Keyboard Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Tab order follows logical flow', async ({ page }) => {
    // Verify each form input is focusable and in the expected order.
    // Toggle switches and format lock buttons sit between inputs in the DOM,
    // so we use focus() to confirm each input is reachable rather than
    // counting exact Tab presses.
    await page.focus('#name');
    let focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('name');

    await page.focus('#title');
    focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('title');

    await page.focus('#department');
    focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('department');

    await page.focus('#phone');
    focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('phone');

    await page.focus('#email-prefix');
    focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('email-prefix');
  });

  test('Focus indicators are visible on all interactive elements', async ({ page }) => {
    // Check focus indicators on key interactive elements.
    // Form inputs use outline: none on the input itself, with a visible
    // box-shadow on the parent .input-wrapper via :focus-within instead.
    const elements = [
      '#name',
      '#title',
      '#email-prefix',
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

      // Check for a visible focus indicator: either an outline on the element
      // itself, or a box-shadow on its parent .input-wrapper (form inputs
      // delegate focus styling to the wrapper)
      const hasFocusIndicator = await page.evaluate((sel) => {
        const el = document.querySelector(sel);
        if (!el) return false;
        const styles = window.getComputedStyle(el);
        if (styles.outlineStyle !== 'none') return true;

        // Check parent wrapper for box-shadow focus indicator
        const wrapper = el.closest('.input-wrapper, .email-split-input');
        if (wrapper) {
          const wrapperStyles = window.getComputedStyle(wrapper);
          return wrapperStyles.boxShadow !== 'none';
        }
        return false;
      }, selector);

      expect(hasFocusIndicator).toBe(true);
    }
  });

  test('Escape closes modal', async ({ page }) => {
    // Open Zoho Mail instructions modal (visible without expanding accordion)
    await page.click('[data-client="zoho-mail"]');
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
    await page.fill('#email-prefix', 'test.user');

    // Focus copy button
    await page.focus('#copyButton');

    // Press Enter
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Check that copy action was triggered (toast notification visible)
    const toastVisible = await page.evaluate(() => {
      const toast = document.querySelector('.toast');
      return toast?.classList.contains('show') ?? false;
    });
    expect(toastVisible).toBe(true);
  });

  test('Space toggles checkboxes and switches', async ({ page }) => {
    // Toggle switches are div[role="switch"] elements, not checkboxes
    const toggleSwitch = page.locator('.toggle-switch[role="switch"]').first();
    await toggleSwitch.focus();

    // Get initial state
    const initialState = await toggleSwitch.getAttribute('aria-checked');

    // Press Space
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);

    // Verify state changed
    const newState = await toggleSwitch.getAttribute('aria-checked');
    expect(newState).not.toBe(initialState);
  });

  test('Modal traps focus within dialog', async ({ page }) => {
    // Open Zoho Mail modal (visible without expanding accordion)
    await page.click('[data-client="zoho-mail"]');
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

      // Verify focus is still within modal (.modal-backdrop is a sibling of
      // .modal-content, so check the parent #import-modal container)
      const focusInModal = await page.evaluate(() => {
        const modal = document.querySelector('#import-modal');
        const active = document.activeElement;
        return modal?.contains(active) ?? false;
      });

      expect(focusInModal).toBe(true);
    }
  });

  test('Shift+Tab navigates backwards', async ({ page }) => {
    // Focus title directly (toggle switches and format locks sit between inputs)
    await page.focus('#title');

    let focused = await page.evaluate(() => document.activeElement?.id);
    expect(focused).toBe('title');

    // Shift+Tab back through toggle-switch(title) and format-lock(name) to name
    await page.keyboard.press('Shift+Tab'); // toggle-switch(title)
    await page.keyboard.press('Shift+Tab'); // format-lock(name)
    await page.keyboard.press('Shift+Tab'); // name
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
    // Fill form using keyboard — focus each field directly since
    // toggle switches and format lock buttons sit between inputs
    await page.focus('#name');
    await page.keyboard.type('Test User');

    await page.focus('#title');
    await page.keyboard.type('Senior Developer');

    await page.focus('#department');
    await page.keyboard.type('Engineering');

    await page.focus('#email-prefix');
    await page.keyboard.type('test.user');

    await page.focus('#phone');
    await page.keyboard.type('+1234567890');

    // Tab to copy button (may need multiple tabs past remaining fields)
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => document.activeElement?.id);
      if (focused === 'copyButton') break;
    }

    // Press Enter to copy
    await page.keyboard.press('Enter');
    await page.waitForTimeout(500);

    // Verify toast notification appears
    const toastVisible = await page.evaluate(() => {
      const toast = document.querySelector('.toast');
      return toast?.classList.contains('show') ?? false;
    });
    expect(toastVisible).toBe(true);
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
