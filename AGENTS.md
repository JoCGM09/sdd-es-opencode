# AGENTS.md — Reglas del proyecto

Este archivo se carga SIEMPRE (ver `instructions` en opencode.json).

<!-- Completa esto con todos los detalles de tu proyecto con conocimiento general compartido -->

 Un motor de presentación web a medida — navegación por clic/puntero como PowerPoint, animaciones de contenido, diagramas de arquitectura— **unificado** con la capa de interacción de audiencia que ya especificamos. No uses Slidev, reveal.js ni ningún motor de slides de terceros: constrúyelo desde cero con tu propio modelo de "slide" y "paso animado", porque necesitamos que avanzar una slide pueda, cuando corresponda, disparar un poll en el teléfono del público — y eso requiere control total del ciclo de navegación, no un plugin sobre un motor ajeno. 

Toma como referencia el archivo [pitch.md](http://pitch.md) y la carpeta de /fuentes. Si no existe [pitch.md](http://pitch.md) generalo en base a las fuentes presentes acompañada de preguntas necesarias o información extra que se quiera brindar sobre el contenido de la charla técnica.

Dos superficies, un servidor:

- **Deck del presentador** — lo que se proyecta. Navegación por clic de mouse, flechas de teclado, y puntero/clicker (que el navegador ve como flechas o `PageUp`/`PageDown`/espacio — soporta esos tres esquemas de tecla). Que tenga la opción de agregar vista de presentador para que, al compartir dos veces la pantalla, en una pantalla se pueda ver qué se verá después de presionar el click de siguiente parte.
- **Audiencia (móvil)** — Sin ver el deck, solo interactúa cuando corresponde para responder preguntas que se reflejarán en tiempo real, interacciones durante la presentación de los usuarios y cada cierto tiempo recibir los puntos más importantes presentados de la teoría. Al final de la charla, debe existir la forma de que ellos se lleven los apuntes de resumen que se ha ido generando. 
- **Servidor en tiempo real** — ahora con una responsabilidad más: además de agregar resultados, sabe qué slide está activa y, si esa slide está marcada como "punto de interacción", activa el poll correspondiente automáticamente en el momento en que el presentador llega a ella.

## Restricciones duras (no negociables)

- **El deck es desktop/proyector-first.** Optimiza para 16:9 en pantalla grande, no para móvil. La audiencia sigue sin necesitar verlo.
- **La audiencia nunca necesita ver ni cargar la presentación**.
- **Un solo input de navegación, tres formas de disparar el mismo evento**: clic izquierdo del mouse, flecha derecha/espacio del teclado, y botón de avance de un puntero/clicker físico — los tres deben producir exactamente la misma acción de "avanzar un paso". No trates el puntero como un caso especial; los clickers estándar ya emulan teclado.
- **Cada slide puede tener varios "pasos" internos** (fragments): un clic no siempre pasa a la slide siguiente, primero revela lo que falta dentro de la slide actual — igual que el comportamiento de builds en Keynote/PowerPoint. El agente debe modelar esto explícitamente: `slide → pasos internos → slide siguiente`, no `slide → slide` sin estados intermedios.
- **Tolerancia a fallo cero durante la charla.** Si el servidor en tiempo real se cae, el deck debe seguir navegable con clic/teclado sin ninguna dependencia de red — la sincronización con audiencia es una capa opcional encima de un deck que funciona standalone.
- **Retroceder debe funcionar siempre**, incluyendo deshacer pasos internos ya revelados, sin romper el estado de si un poll ya fue disparado o no (retroceder no debe volver a lanzar el mismo poll dos veces).

## Los momentos de interacción

1. Poll binario de apertura (doble) — Sí/No.
2. Check de pulso a mitad de charla — opción única, 3-4 opciones.
3. Votación de cierre — opción única sobre los tres pasos finales.
4. Preguntas abiertas de texto libre (Q&amp;A), disponibles en cualquier momento, no atadas a una slide específica.
5. Apuntes entregados, no generados por IA, entregados por partes y un resumen al final.

**L**os momentos 1, 2 y 3 ahora se marcan directamente en la slide correspondiente como `interactionTrigger: <id>`. El presentador no necesita una vista de control aparte para activarlos — llegar a esa slide (avanzar con clic/teclado/puntero) ya dispara el poll en el servidor. El momento 4 (Q&amp;A) es la excepción: vive activo durante toda la charla, no se dispara por navegación.

Esto simplifica la arquitectura: el "panel de control" del presentador deja de ser una vista separada y se convierte en un panel lateral opcional *dentro* del propio deck (visible solo en la pantalla del presentador si usas modo dual-screen, ver sección 6), mostrando resultados en vivo del poll que acaba de disparar, sin que la audiencia lo vea.

## El motor de slides: navegación, animaciones, diagramas

- **Modelo de datos de una slide:** cada slide es un objeto con una lista ordenada de "pasos" (elementos que aparecen progresivamente) y metadata opcional (`interactionTrigger`, notas del presentador, tiempo estimado). El motor de navegación solo necesita saber "hay más pasos en esta slide" o "no, siguiente slide" — constrúyelo así de simple, no más complejo.
- **Animación de contenido:** transiciones de entrada por paso (fade, slide-in, escala) vía CSS transitions o una librería de animación ligera. No se necesita física de resorte ni nada elaborado — el objetivo es claridad, no espectáculo.
- **Diagramas de arquitectura:** generarlos como componentes declarativos (Mermaid.js para los diagramas de capas/flujo tipo el de AWS, o SVG construido a mano cuando se necesite control fino, como el ícono de la "fábrica" con las 4 capas). Cada capa del diagrama debe poder ser un "paso" independiente — capa 1 aparece con el primer clic, capa 2 con el segundo, etc., replicando cómo se explica en el guion.
- **Modo presentador (opcional pero recomendado):** una segunda vista, en otra pestaña o ventana, sincronizada por el mismo servidor en tiempo real, mostrando notas del presentador, el paso actual, el siguiente paso, y los resultados en vivo del poll activo — el clásico "presenter view" de PowerPoint, aplicado a este motor.
- **Deep-linking por slide:** cada slide/paso debe tener una URL navegable (`/deck/12/2` = slide 12, paso 2) para poder saltar directo durante ensayos sin tener que hacer clic desde el inicio.

## Contenido de las slides: fuente de verdad

Si no existe el archivo [pitch.md](http://pitch.md) generarlo de las /fuentes. Si existe, trátalo como la **spec de contenido**, no lo regeneres desde cero: el agente debe mapear cada una de esas secciones a un objeto de slide con sus pasos, preservando textos, analogías y el orden ya validado. Los momentos de interacción van en las slides que ya corresponden a esos puntos del guion (apertura, bloque de costos, cierre).

## 6. Arquitectura (dos superficies, un servidor)

- **Deck + control del presentador** — app web única. Navegación central, panel de resultados en vivo embebido (no una vista separada), notas opcionales en segunda pestaña sincronizada.
- **Audiencia (móvil)**  URL/QR + código de sesión, una pregunta activa a la vez, cola de Q&amp;A.
- **Servidor en tiempo real** — ahora mantiene dos piezas de estado: (a) qué slide/paso está activo (para el modo presentador de doble pantalla, si se implementa) y (b) qué poll está activo y sus resultados agregados. Estado en memoria o Redis, igual que antes — sigue sin necesitar base de datos persistente.

## Stack sugerido (ajustable por el agente)

- **Motor de slides:** SPA en Vue o Svelte (evitar el overhead de Next.js para algo que no necesita SSR). Enrutamiento simple por slide/paso como se describe en la sección 4.
- **Animaciones:** CSS transitions nativas primero; solo añadir una librería (Motion One, GSAP) si las transiciones nativas no alcanzan para algo específico del guion.
- **Diagramas:** Mermaid.js para los diagramas de flujo/capas; SVG a mano para ilustraciones más específicas (íconos, metáforas visuales).
- **Backend realtime:** igual que el spec anterior — Node.js + `ws` o [`socket.io`](http://socket.io), estado en memoria/Redis, sin base de datos persistente.
- **Deploy:** un solo servicio sirviendo deck + audiencia + servidor realtime. Debe poder levantarse en local como respaldo si el wifi del evento falla — el deck ya funciona standalone sin red (restricción de la sección 2), así que el respaldo real es solo para la capa de interacción.

## No funcionales que sí importan aquí

- **Latencia de navegación imperceptible.** Un clic debe reflejar el cambio en la pantalla proyectada sin delay perceptible — esto corre 100% local en el navegador del presentador, nunca depende de una ida y vuelta al servidor para avanzar de slide.
- **Reconexión silenciosa de audiencia** (se mantiene del spec anterior).
- **Anti-abuso en Q&amp;A** (se mantiene).
- **Modo pantalla completa** obligatorio para el deck — sin barra de navegador visible durante la charla.
- **Exportable como respaldo estático:** si todo falla, debe existir una forma de generar una versión no interactiva (imágenes o PDF de cada slide en su estado final) como último recurso — no como feature principal, como seguro.

## Qué NO construir en esta versión

- Sin editor visual de slides (WYSIWYG) — el contenido se define en código/ datos, no se edita arrastrando cajas.
- Sin motor de slides genérico y reusable para "cualquier charla futura" en esta v1 — constrúyelo para esta charla, con estructura razonable, pero sin invertir tiempo en abstraerlo como producto todavía.
- Sin colaboración multi-presentador ni control remoto desde otro dispositivo que no sea el propio deck.
- Todo lo ya excluido en el spec anterior (multi-sala, autenticación de audiencia, analítica histórica, etc.) se mantiene excluido.

---

Todo lo que pongas aquí no hace falta repetirlo en cada prompt: es la forma más barata de "entrenar" al agente para tu proyecto. Mantenlo corto (&lt; 1 página) — cada línea de más se paga en tokens en cada turno, de cada sesión, para siempre.

## Flujo de trabajo obligatorio (SDD)

1. No se escribe código sin un `plan.md` aprobado en `specs/<fecha>-<feature>/`.
2. Toda feature nueva empieza en una rama nueva desde `master`.
3. Antes de mergear: `test-writer` corrió y los tests pasan, `security-reviewer` no dejó hallazgos "high/critical" sin resolver.
4. Si el agente no está seguro de un requisito, pregunta — no asume.

## Convenciones técnicas

<!-- Completa esto una vez con tu stack real; ver specs/tech-stack.md -->

- Lenguaje / framework: Vue, TypeScript
- Estilos: Tailwind CSS, CSS Transitions
- Estado: Variables reactivas de Vue (sin librerías externas para la Fase 1)
- Estilo de commits: Conventional Commits (`feat:`, `fix:`, `chore:`...)
- Gestor de paquetes: npm (o el que se decida al hacer setup)
- Definición visual: Ver `specs/brand-definition.md` y `specs/design-tokens.json`
- Cómo correr tests localmente:
- Cómo correr el linter:

## Seguridad — no negociable

- Nunca hardcodear secrets, tokens o API keys. Usar variables de entorno.
- Toda entrada de usuario se valida y sanitiza antes de tocar la BD.
- Nunca loguear PII (DNI, contraseñas, etc) en texto plano.
- Cualquier endpoint que toque datos sensibles requiere autenticación y autorización explícita — nunca "por defecto abierto".

## Disciplina de costo/tokens

- No leas archivos completos si con `grep`/`glob` alcanza para ubicar lo que necesitas.
- No repitas contexto que ya está en este archivo o en `specs/`.
- Para tareas mecánicas (tests, docs, refactors chicos) usa el subagente correspondiente con modelo económico — no el agente principal.
- Si una tarea puede resolverse leyendo 1 archivo, no listes todo el repo primero.

