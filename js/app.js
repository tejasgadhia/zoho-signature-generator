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
        bookings: '',
        website: 'https://www.zoho.com'
    },
    fieldToggles: {
        title: true,
        department: true,
        email: true,
        phone: true,
        linkedin: true,
        twitter: true,
        bookings: false,
        website: false  // Website is now locked, not toggleable
    },
    signatureStyle: 'classic',
    socialOptions: {
        enabled: true,
        channels: ['twitter', 'linkedin', 'facebook', 'instagram'],
        displayType: 'text'
    },
    isDarkModePreview: false,  // Changed from isDarkMode - only affects preview
    accentColor: '#E42527'  // Default Zoho red
};

// Expose AppState globally for debugging and testing
window.AppState = AppState;

// Acronyms to preserve in title case formatting
const PRESERVED_ACRONYMS = [
    // Job Roles
    'VP', 'SVP', 'EVP', 'CEO', 'CTO', 'CFO', 'COO', 'CMO', 'CIO',
    // Tech Terms
    'iOS', 'API', 'UI', 'UX', 'IT', 'HR',
    // Business Terms
    'B2B', 'B2C', 'SaaS', 'SMB'
];

// Words that should remain lowercase (unless first word)
const LOWERCASE_WORDS = [
    'a', 'an', 'the',           // Articles
    'and', 'but', 'or', 'nor',  // Conjunctions
    'of', 'at', 'by', 'for', 'in', 'on', 'to', 'up', 'with', 'as'  // Prepositions
];

// Smart title case function that preserves acronyms and handles lowercase words
function toSmartTitleCase(str) {
    if (!str || typeof str !== 'string') return str;

    // Split into words
    const words = str.toLowerCase().split(/\s+/);

    // Process each word
    const result = words.map((word, index) => {
        // Always capitalize first word
        if (index === 0) {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }

        // Check if it's a lowercase word
        if (LOWERCASE_WORDS.includes(word)) {
            return word;
        }

        // Capitalize first letter
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');

    // Restore preserved acronyms
    let finalResult = result;
    PRESERVED_ACRONYMS.forEach(acronym => {
        const regex = new RegExp('\\b' + acronym + '\\b', 'gi');
        finalResult = finalResult.replace(regex, acronym);
    });

    return finalResult;
}

// Initialize formatting state from localStorage
const formatLockState = {
    name: localStorage.getItem('format-lock-name') !== 'false',
    title: localStorage.getItem('format-lock-title') !== 'false',
    department: localStorage.getItem('format-lock-department') !== 'false'
};

// Setup format lock icons
function setupFormatLockIcons() {
    document.querySelectorAll('.format-lock-icon').forEach(icon => {
        const fieldId = icon.dataset.field;

        // Set initial state from localStorage
        if (!formatLockState[fieldId]) {
            icon.classList.remove('locked');
            icon.title = 'Title Case OFF - click to enable auto-capitalization';
        } else {
            icon.title = 'Title Case ON - auto-capitalizes on blur';
        }

        // Toggle on click
        icon.addEventListener('click', () => {
            formatLockState[fieldId] = !formatLockState[fieldId];
            icon.classList.toggle('locked');

            if (formatLockState[fieldId]) {
                icon.title = 'Title Case ON - auto-capitalizes on blur';
            } else {
                icon.title = 'Title Case OFF - click to enable auto-capitalization';
            }

            // Save to localStorage
            localStorage.setItem(`format-lock-${fieldId}`, formatLockState[fieldId]);
        });
    });
}

// Apply smart title case formatting on blur and paste
function setupSmartTitleCase() {
    ['name', 'title', 'department'].forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;

        const applyFormatting = () => {
            if (formatLockState[fieldId] && input.value.trim()) {
                input.value = toSmartTitleCase(input.value);
                AppState.formData[fieldId] = input.value;
                updatePreview();
            }
        };

        // Apply on blur
        input.addEventListener('blur', applyFormatting);

        // Apply on paste (wait for paste to complete)
        input.addEventListener('paste', () => {
            setTimeout(applyFormatting, 10);
        });
    });
}

