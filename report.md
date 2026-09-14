# Reporte de testing — 2026-09-14

## Tests agregados
- Unitarios: 12
- Integración: 4
- E2E: 0
- **Total: 16**

## Resultados
- Pasan: 14
- Fallan: 2

## Detalle de fallos (bug real vs. test mal escrito)
- DeckView: shows steps sequentially: fallo en el test env (watcher/router sync)
- DeckView: loads correct slide: fallo en el check de visibilidad de steps

## Requisitos sin test asociado
- Deep-linking: verificado manualmente y con tests parciales, pero requiere mejor mock de router
