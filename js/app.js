/**
 * Main Application Logic
 * Handles form interactions, preview updates, and copy functionality
 */

// Application state
const AppState = {
    formData: {
        name: '',
        title: '',
        department: '',
        email: '',
        phone: '',
        linkedin: '',
        twitter: '',
        website: 'https://www.zoho.com'
    },
    fieldToggles: {
        title: true,
        department: true,
        email: true,
        phone: true,
        linkedin: true,
        twitter: true,
        website: true
    },
    signatureStyle: 'classic',
    socialOptions: {
        enabled: false,
        channels: ['twitter', 'linkedin', 'facebook', 'instagram'],
        displayType: 'text'
    },
    isDarkMode: false
};

// DOM elements
const elements = {
    form: document.getElementById('signatureForm'),
    preview: document.getElementById('signaturePreview'),
    previewContainer: document.getElementById('previewContainer'),
    copyButton: document.getElementById('copyButton'),
    howToButton: document.getElementById('howToButton'),
    themeToggle: document.getElementById('themeToggle'),
    toast: document.getElementById('toast')
};

/**
 * Defensive null check for critical elements
 */
function validateDOMElements() {
    const requiredElements = ['form', 'preview', 'previewContainer', 'copyButton'];
    const missing = requiredElements.filter(key => !elements[key]);

    if (missing.length > 0) {
        console.warn('Warning: Missing required DOM elements:', missing);
        console.warn('Application may not function correctly.');
    }

    return missing.length === 0;
}

/**
 * Initialize the application
 */
function init() {
    // Validate DOM elements exist
    if (!validateDOMElements()) {
        console.error('Critical DOM elements missing. Halting initialization.');
        return;
    }

    // Load saved theme preference
    loadThemePreference();

    // Load initial form data from values
    loadInitialFormData();

    // Setup event listeners
    setupFormListeners();
    setupFieldToggles();
    setupClearButtons();
    setupStyleSelector();
    setupZohoSocialControls();
    setupCopyButton();
    setupThemeToggle();
    setupHowToButton();

    // Initial preview update
    updatePreview();
}

/**
 * Load initial form data from input values
 */
function loadInitialFormData() {
    const textInputs = elements.form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"]');

    textInputs.forEach(input => {
        const fieldName = input.name;
        const value = input.value.trim();

        if (value) {
            AppState.formData[fieldName] = value;
        }
    });
}

/**
 * Setup form input listeners for live preview
 */
function setupFormListeners() {
    const textInputs = elements.form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"]');

    textInputs.forEach(input => {
        // Update on input (real-time)
        input.addEventListener('input', (e) => {
            const fieldName = e.target.name;
            const value = e.target.value.trim();

            AppState.formData[fieldName] = value;
            updatePreview();
        });

        // Validate on blur
        input.addEventListener('blur', (e) => {
            validateField(e.target);
        });
    });
}

/**
 * Setup field toggle switches
 */
function setupFieldToggles() {
    const toggles = document.querySelectorAll('.toggle-switch');

    toggles.forEach(toggle => {
        const fieldName = toggle.dataset.field;
        const input = document.getElementById(fieldName);

        // Set initial state based on active class
        const isActive = toggle.classList.contains('active');
        AppState.fieldToggles[fieldName] = isActive;
        if (input) {
            input.disabled = !isActive;
        }

        // Handle toggle action (shared between click and keyboard)
        const handleToggle = () => {
            const isNowActive = !toggle.classList.contains('active');

            // Toggle active class
            if (isNowActive) {
                toggle.classList.add('active');
            } else {
                toggle.classList.remove('active');
            }

            // Update ARIA state for accessibility
            toggle.setAttribute('aria-checked', isNowActive);

            // Update state
            AppState.fieldToggles[fieldName] = isNowActive;

            if (input) {
                input.disabled = !isNowActive;

                // Clear the field data if turned off
                if (!isNowActive) {
                    AppState.formData[fieldName] = '';
                } else {
                    // Restore the value if re-enabled
                    AppState.formData[fieldName] = input.value.trim();
                }
            }

            updatePreview();
        };

        // Listen for clicks
        toggle.addEventListener('click', handleToggle);

        // Listen for keyboard events (Enter and Space)
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleToggle();
            }
        });
    });
}

/**
 * Setup clear button functionality
 */
