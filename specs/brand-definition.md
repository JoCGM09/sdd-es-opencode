# Definición de Marca: Pitch Gen

## Identidad del Proyecto
* **Nombre:** Pitch Gen
* **Descripción:** Motor de presentaciones web a medida enfocado en navegación robusta y sincronización automática de encuestas con la audiencia móvil.
* **Tono:** Técnico, directo, profesional pero con un toque de modernidad. Estilo "dev-tool", priorizando la claridad y reduciendo el ruido visual para destacar la información.
* **Keywords del tono:** Minimalista, Funcional, Confiable, Preciso.

## Ejemplos de Copy (Tono)
* **Estado vacío:** "No hay encuestas activas. Avanza a la siguiente slide para lanzar una."
* **Botón principal:** "Copiar Link de Sesión"
* **Mensaje de error:** "Error de conexión. Fallback local activado."

## Paleta de Colores
* **Tema Principal:** Oscuro (Dark Mode Only para proyector).
* **Fondo Principal:** `#0D1117` (Gris muy oscuro/Azul noche profundo).
* **Texto Principal:** `#F8FAFC` (Slate 50 - Blanco roto para reducir fatiga visual).
* **Acento Principal:** `#3B82F6` (Blue 500 - Para enlaces, indicadores activos y progreso).
* **Acento Secundario:** `#8B5CF6` (Violet 500 - Para elementos de interacción especial o acentos visuales).
* **Semánticos:**
  * Éxito: `#10B981` (Emerald 500)
  * Error: `#EF4444` (Red 500)

### Accesibilidad (Contraste)
* `#F8FAFC` sobre `#0D1117`: Ratio > 18:1 (Pasa AA/AAA).
* `#3B82F6` sobre `#0D1117`: Ratio ~ 5.15:1 (Pasa AA para texto normal).
* `#8B5CF6` sobre `#0D1117`: Ratio ~ 4.7:1 (Pasa AA para texto normal).

## Tipografía
* **Familia principal (UI y cuerpo):** `Inter`, `Roboto`, o similar sans-serif limpia.
* **Familia monospace (código o datos técnicos):** `JetBrains Mono`, `Fira Code`.
* **Pesos:**
  * Regular (400) para cuerpo.
  * Medium (500) para botones y etiquetas.
  * Bold (700) para títulos de slides.

## Reglas Visuales Adicionales
* **Espaciado:** Sistema base de 4px/8px (Tailwind por defecto).
* **Bordes:** Ligeramente redondeados (`rounded-md` de Tailwind) para no ser excesivamente rígido, pero manteniendo la seriedad.
* **Transiciones:** Suaves (fade, transform-slide) para entradas, nunca rebotes ni físicas elásticas ("spring").
