/**
 * Puppeteer script to select a signature style AND enable dark mode
 * Uses scriptParams.style to determine which style to select
 */
module.exports = async (page, scenario, vp) => {
    const style = scenario.scriptParams?.style || 'classic';
    console.log('SCENARIO > ' + scenario.label + ' - Selecting style: ' + style + ' (dark mode)');

    // Wait for the page to be ready
    await page.waitForSelector('input[name="signatureStyle"]');
    await page.waitForSelector('#themeToggle');

    // Click the style radio button using evaluate
    await page.evaluate((styleValue) => {
        const radio = document.querySelector(`input[name="signatureStyle"][value="${styleValue}"]`);
        if (radio) {
            radio.click();
        }
    }, style);

    // Enable dark mode using evaluate
    await page.evaluate(() => {
        const toggle = document.querySelector('#themeToggle');
        if (toggle) {
            toggle.click();
        }
    });

    // Wait for transitions to complete
    await new Promise(r => setTimeout(r, 300));

    // Run default click and hover helper
    await require('./clickAndHoverHelper')(page, scenario);
};
