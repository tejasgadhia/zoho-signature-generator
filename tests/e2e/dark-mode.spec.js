// @ts-check
const { test, expect } = require('@playwright/test');

// Helper function to toggle dark mode using JavaScript (checkbox is hidden with CSS)
async function toggleDarkMode(page) {
    await page.evaluate(() => {
        const toggle = document.querySelector('#themeToggle');
        if (toggle) {
            // Set checked state and dispatch change event
            toggle.checked = !toggle.checked;
            toggle.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
    await page.waitForTimeout(200);
}

test.describe('Dark Mode', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.fill('#name', 'John Doe');
    });

    test('should toggle dark mode on preview', async ({ page }) => {
        const themeToggle = page.locator('#themeToggle');

        // Initially not checked
        await expect(themeToggle).not.toBeChecked();

        // Toggle dark mode using JavaScript (checkbox is hidden)
        await toggleDarkMode(page);

        // Should be checked
        await expect(themeToggle).toBeChecked();
    });

    test('should update signature preview for dark mode', async ({ page }) => {
        const previewContainer = page.locator('#previewContainer');

        // Initially should not have dark-mode class
        await expect(previewContainer).not.toHaveClass(/dark-mode/);

        // Toggle dark mode using JavaScript (checkbox is hidden)
        await toggleDarkMode(page);

        // Preview container should have dark-mode class
        await expect(previewContainer).toHaveClass(/dark-mode/);
    });

    test('should persist dark mode preference', async ({ page }) => {
        // Toggle dark mode using JavaScript (checkbox is hidden)
        await toggleDarkMode(page);

        // Check localStorage (app uses 'zoho-signature-preview-theme' key)
        const theme = await page.evaluate(() => localStorage.getItem('zoho-signature-preview-theme'));
        expect(theme).toBe('dark');
    });

    test('should load dark mode from localStorage', async ({ page }) => {
        // First, enable dark mode on the page
        await toggleDarkMode(page);

        // Reload the page
        await page.reload();
        await page.waitForTimeout(200);

        // Dark mode should still be enabled from localStorage
        const themeToggle = page.locator('#themeToggle');
        await expect(themeToggle).toBeChecked();
    });
});
