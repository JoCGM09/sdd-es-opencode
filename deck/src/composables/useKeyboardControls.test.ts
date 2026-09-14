import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useKeyboardControls } from './useKeyboardControls';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';

describe('useKeyboardControls', () => {
  const handlers = {
    next: vi.fn(),
    prev: vi.fn(),
  };

  const TestComponent = defineComponent({
    setup() {
      useKeyboardControls(handlers);
      return () => h('div');
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock fullscreen API
    document.documentElement.requestFullscreen = vi.fn().mockResolvedValue(undefined);
    document.exitFullscreen = vi.fn().mockResolvedValue(undefined);
    // Object.defineProperty to mock fullscreenElement
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: vi.fn().mockReturnValue(null),
    });
  });

  it('should call next handler on ArrowRight', async () => {
    const wrapper = mount(TestComponent);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(handlers.next).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('should call next handler on Space', async () => {
    const wrapper = mount(TestComponent);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    expect(handlers.next).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('should call next handler on PageUp and PageDown', async () => {
    const wrapper = mount(TestComponent);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageUp' }));
    expect(handlers.next).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown' }));
    expect(handlers.next).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it('should call prev handler on ArrowLeft', async () => {
    const wrapper = mount(TestComponent);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(handlers.prev).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('should toggle fullscreen on "f"', async () => {
    const wrapper = mount(TestComponent);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }));
    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();

    // Simulate being in fullscreen
    vi.mocked(document.fullscreenElement);
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: vi.fn().mockReturnValue(document.documentElement),
    });

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f' }));
    expect(document.exitFullscreen).toHaveBeenCalled();
    wrapper.unmount();
  });
});
