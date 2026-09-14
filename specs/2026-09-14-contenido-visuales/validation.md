# Criterios de Validación: Fase 2

## Parser Automático de Markdown
- [ ] El script de parseo ejecuta sin fallos locales y genera correctamente el archivo estructurado (`slides.json` o equivalente).
- [ ] La cantidad de slides en el JSON coincide con el número de marcadores `---` en el archivo `pitch.md`.
- [ ] Las slides con marcas de pasos (`--`) contienen un array de fragmentos lógicos listo para iterar en Vue.
- [ ] Los campos de metadatos (`interactionTrigger` y `notes`) se exponen correctamente como variables dentro de la estructura de la slide, sin "ensuciar" el texto que se renderiza en la pantalla principal.

## Componentes Vue y Animaciones SVG
- [ ] El diagrama interactivo se muestra utilizando etiquetas SVG nativas y no desborda la proporción 16:9 del proyector.
- [ ] A medida que se presiona el avance de la slide, el SVG del diagrama no desaparece ni pasa a la próxima diapositiva inmediatamente, sino que activa progresivamente las 4 sub-capas (Orquestación, Cómputo, Almacenamiento, Linaje).
- [ ] Presionar retroceder mientras se está en la mitad del diagrama (ej. paso 3 al paso 2) oculta correctamente la última capa revelada de forma animada.

## Motor Integrado (Deck)
- [ ] La UI principal renderiza directamente del output del parser sin dependencias estáticas manuales.
- [ ] Al entrar a las diapositivas correspondientes a la apertura, al bloque del dolor y al cierre final, el sistema en modo local emite el evento o console.log reconociendo el `interactionTrigger`.
- [ ] El modo de presentación y controles por teclado se mantienen completamente funcionales.