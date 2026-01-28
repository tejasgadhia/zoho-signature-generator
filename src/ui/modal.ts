/**
 * Modal Controller
 * Manages modal dialog functionality (import instructions)
 */

export type EmailClientType = 'zoho-mail' | 'zoho-desk' | 'gmail' | 'apple-mail' | 'outlook';

interface ModalInstructions {
  title: string;
  header: string;
  body: string;
}

export class ModalController {
  private static modal: HTMLElement | null = null;
  private static closeButton: HTMLElement | null = null;
  private static backdrop: HTMLElement | null = null;
  private static handleTabKey: ((e: KeyboardEvent) => void) | null = null;

  /**
   * Initialize modal controller
   */
  static init(): void {
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
  }

  /**
   * Setup event listeners for modal
   */
  private static setupEventListeners(): void {
    if (!this.modal) return;

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
  }

  /**
   * Open the modal with client-specific content
   */
  static open(clientType: EmailClientType = 'zoho-mail'): void {
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
  }

  /**
   * Update modal content for specific email client
   */
  private static updateContent(clientType: EmailClientType): void {
    if (!this.modal) return;

    const modalHeader = this.modal.querySelector('#modal-header-content');
    const modalBody = this.modal.querySelector('#modal-body-content');

    if (!modalHeader || !modalBody) {
      console.warn('Modal header or body not found');
      return;
    }

    const content = this.getClientInstructions(clientType);

    // Inject header + close button
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
  }

