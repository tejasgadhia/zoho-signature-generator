/**
 * Form Handler
 * Manages all form input events, validation, and preview updates
 */

import type { AppStateManager } from './state';
import type { PreviewRenderer } from './preview-renderer';
import type { FormData } from '../types';
import {
  generateEmailPrefix,
  toSmartTitleCase,
  getTrackedWebsiteURL,
  sanitizeSocialUrl,
  extractBookingsSlug,
  liveFormatPhone,
  debounce,
  inputValidator
} from '../utils';
import { eventBus } from '../events';

export class FormHandler {
  private stateManager: AppStateManager;
  private previewRenderer: PreviewRenderer;
  private debouncedRender: () => void;
  private userEditedEmailPrefix: boolean = false; // Track if user manually edited email prefix
  private formatLockAbortController: AbortController | null = null; // Track format lock listeners for cleanup

  constructor(stateManager: AppStateManager, previewRenderer: PreviewRenderer) {
    this.stateManager = stateManager;
    this.previewRenderer = previewRenderer;
    // Debounce preview updates to reduce lag during typing (300ms delay)
    this.debouncedRender = debounce(() => this.previewRenderer.render(), 300);
  }

  /**
   * Initialize all form listeners
   */
  initialize(): void {
    this.setupInputListeners();
    this.setupToggleListeners();
    this.setupStyleSelector();
    this.setupAccentColorSelector();
    this.setupFormatLockIcons();
    this.setupSmartTitleCase();
    this.setupWebsiteTracking();
    this.setupClearButtons();
  }

