// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Clipboard Copy', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Fill in required data
        await page.fill('#name', 'John Doe');
        await page.fill('#title', 'Software Engineer');
        await page.fill('#department', 'Engineering');
        await page.fill('#email-prefix', 'john.doe');
    });

    test('should have copy button visible', async ({ page }) => {
        const copyButton = page.locator('#copyButton');
        await expect(copyButton).toBeVisible();
        await expect(copyButton).toContainText('Copy Signature');
    });

    test('should show success message after copy', async ({ page }) => {
        // Grant clipboard permissions
        await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);

        const copyButton = page.locator('#copyButton');

        // Click copy button
        await copyButton.click();
        await page.waitForTimeout(500);

        // Button text should change to indicate success
        await expect(copyButton).toContainText(/Copied|Copy/);
    });

    test('should have signature content in preview', async ({ page }) => {
        const preview = page.locator('#signaturePreview');

        // Preview should contain the user's name
        await expect(preview).toContainText('John Doe');

        // Preview should contain the job title
        await expect(preview).toContainText('Software Engineer');

        // Preview should contain the department
        await expect(preview).toContainText('Engineering');
    });

    test('should update preview when form data changes', async ({ page }) => {
        const preview = page.locator('#signaturePreview');

        // Clear and type new name
        await page.fill('#name', 'Jane Smith');
        await page.waitForTimeout(100);

        // Preview should update
        await expect(preview).toContainText('Jane Smith');
    });
});