  /**
   * Get instructions for specific email client
   * NOTE: This is a simplified version. The full implementation would include
   * all the HTML templates from modal.js lines 124-503
   */
  private static getClientInstructions(clientType: EmailClientType): ModalInstructions {
    const instructions: Record<EmailClientType, ModalInstructions> = {
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
                  <button class="inline-copy-btn" onclick="copySignatureFromModal(event)" aria-label="Copy signature to clipboard">
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
                  Select your signature, then click the <strong>Insert HTML</strong> button
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
        title: 'Zoho Desk',
        header: `
          <div class="modal-header-with-logo">
            <img src="assets/desk-full.svg" alt="Zoho Desk logo" class="modal-logo-badge">
            <div class="modal-header-title-group">
              <h2 id="modalTitle">Zoho Desk</h2>
              <div class="modal-time-estimate" aria-label="Estimated time 2 minutes, 6 steps total">
                ~2 minutes • 6 steps
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
                  <button class="inline-copy-btn" onclick="copySignatureFromModal(event)" aria-label="Copy signature to clipboard">
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
                  Open <a href="https://desk.zoho.com" target="_blank" rel="noopener noreferrer" class="external-link">Zoho Desk</a> → <strong>Settings</strong> (gear icon) → <strong>Preferences</strong> → <strong>Signature</strong> and select your department from the dropdown at the top
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">3</div>
              <div class="step-content">
                <div class="step-title">
                  Click the <strong>Insert</strong> button on the right side of the interface
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">4</div>
              <div class="step-content">
                <div class="step-title">
                  In the dialog box that appears, paste the HTML using <kbd data-key="⌘V"></kbd> or <kbd data-key="Ctrl+V"></kbd>
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">5</div>
              <div class="step-content">
                <div class="step-title">
                  Click <strong>Insert</strong> in the dialog — you'll see a preview of your signature in the editor
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">6</div>
              <div class="step-content">
                <div class="step-title">
                  Click the blue <strong>Save</strong> button at the bottom of the screen
                </div>
              </div>
            </li>
          </ol>
          <div class="tip-box-new pro-tip" role="note">
            <span class="tip-icon" aria-label="Tip">💡</span>
            <div class="tip-content">
              <strong>Tip:</strong> You can create different signatures for different departments.
            </div>
          </div>
        `
      },
      'gmail': {
        title: 'Gmail',
        header: `
          <div class="modal-header-with-logo">
            <img src="assets/gmail-logo.svg" alt="Gmail logo" class="modal-logo-badge">
            <div class="modal-header-title-group">
              <h2 id="modalTitle">Gmail</h2>
              <div class="modal-time-estimate" aria-label="Estimated time 1 minute, 5 steps total">
                ~1 minute • 5 steps
              </div>
            </div>
          </div>
        `,
        body: `
          <ol class="instruction-steps" aria-label="Import instructions" style="--step-color: #EA4335;">
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">1</div>
              <div class="step-content">
                <div class="step-title">
                  <button class="inline-copy-btn" onclick="copySignatureFromModal(event)" aria-label="Copy signature to clipboard">
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
                  Open <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" class="external-link">Gmail</a> → Click ⚙️ <strong>Settings</strong> → <strong>See all settings</strong>
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">3</div>
              <div class="step-content">
                <div class="step-title">
                  Scroll down to <strong>Signature</strong> section and click <strong>Create new</strong>
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">4</div>
              <div class="step-content">
                <div class="step-title">
                  Give it a name, then paste using <kbd data-key="⌘V"></kbd> or <kbd data-key="Ctrl+V"></kbd> directly into the signature box
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">5</div>
              <div class="step-content">
                <div class="step-title">
                  Scroll to bottom and click <strong>Save Changes</strong>
                </div>
              </div>
            </li>
          </ol>
          <div class="tip-box-new warning" role="note">
            <span class="tip-icon" aria-label="Note">⚠️</span>
            <div class="tip-content">
              <strong>Note:</strong> Gmail may modify some formatting. Test by sending an email to yourself.
            </div>
          </div>
        `
      },
      'apple-mail': {
        title: 'Apple Mail',
        header: `
          <div class="modal-header-with-logo">
            <img src="assets/apple-mail-logo.svg" alt="Apple Mail logo" class="modal-logo-badge">
            <div class="modal-header-title-group">
              <h2 id="modalTitle">Apple Mail</h2>
              <div class="modal-time-estimate" aria-label="Estimated time 1 minute, 5 steps total">
                ~1 minute • 5 steps
              </div>
            </div>
          </div>
        `,
        body: `
          <ol class="instruction-steps" aria-label="Import instructions" style="--step-color: #007AFF;">
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">1</div>
              <div class="step-content">
                <div class="step-title">
                  <button class="inline-copy-btn" onclick="copySignatureFromModal(event)" aria-label="Copy signature to clipboard">
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
                  Open Mail app → <strong>Mail</strong> menu (top left) → <strong>Settings</strong>
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">3</div>
              <div class="step-content">
                <div class="step-title">
                  Click <strong>Signatures</strong> tab → Select your email account → Click <strong>+</strong> button
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">4</div>
              <div class="step-content">
                <div class="step-title">
                  <strong>Uncheck "Always match my default message font"</strong> (important!), then paste using <kbd data-key="⌘V"></kbd>
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">5</div>
              <div class="step-content">
                <div class="step-title">
                  Close Settings window to save automatically
                </div>
              </div>
            </li>
          </ol>
          <div class="tip-box-new success" role="note">
            <span class="tip-icon" aria-label="Success">✅</span>
            <div class="tip-content">
              <strong>Great choice!</strong> Apple Mail has excellent support for HTML signatures.
            </div>
          </div>
        `
      },
      'outlook': {
        title: 'Outlook',
        header: `
          <div class="modal-header-with-logo">
            <img src="assets/outlook-logo.svg" alt="Outlook logo" class="modal-logo-badge">
            <div class="modal-header-title-group">
              <h2 id="modalTitle">Outlook</h2>
              <div class="modal-time-estimate" aria-label="Estimated time 1 minute, 5 steps total">
                ~1 minute • 5 steps
              </div>
            </div>
          </div>
        `,
        body: `
          <ol class="instruction-steps" aria-label="Import instructions" style="--step-color: #0078D4;">
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">1</div>
              <div class="step-content">
                <div class="step-title">
                  <button class="inline-copy-btn" onclick="copySignatureFromModal(event)" aria-label="Copy signature to clipboard">
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
                  Open Outlook → <strong>File</strong> → <strong>Options</strong> → <strong>Mail</strong>
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">3</div>
              <div class="step-content">
                <div class="step-title">
                  Click <strong>Signatures...</strong> button in the "Compose messages" section
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">4</div>
              <div class="step-content">
                <div class="step-title">
                  Click <strong>New</strong>, give it a name, then paste using <kbd data-key="Ctrl+V"></kbd> into the editor box
                </div>
              </div>
            </li>
            <li class="instruction-step">
              <div class="step-number" aria-hidden="true">5</div>
              <div class="step-content">
                <div class="step-title">
                  Click <strong>OK</strong> to save your signature
                </div>
              </div>
            </li>
          </ol>
          <div class="tip-box-new warning" role="note">
            <span class="tip-icon" aria-label="Warning">⚠️</span>
            <div class="tip-content">
              <strong>Note:</strong> Outlook may display signatures differently. Test in a draft email to verify.
            </div>
          </div>
        `
      }
    };

    return instructions[clientType] || instructions['zoho-mail'];
  }

  /**
   * Close the modal
   */
  static close(): void {
    if (!this.modal) return;

    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');

    // Restore body scroll
    document.body.style.overflow = '';

    // Clean up focus trap event listener
    if (this.handleTabKey) {
      document.removeEventListener('keydown', this.handleTabKey);
      this.handleTabKey = null;
    }
  }

  /**
   * Check if modal is open
   */
  static isOpen(): boolean {
    return this.modal?.classList.contains('active') || false;
  }

  /**
   * Trap focus inside modal for accessibility
   */
  private static trapFocus(): void {
    if (!this.modal) return;

    const focusableElements = this.modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus first element when modal opens
    setTimeout(() => {
      if (firstElement) {
        firstElement.focus();
      }
    }, 100);

    // Remove any existing handler
    if (this.handleTabKey) {
      document.removeEventListener('keydown', this.handleTabKey);
    }

    // Trap focus within modal
    this.handleTabKey = (e: KeyboardEvent) => {
      if (!this.isOpen()) return;

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
}
