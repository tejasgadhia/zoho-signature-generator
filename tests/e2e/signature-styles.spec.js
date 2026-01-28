// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Signature Styles', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Fill in some basic data
        await page.fill('#name', 'John Doe');
        await page.fill('#title', 'Software Engineer');
        await page.fill('#department', 'Engineering');
    });

    test('should have 6 signature styles available', async ({ page }) => {
        const styleOptions = page.locator('input[name="signatureStyle"]');
        await expect(styleOptions).toHaveCount(6);
    });

    test('should default to classic style', async ({ page }) => {
        const classicRadio = page.locator('input[name="signatureStyle"][value="classic"]');
        await expect(classicRadio).toBeChecked();
    });

    test('should update preview when style changes', async ({ page }) => {
        // Get initial preview content
        const preview = page.locator('#signaturePreview');
        const initialContent = await preview.innerHTML();

        // Switch to modern style - click the label wrapper instead of input
        await page.locator('input[name="signatureStyle"][value="modern"]').check({ force: true });
        await page.waitForTimeout(200);

        // Preview should change
        const newContent = await preview.innerHTML();
        expect(newContent).not.toBe(initialContent);
    });

    test('should select each style correctly', async ({ page }) => {
        const styles = ['classic', 'professional', 'minimalist', 'compact', 'modern', 'creative'];

        for (const style of styles) {
            // Use check with force to bypass click interception
            await page.locator(`input[name="signatureStyle"][value="${style}"]`).check({ force: true });
            const radio = page.locator(`input[name="signatureStyle"][value="${style}"]`);
            await expect(radio).toBeChecked();
        }
    });

    test('should show style descriptions', async ({ page }) => {
        // Check that each style has a description
        await expect(page.locator('.style-option .style-desc')).toHaveCount(6);
    });
});

test.describe('Accent Colors', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.fill('#name', 'John Doe');
    });

    test('should have 4 accent colors available', async ({ page }) => {
        const colorButtons = page.locator('.color-btn');
        await expect(colorButtons).toHaveCount(4);
    });

    test('should default to red accent color', async ({ page }) => {
        const redButton = page.locator('.color-btn[data-color="#E42527"]');
        await expect(redButton).toHaveClass(/selected/);
    });

    test('should change accent color on click', async ({ page }) => {
        // Click green button
        const greenButton = page.locator('.color-btn[data-color="#089949"]');
        await greenButton.click();

        // Green should be selected
        await expect(greenButton).toHaveClass(/selected/);

        // Red should not be selected
        const redButton = page.locator('.color-btn[data-color="#E42527"]');
        await expect(redButton).not.toHaveClass(/selected/);
    });

    test('should update preview when color changes', async ({ page }) => {
        const preview = page.locator('#signaturePreview');

        // Get initial preview
        const initialHTML = await preview.innerHTML();

        // Click blue button
        await page.click('.color-btn[data-color="#226DB4"]');
        await page.waitForTimeout(200);

        // Preview should change (contain blue color)
        const newHTML = await preview.innerHTML();
        expect(newHTML).not.toBe(initialHTML);
    });
});
