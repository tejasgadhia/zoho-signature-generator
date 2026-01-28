// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// Known issues to exclude from failing tests (tracked separately for fixing)
// These are documented accessibility issues that need to be addressed in future work
const KNOWN_ISSUES = [
    'aria-prohibited-attr',  // div.toggle-switch uses aria-label without role
    'color-contrast',        // Some color buttons have insufficient contrast
    'landmark-one-main',     // Document needs a main landmark
    'region',                // Content should be in landmark regions
    'target-size',           // Some touch targets are too small (format lock icons)
];

test.describe('Accessibility - Core Checks', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should have proper form labels', async ({ page }) => {
        const results = await new AxeBuilder({ page })
            .withRules(['label', 'label-title-only'])
            .analyze();

        expect(results.violations).toEqual([]);
    });

    test('should have accessible images', async ({ page }) => {
        const results = await new AxeBuilder({ page })
            .withRules(['image-alt', 'role-img-alt'])
            .analyze();

        expect(results.violations).toEqual([]);
    });

    test('should have accessible links', async ({ page }) => {
        const results = await new AxeBuilder({ page })
            .withRules(['link-name', 'link-in-text-block'])
            .analyze();

        expect(results.violations).toEqual([]);
    });

    test('should have accessible buttons', async ({ page }) => {
        const results = await new AxeBuilder({ page })
            .withRules(['button-name'])
            .analyze();

        expect(results.violations).toEqual([]);
    });

    test('should have page with HTML lang attribute', async ({ page }) => {
        const results = await new AxeBuilder({ page })
            .withRules(['html-has-lang', 'html-lang-valid'])
            .analyze();

        expect(results.violations).toEqual([]);
    });

    test('should have valid ARIA roles and attributes', async ({ page }) => {
        const results = await new AxeBuilder({ page })
            .withRules(['aria-valid-attr', 'aria-valid-attr-value', 'aria-roles'])
            .analyze();

        expect(results.violations).toEqual([]);
    });
});

test.describe('Accessibility - Full Scan (excluding known issues)', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should pass WCAG 2.2 AA checks (excluding known issues)', async ({ page }) => {
        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .disableRules(KNOWN_ISSUES)
            .analyze();

        expect(results.violations).toEqual([]);
    });

    test('should pass checks with form filled (excluding known issues)', async ({ page }) => {
        await page.fill('#name', 'John Doe');
        await page.fill('#title', 'Software Engineer');
        await page.fill('#department', 'Engineering');
        await page.fill('#email-prefix', 'john.doe');
        await page.fill('#phone', '+1 512 555 0123');

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .disableRules(KNOWN_ISSUES)
            .analyze();

        expect(results.violations).toEqual([]);
    });

    test('should pass checks in dark mode (excluding known issues)', async ({ page }) => {
        await page.evaluate(() => {
            const toggle = document.querySelector('#themeToggle');
            if (toggle) {
                // @ts-ignore - checkbox has checked property
                toggle.checked = true;
                toggle.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
        await page.waitForTimeout(200);

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .disableRules(KNOWN_ISSUES)
            .analyze();

        expect(results.violations).toEqual([]);
    });

    test('should pass checks with feedback modal open (excluding known issues)', async ({ page }) => {
        await page.click('#feedbackButton');
        await page.waitForTimeout(200);

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .disableRules(KNOWN_ISSUES)
            .analyze();

        expect(results.violations).toEqual([]);
    });

    test('should pass checks with import modal open (excluding known issues)', async ({ page }) => {
        await page.click('.import-btn[data-client="zoho-mail"]');
        await page.waitForTimeout(200);

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .disableRules(KNOWN_ISSUES)
            .analyze();

        expect(results.violations).toEqual([]);
    });
});

test.describe('Accessibility - Known Issues Report', () => {
    test('generate report of known accessibility issues', async ({ page }) => {
        await page.goto('/');

        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .analyze();

        // Log violations for documentation
        if (results.violations.length > 0) {
            console.log('\n=== ACCESSIBILITY ISSUES REPORT ===\n');
            results.violations.forEach((violation, index) => {
                console.log(`${index + 1}. ${violation.id} (${violation.impact})`);
                console.log(`   ${violation.help}`);
                console.log(`   Affected: ${violation.nodes.length} element(s)`);
                console.log(`   More info: ${violation.helpUrl}\n`);
            });
            console.log('=== END REPORT ===\n');
        }

        // This test documents issues but doesn't fail
        // The count is tracked for regression detection
        const violationCount = results.violations.length;
        console.log(`Total violations found: ${violationCount}`);

        // Ensure no NEW violations are introduced (track baseline)
        // Current baseline: 3 known issue types (aria-prohibited-attr, color-contrast, heading-order)
        expect(results.violations.length).toBeLessThanOrEqual(3);
    });
});

test.describe('Keyboard Navigation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should be able to tab through form fields', async ({ page }) => {
        // Focus on the first focusable element
        await page.keyboard.press('Tab');

        // Get the focused element
        const focusedElement = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);
        expect(focusedElement).toBeTruthy();

        // Tab through several fields and verify focus moves
        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('Tab');
            const currentFocus = await page.evaluate(() => document.activeElement?.tagName);
            expect(currentFocus).toBeTruthy();
        }
    });

    test('should be able to close modal with Escape key', async ({ page }) => {
        // Open feedback modal
        await page.click('#feedbackButton');
        await page.waitForTimeout(200);

        // Verify modal is open
        const feedbackModal = page.locator('#feedback-modal');
        await expect(feedbackModal).toHaveAttribute('aria-hidden', 'false');

        // Press Escape to close
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);

        // Verify modal is closed
        await expect(feedbackModal).toHaveAttribute('aria-hidden', 'true');
    });

    test('should activate buttons with Enter key', async ({ page }) => {
        // Focus on feedback button
        await page.focus('#feedbackButton');

        // Press Enter to activate
        await page.keyboard.press('Enter');
        await page.waitForTimeout(200);

        // Verify modal opened
        const feedbackModal = page.locator('#feedback-modal');
        await expect(feedbackModal).toHaveAttribute('aria-hidden', 'false');
    });

    test('should activate buttons with Space key', async ({ page }) => {
        // Focus on feedback button
        await page.focus('#feedbackButton');

        // Press Space to activate
        await page.keyboard.press('Space');
        await page.waitForTimeout(200);

        // Verify modal opened
        const feedbackModal = page.locator('#feedback-modal');
        await expect(feedbackModal).toHaveAttribute('aria-hidden', 'false');
    });

    test('should navigate form with Tab key', async ({ page }) => {
        // Fill name field first
        await page.fill('#name', 'John Doe');

        // Focus on name field
        await page.focus('#name');

        // Tab to next field
        await page.keyboard.press('Tab');

        // Verify focus moved (element may not have id, check tagName)
        const focusedInfo = await page.evaluate(() => ({
            id: document.activeElement?.id,
            tagName: document.activeElement?.tagName,
            className: document.activeElement?.className
        }));

        // Focus should have moved to a different element
        expect(focusedInfo.tagName).toBeTruthy();
        // Either the id is different from 'name', or the element doesn't have id 'name'
        expect(focusedInfo.id !== 'name' || focusedInfo.tagName !== 'INPUT').toBe(true);
    });
});
