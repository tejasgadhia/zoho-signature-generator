/**
 * Puppeteer script to open the feedback modal
 */
module.exports = async (page, scenario, vp) => {
    console.log('SCENARIO > ' + scenario.label + ' - Opening feedback modal');

    // Wait for the page to be ready
    await page.waitForSelector('#feedbackButton');

    // Click the feedback button using evaluate for better reliability
    await page.evaluate(() => {
        const btn = document.querySelector('#feedbackButton');
        if (btn) {
            btn.click();
        }
    });

    // Wait for modal animation to complete
    await new Promise(r => setTimeout(r, 300));

    // Run default click and hover helper
    await require('./clickAndHoverHelper')(page, scenario);
};
