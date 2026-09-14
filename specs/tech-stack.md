# Stack Tecnológico

<!-- Generado/actualizado por /constitution -->

## Stack Seleccionado
| Capa         | Elección | Justificación |
|--------------|--------|-----------|
| Frontend     | Vue (SPA) | Liviano, sin overhead de SSR (como Next.js), ideal para un motor standalone enfocado en animaciones y control de DOM local. |
| Animaciones  | CSS Transitions | Suficiente para la mayoría de revelados (fade, slide). Si es necesario, integración con Motion One para animaciones más complejas del guion. |
| Backend Realtime | Node.js + Socket.io | Estándar y robusto para sincronización de estado bi-direccional entre el presentador y la audiencia móvil. |
| Base de datos| Supabase (Realtime / DB) | Actuará como capa de pub/sub o almacenamiento efímero de estado para la sesión activa (qué slide se ve, votos de polls activos). Reemplaza Redis en memoria para facilitar el despliegue serverless. |
| Hosting/CI   | Vercel | Permite despliegue rápido del front-end Vue y posibles Serverless Functions. *Nota: El servidor de Socket.io puro puede requerir un adaptador o un entorno distinto (ej. Render/Railway) si Vercel Serverless Functions no soporta websockets persistentes, o usar el realtime de Supabase directamente para reemplazar Socket.io.* |
| Diagramas    | Mermaid.js / SVG | Ideal para arquitecturas técnicas y control por pasos ("capas") narrativas. |

## Alternativas Descartadas
- **Next.js / SSR:** Añade complejidad y latencia innecesaria; el deck debe ser proyector-first, 100% offline-capaz en su núcleo visual, y no requiere SEO.
- **Slidev / reveal.js:** Descartados por requerimiento de la misión. Se necesita control absoluto del loop de navegación para atarlo al disparo automático de encuestas.
- **Base de datos persistente (SQL tradicional):** No se mantendrá histórico ni analítica de los polls post-evento. Los datos son efímeros. El uso de Supabase se restringe a canal de estado en tiempo real.

## Estándares Técnicos, Buenas Prácticas y Seguridad
- **Tolerancia a fallos de red:** La aplicación Vue (Deck del presentador) debe atrapar errores del socket y permitir seguir navegando la presentación de forma local, ignorando los features de audiencia.
- **Seguridad / Anti-abuso:** Implementar rate-limiting o debounce en el Q&A de la audiencia.
- **Modo Pantalla Completa:** Requerido para la experiencia de proyección en la capa del presentador.
- **URLs por Slide:** Implementar deep-linking (`/deck/:slide/:step`) usando Vue Router para facilitar ensayos.