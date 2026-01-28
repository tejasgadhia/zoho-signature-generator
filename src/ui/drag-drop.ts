/**
 * Drag & Drop Handler
 * Manages drag-and-drop reordering for social media channels
 */

import type { AppStateManager } from '../app/state';
import type { PreviewRenderer } from '../app/preview-renderer';
import type { SocialChannel } from '../types';

const VALID_CHANNELS: SocialChannel[] = ['linkedin', 'twitter', 'instagram', 'facebook'];

function isValidChannel(channel: string): channel is SocialChannel {
  return VALID_CHANNELS.includes(channel as SocialChannel);
}

export class DragDropHandler {
  private stateManager: AppStateManager;
  private previewRenderer: PreviewRenderer;
  private draggedElement: HTMLElement | null = null;

  constructor(stateManager: AppStateManager, previewRenderer: PreviewRenderer) {
    this.stateManager = stateManager;
    this.previewRenderer = previewRenderer;
  }

  /**
   * Initialize drag-drop functionality
   */
  initialize(): void {
    this.setupDragListeners();
    this.setupCardClickHandlers();
    this.setupMasterToggle();
  }

  /**
   * Setup drag-and-drop event listeners
   */
  private setupDragListeners(): void {
    const socialCards = document.querySelectorAll('.social-compact-card');

    socialCards.forEach((card) => {
      const htmlCard = card as HTMLElement;

      // Make draggable
      htmlCard.setAttribute('draggable', 'true');

      // Drag start
      htmlCard.addEventListener('dragstart', (e) => {
        this.handleDragStart(e as DragEvent);
      });

      // Drag over
      htmlCard.addEventListener('dragover', (e) => {
        e.preventDefault();  // Allow drop
        this.handleDragOver(e as DragEvent);
      });

      // Drop
      htmlCard.addEventListener('drop', (e) => {
        e.preventDefault();
        this.handleDrop(e as DragEvent);
      });

      // Drag end
      htmlCard.addEventListener('dragend', () => {
        this.handleDragEnd();
      });
    });
  }

  /**
   * Handle drag start
   */
  private handleDragStart(event: DragEvent): void {
    this.draggedElement = event.target as HTMLElement;
    this.draggedElement.classList.add('dragging');

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', this.draggedElement.innerHTML);
    }
  }

  /**
   * Handle drag over
   */
  private handleDragOver(event: DragEvent): void {
    const target = event.target as HTMLElement;
    const card = target.closest('.social-compact-card') as HTMLElement;

    if (card && card !== this.draggedElement) {
      // Visual feedback
      card.classList.add('drag-over');
    }
  }

  /**
   * Handle drop
   */
  private handleDrop(event: DragEvent): void {
    if (!this.draggedElement) return;

    const target = event.target as HTMLElement;
    const dropTarget = target.closest('.social-compact-card') as HTMLElement;

    if (dropTarget && dropTarget !== this.draggedElement) {
      const container = dropTarget.parentElement;
      if (!container) return;

      // Determine drop position
      const rect = dropTarget.getBoundingClientRect();
      const midpoint = (rect.left + rect.right) / 2;
      const insertBefore = event.clientX < midpoint;

      // Reorder DOM elements
      if (insertBefore) {
        container.insertBefore(this.draggedElement, dropTarget);
      } else {
        container.insertBefore(this.draggedElement, dropTarget.nextSibling);
      }

      // Save new order
      this.saveOrder();
    }
  }

  /**
   * Handle drag end (cleanup)
   */
  private handleDragEnd(): void {
    // Remove visual feedback
    document.querySelectorAll('.social-compact-card').forEach((card) => {
      card.classList.remove('dragging', 'drag-over');
    });

    this.draggedElement = null;
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

      htmlCard.addEventListener('click', () => {
        // Prevent toggle during drag
        if (this.draggedElement) return;

        // Toggle active state
        htmlCard.classList.toggle('active');
        htmlCard.setAttribute('aria-checked', String(htmlCard.classList.contains('active')));

        // Update state with active channels and re-render preview
        this.updateActiveChannels();
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

    // Re-render preview
    this.previewRenderer.render();
  }

  /**
   * Setup master social toggle
   */
  private setupMasterToggle(): void {
    const masterToggle = document.getElementById('master-social-toggle');
    if (!masterToggle) return;

    masterToggle.addEventListener('click', () => {
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
    });
  }
}
