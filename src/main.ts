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
import { DragDropHandler } from './ui/drag-drop';
import { setupErrorBoundary } from './utils/error-tracking';
import { showErrorModal } from './ui/error-modal';

// Setup error boundary BEFORE any other initialization
setupErrorBoundary(showErrorModal);

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  if (import.meta.env.DEV) {
    console.log('Zoho Signature Generator - Initializing...');
  }

  // Initialize state manager
  const state = new AppStateManager();
  state.migrateSchema(); // Run schema migration if needed

  // Clean up legacy encrypted data and load preferences
  state.cleanupLegacyEncryptedData();
  state.loadFromStorage();

  // Initialize preview renderer
  const previewRenderer = new PreviewRenderer(state);

  // Initialize form handler
  const formHandler = new FormHandler(state, previewRenderer);
  formHandler.initialize();

  // Initialize clipboard manager
  const clipboardManager = new ClipboardManager(state);

  // Note: ThemeManager removed - dark mode is ONLY for signature preview section,
  // not for the entire app. See previewRenderer.toggleDarkMode() below.

  // Initialize drag-drop handler
  const dragDropHandler = new DragDropHandler(state, previewRenderer);
  dragDropHandler.initialize();

  // Initialize modal controller
  ModalController.init();

  // Note: Help hints now use CSS-only approach with :focus-within
  // No JavaScript controller needed

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
  const importButtons = document.querySelectorAll('[data-client]');
  importButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const clientType = (button as HTMLElement).dataset.client;
      if (clientType) {
        ModalController.open(clientType as any);
      }
    });
  });

  // Expose copySignatureFromModal globally for modal inline onclick handlers
  (window as any).copySignatureFromModal = async (event: Event) => {
    event.preventDefault();
    await clipboardManager.copySignature();
  };

  // Setup feedback button to open feedback modal
  const feedbackButton = document.getElementById('feedbackButton');
  const feedbackModal = document.getElementById('feedback-modal');
  if (feedbackButton && feedbackModal) {
    feedbackButton.addEventListener('click', () => {
      feedbackModal.classList.add('active');
      feedbackModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });

    // Close feedback modal on backdrop click or close button
    const feedbackBackdrop = feedbackModal.querySelector('.modal-backdrop');
    const feedbackCloseBtn = feedbackModal.querySelector('.modal-close');

    const closeFeedbackModal = () => {
      feedbackModal.classList.remove('active');
      feedbackModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    feedbackBackdrop?.addEventListener('click', closeFeedbackModal);
    feedbackCloseBtn?.addEventListener('click', closeFeedbackModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && feedbackModal.classList.contains('active')) {
        closeFeedbackModal();
      }
    });
  }

  // Say Thanks button (Easter egg)
  const thanksButton = document.getElementById('thanksButton');
  const thanksModal = document.getElementById('thanks-modal');
  const thanksCountBadge = document.getElementById('thanksCount');
  const thanksCountNumber = document.getElementById('thanksCountNumber');
  const thanksVideo = document.getElementById('thanksVideo') as HTMLVideoElement;

  if (thanksButton && thanksModal && thanksCountBadge && thanksCountNumber && thanksVideo) {
    // Load saved count or default to 27
    let count = parseInt(localStorage.getItem('thanks-count') || '27', 10);
    thanksCountNumber.textContent = count.toString();

    thanksButton.addEventListener('click', () => {
      // Increment and animate count
      count++;
      localStorage.setItem('thanks-count', count.toString());
      thanksCountNumber.textContent = count.toString();
      thanksCountBadge.classList.add('bumped');
      setTimeout(() => thanksCountBadge.classList.remove('bumped'), 300);

      // Open modal and autoplay
      thanksModal.classList.add('active');
      thanksModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Small delay for modal animation, then play
      setTimeout(() => {
        thanksVideo.currentTime = 0;
        thanksVideo.play().catch(() => {
          // Autoplay blocked - user can click play manually
        });
      }, 100);
    });

    // Close handlers
    const closeThanksModal = () => {
      thanksModal.classList.remove('active');
      thanksModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      thanksVideo.pause();
    };

    thanksModal.querySelector('.modal-backdrop')?.addEventListener('click', closeThanksModal);
    thanksModal.querySelector('.video-modal-close')?.addEventListener('click', closeThanksModal);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && thanksModal.classList.contains('active')) {
        closeThanksModal();
      }
    });
  }

  // Expose state for debugging (development only)
  if (import.meta.env.DEV) {
    (window as any).AppState = state;
    (window as any).PreviewRenderer = previewRenderer;
    (window as any).ClipboardManager = clipboardManager;
    console.log('Initialization complete');
  }

  // Expose AppState globally for error tracking (PII-safe state access)
  (window as any).AppState = state;
});
