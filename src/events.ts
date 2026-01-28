/**
 * Event Bus
 * Centralized event dispatch for decoupled component communication
 */

/**
 * Event types supported by the event bus
 */
export type EventType =
  | 'preview:render'      // Request to re-render the preview
  | 'preview:rendered'    // Preview has been rendered
  | 'state:changed'       // Any state has changed
  | 'form:changed'        // Form data has changed
  | 'style:changed'       // Signature style has changed
  | 'social:changed'      // Social options have changed
  | 'theme:changed'       // Theme (light/dark) has changed
  | 'color:changed';      // Accent color has changed

/**
 * Event payload types
 */
export interface EventPayloads {
  'preview:render': { immediate?: boolean };
  'preview:rendered': { success: boolean };
  'state:changed': { field?: string };
  'form:changed': { field: string; value: string };
  'style:changed': { style: string };
  'social:changed': { channels?: string[]; enabled?: boolean };
  'theme:changed': { isDark: boolean };
  'color:changed': { color: string };
}

/**
 * Event handler function type
 */
type EventHandler<T extends EventType> = (payload: EventPayloads[T]) => void;

/**
 * Subscription handle for unsubscribing
 */
interface Subscription {
  unsubscribe: () => void;
}

/**
 * Event Bus class
 * Provides pub/sub pattern for decoupled communication
 */
class EventBus {
  private handlers: Map<EventType, Set<EventHandler<EventType>>> = new Map();

  /**
   * Subscribe to an event
   * @param event - Event type to subscribe to
   * @param handler - Handler function to call when event is emitted
   * @returns Subscription object with unsubscribe method
   */
  on<T extends EventType>(event: T, handler: EventHandler<T>): Subscription {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }

    const handlers = this.handlers.get(event)!;
    handlers.add(handler as EventHandler<EventType>);

    return {
      unsubscribe: () => {
        handlers.delete(handler as EventHandler<EventType>);
      }
    };
  }

  /**
   * Subscribe to an event (one-time)
   * Handler is automatically unsubscribed after first call
   */
  once<T extends EventType>(event: T, handler: EventHandler<T>): Subscription {
    const wrappedHandler: EventHandler<T> = (payload) => {
      subscription.unsubscribe();
      handler(payload);
    };

    const subscription = this.on(event, wrappedHandler);
    return subscription;
  }

  /**
   * Emit an event
   * @param event - Event type to emit
   * @param payload - Event payload data
   */
  emit<T extends EventType>(event: T, payload: EventPayloads[T]): void {
    const handlers = this.handlers.get(event);
    if (!handlers) return;

    handlers.forEach(handler => {
      try {
        handler(payload);
      } catch (error) {
        console.error(`Event handler error for "${event}":`, error);
      }
    });
  }

  /**
   * Remove all handlers for an event
   */
  off(event: EventType): void {
    this.handlers.delete(event);
  }

  /**
   * Remove all handlers for all events
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Get the number of handlers for an event
   * Useful for debugging
   */
  listenerCount(event: EventType): number {
    return this.handlers.get(event)?.size || 0;
  }
}

// Export singleton instance
export const eventBus = new EventBus();

// Export class for testing or multiple instances
export { EventBus };
