# Requerimientos: Fase 1 - Motor Core Standalone

## 1. Alcance
Construir el núcleo del motor de presentaciones en Vue, capaz de renderizar slides y pasos internos de forma autónoma (offline) desde una estructura de datos local en JSON/TS, utilizando estilos basados en Tailwind y transiciones nativas de CSS. 

## 2. Decisiones Tomadas
*   **Datos:** El contenido de las presentaciones se definirá como una estructura de objetos estáticos en TypeScript o JSON, mapeando slides y sus `fragments` (pasos internos).
*   **Estilos y UI:** Se utilizará Tailwind CSS para la maquetación. El estilo visual seguirá el `brand-definition.md` (modo oscuro dev-tool).
*   **Controles de Navegación:**
    *   Siguiente: Clic izquierdo, flecha derecha, Espacio, RePág, AvPág.
    *   Anterior: Flecha izquierda.
    *   Pantalla Completa: Mapeado a la tecla 'F'.
*   **Deep-linking:** Las rutas reflejarán el estado de la presentación (`/deck/:slide/:step`) para permitir saltos directos y facilitar recargas sin perder contexto.

## 3. Fuera de Alcance (Exclusiones explícitas)
*   **Servidor Realtime / Socket.io:** La Fase 1 corre estrictamente local y offline, sin backend.
*   **Audiencia / Dispositivos Móviles:** No se construirá ninguna interfaz para el público todavía.
*   **Generador/Editor visual:** Los datos se manejan escribiendo código/JSON a mano.
*   **Gráficos Avanzados (Mermaid):** Los diagramas dinámicos quedan para la Fase 2. Aquí solo se soportará texto e imágenes simples como proof-of-concept de los pasos.
