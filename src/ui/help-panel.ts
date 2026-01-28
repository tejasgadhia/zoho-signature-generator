/**
 * Help Panel Controller
 * Manages expandable help panels for form fields
 */

import { HELP_CONTENT } from '../constants';

/**
 * Announce message to screen readers via live region
 */
function announceToScreenReader(message: string): void {
  // Find or create live region
  let liveRegion = document.getElementById('sr-announcements');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'sr-announcements';
    liveRegion.className = 'sr-only';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    document.body.appendChild(liveRegion);
  }

  // Clear and set new message (triggers announcement)
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion!.textContent = message;
  }, 100);
}

export class HelpPanelController {
  private static abortController: AbortController | null = null;
  private static openPanelField: string | null = null;

  /**
   * Initialize help panel controller
   * Finds all help icons and sets up event handlers
   */
  static init(): void {
    // Clean up any existing listeners
    this.cleanup();

    // Create new AbortController for this session
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    // Find all help icons
    const helpIcons = document.querySelectorAll<HTMLElement>('.help-icon[data-field]');

    helpIcons.forEach((icon) => {
      const fieldId = icon.dataset.field;
      if (!fieldId || !HELP_CONTENT[fieldId]) {
        return;
      }

      // Create help panel for this field
      this.createHelpPanel(icon, fieldId);

      // Set up ARIA attributes on icon
      const panelId = `help-panel-${fieldId}`;
      icon.setAttribute('role', 'button');
      icon.setAttribute('tabindex', '0');
      icon.setAttribute('aria-expanded', 'false');
      icon.setAttribute('aria-controls', panelId);
      icon.setAttribute('aria-label', `Help for ${HELP_CONTENT[fieldId].title}`);

      // Click handler
      icon.addEventListener(
        'click',
        () => {
          this.togglePanel(fieldId);
        },
        { signal }
      );

      // Keyboard handler (Space/Enter to toggle)
      icon.addEventListener(
        'keydown',
        (e: KeyboardEvent) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this.togglePanel(fieldId);
          }
        },
        { signal }
      );
    });

    // Global Escape key handler to close all panels
    document.addEventListener(
      'keydown',
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.openPanelField) {
          this.closeAllPanels();
        }
      },
      { signal }
    );

    if (import.meta.env.DEV) {
      console.log(`HelpPanelController initialized with ${helpIcons.length} help icons`);
    }
  }

  /**
   * Create help panel HTML and insert into DOM
   */
  private static createHelpPanel(icon: HTMLElement, fieldId: string): void {
    const content = HELP_CONTENT[fieldId];
    if (!content) return;

    const panelId = `help-panel-${fieldId}`;

    // Check if panel already exists
    if (document.getElementById(panelId)) {
      return;
    }

    // Create help panel element
    const panel = document.createElement('div');
    panel.id = panelId;
    panel.className = 'help-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', `help-title-${fieldId}`);

    panel.innerHTML = `
      <h4 id="help-title-${fieldId}">${content.title}</h4>
      <p>${content.content}</p>
    `;

    // Find the parent input-group and insert panel after the grid row
    const inputGroup = icon.closest('.input-group');
    if (inputGroup) {
      // Insert panel as the last child of input-group (will span columns via CSS)
      inputGroup.appendChild(panel);
    }
  }

  /**
   * Toggle a specific help panel
   */
  private static togglePanel(fieldId: string): void {
    const panel = document.getElementById(`help-panel-${fieldId}`);
    const icon = document.querySelector<HTMLElement>(`.help-icon[data-field="${fieldId}"]`);

    if (!panel || !icon) return;

    const isCurrentlyOpen = panel.classList.contains('visible');

    // Close any other open panels first
    if (this.openPanelField && this.openPanelField !== fieldId) {
      this.closePanel(this.openPanelField);
    }

    if (isCurrentlyOpen) {
      // Close this panel
      this.closePanel(fieldId);
    } else {
      // Open this panel
      this.openPanel(fieldId);
    }
  }

  /**
   * Open a specific help panel
   */
  private static openPanel(fieldId: string): void {
    const panel = document.getElementById(`help-panel-${fieldId}`);
    const icon = document.querySelector<HTMLElement>(`.help-icon[data-field="${fieldId}"]`);
    const content = HELP_CONTENT[fieldId];

    if (!panel || !icon || !content) return;

    panel.classList.add('visible');
    icon.setAttribute('aria-expanded', 'true');
    this.openPanelField = fieldId;

    // Announce to screen readers
    announceToScreenReader(`${content.title} help expanded`);
  }

  /**
   * Close a specific help panel
   */
  private static closePanel(fieldId: string): void {
    const panel = document.getElementById(`help-panel-${fieldId}`);
    const icon = document.querySelector<HTMLElement>(`.help-icon[data-field="${fieldId}"]`);
    const content = HELP_CONTENT[fieldId];

    if (!panel || !icon) return;

    panel.classList.remove('visible');
    icon.setAttribute('aria-expanded', 'false');

    if (this.openPanelField === fieldId) {
      this.openPanelField = null;
    }

    // Announce to screen readers
    if (content) {
      announceToScreenReader(`${content.title} help collapsed`);
    }
  }

  /**
   * Close all open help panels
   */
  static closeAllPanels(): void {
    const openPanels = document.querySelectorAll('.help-panel.visible');
    openPanels.forEach((panel) => {
      const fieldId = panel.id.replace('help-panel-', '');
      this.closePanel(fieldId);
    });
    this.openPanelField = null;
  }

  /**
   * Clean up event listeners
   */
  static cleanup(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.openPanelField = null;
  }
}
