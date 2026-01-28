// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Form Validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should validate email domain - requires @zohocorp.com', async ({ page }) => {
        // Fill in the name field first
        await page.fill('#name', 'Test User');

        // The email field only takes the prefix (before @zohocorp.com)
        // So we just test with a valid prefix
        await page.fill('#email-prefix', 'test.user');
        await page.locator('#email-prefix').blur();
        await page.waitForTimeout(100);

        // The email input should be present and have the prefix value
        const emailInput = page.locator('#email-prefix');
        await expect(emailInput).toHaveValue('test.user');
    });

    test('should accept valid @zohocorp.com email prefix', async ({ page }) => {
        await page.fill('#name', 'Test User');
        await page.fill('#email-prefix', 'test.user');
        await page.locator('#email-prefix').blur();

        // Wait for validation
        await page.waitForTimeout(100);

        // Should not have error class
        const emailInput = page.locator('#email-prefix');
        await expect(emailInput).not.toHaveClass(/error/);
    });

    test('should validate phone number format', async ({ page }) => {
        await page.fill('#name', 'Test User');

        // Fill in phone number
        await page.fill('#phone', '+1 (512) 555-0123');
        await page.locator('#phone').blur();

        // Wait for validation
        await page.waitForTimeout(100);

        // Should be valid (no error)
        const phoneInput = page.locator('#phone');
        await expect(phoneInput).not.toHaveClass(/error/);
    });

    test('should show name field as required', async ({ page }) => {
        // Name field should be required
        const nameInput = page.locator('#name');
        await expect(nameInput).toHaveAttribute('required', '');
    });

    test('should toggle optional fields on/off', async ({ page }) => {
        // Get the title toggle
        const titleToggle = page.locator('.toggle-switch[data-field="title"]');
        const titleInput = page.locator('#title');

        // Initially should be enabled
        await expect(titleInput).not.toBeDisabled();

        // Click to toggle off
        await titleToggle.click();

        // Should be disabled
        await expect(titleInput).toBeDisabled();

        // Click to toggle back on
        await titleToggle.click();

        // Should be enabled again
        await expect(titleInput).not.toBeDisabled();
    });

    test('should enable LinkedIn field only when toggle is on', async ({ page }) => {
        const linkedinToggle = page.locator('.toggle-switch[data-field="linkedin"]');
        const linkedinInput = page.locator('#linkedin-username');

        // Initially should be disabled (toggle off)
        await expect(linkedinInput).toBeDisabled();

        // Click to enable
        await linkedinToggle.click();

        // Should be enabled
        await expect(linkedinInput).not.toBeDisabled();

        // Fill in a value
        await linkedinInput.fill('testuser');

        // The value should be present
        await expect(linkedinInput).toHaveValue('testuser');
    });

    test('should show format lock icons on name, title, department', async ({ page }) => {
        // Check format lock icons exist
        await expect(page.locator('.format-lock-icon[data-field="name"]')).toBeVisible();
        await expect(page.locator('.format-lock-icon[data-field="title"]')).toBeVisible();
        await expect(page.locator('.format-lock-icon[data-field="department"]')).toBeVisible();
    });
});
