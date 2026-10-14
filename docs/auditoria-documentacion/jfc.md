# Módulo 5 — Revisión de backlog y auditoría de documentación

**Autor:** José Felipe Castellot (JFC)  
**Base auditada:** `s4/start`, última rama del curso disponible en el fork al iniciar esta entrega.  
**Fuentes contrastadas:** `docs/backlog/`, `docs/prd/`, `openspec/specs/`, `CLAUDE.md`, `Makefile`, rutas/controladores/transformers/validadores del backend, frontend y suite funcional existente.

---

## Parte A — Revisión del backlog con lo que sabemos hoy

### 1. Estado que refleja el backlog

El backlog sigue siendo útil como mapa de producto: conserva 12 historias, orden de prioridad, criterios de aceptación, dependencias y decisiones abiertas. Sin embargo, ya no representa por completo el estado técnico actual. Varias decisiones que allí siguen abiertas ya quedaron fijadas en la spec viva y en el código, y otras historias tienen implementación pero todavía no pueden considerarse cerradas porque la verificación encontró divergencias.

### 2. Qué cambió al contrastarlo con spec, código y pruebas

**Decisiones abiertas que ya no lo están.**

- **Longitud del título (PA-9):** el backlog evita fijar el umbral; la spec viva y el validador ya fijan **200 caracteres**, con rechazo a partir de 201.
- **Transiciones de estado (PA-7):** el backlog deja abierto si se puede volver desde «Hecho»; la spec viva ya declara que **cualquier transición entre los tres estados es válida**, incluida `done → pending`.
- **Orden de la lista (PA-3):** el backlog lo mantiene abierto; el comportamiento actual ya está definido como **más reciente primero**, con desempate estable por id descendente.

**Historias que existen en código pero no están realmente “cerradas”.**

- **E3-1 — lista compartida:** existe la lista y el responsable aparece en cada tarea, pero la revisión del Módulo 4 detectó que el serializado de la lista usa el transformer completo de usuario y puede exponer el **email**, contradiciendo el criterio que exige identificar al responsable sin filtrar datos de cuenta.
- **FS-142 — filtro por estado:** la spec exige que un estado inexistente se rechace con `422`; el validador actual acepta cualquier string opcional, de modo que un valor inventado puede terminar como lista vacía. Tener endpoint no equivale a haber satisfecho el criterio.
- **Base de pruebas:** el bloqueo transversal «No hay base de pruebas» ya está obsoleto. Existe harness funcional y pruebas de auth. El problema actual es más concreto: **cobertura insuficiente del vertical de tareas**, no ausencia de infraestructura de test.

**Historias que cambiaron de naturaleza.**

- **E3-2 — lista viva** sigue siendo el mayor riesgo del MVP y no debería entrar como una historia ordinaria. Antes de descomponerla hace falta decidir el mecanismo de propagación y, además, resolver qué ocurre ante desconexión/reconexión y cómo se comunica que una lista dejó de estar fresca.

### 3. Ajustes concretos al backlog

1. **Cerrar las decisiones ya materializadas y reflejarlas en las historias.**  
   Actualizar PA-9, PA-7 y PA-3 con los contratos que ya existen: 200 caracteres, transiciones libres entre los tres estados y orden newest-first. Mantenerlas como «abiertas» hace que backlog, spec y código cuenten historias distintas.

2. **Separar “implementado” de “verificado”.**  
   Marcar E3-1 y FS-142 como trabajo aún no cerrable hasta resolver sus divergencias observables: fuga de email del responsable y filtro inválido que no se rechaza según contrato. El criterio de terminado debe depender de spec + prueba, no de que exista código.

3. **Actualizar el bloqueo de pruebas.**  
   Sustituir «No hay base de pruebas» por «Falta cobertura funcional de tasks» y convertir la trazabilidad scenario→test en condición de cierre de las historias que ya tienen implementación.

4. **Tratar E3-2 como enabler/spike antes de delivery.**  
   Decidir primero transporte del cambio, reconexión, detección de estado stale y choque con edición local. Después sí descomponer en tickets. Es la historia que sostiene la promesa diferencial del producto y no conviene esconder decisiones arquitectónicas dentro de tickets de implementación.

---

## Parte B — Auditoría de documentación

### Formato

Estado usado: **Completa · Parcial · Inexistente · No aplica**. La auditoría comprueba si una persona nueva puede entender, operar e integrar FlowSync sin reconstruir el sistema a partir del código.

