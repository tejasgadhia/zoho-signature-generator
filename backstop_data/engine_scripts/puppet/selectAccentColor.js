/**
 * Puppeteer script to select an accent color
 * Uses scriptParams.color to determine which color to select (hex value)
 */
module.exports = async (page, scenario, vp) => {
    const color = scenario.scriptParams?.color || '#E42527';
    console.log('SCENARIO > ' + scenario.label + ' - Selecting color: ' + color);

    // Wait for the page to be ready
    await page.waitForSelector('.color-btn');

    // Click the color button using evaluate for better reliability
    await page.evaluate((colorValue) => {
        const btn = document.querySelector(`.color-btn[data-color="${colorValue}"]`);
        if (btn) {
            btn.click();
        }
    }, color);

    // Wait for preview to update
    await new Promise(r => setTimeout(r, 200));

    // Run default click and hover helper
    await require('./clickAndHoverHelper')(page, scenario);
};
