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
        const modalHeader = this.modal.querySelector('#modal-header-content');
        const modalBody = this.modal.querySelector('#modal-body-content');

        if (!modalHeader || !modalBody) {
            console.warn('Modal header or body not found');
            return;
        }

        const content = this.getClientInstructions(clientType);

        // Inject header (logo + title + time estimate) + close button
        modalHeader.innerHTML = content.header + `
            <button type="button" class="modal-close" aria-label="Close modal">×</button>
        `;

        // Re-attach close button event listener
        const closeButton = modalHeader.querySelector('.modal-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.close();
            });
        }

        // Inject body
        modalBody.innerHTML = content.body;
    },

    /**
     * Get instructions for specific email client
     */
    getClientInstructions(clientType) {
        const instructions = {
            'zoho-mail': {
                title: 'Zoho Mail',
                header: `
                    <div class="modal-header-with-logo">
                        <img src="assets/mail-full.svg" alt="Zoho Mail logo" class="modal-logo-badge">
                        <div class="modal-header-title-group">
                            <h2 id="modalTitle">Zoho Mail</h2>
                            <div class="modal-time-estimate" aria-label="Estimated time 1 minute, 5 steps total">
                                ~1 minute • 5 steps
                            </div>
                        </div>
                    </div>
                `,
                body: `
                    <ol class="instruction-steps" aria-label="Import instructions" style="--step-color: #E42527;">
                        <li class="instruction-step">
                            <div class="step-number" aria-hidden="true">1</div>
                            <div class="step-content">
                                <div class="step-title">
                                    <button class="inline-copy-btn" onclick="ModalController.copySignature(event)" aria-label="Copy signature to clipboard">
                                        <svg viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M5.5 1a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5h-8z"/>
                                        </svg>
                                        Copy Signature
                                    </button>
                                </div>
                            </div>
                        </li>

                        <li class="instruction-step">
                            <div class="step-number" aria-hidden="true">2</div>
                            <div class="step-content">
                                <div class="step-title">
                                    Open <a href="https://mail.zoho.com" target="_blank" rel="noopener noreferrer" class="external-link">Zoho Mail</a> → <strong>Settings</strong> → <strong>Signature</strong>
                                </div>
                            </div>
                        </li>

                        <li class="instruction-step">
                            <div class="step-number" aria-hidden="true">3</div>
                            <div class="step-content">
                                <div class="step-title">
                                    Select your signature, then click <strong>Insert HTML</strong> in the editor toolbar
                                </div>
                            </div>
                        </li>

                        <li class="instruction-step">
                            <div class="step-number" aria-hidden="true">4</div>
                            <div class="step-content">
                                <div class="step-title">
                                    Paste using <kbd data-key="⌘V"></kbd> or <kbd data-key="Ctrl+V"></kbd>, then click <strong>Insert</strong>
                                </div>
                            </div>
                        </li>

                        <li class="instruction-step">
                            <div class="step-number" aria-hidden="true">5</div>
                            <div class="step-content">
                                <div class="step-title">
                                    Click <strong>Update</strong> to save your signature
                                </div>
                            </div>
                        </li>
                    </ol>

                    <div class="tip-box-new pro-tip" role="note">
                        <span class="tip-icon" aria-label="Tip">💡</span>
                        <div class="tip-content">
                            <strong>Tip:</strong> Test your signature by composing a new email.
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
     * Copy signature to clipboard (called from inline button)
     */
    copySignature(event) {
        event.preventDefault();
        event.stopPropagation();

        const button = event.currentTarget;
        const originalText = button.innerHTML;

        // Trigger the main copy button
        const mainCopyButton = document.getElementById('copyButton');
        if (mainCopyButton) {
            mainCopyButton.click();

            // Show success state
            button.innerHTML = `
                <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Copied!
            `;
            button.classList.add('copied');

            // Restore original state after 2 seconds
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('copied');
            }, 2000);
        } else {
            console.error('Main copy button not found');
        }
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