| # | Tipo de documentación | Estado | Evidencia y observación | Ubicación |
|---|---|---|---|---|
| 1 | **README de proyecto / onboarding** | **Parcial** | El README de la rama es principalmente la lección del ejercicio y sí explica setup, Node, make, WSL, tests y arranque, pero no funciona como README estable del producto: mezcla instrucciones del curso con operación del repo y no ofrece una entrada durable a arquitectura, API y capacidades. | `README.md`, `Makefile` |
| 2 | **Arquitectura general** | **Parcial** | `CLAUDE.md` documenta stack, backend, generación de schema, auth, serializers y organización frontend. Es valioso, pero está pensado como memoria para el agente; no existe un documento de arquitectura para humanos ni un C4/diagrama versionado que muestre fronteras y relaciones. | `CLAUDE.md` |
| 3 | **API / endpoints** | **Parcial** | La spec viva describe con mucho detalle contratos de auth/tasks y el código tipado genera registry; sin embargo no existe **OpenAPI/Swagger** machine-readable. Además, la tabla de rutas de `CLAUDE.md` enumera auth/account pero ya no refleja toda la superficie de tasks. | `openspec/specs/auth/spec.md`, `openspec/specs/tasks/spec.md`, `backend/start/routes.ts`, `CLAUDE.md` |
| 4 | **Docstrings / documentación inline** | **Parcial** | Hay comentarios técnicos de alta calidad en modelos, controladores, validators y transformers —explican intención y trade-offs—, pero no se aplica una convención formal y uniforme de TSDoc/JSDoc a la API interna. | `backend/app/**` |
| 5 | **Decisiones técnicas (ADRs)** | **Inexistente** | No hay `docs/adr/` ni ADRs versionados. Decisiones relevantes —tokens opacos, SQLite, transformers distintos para lista/detalle, cálculo de vencimiento por día de referencia— están explicadas en código/CLAUDE pero no registradas como decisiones con contexto, alternativas y consecuencias. | — |
| 6 | **Guía operacional / troubleshooting** | **Parcial** | Hay muy buen soporte para desarrollo local (`make setup`, `make start`, errores frecuentes), pero no hay runbook de producción, despliegue, backup/restauración de SQLite, rollback, rotación de secretos ni respuesta a incidentes. | `README.md`, `Makefile` |
| 7 | **Convenciones de código y trabajo con agentes** | **Completa** | `CLAUDE.md` y `AGENTS.md` fijan comandos, arquitectura, imports, validación, serializers, generación de schema, frontend y reglas de proceso. También existe un subagente read-only adversarial. | `CLAUDE.md`, `AGENTS.md`, `.claude/agents/adversarial-reviewer.md` |
| 8 | **Spec viva / trazabilidad con el código** | **Parcial — con divergencias** | OpenSpec está bien estructurado y es el mejor contrato del sistema, pero la auditoría encuentra deriva real: el spec prohíbe exponer email en `assignee` mientras la lista usa `UserTransformer`; además, el spec exige `422` para un filtro de estado inventado y el validator de lista acepta cualquier string. | `openspec/specs/tasks/spec.md`, `backend/app/transformers/task_transformer.ts`, `backend/app/validators/task.ts` |

### Tipos adicionales encontrados

| Tipo | Estado | Observación | Ubicación |
|---|---|---|---|
| **PRD y alcance de producto** | **Completa / fuerte** | Hay PRD detallado y un documento de alcance separado; son buenos anclajes para no convertir decisiones técnicas en requisitos inventados. | `docs/prd/flowsync-mvp.md`, `docs/prd/alcance-mvp.md` |
| **Backlog con criterios y dependencias** | **Completa, pero necesita sincronización** | Doce historias con CA, riesgos, dependencias, prioridad y dos historias descompuestas. El problema ya no es falta de detalle sino **deriva** frente a spec/código. | `docs/backlog/` |
| **Documentación de pruebas** | **Parcial** | Existe suite functional de auth y el harness está documentado en `CLAUDE.md`; falta un mapa de cobertura por capability/scenario y tasks todavía no tiene cobertura suficiente en la base auditada. | `backend/tests/functional/auth/`, `CLAUDE.md` |
| **Docs-as-Code / publicación** | **Inexistente** | No hay workflow versionado en la base auditada que valide o publique documentación, OpenAPI o diagramas ni que detecte deriva documental en CI. | — |

### Top 3 carencias que más duelen

1. **No hay una arquitectura navegable para humanos ni ADRs.** El conocimiento existe, pero está repartido entre `CLAUDE.md`, comentarios y código; cuesta reconstruir el porqué y las fronteras del sistema.
2. **No existe un contrato OpenAPI machine-readable y la documentación de API está fragmentada.** OpenSpec describe comportamiento muy bien, pero un consumidor todavía necesita interpretar specs/código y la tabla de rutas de `CLAUDE.md` ya está incompleta.
3. **Hay deriva entre fuentes de verdad.** Backlog mantiene decisiones abiertas que spec/código ya cerraron, y la propia spec difiere de la implementación en privacidad del assignee y filtro inválido. Una documentación abundante deja de ayudar si no sabemos cuál manda.

### Top 3 fortalezas que no conviene romper

1. **La spec viva está escrita como comportamiento verificable**, con WHEN/THEN y escenarios suficientemente concretos para transformarlos en pruebas.
2. **El PRD + alcance + backlog conservan trazabilidad de producto**, incluidos criterios propuestos y decisiones pendientes en lugar de esconder incertidumbre.
3. **`CLAUDE.md` funciona muy bien como memoria operativa para agentes**, con convenciones concretas del stack reciente y reglas que evitan patrones incorrectos.

---

## Exploración de tres formatos

- **C4:** añadiría una vista estable de contexto/contenedores y sus fronteras — navegador → React → API AdonisJS → SQLite — evitando que una persona tenga que deducir relaciones leyendo carpetas.
- **ADR:** conservaría el *porqué* y las alternativas de decisiones como access tokens opacos, SQLite y el mecanismo futuro de lista viva, para que no se vuelvan a discutir sin contexto.
- **OpenAPI:** convertiría la superficie HTTP en un contrato machine-readable que permita documentación interactiva, generación de clientes/mocks y validación automática de deriva entre API implementada y publicada.

---

## Conclusión

FlowSync **no carece de documentación**: tiene PRD, alcance, backlog, specs vivas y una memoria técnica de agente muy rica. El problema actual es de **forma y sincronización**. Falta una capa de documentación de ingeniería para humanos (arquitectura/ADR/runbook/OpenAPI) y, sobre todo, mecanismos que eviten que backlog, spec, código y pruebas diverjan.

La prioridad documental no debería ser “escribir más”, sino **conectar y verificar lo que ya existe**.
