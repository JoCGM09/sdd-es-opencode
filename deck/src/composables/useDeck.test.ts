import { describe, it, expect, beforeEach } from 'vitest';
import { useDeck } from './useDeck';
import type { Slide } from '../types';

const mockSlides: Slide[] = [
  {
    id: '1',
    title: 'Slide 1',
    content: 'Content 1',
    steps: [
      { id: '1-1', content: 'Step 1-1' },
      { id: '1-2', content: 'Step 1-2' }
    ]
  },
  {
    id: '2',
    title: 'Slide 2',
    content: 'Content 2'
  }
];

describe('useDeck', () => {
  let deck: ReturnType<typeof useDeck>;

  beforeEach(() => {
    deck = useDeck();
    deck.initDeck(mockSlides);
  });

  it('should initialize correctly', () => {
    expect(deck.currentSlideIndex.value).toBe(0);
    expect(deck.currentStepIndex.value).toBe(-1);
    expect(deck.currentSlide.value.id).toBe('1');
  });

  it('should advance steps within a slide', () => {
    deck.next();
    expect(deck.currentSlideIndex.value).toBe(0);
    expect(deck.currentStepIndex.value).toBe(0);
    
    deck.next();
    expect(deck.currentSlideIndex.value).toBe(0);
    expect(deck.currentStepIndex.value).toBe(1);
  });

  it('should advance to next slide when steps are exhausted', () => {
    deck.next(); // Step 0
    deck.next(); // Step 1
    deck.next(); // Slide 1 (index 1), Step -1
    
    expect(deck.currentSlideIndex.value).toBe(1);
    expect(deck.currentStepIndex.value).toBe(-1);
    expect(deck.currentSlide.value.id).toBe('2');
  });

  it('should go back steps within a slide', () => {
    deck.next(); // Step 0
    deck.next(); // Step 1
    deck.prev();
    
    expect(deck.currentSlideIndex.value).toBe(0);
    expect(deck.currentStepIndex.value).toBe(0);
  });

  it('should go back to previous slide at last step when at first step (-1)', () => {
    deck.next(); // Slide 0, Step 0
    deck.next(); // Slide 0, Step 1
    deck.next(); // Slide 1, Step -1
    
    deck.prev(); // Should go back to Slide 0, Step 1
    
    expect(deck.currentSlideIndex.value).toBe(0);
    expect(deck.currentStepIndex.value).toBe(1);
  });

  it('should not go before first slide', () => {
    deck.prev();
    expect(deck.currentSlideIndex.value).toBe(0);
    expect(deck.currentStepIndex.value).toBe(-1);
  });

  it('should not go after last slide', () => {
    deck.currentSlideIndex.value = 1;
    deck.currentStepIndex.value = -1;
    
    deck.next();
    expect(deck.currentSlideIndex.value).toBe(1);
    expect(deck.currentStepIndex.value).toBe(-1);
  });
});
