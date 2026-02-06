/**
 * Preview Renderer
 * Manages the live signature preview display
 * Subscribes to event bus for decoupled render triggers
 */

import type { AppStateManager } from './state';
import { SignatureGenerator } from '../signature-generator/index';
import { EXAMPLE_DATA } from '../constants';
import { eventBus } from '../events';
import { debounce } from '../utils';

export class PreviewRenderer {
  private stateManager: AppStateManager;
  private previewContainer: HTMLElement | null;
  private debouncedRender: () => void;

  constructor(stateManager: AppStateManager) {
    this.stateManager = stateManager;
    this.previewContainer = document.getElementById('signaturePreview');
    this.debouncedRender = debounce(() => this.render(), 300);

    // Subscribe to event bus for decoupled render triggers
    this.setupEventSubscriptions();
  }

  /**
   * Setup event bus subscriptions
   */
  private setupEventSubscriptions(): void {
    // Listen for explicit render requests
    eventBus.on('preview:render', (payload) => {
      if (payload.immediate) {
        this.render();
      } else {
        this.debouncedRender();
      }
    });
  }

  /**
   * Render the signature preview
   */
  render(): void {
    if (!this.previewContainer) {
      console.warn('Preview container not found');
      return;
    }

    const state = this.stateManager.getState();
    const formData = state.formData;
    const fieldToggles = state.fieldToggles;

    // Use example data for empty fields in preview so users can see what signature looks like
    // Copy validation will warn users if they try to copy with example data
    const previewData = { ...formData };
    Object.keys(previewData).forEach(key => {
      const fieldKey = key as keyof typeof previewData;

      // Check if this field has a toggle (some fields like 'name' don't)
      const hasToggle = fieldKey in fieldToggles;
      const isEnabled = hasToggle ? fieldToggles[fieldKey as keyof typeof fieldToggles] : true;

      // Fill example data if field is enabled AND empty (for visual preview)
      if (isEnabled && !previewData[fieldKey] && EXAMPLE_DATA[fieldKey]) {
        previewData[fieldKey] = EXAMPLE_DATA[fieldKey];
      }

      // Clear data for disabled fields (so they don't show in preview)
      if (hasToggle && !isEnabled) {
        previewData[fieldKey] = '';
      }
    });

    try {
      // Generate preview HTML (includes dark mode support)
      const html = SignatureGenerator.generatePreview(
        previewData,
        state.signatureStyle,
        state.socialOptions,
        state.accentColor
      );

      // Update preview container
      this.previewContainer.innerHTML = html;

      // Apply dark mode class and accent color to parent .preview-container
      const container = this.previewContainer.closest('.preview-container');
      if (container) {
        if (state.isDarkModePreview) {
          container.classList.add('dark-mode');
        } else {
          container.classList.remove('dark-mode');
        }
        // Set accent color for dark mode contrast overrides (see preview.css)
        container.setAttribute('data-accent', state.accentColor);
      }
    } catch (error) {
      console.error('Failed to render preview:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.previewContainer.innerHTML = `
        <p style="color: #666; font-size: 14px; padding: 20px; text-align: center;">
          Unable to generate preview. ${errorMessage.includes('style') ? 'Please select a valid signature style.' : 'Please check your input fields.'}
        </p>
      `;
      eventBus.emit('preview:rendered', { success: false });
      return;
    }

    eventBus.emit('preview:rendered', { success: true });
  }

  /**
   * Update the preview (alias for render)
   */
  updatePreview(): void {
    this.render();
  }

  /**
   * Toggle dark mode preview
   */
  toggleDarkMode(enabled: boolean): void {
    this.stateManager.setDarkModePreview(enabled);
    this.render();
  }
}
