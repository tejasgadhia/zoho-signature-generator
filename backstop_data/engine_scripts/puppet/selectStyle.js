/**
 * Puppeteer script to select a signature style
 * Uses scriptParams.style to determine which style to select
 */
module.exports = async (page, scenario, vp) => {
    const style = scenario.scriptParams?.style || 'classic';
    console.log('SCENARIO > ' + scenario.label + ' - Selecting style: ' + style);

    // Wait for the page to be ready
    await page.waitForSelector('input[name="signatureStyle"]');

    // Click the style radio button using evaluate for better reliability
    await page.evaluate((styleValue) => {
        const radio = document.querySelector(`input[name="signatureStyle"][value="${styleValue}"]`);
        if (radio) {
            radio.click();
        }
    }, style);

    // Wait for preview to update
    await new Promise(r => setTimeout(r, 200));

    // Run default click and hover helper
    await require('./clickAndHoverHelper')(page, scenario);
};