  /**
   * Setup input field listeners
   */
  private setupInputListeners(): void {
    // Name input
    const nameInput = document.getElementById('name') as HTMLInputElement;
    if (nameInput) {
      nameInput.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.handleFieldChange('name', value);

        // Auto-generate email prefix from name (only if user hasn't manually edited it)
        const emailPrefixInput = document.getElementById('email-prefix') as HTMLInputElement;
        if (emailPrefixInput && !this.userEditedEmailPrefix) {
          const prefix = generateEmailPrefix(value);
          emailPrefixInput.value = prefix;
          this.handleEmailPrefixChange(prefix);
        }
      });
    }

    // Email prefix input (with validation and character filtering)
    const emailPrefixInput = document.getElementById('email-prefix') as HTMLInputElement;
    if (emailPrefixInput) {
      emailPrefixInput.addEventListener('input', (e) => {
        const input = e.target as HTMLInputElement;
        // Filter to only allowed characters: lowercase letters, numbers, dots
        // Strip @zohocorp.com if user pastes full email
        let value = input.value
          .toLowerCase()
          .replace(/@zohocorp\.com$/i, '')  // Strip domain if pasted
          .replace(/[^a-z0-9.]/g, '');       // Only allow letters, numbers, dots
        input.value = value;
        this.userEditedEmailPrefix = true; // Mark as manually edited
        this.handleEmailPrefixChange(value);
        // Real-time validation for immediate feedback
        if (value) {
          this.validateField('email', `${value}@zohocorp.com`);
        }
      });

      emailPrefixInput.addEventListener('blur', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.validateField('email', `${value}@zohocorp.com`);
      });
    }

    // LinkedIn username input
    const linkedinUsernameInput = document.getElementById('linkedin-username') as HTMLInputElement;
    if (linkedinUsernameInput) {
      linkedinUsernameInput.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        // Sanitize input (handles full URLs, spaces, tracking params)
        const cleaned = sanitizeSocialUrl(value, 'linkedin.com');
        const fullUrl = cleaned ? `https://linkedin.com/in/${cleaned}` : '';
        this.handleFieldChange('linkedin', fullUrl);
      });

      linkedinUsernameInput.addEventListener('blur', (e) => {
        const value = (e.target as HTMLInputElement).value;
        if (value) {
          // Clean up any accidentally pasted full URLs and update input
          const cleaned = sanitizeSocialUrl(value, 'linkedin.com');
          (e.target as HTMLInputElement).value = cleaned;
        }
      });
    }

    // Twitter/X username input
    const twitterUsernameInput = document.getElementById('twitter-username') as HTMLInputElement;
    if (twitterUsernameInput) {
      twitterUsernameInput.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        // Sanitize input (handles full URLs, @symbol, spaces)
        const cleaned = sanitizeSocialUrl(value, 'x.com');
        const fullUrl = cleaned ? `https://x.com/${cleaned}` : '';
        this.handleFieldChange('twitter', fullUrl);
      });

      twitterUsernameInput.addEventListener('blur', (e) => {
        const value = (e.target as HTMLInputElement).value;
        if (value) {
          // Clean up any accidentally pasted full URLs and update input
          const cleaned = sanitizeSocialUrl(value, 'x.com');
          (e.target as HTMLInputElement).value = cleaned;
        }
      });
    }

    // Bookings ID input (handles full URL paste)
    const bookingsIdInput = document.getElementById('bookings-id') as HTMLInputElement;
    if (bookingsIdInput) {
      bookingsIdInput.addEventListener('input', (e) => {
        const input = e.target as HTMLInputElement;
        // Extract slug from pasted URL or use as-is
        const slug = extractBookingsSlug(input.value);
        const fullUrl = slug ? `https://bookings.zohocorp.com/#/${slug}` : '';
        this.handleFieldChange('bookings', fullUrl);
      });

      bookingsIdInput.addEventListener('blur', (e) => {
        const input = e.target as HTMLInputElement;
        if (input.value) {
          // Clean up any accidentally pasted full URLs and update input
          const slug = extractBookingsSlug(input.value);
          input.value = slug;
          // Validate the calendar ID format
          this.validateField('bookings', slug);
        } else {
          // Clear validation when empty
          this.validateField('bookings', '');
        }
      });
    }

    // Phone input (live formatting with +1 prefix, numbers only)
    const phoneInput = document.getElementById('phone') as HTMLInputElement;
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        const input = e.target as HTMLInputElement;
        const cursorPos = input.selectionStart || 0;

        // Live format as user types: auto +1 prefix, digits only, spaced format
        const { formatted, cursorPosition } = liveFormatPhone(input.value, cursorPos);

        input.value = formatted;
        this.handleFieldChange('phone', formatted);

        // Restore cursor position
        input.setSelectionRange(cursorPosition, cursorPosition);

        // Real-time validation for immediate feedback
        if (formatted) {
          this.validateField('phone', formatted);
        } else {
          // Clear validation when empty
          this.validateField('phone', '');
        }
      });

      phoneInput.addEventListener('blur', () => {
        // Validation on blur (formatting already done live)
        this.validateField('phone', phoneInput.value);
      });
    }

    // Standard text inputs (title, department)
    ['title', 'department'].forEach(fieldId => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (!input) return;

      input.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.handleFieldChange(fieldId as keyof FormData, value);
      });

      input.addEventListener('blur', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.validateField(fieldId as keyof FormData, value);
      });
    });
  }

  /**
   * Handle email prefix change
   */
  private handleEmailPrefixChange(prefix: string): void {
    // Strip @zohocorp.com if user typed it (prevent double domain)
    const cleanPrefix = prefix.replace(/@zohocorp\.com$/i, '').trim();
    const fullEmail = cleanPrefix ? `${cleanPrefix}@zohocorp.com` : '';
    this.handleFieldChange('email', fullEmail);
  }

  /**
   * Handle field value change
   */
  private handleFieldChange(field: keyof FormData, value: string): void {
    this.stateManager.updateFormData(field, value);
    eventBus.emit('form:changed', { field, value });
    this.debouncedRender();
  }

  /**
   * Validate a field and show/hide error messages
   * Uses centralized InputValidator for consistent validation
   */
  private validateField(field: keyof FormData, value: string): boolean {
    // Map field names to actual input IDs (handles special cases like email-prefix)
    const inputIdMap: Record<string, string> = {
      'email': 'email-prefix',
      'linkedin': 'linkedin-username',
      'twitter': 'twitter-username',
      'bookings': 'bookings-id',
      'phone': 'phone'
    };

    const inputId = inputIdMap[field] || field;
    const inputElement = document.getElementById(inputId);
    const inputGroup = inputElement?.closest('.input-group');
    const validationIcon = inputGroup?.querySelector('.validation-icon') as HTMLElement;

    if (!validationIcon) return true;

    // Use centralized validator
    const result = inputValidator.validate(field, value);
    let iconContent = '';

    // Only show validation for fields that have visual feedback (email, phone, bookings)
    if (field === 'email' || field === 'phone' || field === 'bookings') {
      if (value && !result.isValid) {
        iconContent = '✗';
      } else if (value) {
        iconContent = '✓';
      }
    }

    // Update validation icon
    if (iconContent) {
      validationIcon.textContent = iconContent;
      validationIcon.className = result.isValid ? 'validation-icon valid show' : 'validation-icon invalid show';
      validationIcon.style.display = 'flex';
      validationIcon.setAttribute('aria-label', result.message ? `✗ ${result.message}` : 'Valid');

      // Add red border on invalid fields for visibility
      const inputWrapper = inputElement?.closest('.input-wrapper');
      if (inputWrapper) {
        if (!result.isValid) {
          inputWrapper.classList.add('validation-error');
        } else {
          inputWrapper.classList.remove('validation-error');
        }
      }
    } else {
      validationIcon.className = 'validation-icon';
      validationIcon.style.display = 'none';
      const inputWrapper = inputElement?.closest('.input-wrapper');
      inputWrapper?.classList.remove('validation-error');
    }

    return result.isValid;
  }

  /**
   * Setup toggle switches for optional fields
   */
  private setupToggleListeners(): void {
    // Note: Toggles are <div> elements with data-field, not <input> elements
    const toggles = document.querySelectorAll<HTMLElement>('.toggle-switch[data-field]:not(.social-toggle)');

    toggles.forEach((toggle) => {
      const field = toggle.dataset.field;
      if (!field) return;

      // Handler for toggling field state
      const handleToggle = () => {
        // Toggle active state
        const isActive = toggle.classList.contains('active');
        const enabled = !isActive;

        // Update visual state
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-checked', String(enabled));

        const fieldToggles = this.stateManager.getState().fieldToggles;

        // Only update toggle if it's a valid toggle field
        if (field in fieldToggles) {
          this.stateManager.updateFieldToggle(field as any, enabled);

          // Map field name to input ID (handle special cases)
          let inputId = field;
          if (field === 'email') {
            inputId = 'email-prefix';
          } else if (field === 'linkedin') {
            inputId = 'linkedin-username';
          } else if (field === 'twitter') {
            inputId = 'twitter-username';
          } else if (field === 'bookings') {
            inputId = 'bookings-id';
          }

          // Disable/enable the corresponding input
          const input = document.getElementById(inputId) as HTMLInputElement;
          if (input) {
            input.disabled = !enabled;
            // Don't clear value when disabling - preserve it for re-enabling
            // The preview renderer will handle hiding disabled fields
          }

          // Disable/enable the format lock button if it exists (title, department)
          const formatLockBtn = document.querySelector(`.format-lock-icon[data-field="${field}"]`) as HTMLButtonElement;
          if (formatLockBtn) {
            formatLockBtn.disabled = !enabled;
            formatLockBtn.tabIndex = enabled ? 0 : -1;
          }

          this.previewRenderer.render();
        }
      };

      // Click handler
      toggle.addEventListener('click', handleToggle);

      // Keyboard handler (Space/Enter for role="switch" accessibility)
      toggle.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleToggle();
        }
      });
    });
  }

  /**
   * Setup signature style selector
   */
  private setupStyleSelector(): void {
    const styleRadios = document.querySelectorAll<HTMLInputElement>('input[name="signatureStyle"]');

    styleRadios.forEach((radio) => {
      radio.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.checked) {
          const style = target.value as any;
          this.stateManager.setSignatureStyle(style);
          eventBus.emit('style:changed', { style });
          // Use immediate render for style changes (not debounced)
          this.previewRenderer.render();
        }
      });

      // Also listen on the parent label for clicks
      const label = radio.closest('.style-option') as HTMLElement;
      if (label) {
        label.addEventListener('click', () => {
          if (!radio.checked) {
            radio.checked = true;
            const style = radio.value as any;
            this.stateManager.setSignatureStyle(style);
            this.previewRenderer.render();
          }
        });
      }
    });
  }

  /**
   * Setup accent color selector
   */
  private setupAccentColorSelector(): void {
    const colorButtons = document.querySelectorAll<HTMLButtonElement>('.color-btn');

    colorButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const color = button.dataset.color;
        if (!color) return;

        // Update selected state (CSS uses 'selected' class for checkmark and border)
        colorButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');

        // Update state and preview
        this.stateManager.setAccentColor(color);
        eventBus.emit('color:changed', { color });
        this.previewRenderer.render();
      });
    });
  }

  /**
   * Setup format lock icons (title case auto-formatting)
   */
  private setupFormatLockIcons(): void {
    // Abort any existing listeners before adding new ones (prevents leak on re-init)
    if (this.formatLockAbortController) {
      this.formatLockAbortController.abort();
    }
    this.formatLockAbortController = new AbortController();
    const { signal } = this.formatLockAbortController;

    document.querySelectorAll('.format-lock-icon').forEach(icon => {
      const fieldId = (icon as HTMLElement).dataset.field as 'name' | 'title' | 'department';

      // Set initial state
      const isLocked = this.stateManager.getFormatLock(fieldId);
      if (!isLocked) {
        icon.classList.remove('locked');
        icon.setAttribute('title', 'Title Case OFF - click to enable auto-capitalization');
      } else {
        icon.setAttribute('title', 'Title Case ON - formats as you type');
      }

      // Toggle on click (with AbortController for cleanup)
      icon.addEventListener('click', () => {
        this.stateManager.toggleFormatLock(fieldId);
        const newState = this.stateManager.getFormatLock(fieldId);

        icon.classList.toggle('locked');
        icon.setAttribute('title', newState
          ? 'Title Case ON - formats as you type'
          : 'Title Case OFF - click to enable auto-capitalization'
        );
      }, { signal });
    });
  }

  /**
   * Setup smart title case formatting
   */
  private setupSmartTitleCase(): void {
    ['name', 'title', 'department'].forEach(fieldId => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (!input) return;

      const applyFormatting = (preserveCursor = false) => {
        const isLocked = this.stateManager.getFormatLock(fieldId as 'name' | 'title' | 'department');

        if (isLocked && input.value.trim()) {
          // Store cursor position
          const cursorPos = preserveCursor ? input.selectionStart : null;

          input.value = toSmartTitleCase(input.value);
          this.handleFieldChange(fieldId as keyof FormData, input.value);

          // Restore cursor position
          if (preserveCursor && cursorPos !== null) {
            input.setSelectionRange(cursorPos, cursorPos);
          }
        }
      };

      // Apply on input for instant feedback
      input.addEventListener('input', () => applyFormatting(true));

      // Apply on blur for final cleanup
      input.addEventListener('blur', () => applyFormatting(false));

      // Apply on paste
      input.addEventListener('paste', () => {
        setTimeout(() => applyFormatting(false), 10);
      });
    });
  }

  /**
   * Setup website URL tracking (UTM parameters)
   */
  private setupWebsiteTracking(): void {
    const emailPrefixInput = document.getElementById('email-prefix') as HTMLInputElement;

    if (emailPrefixInput) {
      emailPrefixInput.addEventListener('input', () => {
        const prefix = emailPrefixInput.value.trim();
        const trackedUrl = getTrackedWebsiteURL(prefix);
        this.stateManager.updateFormData('website', trackedUrl);
        this.debouncedRender();
      });
    }

    // Set initial tracked URL
    const initialPrefix = emailPrefixInput?.value.trim() || 'zoho-employee';
    const initialTrackedUrl = getTrackedWebsiteURL(initialPrefix);
    this.stateManager.updateFormData('website', initialTrackedUrl);
  }

  /**
   * Setup clear buttons for inputs
   */
  private setupClearButtons(): void {
    const clearButtons = document.querySelectorAll<HTMLButtonElement>('.clear-btn');

    clearButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const fieldId = button.dataset.field as keyof FormData;
        if (!fieldId) return;

        const input = document.getElementById(fieldId) as HTMLInputElement;
        if (input) {
          input.value = '';
          this.handleFieldChange(fieldId, '');
        }
      });
    });
  }
}
