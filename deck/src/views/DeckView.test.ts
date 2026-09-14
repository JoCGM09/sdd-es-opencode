import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import DeckView from './DeckView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('DeckView.vue', () => {
  let router: any;

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/deck/:slide/:step',
          name: 'deck',
          component: DeckView
        }
      ]
    });
    router.push('/deck/0/-1');
    await router.isReady();
  });

  it('renders the first slide', async () => {
    const wrapper = mount(DeckView, {
      global: {
        plugins: [router],
        stubs: {
          Transition: false,
          TransitionGroup: false
        }
      }
    });
    
    await flushPromises();
    await nextTick();
    
    expect(wrapper.text()).toContain('Motor Core Standalone');
  });

  it('advances on click and updates URL', async () => {
    const wrapper = mount(DeckView, {
      global: {
        plugins: [router],
        stubs: {
          Transition: true,
          TransitionGroup: true
        }
      }
    });

    await flushPromises();
    await nextTick();

    await wrapper.trigger('click');
    await flushPromises();
    await nextTick();
    
    expect(router.currentRoute.value.path).toBe('/deck/1/-1');
  });

  it('shows steps sequentially on click', async () => {
    router.push('/deck/1/-1');
    await router.isReady();

    const wrapper = mount(DeckView, {
      global: {
        plugins: [router],
        stubs: {
          Transition: true,
          TransitionGroup: true
        }
      }
    });

    await flushPromises();
    await nextTick();
    
    // Check steps
    const getSteps = () => wrapper.findAll('div').filter(w => w.html().includes('Paso'));
    const getVisibleSteps = () => getSteps().filter(w => w.isVisible());

    expect(getVisibleSteps().length).toBe(0);

    await wrapper.trigger('click');
    await flushPromises();
    await nextTick();
    
    // In some environments, router.push might need more time or another tick
    await flushPromises();
    
    expect(router.currentRoute.value.path).toBe('/deck/1/0');
    expect(getVisibleSteps().length).toBe(1);
    expect(getVisibleSteps()[0].text()).toContain('Paso 1');
  });

  it('loads correct slide and step from URL', async () => {
    router.push('/deck/1/1');
    await router.isReady();

    const wrapper = mount(DeckView, {
      global: {
        plugins: [router],
        stubs: {
          Transition: true,
          TransitionGroup: true
        }
      }
    });

    await flushPromises();
    await nextTick();

    expect(wrapper.text()).toContain('Fragmentos');
    expect(wrapper.text()).toContain('Paso 2');
    
    const getSteps = () => wrapper.findAll('div').filter(w => w.html().includes('Paso'));
    const getVisibleSteps = () => getSteps().filter(w => w.isVisible());
    
    expect(getVisibleSteps().length).toBe(2); // Paso 1 and Paso 2
  });
});
