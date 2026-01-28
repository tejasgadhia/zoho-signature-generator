/**
 * Puppeteer script to fill the form with test data
 */
module.exports = async (page, scenario, vp) => {
    console.log('SCENARIO > ' + scenario.label + ' - Filling form with test data');

    // Wait for the page to be ready
    await page.waitForSelector('#name');

    // Fill in required and optional fields
    await page.type('#name', 'Jasmine Frank');
    await page.type('#title', 'Director of Marketing');
    await page.type('#department', 'Zoho One');
    await page.type('#email-prefix', 'jasmine.frank');
    await page.type('#phone', '+1 (512) 555-0123');

    // Enable LinkedIn toggle and fill in username using evaluate
    await page.evaluate(() => {
        const linkedinToggle = document.querySelector('.toggle-switch[data-field="linkedin"]');
        if (linkedinToggle) {
            linkedinToggle.click();
        }
    });

    // Wait for toggle animation
    await new Promise(r => setTimeout(r, 100));

    // Fill LinkedIn username
    await page.type('#linkedin-username', 'jasminefrank');

    // Wait for preview to update
    await new Promise(r => setTimeout(r, 300));

    // Run default click and hover helper
    await require('./clickAndHoverHelper')(page, scenario);
};
