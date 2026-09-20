---
name: poc-strategy
description: Cómo ejecutar una Prueba de Concepto (POC) para validar hipótesis, comparar tecnologías y tomar decisiones técnicas fundamentadas. Úsala siempre que se necesite investigar y probar 2 o más tecnologías o enfoques antes de implementarlos en la base de código real.
---

# Estrategia para Pruebas de Concepto (POC)

Antes de construir la POC, sigue este flujo de trabajo para asegurar que la validación sea eficiente y responda a la necesidad del proyecto sin sobre-ingeniería.

## 1. Definición de la Hipótesis y Criterios

Antes de escribir código:
- Identifica claramente qué se está intentando validar (ej. "¿Es X más rápido que Y para esta consulta?", "¿Soporta la librería Z el caso de uso W?").
- Define los **criterios de éxito** estrictos. No se trata de construir la feature completa, sino de probar el aspecto dudoso o riesgoso.
- Elige las 2 o más alternativas a comparar, o el enfoque único que se probará si solo es una validación de viabilidad.

## 2. Aislamiento

- Una POC **no debe contaminar** la base de código principal (master/main) ni el diseño final hasta que se tome una decisión.
- Crea el código de la POC en una carpeta aislada como `poc/<nombre-hipotesis>/`, o hazlo en una rama dedicada desechable.
- Mantén la implementación lo más cruda y simple posible: no te preocupes por la arquitectura final, patrones de diseño o tests exhaustivos, salvo que esos sean los criterios a evaluar.

## 3. Ejecución de la POC

- Implementa la funcionalidad mínima necesaria en cada tecnología o enfoque.
- Usa scripts rápidos (`bash`, `node`, `python`, etc.) para simular el entorno o la carga si es necesario.
- Mide los resultados según los criterios de éxito definidos (ej. rendimiento en ms, tamaño del bundle, facilidad de uso de la API, compatibilidad).

## 4. Decisión y Documentación

Al terminar, no asumas que la POC se fusiona tal cual. Debes generar un reporte breve:
1. **Resumen de la validación:** Qué se probó y con qué alternativas.
2. **Resultados:** Comparativa clara de cómo rindió cada alternativa contra los criterios de éxito.
3. **Decisión recomendada:** Cuál alternativa ganó y por qué.
4. **Próximos pasos:** Cómo extraer la "funcionalidad base" de la POC ganadora para ahora sí integrarla con buenas prácticas en la feature/spec real de la aplicación.

## 5. Formato de Salida Esperado

Produce un reporte en texto plano o Markdown como salida final, indicando:
- **Hipótesis:** ...
- **Alternativas:** ...
- **Ganador:** ...
- **Justificación:** ...

*Nota: Una vez que el usuario apruebe el resultado de la POC, el código ganador (o la lección aprendida) debe usarse como referencia para la implementación formal a través del agente o flujo de trabajo habitual (ej. mediante `plan.md` y `build`).*