/**
 * Generate tracked zoho.com URL with UTM parameters
 */
function getTrackedWebsiteURL() {
    const emailPrefixInput = document.getElementById('email-prefix');
    const emailPrefix = emailPrefixInput?.value.trim() || 'zoho-employee';
    const baseURL = 'https://www.zoho.com';

    // Build UTM parameters
    const params = new URLSearchParams({
        utm_source: 'email-signature',
        utm_medium: 'signature',
        utm_campaign: emailPrefix
    });

    return `${baseURL}?${params.toString()}`;
}

/**
 * Setup website URL tracking
 */
function setupWebsiteTracking() {
    const emailPrefixInput = document.getElementById('email-prefix');

    if (emailPrefixInput) {
        // Update tracked URL when email changes
        emailPrefixInput.addEventListener('input', () => {
            AppState.formData.website = getTrackedWebsiteURL();
            updatePreview();
        });
    }

    // Set initial tracked URL
    AppState.formData.website = getTrackedWebsiteURL();
}

// DOM elements
const elements = {
    form: document.getElementById('signatureForm'),
    preview: document.getElementById('signaturePreview'),
    previewContainer: document.getElementById('previewContainer'),
    copyButton: document.getElementById('copyButton'),
    themeToggle: document.getElementById('themeToggle'),
    toast: document.getElementById('toast'),
    importButtons: document.querySelectorAll('.import-btn')
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

    // Restore saved accent color
    restoreAccentColor();

    // Load initial form data from values
    loadInitialFormData();

    // Setup event listeners
    setupFormListeners();
    setupFieldToggles();
    setupClearButtons();
    setupStyleSelector();
    setupColorSwitcher();     // Accent color selection
    setupZohoSocialControls();
    setupCopyButton();
    setupThemeToggle();
    setupImportButtons();
    setupFormatLockIcons();   // Smart title case lock icons
    setupSmartTitleCase();    // Smart title case formatting
    setupWebsiteTracking();   // URL tracking for zoho.com

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
 * Auto-generate email prefix from full name
 */
function generateEmailPrefix(fullName) {
    const cleaned = fullName.trim().toLowerCase();
    const parts = cleaned.split(/\s+/);

    if (parts.length >= 2) {
        const first = parts[0].replace(/[^a-z]/g, '');
        const last = parts[parts.length - 1].replace(/[^a-z]/g, '');
        return `${first}.${last}`;
    } else if (parts.length === 1 && parts[0]) {
        return parts[0].replace(/[^a-z]/g, '');
    }
    return '';
}

/**
 * Setup form input listeners for live preview
 */
function setupFormListeners() {
    const textInputs = elements.form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"]');
    const nameInput = document.getElementById('name');
    const emailPrefixInput = document.getElementById('email-prefix');

    // Special handler for name field to auto-generate email
    if (nameInput && emailPrefixInput) {
        nameInput.addEventListener('input', (e) => {
            const fullName = e.target.value;

            // Auto-generate email prefix
            const emailPrefix = generateEmailPrefix(fullName);
            emailPrefixInput.value = emailPrefix;

            // Update both name and email in state
            AppState.formData.name = fullName.trim();
            AppState.formData.email = `${emailPrefix}@zohocorp.com`;

            updatePreview();
        });
    }

    // Listen to email prefix changes
    if (emailPrefixInput) {
        emailPrefixInput.addEventListener('input', (e) => {
            const prefix = e.target.value.trim();
            AppState.formData.email = `${prefix}@zohocorp.com`;
            updatePreview();
        });

        emailPrefixInput.addEventListener('blur', (e) => {
            validateField(e.target);
        });
    }

    // LinkedIn username handler
    const linkedinUsernameInput = document.getElementById('linkedin-username');
    if (linkedinUsernameInput) {
        linkedinUsernameInput.addEventListener('input', (e) => {
            const username = e.target.value.trim();
            AppState.formData.linkedin = username ? `https://linkedin.com/in/${username}` : '';
            updatePreview();
        });

        linkedinUsernameInput.addEventListener('blur', (e) => {
            validateField(e.target);
        });
    }

    // Twitter username handler
    const twitterUsernameInput = document.getElementById('twitter-username');
    if (twitterUsernameInput) {
        twitterUsernameInput.addEventListener('input', (e) => {
            const username = e.target.value.trim();
            AppState.formData.twitter = username ? `@${username}` : '';
            updatePreview();
        });

        twitterUsernameInput.addEventListener('blur', (e) => {
            validateField(e.target);
        });
    }

    // Bookings ID handler
    const bookingsIdInput = document.getElementById('bookings-id');
    if (bookingsIdInput) {
        bookingsIdInput.addEventListener('input', (e) => {
            const bookingsId = e.target.value.trim();
            AppState.formData.bookings = bookingsId ? `https://bookings.zohocorp.com/#/${bookingsId}` : '';
            updatePreview();
        });

        bookingsIdInput.addEventListener('blur', (e) => {
            validateField(e.target);
        });
    }

    textInputs.forEach(input => {
        // Skip special handling for name, email-prefix, linkedin-username, twitter-username, bookings-id (handled above)
        if (input.id === 'name' || input.id === 'email-prefix' ||
            input.id === 'linkedin-username' || input.id === 'twitter-username' ||
            input.id === 'bookings-id') {
            return;
        }

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
    // Exclude social toggles (they have their own handler)
    const toggles = document.querySelectorAll('.toggle-switch:not(.social-toggle)');

    toggles.forEach(toggle => {
        const fieldName = toggle.dataset.field;
        // Special handling for username-based fields
        let inputId = fieldName;
        if (fieldName === 'email') {
            inputId = 'email-prefix';
        } else if (fieldName === 'linkedin') {
            inputId = 'linkedin-username';
        } else if (fieldName === 'twitter') {
            inputId = 'twitter-username';
        } else if (fieldName === 'bookings') {
            inputId = 'bookings-id';
        }
        const input = document.getElementById(inputId);

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
                    if (fieldName === 'email') {
                        // For email, construct full email from prefix
                        const prefix = input.value.trim();
                        AppState.formData[fieldName] = `${prefix}@zohocorp.com`;
                    } else if (fieldName === 'linkedin') {
                        // For LinkedIn, construct full URL from username
                        const username = input.value.trim();
                        AppState.formData[fieldName] = username ? `https://linkedin.com/in/${username}` : '';
                    } else if (fieldName === 'twitter') {
                        // For Twitter, add @ to username
                        const username = input.value.trim();
                        AppState.formData[fieldName] = username ? `@${username}` : '';
                    } else if (fieldName === 'bookings') {
                        // For Bookings, construct full URL from ID
                        const bookingsId = input.value.trim();
                        AppState.formData[fieldName] = bookingsId ? `https://bookings.zohocorp.com/#/${bookingsId}` : '';
                    } else {
                        AppState.formData[fieldName] = input.value.trim();
                    }
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
 * Setup Zoho social media controls (Horizontal Compact Cards)
 */
function setupZohoSocialControls() {
    // Define canonical order for social channels (this determines display order)
    const canonicalOrder = ['twitter', 'linkedin', 'facebook', 'instagram'];

    // Helper function to sort channels by canonical order
    const sortChannels = (channels) => {
        return channels.sort((a, b) => {
            return canonicalOrder.indexOf(a) - canonicalOrder.indexOf(b);
        });
    };

    // Initialize all channels as enabled by default
    AppState.socialOptions.enabled = true;
    AppState.socialOptions.channels = [...canonicalOrder]; // Use spread to create a copy

    // Setup master toggle
    const masterToggle = document.getElementById('master-social-toggle');
    const socialGrid = document.getElementById('socialCompactGrid');

    if (masterToggle) {
        const handleMasterToggle = () => {
            const isNowActive = !masterToggle.classList.contains('active');

            // Toggle visual state
            if (isNowActive) {
                masterToggle.classList.add('active');
                socialGrid.style.display = 'grid';
            } else {
                masterToggle.classList.remove('active');
                socialGrid.style.display = 'none';
            }

            // Update ARIA
            masterToggle.setAttribute('aria-checked', isNowActive);

            // Update state
            AppState.socialOptions.enabled = isNowActive;

            updatePreview();
        };

        masterToggle.addEventListener('click', handleMasterToggle);
        masterToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleMasterToggle();
            }
        });
    }

    // Setup individual card click-to-toggle
    const cards = document.querySelectorAll('.social-compact-card');

    cards.forEach(card => {
        const channel = card.dataset.channel;

        // Handle card click to toggle (but not when dragging)
        let isDragging = false;

        card.addEventListener('mousedown', () => {
            isDragging = false;
        });

        card.addEventListener('mousemove', () => {
            isDragging = true;
        });

        card.addEventListener('click', (e) => {
            // Don't toggle if we're dragging
            if (isDragging) {
                isDragging = false;
                return;
            }

            // Don't toggle if clicking the drag handle
            if (e.target.classList.contains('social-drag-handle')) {
                return;
            }

            // Toggle active state
            const isNowActive = !card.classList.contains('active');

            if (isNowActive) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }

            // Update AppState channels array
            if (isNowActive) {
                // Add channel to enabled list
                if (!AppState.socialOptions.channels.includes(channel)) {
                    AppState.socialOptions.channels.push(channel);
                    // Sort to maintain canonical order
                    AppState.socialOptions.channels = sortChannels(AppState.socialOptions.channels);
                }
            } else {
                // Remove channel from enabled list
                AppState.socialOptions.channels = AppState.socialOptions.channels.filter(c => c !== channel);
            }

            // Enable social section if any channels are active
            AppState.socialOptions.enabled = AppState.socialOptions.channels.length > 0;

            updatePreview();
        });

        // Keyboard support for toggle
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

    // Setup drag-and-drop for reordering
    setupSocialDragAndDrop(canonicalOrder, sortChannels);
}

/**
 * Setup drag-and-drop functionality for social media compact grid (Horizontal)
 * Implements modern UX best practices:
 * - Mouse drag with visual feedback (left/right positioning)
 * - Keyboard navigation (Space to grab, Arrow keys to move, Space to drop)
 * - Screen reader announcements
 * - Touch support
 * - Smooth animations
 */
function setupSocialDragAndDrop(canonicalOrder, sortChannels) {
    const socialGrid = document.getElementById('socialCompactGrid');
    const cards = document.querySelectorAll('.social-compact-card');

    // Create ARIA live region for screen reader announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    // State management
    let draggedCard = null;
    let keyboardGrabbedCard = null;

    // Helper: Announce to screen readers
    const announce = (message) => {
        liveRegion.textContent = message;
    };

    // Helper: Get current position
    const getCardPosition = (card) => {
        return Array.from(socialGrid.children).indexOf(card) + 1;
    };

    // Helper: Get card label
    const getCardLabel = (card) => {
        return card.querySelector('.social-compact-label').textContent;
    };

    // Helper: Save order to state and localStorage
    const saveOrder = () => {
        const newOrder = Array.from(socialGrid.querySelectorAll('.social-compact-card'))
            .map(card => card.dataset.channel);

        canonicalOrder.length = 0;
        canonicalOrder.push(...newOrder);

        AppState.socialOptions.channels = sortChannels(AppState.socialOptions.channels);
        localStorage.setItem('socialChannelOrder', JSON.stringify(newOrder));
        updatePreview();
    };

    // Helper: Animate drop with smooth transition
    const animateDrop = (card) => {
        card.style.transition = 'all 200ms cubic-bezier(0.2, 0, 0, 1)';
        setTimeout(() => {
            card.style.transition = '';
        }, 200);
    };

    // Setup mouse/touch drag for each card
    cards.forEach((card) => {
        // Make cards focusable for keyboard navigation
        card.setAttribute('aria-label', `${getCardLabel(card)} - Click to toggle, drag to reorder, or press space for keyboard reordering`);

        // Mouse drag events
        card.addEventListener('dragstart', (e) => {
            draggedCard = card;
            card.classList.add('dragging');
            socialGrid.classList.add('drag-active');

            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', card.innerHTML);

            // Custom drag image with offset
            const rect = card.getBoundingClientRect();
            e.dataTransfer.setDragImage(card, e.clientX - rect.left, e.clientY - rect.top);

            announce(`Grabbed ${getCardLabel(card)}`);

            // Haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
            socialGrid.classList.remove('drag-active');

            // Remove all drag-over classes
            cards.forEach(c => {
                c.classList.remove('drag-over-left', 'drag-over-right');
            });

            animateDrop(card);
            saveOrder();

            announce(`Dropped ${getCardLabel(card)} at position ${getCardPosition(card)}`);

            // Haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(20);
            }

            draggedCard = null;
        });

        // Drag over - live reordering with visual feedback (horizontal)
        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';

            if (draggedCard && draggedCard !== card) {
                const rect = card.getBoundingClientRect();

                // Live reorder: move cards in real-time as user drags horizontally
                const afterElement = (e.clientX - rect.left) > (rect.width / 2);

                if (afterElement) {
                    // Insert after this card
                    const nextSibling = card.nextSibling;
                    if (nextSibling !== draggedCard) {
                        socialGrid.insertBefore(draggedCard, nextSibling);
                    }
                } else {
                    // Insert before this card
                    if (card !== draggedCard) {
                        socialGrid.insertBefore(draggedCard, card);
                    }
                }
            }
        });

        // Drop - just finalize the position and save
        card.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Position is already set from live reordering in dragover
        });

        // Keyboard navigation (horizontal)
        card.addEventListener('keydown', (e) => {
            // Space to grab/drop
            if (e.key === ' ' && !e.target.classList.contains('social-compact-card')) {
                // Only handle space on the card itself, not when focused on other elements
                e.preventDefault();

                if (keyboardGrabbedCard === card) {
                    // Drop
                    card.classList.remove('keyboard-grabbed');
                    keyboardGrabbedCard = null;

                    animateDrop(card);
                    saveOrder();

                    announce(`Dropped ${getCardLabel(card)} at position ${getCardPosition(card)}`);

                    // Haptic feedback
                    if (navigator.vibrate) {
                        navigator.vibrate(20);
                    }
                } else {
                    // Grab
                    keyboardGrabbedCard = card;
                    card.classList.add('keyboard-grabbed');

                    announce(`Grabbed ${getCardLabel(card)} at position ${getCardPosition(card)}. Use left/right arrow keys to move, space to drop.`);

                    // Haptic feedback
                    if (navigator.vibrate) {
                        navigator.vibrate(10);
                    }
                }
            }

            // Arrow keys to move when grabbed (horizontal: left/right)
            if (keyboardGrabbedCard === card && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
                e.preventDefault();

                const allCards = Array.from(socialGrid.children);
                const currentIndex = allCards.indexOf(card);

                if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    // Move left
                    socialGrid.insertBefore(card, allCards[currentIndex - 1]);
                    announce(`Moved ${getCardLabel(card)} to position ${getCardPosition(card)}`);
                } else if (e.key === 'ArrowRight' && currentIndex < allCards.length - 1) {
                    // Move right
                    socialGrid.insertBefore(card, allCards[currentIndex + 2]);
                    announce(`Moved ${getCardLabel(card)} to position ${getCardPosition(card)}`);
                }

                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(5);
                }
            }

            // Escape to cancel
            if (e.key === 'Escape' && keyboardGrabbedCard === card) {
                card.classList.remove('keyboard-grabbed');
                keyboardGrabbedCard = null;
                announce(`Cancelled reordering ${getCardLabel(card)}`);
            }
        });
    });

    // Load custom order from localStorage if it exists
    const savedOrder = localStorage.getItem('socialChannelOrder');
    if (savedOrder) {
        try {
            const customOrder = JSON.parse(savedOrder);

            canonicalOrder.length = 0;
            canonicalOrder.push(...customOrder);

            customOrder.forEach(channel => {
                const card = socialGrid.querySelector(`[data-channel="${channel}"]`);
                if (card) {
                    socialGrid.appendChild(card);
                }
            });

            AppState.socialOptions.channels = sortChannels(AppState.socialOptions.channels);
            updatePreview();
        } catch (e) {
            console.error('Failed to load custom social channel order:', e);
        }
    }
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
                AppState.socialOptions,
                AppState.accentColor
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
                    AppState.socialOptions,
                    AppState.accentColor
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
        AppState.isDarkModePreview = e.target.checked;
        applyTheme();
        saveThemePreference();
    });
}

