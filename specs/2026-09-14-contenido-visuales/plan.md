# Plan de Implementación: Fase 2 - Contenido y Visuales

## Tarea 1: Adaptación de Sintaxis en `pitch.md`
[x] Actualizar el archivo raíz `pitch.md` para introducir la sintaxis del parser:
  - Definir delimitadores lógicos usando `---` para iniciar cada nueva diapositiva.
  - Usar `--` para definir la aparición de elementos progresivos (pasos o fragments) dentro de una slide.
  - Insertar `<!-- notes: ... -->` envolviendo el discurso hablado del presentador, para no mostrarlo en pantalla.
  - Colocar `<!-- trigger: poll-apertura -->`, `<!-- trigger: poll-pulso -->` y `<!-- trigger: poll-cierre -->` en los momentos correctos del guion.

## Tarea 2: Construcción del Parser de Markdown
[x] Desarrollar el parser (`scripts/parse-pitch.js` o equivalente) que:
  - Lea el archivo fuente `pitch.md`.
  - Fragmente el documento generando un array de objetos tipo `Slide`.
  - Agrupe el contenido visual vs. el texto que pertenece al array de `notes`.
  - Identifique las transiciones internas (los `--`) y cree un sub-array numérico o de strings correspondientes a los `steps`.
  - Asigne el campo `interactionTrigger` si está presente en la diapositiva.
[x] Configurar el build/dev server (Vite/Node) para ejecutar este parser antes o durante el empaquetado, volcando un `src/data/slides.json` (o `.ts`) resultante.

## Tarea 3: Componente Vue para Diagrama SVG (Arquitectura AWS)
[x] Construir el componente `AwsArchitectureDiagram.vue`.
[x] Integrar la ilustración de las 4 capas usando SVG puro.
[x] Conectar un prop dinámico de `currentStep` al componente.
[x] Añadir condicionales Vue (`v-show` / `v-if` / clases reactivas) para revelar de forma progresiva:
  - Paso 1: Orquestación (EventBridge/Step Functions).
  - Paso 2: Cómputo (Fargate/dbt-ol).
  - Paso 3: Motor y Almacenamiento (Athena/Iceberg/Glue).
  - Paso 4: Linaje y Gobernanza (DataZone/SageMaker).
[x] Estilizar las animaciones usando transiciones fluidas de Tailwind (opacity, scale, translate).

## Tarea 4: Integración del Core y Renderizado Dinámico
[x] Actualizar el motor de navegación de la Fase 1 para consumir el JSON generado automáticamente por el Parser en vez de datos quemados en código.
[x] Implementar la inyección de componentes Vue (ej. un tag HTML especial o metadato en Markdown para instanciar `<AwsArchitectureDiagram />` en la slide correspondiente).
[x] Añadir un "watcher" o log en la aplicación Vue que imprima en consola (o notifique temporalmente en la UI) al entrar a una slide cuyo campo `interactionTrigger` no es nulo, validando que el momento exacto ha sido capturado.