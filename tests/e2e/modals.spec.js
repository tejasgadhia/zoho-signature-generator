// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Feedback Modal', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should open feedback modal on button click', async ({ page }) => {
        const feedbackBtn = page.locator('#feedbackButton');
        const feedbackModal = page.locator('#feedback-modal');

        // Initially hidden
        await expect(feedbackModal).toHaveAttribute('aria-hidden', 'true');

        // Click feedback button
        await feedbackBtn.click();
        await page.waitForTimeout(200);

        // Modal should be visible
        await expect(feedbackModal).toHaveAttribute('aria-hidden', 'false');
    });

    test('should close feedback modal on close button click', async ({ page }) => {
        // Open modal
        await page.click('#feedbackButton');
        await page.waitForTimeout(200);

        // Click close button
        await page.click('#feedback-modal .modal-close');
        await page.waitForTimeout(200);

        // Modal should be hidden
        const feedbackModal = page.locator('#feedback-modal');
        await expect(feedbackModal).toHaveAttribute('aria-hidden', 'true');
    });

    test('should close feedback modal on Escape key', async ({ page }) => {
        // Open modal
        await page.click('#feedbackButton');
        await page.waitForTimeout(200);

        // Press Escape
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);

        // Modal should be hidden
        const feedbackModal = page.locator('#feedback-modal');
        await expect(feedbackModal).toHaveAttribute('aria-hidden', 'true');
    });

    test('should show 3 contact options in feedback modal', async ({ page }) => {
        await page.click('#feedbackButton');
        await page.waitForTimeout(200);

        // Should have 3 feedback options (Cliq, Email, GitHub)
        const feedbackOptions = page.locator('.feedback-option');
        await expect(feedbackOptions).toHaveCount(3);
    });
});

test.describe('Import Instructions Modal', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should open Zoho Mail instructions modal', async ({ page }) => {
        // Click Zoho Mail button
        await page.click('.import-btn[data-client="zoho-mail"]');
        await page.waitForTimeout(200);

        // Modal should be visible
        const importModal = page.locator('#import-modal');
        await expect(importModal).toHaveAttribute('aria-hidden', 'false');

        // Modal should show Zoho Mail content
        const modalContent = page.locator('#modal-body-content');
        await expect(modalContent).toContainText('Settings');
    });

    test('should open Zoho Desk instructions modal', async ({ page }) => {
        await page.click('.import-btn[data-client="zoho-desk"]');
        await page.waitForTimeout(200);

        const importModal = page.locator('#import-modal');
        await expect(importModal).toHaveAttribute('aria-hidden', 'false');
    });

    test('should open Gmail instructions modal', async ({ page }) => {
        await page.click('.import-btn[data-client="gmail"]');
        await page.waitForTimeout(200);

        const importModal = page.locator('#import-modal');
        await expect(importModal).toHaveAttribute('aria-hidden', 'false');
    });

    test('should close import modal on close button click', async ({ page }) => {
        await page.click('.import-btn[data-client="zoho-mail"]');
        await page.waitForTimeout(200);

        await page.click('#import-modal .modal-close');
        await page.waitForTimeout(200);

        const importModal = page.locator('#import-modal');
        await expect(importModal).toHaveAttribute('aria-hidden', 'true');
    });

    test('should close import modal on backdrop click', async ({ page }) => {
        await page.click('.import-btn[data-client="zoho-mail"]');
        await page.waitForTimeout(200);

        // Use JavaScript evaluation to click backdrop (since it's behind modal content)
        await page.evaluate(() => {
            const backdrop = document.querySelector('#import-modal .modal-backdrop');
            if (backdrop) backdrop.click();
        });
        await page.waitForTimeout(200);

        const importModal = page.locator('#import-modal');
        await expect(importModal).toHaveAttribute('aria-hidden', 'true');
    });
});