function setupClearButtons() {
    const clearButtons = document.querySelectorAll('.clear-btn');

    clearButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const inputName = e.target.dataset.input;
            const input = document.getElementById(inputName);

            if (input) {
                input.value = '';
                AppState.formData[inputName] = '';
                updatePreview();
                input.focus();
            }
        });
    });
}

/**
 * Setup signature style selector
 */
function setupStyleSelector() {
    const styleRadios = document.querySelectorAll('input[name="signatureStyle"]');

    styleRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            AppState.signatureStyle = e.target.value;
            updatePreview();
        });
    });
}

/**
 * Setup Zoho social media controls
 */
function setupZohoSocialControls() {
    const socialAllToggle = document.getElementById('zohoSocialAll');
    const socialChannels = document.getElementById('socialChannels');
    const socialDisplayRadios = document.querySelectorAll('input[name="socialDisplay"]');
    const channelToggles = document.querySelectorAll('.social-channel-toggle');

    // Main toggle for all social media
    if (socialAllToggle && socialChannels) {
        socialAllToggle.addEventListener('change', (e) => {
            AppState.socialOptions.enabled = e.target.checked;

            if (e.target.checked) {
                socialChannels.classList.add('active');
            } else {
                socialChannels.classList.remove('active');
            }

            updatePreview();
        });
    }

    // Display type toggle (text vs icons)
    socialDisplayRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            AppState.socialOptions.displayType = e.target.value;
            updatePreview();
        });
    });

    // Individual channel toggles
    channelToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            // Rebuild channels array from checked boxes
            AppState.socialOptions.channels = [];
            channelToggles.forEach(t => {
                if (t.checked) {
                    AppState.socialOptions.channels.push(t.dataset.channel);
                }
            });
            updatePreview();
        });
    });
}

/**
 * Setup copy to clipboard functionality
 */
function setupCopyButton() {
    elements.copyButton.addEventListener('click', async () => {
        // Check if we have required field (name)
        if (!AppState.formData.name) {
            showToast('Please fill in your name', 'error');
            return;
        }

        // Set loading state
        const originalText = elements.copyButton.querySelector('.btn-text').textContent;
        elements.copyButton.disabled = true;
        elements.copyButton.querySelector('.btn-text').textContent = 'Copying...';

        try {
            // Build filtered form data based on toggles
            const filteredData = getFilteredFormData();

            // Generate the signature HTML
            const signatureHtml = SignatureGenerator.generate(
                filteredData,
                AppState.signatureStyle,
                AppState.socialOptions
            );

            // Modern clipboard API
            if (navigator.clipboard && navigator.clipboard.write) {
                const blob = new Blob([signatureHtml], { type: 'text/html' });
                const plainTextBlob = new Blob([signatureHtml], { type: 'text/plain' });

                const clipboardItem = new ClipboardItem({
                    'text/html': blob,
                    'text/plain': plainTextBlob
                });

                await navigator.clipboard.write([clipboardItem]);
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(signatureHtml);
            } else {
                copyToClipboardFallback(signatureHtml);
            }

            // Show success feedback
            showCopySuccess();
            showToast('Signature copied to clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy:', error);
            try {
                const filteredData = getFilteredFormData();
                const signatureHtml = SignatureGenerator.generate(
                    filteredData,
                    AppState.signatureStyle,
                    AppState.socialOptions
                );
                copyToClipboardFallback(signatureHtml);
                showCopySuccess();
                showToast('Signature copied to clipboard!', 'success');
            } catch (fallbackError) {
                showToast('Failed to copy. Please try again.', 'error');
            }
        } finally {
            // Restore button state
            elements.copyButton.disabled = false;
            elements.copyButton.querySelector('.btn-text').textContent = originalText;
        }
    });
}

/**
 * Get filtered form data based on toggle states
 */
function getFilteredFormData() {
    const filtered = { name: AppState.formData.name };

    Object.keys(AppState.fieldToggles).forEach(field => {
        if (AppState.fieldToggles[field] && AppState.formData[field]) {
            filtered[field] = AppState.formData[field];
        }
    });

    return filtered;
}

/**
 * Fallback method to copy to clipboard
 */
function copyToClipboardFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

/**
 * Show copy success animation
 */
function showCopySuccess() {
    elements.copyButton.classList.add('success');
    const originalText = elements.copyButton.querySelector('.btn-text').textContent;
    elements.copyButton.querySelector('.btn-text').textContent = 'Copied!';

    setTimeout(() => {
        elements.copyButton.classList.remove('success');
        elements.copyButton.querySelector('.btn-text').textContent = originalText;
    }, 2000);
}

