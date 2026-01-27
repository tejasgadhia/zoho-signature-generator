/**
 * Main Entry Point
 * Initializes all application modules
 */

// Import styles
import '@/styles/main.css';

import { AppStateManager } from './app/state';
import { FormHandler } from './app/form-handler';
import { PreviewRenderer } from './app/preview-renderer';
import { ClipboardManager } from './app/clipboard';
import { ModalController } from './ui/modal';
// import { ThemeManager } from './ui/theme'; // Not used yet - no app-wide theme toggle
import { DragDropHandler } from './ui/drag-drop';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('Zoho Signature Generator - Initializing Phase 7 modules...');

  // Initialize state manager
  const state = new AppStateManager();
  state.loadFromStorage();

  // Initialize preview renderer
  const previewRenderer = new PreviewRenderer(state);

  // Initialize form handler
  const formHandler = new FormHandler(state, previewRenderer);
  formHandler.initialize();

  // Initialize clipboard manager
  const clipboardManager = new ClipboardManager(state);

  // Initialize theme manager (currently unused - no app-wide theme toggle in UI)
  // const themeManager = new ThemeManager();
  // themeManager.initialize();

  // Initialize drag-drop handler
  const dragDropHandler = new DragDropHandler(state);
  dragDropHandler.initialize();

  // Initialize modal controller
  ModalController.init();

  // Render initial preview
  previewRenderer.render();

  // Setup copy button
  const copyButton = document.getElementById('copyButton');
  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      await clipboardManager.copySignature();
    });
  }

  // Setup dark mode preview toggle
  const darkModePreviewToggle = document.getElementById('themeToggle') as HTMLInputElement;
  if (darkModePreviewToggle) {
    darkModePreviewToggle.addEventListener('change', () => {
      previewRenderer.toggleDarkMode(darkModePreviewToggle.checked);
    });
  }

  // Setup import instruction buttons
  const importButtons = document.querySelectorAll('[data-client-type]');
  importButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const clientType = (button as HTMLElement).dataset.clientType;
      if (clientType) {
        ModalController.open(clientType as any);
      }
    });
  });

  // Expose state for debugging (development only)
  // Note: import.meta.env.DEV is available at runtime via Vite
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (isDevelopment) {
    (window as any).AppState = state;
    (window as any).PreviewRenderer = previewRenderer;
    (window as any).ClipboardManager = clipboardManager;
  }

  console.log('Phase 7: App State & UI Controllers - Initialization complete!');
});
