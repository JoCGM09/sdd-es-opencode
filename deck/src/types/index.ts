export interface SlideStep {
  id: string;
  content: string; // Puede ser HTML o texto para renderizar
  // En el futuro podemos agregar cosas como animaciones especificas o componentes
}

export interface Slide {
  id: string;
  title?: string;
  content: string; // Contenido base de la slide
  steps?: SlideStep[]; // Fragments que van apareciendo
  interactionTrigger?: string; // ID para disparar evento en el server (Fase 3)
  notes?: string; // Notas del presentador
}
