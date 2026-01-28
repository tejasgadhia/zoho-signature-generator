import { describe, it, expect, vi } from 'vitest';
import { EventBus, eventBus } from './events';

describe('EventBus', () => {
  describe('on/emit', () => {
    it('should subscribe and receive events', () => {
      const bus = new EventBus();
      const handler = vi.fn();

      bus.on('form:changed', handler);
      bus.emit('form:changed', { field: 'name', value: 'John' });

      expect(handler).toHaveBeenCalledWith({ field: 'name', value: 'John' });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should support multiple subscribers for same event', () => {
      const bus = new EventBus();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bus.on('preview:render', handler1);
      bus.on('preview:render', handler2);
      bus.emit('preview:render', { immediate: true });

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });

    it('should not call handlers for different events', () => {
      const bus = new EventBus();
      const handler = vi.fn();

      bus.on('form:changed', handler);
      bus.emit('style:changed', { style: 'classic' });

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe from events', () => {
      const bus = new EventBus();
      const handler = vi.fn();

      const subscription = bus.on('form:changed', handler);
      bus.emit('form:changed', { field: 'name', value: 'John' });
      expect(handler).toHaveBeenCalledTimes(1);

      subscription.unsubscribe();
      bus.emit('form:changed', { field: 'name', value: 'Jane' });
      expect(handler).toHaveBeenCalledTimes(1); // Still 1, not called again
    });
  });

  describe('once', () => {
    it('should only call handler once', () => {
      const bus = new EventBus();
      const handler = vi.fn();

      bus.once('preview:render', handler);
      bus.emit('preview:render', { immediate: false });
      bus.emit('preview:render', { immediate: true });

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('off', () => {
    it('should remove all handlers for an event', () => {
      const bus = new EventBus();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bus.on('style:changed', handler1);
      bus.on('style:changed', handler2);

      bus.off('style:changed');
      bus.emit('style:changed', { style: 'modern' });

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should remove all handlers for all events', () => {
      const bus = new EventBus();
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      bus.on('form:changed', handler1);
      bus.on('style:changed', handler2);

      bus.clear();
      bus.emit('form:changed', { field: 'test', value: 'test' });
      bus.emit('style:changed', { style: 'compact' });

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('listenerCount', () => {
    it('should return correct listener count', () => {
      const bus = new EventBus();

      expect(bus.listenerCount('form:changed')).toBe(0);

      bus.on('form:changed', () => {});
      expect(bus.listenerCount('form:changed')).toBe(1);

      bus.on('form:changed', () => {});
      expect(bus.listenerCount('form:changed')).toBe(2);
    });
  });

  describe('error handling', () => {
    it('should not break other handlers if one throws', () => {
      const bus = new EventBus();
      const errorHandler = vi.fn(() => { throw new Error('Test error'); });
      const goodHandler = vi.fn();

      bus.on('preview:render', errorHandler);
      bus.on('preview:render', goodHandler);

      // Should not throw
      bus.emit('preview:render', { immediate: false });

      expect(errorHandler).toHaveBeenCalled();
      expect(goodHandler).toHaveBeenCalled();
    });
  });

  describe('singleton instance', () => {
    it('should export a singleton instance', () => {
      expect(eventBus).toBeInstanceOf(EventBus);
    });
  });
});
