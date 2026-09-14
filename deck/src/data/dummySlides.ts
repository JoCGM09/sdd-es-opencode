import type { Slide } from '../types';

export const dummySlides: Slide[] = [
  {
    id: 'slide-1',
    title: 'Bienvenido a Pitch Gen',
    content: '<h1 class="text-4xl font-bold text-brand-primary mb-4">Motor Core Standalone</h1><p class="text-xl">Navegación offline y robusta.</p>'
  },
  {
    id: 'slide-2',
    title: 'Navegación por Pasos',
    content: '<h2 class="text-3xl font-semibold mb-4">Fragmentos</h2><p class="mb-6">Esta slide tiene múltiples pasos que se revelan con cada clic.</p>',
    steps: [
      {
        id: 'step-1',
        content: '<div class="p-4 bg-brand-primary/20 border border-brand-primary rounded-md mb-4">Paso 1: Aparece el primer concepto.</div>'
      },
      {
        id: 'step-2',
        content: '<div class="p-4 bg-brand-secondary/20 border border-brand-secondary rounded-md mb-4">Paso 2: Luego este segundo concepto.</div>'
      },
      {
        id: 'step-3',
        content: '<div class="p-4 bg-semantic-success/20 border border-semantic-success rounded-md mb-4">Paso 3: Y finalmente este último.</div>'
      }
    ]
  },
  {
    id: 'slide-3',
    title: 'Fin de Demo',
    content: '<h2 class="text-3xl font-semibold mb-4">Gracias</h2><p class="text-xl text-gray-400">Presiona flecha izquierda para retroceder y ver cómo se deshacen los pasos.</p>',
    interactionTrigger: 'poll-cierre'
  }
];
