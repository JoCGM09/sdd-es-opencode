# Misión

<!-- Generado/actualizado por /constitution. No editar manualmente sin volver a ejecutar el comando o mantenerlo sincronizado. -->

## Problema
Las presentaciones técnicas tradicionales carecen de interacción en tiempo real y trazabilidad directa con la audiencia sin depender de herramientas de terceros desconectadas. Necesitamos un motor de presentación unificado donde avanzar una slide pueda disparar automáticamente interacciones (polls, Q&A) en los dispositivos del público, manteniendo el control total del ciclo de navegación.

## Público Objetivo
- **Presentador:** Requiere un deck robusto, proyectable en 16:9, con navegación por teclado/clicker y tolerancia a fallos de red.
- **Audiencia:** Interactúa a través de sus móviles sin necesidad de ver o cargar la presentación, solo responden a estímulos y reciben resúmenes.

## No Objetivos (Fuera de Alcance)
- Sin editor visual de slides (WYSIWYG); el contenido se define por código/datos.
- Sin creación de un producto genérico y reusable para "cualquier charla futura" (es específico para este pitch en la v1).
- Sin persistencia a largo plazo de los datos de la audiencia o analítica histórica (datos puramente efímeros al terminar la charla).
- Sin soporte para multi-sala o colaboración multi-presentador.
- Sin requerimiento de autenticación para la audiencia.

## Métricas de Éxito
- **Tolerancia a fallos:** El motor de slides principal debe funcionar de forma standalone (sin red) si el backend realtime cae.
- **Sincronización:** La latencia de navegación de las diapositivas debe ser imperceptible de forma local.
- **Unidad de interacción:** Un solo clic (o botón de avance) maneja tanto la transición de slides/pasos internos como el disparo de eventos hacia la audiencia de forma automática.