/**
 * Setup theme toggle
 */
function setupThemeToggle() {
    elements.themeToggle.addEventListener('change', (e) => {
        AppState.isDarkMode = e.target.checked;
        applyTheme();
        saveThemePreference();
    });
}

/**
 * Apply theme to preview container
 */
function applyTheme() {
    if (AppState.isDarkMode) {
        elements.previewContainer.classList.add('dark-mode');
    } else {
        elements.previewContainer.classList.remove('dark-mode');
    }
}

/**
 * Load theme preference from localStorage
 */
function loadThemePreference() {
    const savedTheme = localStorage.getItem('zoho-signature-theme');
    if (savedTheme === 'dark') {
        AppState.isDarkMode = true;
        elements.themeToggle.checked = true;
        applyTheme();
    }
}

/**
 * Save theme preference to localStorage
 */
function saveThemePreference() {
    localStorage.setItem('zoho-signature-theme', AppState.isDarkMode ? 'dark' : 'light');
}

/**
 * Setup how-to button to open modal
 */
function setupHowToButton() {
    elements.howToButton.addEventListener('click', () => {
        ModalController.open();
    });
}

/**
 * Update preview with current form data
 */
function updatePreview() {
    const filteredData = getFilteredFormData();
    const previewHtml = SignatureGenerator.generatePreview(
        filteredData,
        AppState.signatureStyle,
        AppState.socialOptions
    );
    elements.preview.innerHTML = previewHtml;
}

/**
 * Validate individual field
 */
function validateField(input) {
    const value = input.value.trim();

    // Skip validation if empty (except for required fields)
    if (!value) {
        input.setCustomValidity('');
        displayValidationError(input, '');
        return;
    }

    // Validate email - must end with @zohocorp.com
    if (input.type === 'email' && value) {
        if (!SignatureGenerator.isValidEmail(value)) {
            const message = 'Please enter a valid email address';
            input.setCustomValidity(message);
            displayValidationError(input, message);
        } else if (!value.endsWith('@zohocorp.com')) {
            const message = 'Email must be a @zohocorp.com address';
            input.setCustomValidity(message);
            displayValidationError(input, message);
        } else {
            input.setCustomValidity('');
            displayValidationError(input, '');
        }
    }

    // Validate phone - accept common formats
    if (input.type === 'tel' && value) {
        if (!SignatureGenerator.isValidPhone(value)) {
            const message = 'Please enter a valid phone number (e.g., +1 (512) 555-1234)';
            input.setCustomValidity(message);
            displayValidationError(input, message);
        } else {
            input.setCustomValidity('');
            displayValidationError(input, '');
        }
    }

    // Validate URLs and clean up LinkedIn URLs
    if (input.type === 'url' && value) {
        if (!SignatureGenerator.isValidUrl(value)) {
            const message = 'Please enter a valid URL';
            input.setCustomValidity(message);
            displayValidationError(input, message);
        } else {
            input.setCustomValidity('');
            displayValidationError(input, '');

            // Clean up LinkedIn URLs
            if (input.name === 'linkedin' && value.includes('linkedin.com')) {
                const cleanedUrl = SignatureGenerator.cleanLinkedInUrl(value);
                if (cleanedUrl !== value) {
                    input.value = cleanedUrl;
                    AppState.formData.linkedin = cleanedUrl;
                }
            }
        }
    }
}

/**
 * Display or hide error message for an input
 */
function displayValidationError(input, message) {
    const inputGroup = input.closest('.input-group');
    if (!inputGroup) return;

    // Find or create error message element
    let errorElement = inputGroup.querySelector('.error-message');

    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'polite');

        // Insert after input-wrapper
        const inputWrapper = inputGroup.querySelector('.input-wrapper');
        if (inputWrapper) {
            inputWrapper.parentNode.insertBefore(errorElement, inputWrapper.nextSibling);
        }
    }

    // Set error ID for aria-describedby
    const errorId = `${input.id}-error`;
    errorElement.id = errorId;

    if (message) {
        // Show error
        errorElement.textContent = message;
        errorElement.classList.add('visible');
        input.setAttribute('aria-describedby', errorId);
        input.setAttribute('aria-invalid', 'true');
    } else {
        // Hide error
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
        input.removeAttribute('aria-describedby');
        input.removeAttribute('aria-invalid');
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type}`;
    elements.toast.classList.add('show');

    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

/**
 * Handle keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K to focus on first input
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('name').focus();
    }
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
