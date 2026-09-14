import { onMounted, onUnmounted } from 'vue';

interface KeyboardControlHandlers {
  next: () => void;
  prev: () => void;
}

export function useKeyboardControls(handlers: KeyboardControlHandlers) {
  const handleKeydown = (e: KeyboardEvent) => {
    // Siguiente
    if ([' ', 'ArrowRight', 'PageDown', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      handlers.next();
    }
    // Anterior
    else if (['ArrowLeft'].includes(e.key)) {
      e.preventDefault();
      handlers.prev();
    }
    // Fullscreen
    else if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      toggleFullscreen();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error al intentar entrar en pantalla completa: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
}
