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

    // Use example data for empty fields in preview
    const previewData = { ...formData };
    Object.keys(previewData).forEach(key => {
      const fieldKey = key as keyof typeof previewData;
      if (!previewData[fieldKey] && EXAMPLE_DATA[fieldKey]) {
        previewData[fieldKey] = EXAMPLE_DATA[fieldKey];
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

      // Apply dark mode class to parent .preview-container (CSS targets that element)
      const container = this.previewContainer.closest('.preview-container');
      if (container) {
        if (state.isDarkModePreview) {
          container.classList.add('dark-mode');
        } else {
          container.classList.remove('dark-mode');
        }
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
