/**
 * Drag & Drop Handler
 * Manages drag-and-drop reordering for social media channels using SortableJS
 */

import Sortable from 'sortablejs';
import type { AppStateManager } from '../app/state';
import type { PreviewRenderer } from '../app/preview-renderer';
import type { SocialChannel } from '../types';
import { eventBus } from '../events';

const VALID_CHANNELS: SocialChannel[] = ['linkedin', 'youtube', 'twitter', 'instagram', 'facebook'];

function isValidChannel(channel: string): channel is SocialChannel {
  return VALID_CHANNELS.includes(channel as SocialChannel);
}

export class DragDropHandler {
  private stateManager: AppStateManager;
  private previewRenderer: PreviewRenderer;
  private sortable: Sortable | null = null;

  constructor(stateManager: AppStateManager, previewRenderer: PreviewRenderer) {
    this.stateManager = stateManager;
    this.previewRenderer = previewRenderer;
  }

  private static readonly DEFAULT_ORDER: SocialChannel[] = ['linkedin', 'youtube', 'twitter', 'instagram', 'facebook'];

  /**
   * Initialize drag-drop functionality
   */
  initialize(): void {
    this.setupSortable();
    this.setupCardClickHandlers();
    this.setupMasterToggle();
    this.setupResetButton();
  }

  /**
   * Setup SortableJS for smooth drag animations
   */
  private setupSortable(): void {
    const grid = document.getElementById('socialCompactGrid');
    if (!grid) return;

    this.sortable = Sortable.create(grid, {
      animation: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)', // iOS-like spring easing
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',

      onEnd: () => {
        this.saveOrder();
      }
    });
  }

  /**
   * Save channel order to state and localStorage
   */
  private saveOrder(): void {
    const cards = document.querySelectorAll('.social-compact-card.active');
    const order = Array.from(cards)
      .map((card) => (card as HTMLElement).dataset.channel || '')
      .filter((ch): ch is SocialChannel => isValidChannel(ch));

    // Update state with validated channels
    this.stateManager.setSocialOptions({ channels: order });
    this.stateManager.saveSocialOrder();

    // Emit event for decoupled updates
    eventBus.emit('social:changed', { channels: order });

    // Re-render preview
    this.previewRenderer.render();
  }

  /**
   * Setup card click handlers for toggle on/off
   */
  private setupCardClickHandlers(): void {
    const socialCards = document.querySelectorAll('.social-compact-card');

    socialCards.forEach((card) => {
      const htmlCard = card as HTMLElement;

      // Set initial aria-checked based on active class
      htmlCard.setAttribute('aria-checked', String(htmlCard.classList.contains('active')));

      // Handler for toggling social card
      const handleCardToggle = () => {
        // Toggle active state
        htmlCard.classList.toggle('active');
        htmlCard.setAttribute('aria-checked', String(htmlCard.classList.contains('active')));

        // Update state with active channels and re-render preview
        this.updateActiveChannels();
      };

      // Click handler
      htmlCard.addEventListener('click', handleCardToggle);

      // Keyboard handler (Space/Enter for accessibility)
      htmlCard.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleCardToggle();
        }
      });
    });
  }

  /**
   * Get active channels from DOM and update state
   */
  private updateActiveChannels(): void {
    const activeCards = document.querySelectorAll('.social-compact-card.active');
    const activeChannels = Array.from(activeCards)
      .map((card) => (card as HTMLElement).dataset.channel || '')
      .filter((ch): ch is SocialChannel => isValidChannel(ch));

    // Update state with validated active channels
    this.stateManager.setSocialOptions({ channels: activeChannels });

    // Emit event for decoupled updates
    eventBus.emit('social:changed', { channels: activeChannels });

    // Re-render preview
    this.previewRenderer.render();
  }

  /**
   * Setup master social toggle
   */
  private setupMasterToggle(): void {
    const masterToggle = document.getElementById('master-social-toggle');
    if (!masterToggle) return;

    // Handler for toggling all social channels
    const handleMasterToggle = () => {
      const isActive = masterToggle.classList.contains('active');
      const newState = !isActive;

      // Toggle visual state
      masterToggle.classList.toggle('active');
      masterToggle.setAttribute('aria-checked', String(newState));

      // Toggle all social cards
      const socialCards = document.querySelectorAll('.social-compact-card');
      socialCards.forEach((card) => {
        const htmlCard = card as HTMLElement;
        if (newState) {
          htmlCard.classList.add('active');
        } else {
          htmlCard.classList.remove('active');
        }
        htmlCard.setAttribute('aria-checked', String(newState));
      });

      // Update state and re-render preview
      this.updateActiveChannels();
    };

    // Click handler
    masterToggle.addEventListener('click', handleMasterToggle);

    // Keyboard handler (Space/Enter for role="switch" accessibility)
    masterToggle.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleMasterToggle();
      }
    });
  }

  /**
   * Setup reset button to restore default order
   */
  private setupResetButton(): void {
    const resetBtn = document.getElementById('socialResetBtn');
    if (!resetBtn) return;

    resetBtn.addEventListener('click', () => {
      this.resetToDefaultOrder();
    });
  }

  /**
   * Reset social channels to default order
   */
  private resetToDefaultOrder(): void {
    const grid = document.getElementById('socialCompactGrid');
    if (!grid) return;

    // Reorder DOM elements to match default order
    DragDropHandler.DEFAULT_ORDER.forEach(channel => {
      const card = grid.querySelector(`[data-channel="${channel}"]`);
      if (card) {
        // Also ensure it's active
        card.classList.add('active');
        card.setAttribute('aria-checked', 'true');
        grid.appendChild(card);
      }
    });

    // Update master toggle to active
    const masterToggle = document.getElementById('master-social-toggle');
    if (masterToggle) {
      masterToggle.classList.add('active');
      masterToggle.setAttribute('aria-checked', 'true');
    }

    // Save the new order
    this.saveOrder();
  }

  /**
   * Destroy sortable instance (cleanup)
   */
  destroy(): void {
    if (this.sortable) {
      this.sortable.destroy();
      this.sortable = null;
    }
  }
}
