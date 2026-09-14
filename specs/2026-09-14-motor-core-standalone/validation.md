# Criterios de Validación: Fase 1 - Motor Core Standalone

La implementación se considera lista para revisión/merge cuando se cumplan **todos** los siguientes criterios verificables:

## 1. Comportamiento Visual y Estilos
- [ ] La aplicación se renderiza en un canvas oscuro de proporción 16:9 optimizado para escritorio/proyector (sin scrollbars).
- [ ] Se aplican los colores y tipografías (Inter/JetBrains) definidos en `design-tokens.json` a través de clases de Tailwind.

## 2. Navegación y Controles
- [ ] Presionar *Espacio*, *Flecha Derecha*, *RePág* o *AvPág* avanza correctamente la presentación (primero agota los pasos internos, luego pasa a la slide siguiente).
- [ ] Presionar *Flecha Izquierda* retrocede correctamente (deshace pasos internos, luego vuelve a la slide anterior).
- [ ] Hacer clic izquierdo en el área de la presentación avanza la diapositiva igual que la flecha derecha.
- [ ] Presionar la tecla *'F'* alterna el modo pantalla completa nativo del navegador.

## 3. Estado y Deep-linking
- [ ] Entrar directamente a una URL como `/deck/2/1` carga inmediatamente la segunda slide en su primer fragmento.
- [ ] Refrescar el navegador mantiene al usuario exactamente en la misma slide y paso (gracias a la URL).
- [ ] Avanzar o retroceder actualiza la URL en la barra de direcciones sin recargar la página.

## 4. Estructura de Datos
- [ ] La presentación dummy tiene al menos una slide con 3 fragmentos (pasos intermedios) que se revelan secuencialmente, comprobando que el modelo `Slide -> Pasos` funciona y no salta directamente de slide a slide.

## 5. Offline & Rendimiento
- [ ] Si se apaga la conexión de red (simulado en devtools), la navegación mediante teclado/clic sigue funcionando instantáneamente sin ningún error de red en consola.
