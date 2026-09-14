# Plan: Fase 1 - Motor Core Standalone

## 1. Setup del Proyecto (Vue + Tailwind)
[x] 1. Inicializar proyecto Vite + Vue + TypeScript en la raíz o en una carpeta `/deck`. (Definir estructura).
[x] 2. Instalar y configurar Tailwind CSS.
[x] 3. Cargar e integrar las fuentes y variables definidas en `specs/design-tokens.json` a la configuración de Tailwind.

## 2. Estructura de Datos y Modelo de Estado
[x] 1. Crear los tipos (Interfaces) en TypeScript para `Slide` y `SlideStep` (fragments).
[x] 2. Crear un archivo temporal con datos de ejemplo (dummy data) para tener al menos 3 slides, una de ellas con múltiples pasos.
[x] 3. Implementar un store simple (o usar variables reactivas/composables de Vue) para mantener el estado: `currentSlideIndex` y `currentStepIndex`.

## 3. Enrutamiento (Deep-linking)
[x] 1. Instalar y configurar Vue Router.
[x] 2. Crear ruta dinámica `/deck/:slide/:step`.
[x] 3. Vincular el estado reactivo con los parámetros de la URL para que al navegar por los parámetros, el estado se actualice y viceversa.

## 4. Controles y Navegación Global
[x] 1. Implementar un Composable/Store para capturar eventos globales del teclado (`keydown`).
[x] 2. Mapear Espacio, Flecha Derecha, RePág, AvPág y el clic izquierdo (en el contenedor principal) a la acción de "Siguiente".
[x] 3. Mapear Flecha Izquierda a la acción de "Anterior".
[x] 4. Mapear tecla 'F' al Fullscreen API del navegador.
[x] 5. Implementar la lógica de avance/retroceso respetando los límites (no pasar del último paso ni de la última slide).

## 5. Renderizado y Animaciones Core
[x] 1. Crear el componente contenedor de la presentación (16:9, centrado, fondo oscuro).
[x] 2. Implementar renderizado condicional del contenido de la slide actual y sus pasos revelados usando `<Transition>` de Vue y clases de Tailwind para un *fade* o *slide-in* básico.
