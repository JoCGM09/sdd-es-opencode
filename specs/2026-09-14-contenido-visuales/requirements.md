# Requerimientos: Fase 2 - Contenido y Visuales

## 1. Alcance
Implementar el parseo automático del guion técnico (`pitch.md`) a una estructura de datos compatible con el motor de presentaciones desarrollado en la Fase 1. Además, construir los recursos visuales y diagramas utilizando SVG y componentes Vue, y asociar los metadatos de triggers y notas del presentador para preparar la integración futura con el backend en tiempo real.

## 2. Decisiones Tomadas
*   **Parser Automático de Markdown:** En lugar de mapear a TypeScript manualmente, se construirá un parser (script pre-compilación en Node o plugin de Vite) que convierta `pitch.md` en una estructura JSON/TS consumible por la aplicación.
*   **Sintaxis Extendida en Markdown:**
    *   **Separador de slides:** `---`
    *   **Separador de pasos internos (fragments):** `--`
    *   **Triggers de interacción:** Metadatos embebidos en el guion mediante comentarios HTML (ej. `<!-- trigger: poll-apertura -->`) o frontmatter por bloque.
    *   **Notas del presentador:** Extraídas mediante bloques especiales o comentarios (ej. `<!-- notes: ... -->` o blockquotes `>`).
*   **Diagramas y Animaciones (Sin Mermaid):** Se descarta Mermaid.js para tener control absoluto sobre las animaciones. Los diagramas (como la arquitectura en AWS) se construirán mediante **SVG puro integrados en Componentes Vue**. Esto permite asociar el prop del paso actual (`currentStep`) a la opacidad y las clases de Tailwind de cada capa del SVG.
*   **Triggers Identificados:** Se inyectarán explícitamente los IDs definidos: `poll-apertura`, `poll-pulso` y `poll-cierre`.

## 3. Fuera de Alcance
*   **Backend Realtime:** El backend en tiempo real (Socket.io / Supabase) se implementará en la siguiente fase; aquí solo se preparan los campos `interactionTrigger` en el estado local.
*   **Vistas Móviles de Audiencia:** Todavía no se desarrolla ninguna UI web para el público.
*   **Mapeo Manual:** Queda prohibido escribir las slides directamente en TypeScript de manera estática; todo debe fluir a través del Parser Automático de Markdown.
*   **Dependencias de diagramación externas:** No se usarán librerías externas que abstraigan el renderizado de gráficos y restrinjan los hooks de animación.