import { ref, computed } from 'vue';
import type { Slide } from '../types';

// Estado global simple
const currentSlideIndex = ref(0);
const currentStepIndex = ref(-1); // -1 significa que solo se muestra el contenido base de la slide, sin pasos aún
const slides = ref<Slide[]>([]);

export function useDeck() {
  const initDeck = (deckSlides: Slide[]) => {
    slides.value = deckSlides;
    currentSlideIndex.value = 0;
    currentStepIndex.value = -1;
  };

  const currentSlide = computed(() => slides.value[currentSlideIndex.value]);
  
  const hasNextStep = computed(() => {
    if (!currentSlide.value || !currentSlide.value.steps) return false;
    return currentStepIndex.value < currentSlide.value.steps.length - 1;
  });

  const hasNextSlide = computed(() => {
    return currentSlideIndex.value < slides.value.length - 1;
  });

  const hasPrevStep = computed(() => {
    return currentStepIndex.value > -1;
  });

  const hasPrevSlide = computed(() => {
    return currentSlideIndex.value > 0;
  });

  const next = () => {
    if (hasNextStep.value) {
      currentStepIndex.value++;
    } else if (hasNextSlide.value) {
      currentSlideIndex.value++;
      currentStepIndex.value = -1;
    }
  };

  const prev = () => {
    if (hasPrevStep.value) {
      currentStepIndex.value--;
    } else if (hasPrevSlide.value) {
      currentSlideIndex.value--;
      const prevSlide = slides.value[currentSlideIndex.value];
      currentStepIndex.value = prevSlide.steps ? prevSlide.steps.length - 1 : -1;
    }
  };

  return {
    slides,
    currentSlideIndex,
    currentStepIndex,
    currentSlide,
    hasNextStep,
    hasNextSlide,
    hasPrevStep,
    hasPrevSlide,
    initDeck,
    next,
    prev
  };
}
