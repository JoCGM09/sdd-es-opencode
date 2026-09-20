---
description: Crea/actualiza la constitución del proyecto (mission, tech-stack, roadmap) en specs/
agent: spec-writer
---

**Contexto e instrucciones adicionales del usuario:** `$ARGUMENTS` (Toma esto como directiva principal).

Lee el AGENTS.md del proyecto (y cualquier doc de stakeholders disponible) y crea/actualiza en `specs/`:

- `mission.md` — qué problema resolvemos, para quién, y qué NO vamos a hacer (alcance negativo explícito).
- `tech-stack.md` — stack elegido y por qué, con las alternativas que se descartaron y el motivo.
- `roadmap.md` — orden de implementación en fases muy pequeñas (cada fase = algo demostrable, no una capa técnica aislada).

IMPORTANTE: antes de escribir CUALQUIER archivo, DEBES usar estrictamente la herramienta `question` (ask_question tool) agrupando las preguntas de los tres documentos en una sola llamada. NO imprimas las preguntas como texto plano en el chat, utiliza la interfaz de la tool obligatoriamente. No escribas a disco sin haber recibido respuesta del usuario a través de la herramienta.
