/**
 * Clipboard Manager
 * Handles copying signature HTML to clipboard with modern and fallback APIs
 */

import type { AppStateManager } from './state';
import type { FormData, FieldToggles } from '../types';
import { SignatureGenerator } from '../signature-generator/index';
import { ANIMATION_DURATIONS, EXAMPLE_DATA } from '../constants';
import { ModalController } from '../ui/modal';
import { minifyHtml } from '../utils';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastOptions {
  icon?: string;
  actions?: ToastAction[];
  duration?: number;
}

export class ClipboardManager {
  private stateManager: AppStateManager;
  private toastContainer: HTMLElement | null;
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;
  private pendingCopyHtml: string | null = null;

  constructor(stateManager: AppStateManager) {
    this.stateManager = stateManager;
    this.toastContainer = document.getElementById('toast');
    this.setupToastDismiss();
  }

  /**
   * Setup toast dismiss handlers (click X button, Escape key)
   */
  private setupToastDismiss(): void {
    if (!this.toastContainer) return;

    // Dismiss button click
    const dismissBtn = this.toastContainer.querySelector('.toast-dismiss');
    dismissBtn?.addEventListener('click', () => this.hideToast());

    // Escape key to dismiss
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.toastContainer?.classList.contains('show')) {
        this.hideToast();
      }
    });

    // Pause timer on hover
    this.toastContainer.addEventListener('mouseenter', () => {
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
        this.toastTimeout = null;
      }
    });

    // Resume timer on mouse leave (restart with reduced time)
    this.toastContainer.addEventListener('mouseleave', () => {
      if (this.toastContainer?.classList.contains('show')) {
        this.toastTimeout = setTimeout(() => this.hideToast(), 2000);
      }
    });
  }

  /**
   * Check if form data would show example/placeholder values in the signature
   * Returns array of field names that would use example data
   */
  private getExampleDataFields(formData: FormData, fieldToggles: FieldToggles): string[] {
    const exampleFields: string[] = [];

    // Fields to check (excluding website which is always pre-filled)
    const checkFields: (keyof FormData)[] = ['name', 'title', 'department', 'email', 'phone'];

    for (const field of checkFields) {
      const value = formData[field];
      const exampleValue = EXAMPLE_DATA[field];

      // Check if this field has a toggle
      const hasToggle = field in fieldToggles;
      const isEnabled = hasToggle ? fieldToggles[field as keyof FieldToggles] : true;

      // Flag if field is enabled AND (empty OR matches example data)
      // Empty enabled fields will show example data in the preview/signature
      const isEmpty = !value || value.trim() === '';
      const matchesExample = value === exampleValue;

      if (isEnabled && exampleValue && (isEmpty || matchesExample)) {
        exampleFields.push(field);
      }
    }

    return exampleFields;
  }

  /**
   * Copy signature HTML to clipboard
   * Returns true on success, false on failure
   */
  async copySignature(): Promise<boolean> {
    const state = this.stateManager.getState();

    // Check for example data in enabled fields
    const exampleFields = this.getExampleDataFields(state.formData, state.fieldToggles);

    if (exampleFields.length > 0) {
      // Store the HTML for potential "Copy Anyway" action
      this.pendingCopyHtml = minifyHtml(SignatureGenerator.generate(
        state.formData,
        state.signatureStyle,
        state.socialOptions,
        state.accentColor,
        false
      ));

      // Format field names for display
      const fieldLabels: Record<string, string> = {
        name: 'Name',
        title: 'Job Title',
        department: 'Department',
        email: 'Email',
        phone: 'Phone'
      };
      const fieldNames = exampleFields.map(f => fieldLabels[f] || f).join(', ');

      // Show error toast with clear instructions
      this.showToast(`Fill in or turn off: ${fieldNames}`, 'error', {
        icon: '✗',
        duration: 10000,
        actions: [
          {
            label: 'Copy Anyway',
            onClick: () => this.forceCopy(),
          },
        ],
      });
      return false;
    }

    // Check if signature would be empty (no data to copy)
    const hasAnyData = Object.entries(state.formData).some(([key, value]) => {
      if (key === 'website') return false; // Website is always pre-filled, don't count it
      const hasToggle = key in state.fieldToggles;
      const isEnabled = hasToggle ? state.fieldToggles[key as keyof FieldToggles] : true;
      return isEnabled && value && value.trim() !== '';
    });

    if (!hasAnyData) {
      this.showToast('Please fill in at least your name', 'error', {
        icon: '✗',
        duration: 4000,
      });
      return false;
    }

    return await this.performCopy();
  }

  /**
   * Force copy even with example data (called from "Copy Anyway" button)
   */
  private async forceCopy(): Promise<void> {
    if (this.pendingCopyHtml) {
      try {
        if (navigator.clipboard && typeof navigator.clipboard.write === 'function') {
          await this.modernClipboard(this.pendingCopyHtml);
        } else {
          await this.fallbackClipboard(this.pendingCopyHtml);
        }
        this.showToast('Signature copied to clipboard!', 'success', {
          actions: [
            {
              label: 'How to paste →',
              onClick: () => {
                ModalController.open('zoho-mail');
              },
            },
          ],
        });
      } catch (error) {
        console.error('Failed to copy signature:', error);
        this.showToast('Failed to copy signature. Please try again.', 'error');
      }
    }
    this.pendingCopyHtml = null;
  }

  /**
   * Perform the actual clipboard copy operation
   */
  private async performCopy(): Promise<boolean> {
    const state = this.stateManager.getState();

    try {
      // Generate the actual signature HTML (not preview) and minify it
      const html = minifyHtml(SignatureGenerator.generate(
        state.formData,
        state.signatureStyle,
        state.socialOptions,
        state.accentColor,
        false  // isPreview = false for actual clipboard copy
      ));

      // Try modern clipboard API first
      if (navigator.clipboard && typeof navigator.clipboard.write === 'function') {
        await this.modernClipboard(html);
      } else {
        // Fallback to execCommand
        await this.fallbackClipboard(html);
      }

      // Show success toast with action to open instructions
      this.showToast('Signature copied to clipboard!', 'success', {
        actions: [
          {
            label: 'How to paste →',
            onClick: () => {
              // Open the Zoho Mail instructions modal (most common use case)
              ModalController.open('zoho-mail');
            },
          },
        ],
      });
      return true;
    } catch (error) {
      console.error('Failed to copy signature:', error);
      this.showToast('Failed to copy signature. Please try again.', 'error');
      return false;
    }
  }

  /**
   * Modern clipboard API (supports HTML + plain text)
   */
  private async modernClipboard(html: string): Promise<void> {
    try {
      // Create blob with HTML content
      const htmlBlob = new Blob([html], { type: 'text/html' });

      // Create plain text version (strip HTML tags)
      const plainText = this.htmlToPlainText(html);
      const textBlob = new Blob([plainText], { type: 'text/plain' });

      // Write both formats to clipboard
      const clipboardItem = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': textBlob
      });

      await navigator.clipboard.write([clipboardItem]);
    } catch (error) {
      console.error('Modern clipboard failed:', error);
      throw error;
    }
  }

  /**
   * Fallback clipboard using execCommand
   */
  private async fallbackClipboard(html: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '-9999px';
        tempContainer.contentEditable = 'true';
        // SECURITY: innerHTML is required here for execCommand('copy') to preserve HTML formatting.
        // The `html` value is generated by SignatureGenerator (pre-escaped, not user-controlled).
        tempContainer.innerHTML = html;

        document.body.appendChild(tempContainer);

        // Select the content
        const range = document.createRange();
        range.selectNodeContents(tempContainer);

        const selection = window.getSelection();
        if (!selection) {
          throw new Error('Could not get window selection');
        }

        selection.removeAllRanges();
        selection.addRange(range);

        // Copy to clipboard
        const success = document.execCommand('copy');

        // Clean up
        selection.removeAllRanges();
        document.body.removeChild(tempContainer);

        if (success) {
          resolve();
        } else {
          reject(new Error('execCommand copy failed'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Convert HTML to plain text using DOMParser (avoids innerHTML)
   */
  private htmlToPlainText(html: string): string {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  }

  /**
   * Show enhanced toast notification with optional actions
   */
  showToast(message: string, type: 'success' | 'error' = 'success', options?: ToastOptions): void {
    if (!this.toastContainer) {
      console.warn('Toast container not found');
      return;
    }

    // Clear any existing timeout
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    // Set icon
    const iconEl = this.toastContainer.querySelector('.toast-icon');
    if (iconEl) {
      iconEl.textContent = options?.icon || (type === 'success' ? '✓' : '✗');
    }

    // Set message
    const messageEl = this.toastContainer.querySelector('.toast-message');
    if (messageEl) {
      messageEl.textContent = message;
    }

    // Set actions
    const actionsEl = this.toastContainer.querySelector('.toast-actions');
    if (actionsEl) {
      actionsEl.replaceChildren();
      if (options?.actions) {
        options.actions.forEach((action) => {
          const btn = document.createElement('button');
          btn.className = 'toast-action';
          btn.textContent = action.label;
          btn.addEventListener('click', () => {
            action.onClick();
            this.hideToast();
          });
          actionsEl.appendChild(btn);
        });
      }
    }

    // Reset progress bar animation
    const progressBar = this.toastContainer.querySelector('.toast-progress-bar') as HTMLElement;
    if (progressBar) {
      progressBar.style.animation = 'none';
      // Trigger reflow
      void progressBar.offsetWidth;
      const duration = options?.duration || ANIMATION_DURATIONS.TOAST + 1000; // 4s default
      progressBar.style.animation = `toast-countdown ${duration}ms linear forwards`;
    }

    // Set type and show
    this.toastContainer.className = `toast ${type}`;
    this.toastContainer.classList.add('show');

    // Auto-hide after duration
    const duration = options?.duration || ANIMATION_DURATIONS.TOAST + 1000;
    this.toastTimeout = setTimeout(() => this.hideToast(), duration);
  }

  /**
   * Hide toast notification
   */
  hideToast(): void {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
      this.toastTimeout = null;
    }
    this.toastContainer?.classList.remove('show');
  }
}
