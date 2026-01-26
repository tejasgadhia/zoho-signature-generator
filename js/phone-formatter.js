/**
 * Phone Number Formatting (Blur-Based - Best Practice)
 *
 * Based on industry research from Stripe, Shopify, Nielsen Norman Group:
 * - Format ON BLUR (not real-time) to support copy-paste and CMD+A delete
 * - Accept any format during typing (flexible parsing)
 * - Reformat to +1 (555) 123-4567 after user finishes
 * - No live masking that breaks UX
 */

/**
 * Format phone number to +1 (555) 123-4567
 * @param {string} value - Raw phone input (any format)
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(value) {
    // Extract digits only
    const digits = value.replace(/\D/g, '');

    // Handle empty
    if (digits.length === 0) return '';

    // Handle 11 digits (user included 1 prefix)
    let workingDigits = digits;
    if (digits.length === 11 && digits.startsWith('1')) {
        workingDigits = digits.slice(1); // Remove leading 1
    } else if (digits.length > 10) {
        workingDigits = digits.slice(0, 10); // Take first 10
    }

    // Format based on length
    if (workingDigits.length <= 3) {
        return `+1 (${workingDigits}`;
    } else if (workingDigits.length <= 6) {
        return `+1 (${workingDigits.slice(0, 3)}) ${workingDigits.slice(3)}`;
    } else {
        return `+1 (${workingDigits.slice(0, 3)}) ${workingDigits.slice(3, 6)}-${workingDigits.slice(6, 10)}`;
    }
}

/**
 * Setup phone formatting on blur
 */
function setupPhoneFormatting() {
    const phoneInput = document.getElementById('phone');

    if (!phoneInput) {
        console.warn('Phone input not found');
        return;
    }

    // Format on blur (after user finishes typing)
    phoneInput.addEventListener('blur', function() {
        const value = phoneInput.value.trim();
        if (value && value.length > 0) {
            const formatted = formatPhoneNumber(value);
            phoneInput.value = formatted;

            // Update AppState by triggering input event
            const event = new Event('input', { bubbles: true });
            phoneInput.dispatchEvent(event);
        }
    });
}
