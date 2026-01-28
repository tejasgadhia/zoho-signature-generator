/**
 * Preview Renderer
 * Manages the live signature preview display
 */

import type { AppStateManager } from './state';
import { SignatureGenerator } from '../signature-generator/index';
import { EXAMPLE_DATA } from '../constants';

export class PreviewRenderer {
  private stateManager: AppStateManager;
  private previewContainer: HTMLElement | null;

  constructor(stateManager: AppStateManager) {
    this.stateManager = stateManager;
    this.previewContainer = document.getElementById('signaturePreview');
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
      this.previewContainer.innerHTML = '<p style="color: red;">Failed to generate preview</p>';
    }
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
