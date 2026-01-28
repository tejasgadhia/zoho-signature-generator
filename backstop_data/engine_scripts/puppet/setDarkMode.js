/**
 * Puppeteer script to enable dark mode
 */
module.exports = async (page, scenario, vp) => {
    console.log('SCENARIO > ' + scenario.label + ' - Enabling dark mode');

    // Wait for the page to be ready
    await page.waitForSelector('#themeToggle');

    // Click the checkbox input directly (the toggle uses a checkbox)
    await page.evaluate(() => {
        const toggle = document.querySelector('#themeToggle');
        if (toggle) {
            toggle.click();
        }
    });

    // Wait for the theme transition to complete
    await new Promise(r => setTimeout(r, 300));

    // Run default click and hover helper
    await require('./clickAndHoverHelper')(page, scenario);
};
