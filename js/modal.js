/**
 * Modal Controller
 * Handles modal open/close functionality for import instructions
 */

const ModalController = {
    modal: null,
    closeButton: null,
    backdrop: null,
    handleTabKey: null,  // Store reference for cleanup

    /**
     * Initialize modal controller
     */
    init() {
        this.modal = document.getElementById('import-modal');

        if (!this.modal) {
            console.warn('Modal element not found. Modal functionality disabled.');
            return;
        }

        this.closeButton = this.modal.querySelector('.modal-close');
        this.backdrop = this.modal.querySelector('.modal-backdrop');

        if (!this.closeButton || !this.backdrop) {
            console.warn('Modal child elements missing. Modal may not function correctly.');
        }

        this.setupEventListeners();
    },

    /**
     * Setup event listeners for modal
     */
    setupEventListeners() {
        // Close button click
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.close();
            });
        }

        // Backdrop click to close
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => {
                this.close();
            });
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });

        // Prevent modal content clicks from closing
        const modalContent = this.modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    },

    /**
     * Open the modal with client-specific content
     */
    open(clientType = 'zoho-mail') {
        if (!this.modal) {
            console.warn('Cannot open modal: modal element not initialized');
            return;
        }

        // Update modal content based on client type
        this.updateContent(clientType);

        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');

        // Trap focus inside modal
        this.trapFocus();

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    },

    /**
     * Update modal content for specific email client
     */
    updateContent(clientType) {
        const modalTitle = this.modal.querySelector('#modalTitle');
        const modalBody = this.modal.querySelector('#modal-body-content');

        if (!modalTitle || !modalBody) {
            console.warn('Modal title or body not found');
            return;
        }

        const content = this.getClientInstructions(clientType);
        modalTitle.textContent = content.title;
        modalBody.innerHTML = content.body;
    },

    /**
     * Get instructions for specific email client
     */
    getClientInstructions(clientType) {
        const instructions = {
            'zoho-mail': {
                title: 'Import to Zoho Mail',
                body: `
                    <div class="instruction-section highlighted">
                        <h3>✉️ Zoho Mail</h3>
                        <ol>
                            <li><strong>Step 1:</strong> Click the <strong>Copy Signature</strong> button to copy your signature</li>
                            <li><strong>Step 2:</strong> Open Zoho Mail and click the <strong>Settings</strong> icon (gear ⚙️) in the top-right corner</li>
                            <li><strong>Step 3:</strong> In the left sidebar menu, click <strong>Mail</strong> to expand options</li>
                            <li><strong>Step 4:</strong> Click on <strong>Signature</strong> from the expanded menu</li>
                            <li><strong>Step 5:</strong> Click inside the signature editor box</li>
                            <li><strong>Step 6:</strong> Paste your signature using <strong>Ctrl+V</strong> (Windows) or <strong>Cmd+V</strong> (Mac)</li>
                            <li><strong>Step 7:</strong> Click <strong>Save</strong> button at the bottom of the page</li>
                            <li><strong>Step 8:</strong> Compose a test email to verify the signature looks correct</li>
                        </ol>
                        <div class="tip-box">
                            <strong>💡 Pro Tip:</strong> If the logo doesn't appear, make sure you're connected to the internet. The logo loads from Zoho's servers.
                        </div>
                    </div>
                `
            },
            'zoho-desk': {
                title: 'Import to Zoho Desk',
                body: `
                    <div class="instruction-section highlighted">
                        <h3>🎫 Zoho Desk</h3>
                        <ol>
                            <li><strong>Step 1:</strong> Click the <strong>Copy Signature</strong> button to copy your signature</li>
                            <li><strong>Step 2:</strong> Open Zoho Desk and navigate to <strong>Setup</strong></li>
                            <li><strong>Step 3:</strong> Click on <strong>Email</strong> in the left sidebar</li>
                            <li><strong>Step 4:</strong> Select <strong>Email Signature</strong></li>
                            <li><strong>Step 5:</strong> Click <strong>Add Signature</strong> or edit your existing signature</li>
                            <li><strong>Step 6:</strong> Paste your signature using <strong>Ctrl+V</strong> (Windows) or <strong>Cmd+V</strong> (Mac)</li>
                            <li><strong>Step 7:</strong> Enable <strong>"Use this signature for ticket responses"</strong></li>
                            <li><strong>Step 8:</strong> Click <strong>Save</strong></li>
                            <li><strong>Step 9:</strong> Test by responding to a ticket</li>
                        </ol>
                        <div class="tip-box">
                            <strong>💡 Pro Tip:</strong> You can create different signatures for different departments or agents.
                        </div>
                    </div>
                `
            },
            'gmail': {
                title: 'Import to Gmail',
                body: `
                    <div class="instruction-section">
                        <h3>📧 Gmail</h3>
                        <ol>
                            <li>Click the <strong>Copy Signature</strong> button</li>
                            <li>Open Gmail and click the gear icon (⚙️) → <strong>See all settings</strong></li>
                            <li>Scroll down to the <strong>Signature</strong> section</li>
                            <li>Click <strong>Create new</strong> and give it a name</li>
                            <li>Paste your signature (Cmd/Ctrl + V) into the signature box</li>
                            <li>Scroll down and click <strong>Save Changes</strong></li>
                        </ol>
                        <div class="tip-box">
                            <strong>💡 Note:</strong> Gmail may modify some formatting. Test by sending an email to yourself.
                        </div>
                    </div>
                `
            },
            'apple-mail': {
                title: 'Import to Apple Mail',
                body: `
                    <div class="instruction-section">
                        <h3>🍎 Apple Mail</h3>
                        <ol>
                            <li>Click the <strong>Copy Signature</strong> button</li>
                            <li>Open Mail app → <strong>Mail</strong> menu → <strong>Settings</strong></li>
                            <li>Click the <strong>Signatures</strong> tab</li>
                            <li>Select your email account in the middle column</li>
                            <li>Click the <strong>+</strong> button to create a new signature</li>
                            <li>Paste your signature (Cmd + V) into the signature editor</li>
                            <li>Uncheck "Always match my default message font" if needed</li>
                        </ol>
                        <div class="tip-box">
                            <strong>💡 Note:</strong> Apple Mail has excellent support for email signatures.
                        </div>
                    </div>
                `
            },
            'outlook': {
                title: 'Import to Outlook',
                body: `
                    <div class="instruction-section">
                        <h3>📮 Outlook</h3>
                        <ol>
                            <li>Click the <strong>Copy Signature</strong> button</li>
                            <li>Open Outlook → <strong>File</strong> → <strong>Options</strong> → <strong>Mail</strong></li>
                            <li>Click <strong>Signatures</strong> button</li>
                            <li>Click <strong>New</strong> to create a signature</li>
                            <li>Paste your signature (Ctrl + V) into the editor</li>
                            <li>Click <strong>OK</strong> to save</li>
                        </ol>
                        <div class="tip-box">
                            <strong>⚠️ Note:</strong> Outlook may display signatures differently than other clients.
                        </div>
                    </div>
                `
            }
        };

        return instructions[clientType] || instructions['zoho-mail'];
    },

    /**
     * Close the modal
     */
    close() {
        if (!this.modal) return;

        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');

        // Restore body scroll
        document.body.style.overflow = '';

        // Clean up focus trap event listener to prevent memory leak
        if (this.handleTabKey) {
            document.removeEventListener('keydown', this.handleTabKey);
            this.handleTabKey = null;
        }
    },

    /**
     * Check if modal is open
     */
    isOpen() {
        return this.modal.classList.contains('active');
    },

    /**
     * Trap focus inside modal for accessibility
     */
    trapFocus() {
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Focus first element when modal opens
        setTimeout(() => {
            if (firstElement) {
                firstElement.focus();
            }
        }, 100);

        // Remove any existing handler before adding new one
        if (this.handleTabKey) {
            document.removeEventListener('keydown', this.handleTabKey);
        }

        // Trap focus within modal - store reference for cleanup
        this.handleTabKey = (e) => {
            if (!this.isOpen()) {
                return;
            }

            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', this.handleTabKey);
    }
};

// Initialize modal when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ModalController.init();
    });
} else {
    ModalController.init();
}