/**
 * Apply theme to preview container
 */
function applyTheme() {
    if (AppState.isDarkModePreview) {
        elements.previewContainer.classList.add('dark-mode');
    } else {
        elements.previewContainer.classList.remove('dark-mode');
    }
}

/**
 * Load theme preference from localStorage
 */
function loadThemePreference() {
    const savedTheme = localStorage.getItem('zoho-signature-preview-theme');
    if (savedTheme === 'dark') {
        AppState.isDarkModePreview = true;
        elements.themeToggle.checked = true;
        applyTheme();
    }
}

/**
 * Save theme preference to localStorage
 */
function saveThemePreference() {
    localStorage.setItem('zoho-signature-preview-theme', AppState.isDarkModePreview ? 'dark' : 'light');
}

/**
 * Restore saved accent color from localStorage
 */
function restoreAccentColor() {
    const savedColor = localStorage.getItem('signature-accent-color');
    if (savedColor) {
        AppState.accentColor = savedColor;

        // Update UI to reflect saved color
        document.querySelectorAll('.color-btn').forEach(btn => {
            if (btn.dataset.color === savedColor) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }
}

/**
 * Setup color switcher event listeners
 */
function setupColorSwitcher() {
    const buttons = document.querySelectorAll('.color-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const color = e.target.dataset.color;

            // Update state
            AppState.accentColor = color;

            // Update UI - remove selected from all, add to clicked
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
            e.target.classList.add('selected');

            // Persist to localStorage
            localStorage.setItem('signature-accent-color', color);

            // Update preview
            updatePreview();
        });
    });
}

/**
 * Setup import button handlers (sidebar)
 */
function setupImportButtons() {
    elements.importButtons.forEach(button => {
        button.addEventListener('click', () => {
            const clientType = button.dataset.client;
            ModalController.open(clientType);
        });
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
        AppState.socialOptions,
        AppState.accentColor
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

    // Validate email prefix - must be alphanumeric + dots
    if (input.id === 'email-prefix' && value) {
        // Email prefix validation: lowercase letters, numbers, dots
        const prefixRegex = /^[a-z0-9.]+$/;
        if (!prefixRegex.test(value)) {
            const message = 'Email prefix can only contain lowercase letters, numbers, and dots';
            input.setCustomValidity(message);
            displayValidationError(input, message);
        } else if (value.startsWith('.') || value.endsWith('.') || value.includes('..')) {
            const message = 'Dots cannot be at the start, end, or consecutive';
            input.setCustomValidity(message);
            displayValidationError(input, message);
        } else {
            input.setCustomValidity('');
            displayValidationError(input, '');
        }
    }

    // Validate email - must end with @zohocorp.com (legacy support)
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
