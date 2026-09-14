# Roadmap

<!-- Generado/actualizado por /constitution. Fases MUY pequeñas: cada fase debe ser demostrable de principio a fin, no una capa técnica aislada ("no: construir toda la capa de base de datos" / "sí: el usuario puede ver la lista de franjas horarias disponibles"). -->

- [ ] Fase 1: **Motor Core Standalone.** Navegación base (teclado, clic, puntero), estructura de datos (slides y pasos internos/fragments) funcionando sin backend. Deep-linking por slide implementado.
- [ ] Fase 2: **Contenido y Visuales.** Cargar el contenido de `pitch.md`, soporte de diagramas (Mermaid/SVG) mapeando a pasos internos y animaciones de transición (CSS).
- [ ] Fase 3: **Servidor Realtime.** Implementación del backend (Supabase Realtime / Socket.io), tracking del estado de la presentación y broadcast de eventos.
- [ ] Fase 4: **Experiencia de Audiencia (Móvil).** UI para la audiencia, lógica para recibir y responder polls activos (Sí/No, opción única, Q&A).
- [ ] Fase 5: **Panel del Presentador y Pulido.** Vista del presentador (resultados embebidos, notas dual-screen) y fallback de exportación estática de ser necesario.

