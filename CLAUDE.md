# CLAUDE.md

This file provides persistent project guidance for coding agents working in this repository.

## Qué es este repo

FlowSync es un proyecto de práctica para gestión de tareas en equipo. Es un monorepo sin workspaces ni `package.json` raíz: los comandos se ejecutan desde `backend/` o desde `frontend/`.

- `backend/` — API AdonisJS 7 + TypeScript + Lucid + SQLite. Escucha en `http://localhost:3333`.
- `frontend/` — React 19 + Vite + TypeScript. Escucha en `http://localhost:5173`.
- La rama `s1/start` es el punto de partida del ejercicio.

## Restricción principal del ejercicio

Para el ejercicio del Módulo 1, el backend ya existe y **no debe modificarse** salvo que el encargo lo requiera de forma explícita y exista evidencia clara de que no puede resolverse desde el frontend.

Antes de editar:
1. Inspecciona el código existente.
2. Reutiliza contratos, rutas y convenciones ya presentes.
3. No inventes endpoints ni estructuras que ya existan.
4. Mantén el alcance mínimo necesario para cumplir el encargo.

## Comandos

### Backend (`cd backend`)

```bash
npm install
cp .env.example .env
node ace generate:key
node ace migration:run
npm run dev
npm test
npm run lint
npm run format
npm run typecheck
```

Notas:
- La base usa SQLite.
- `database/schema.ts` es generado; no debe editarse a mano.
- Si una migración cambia el esquema, ejecuta las migraciones para regenerarlo.
- Usa imports por subpath definidos por el proyecto; evita rutas relativas largas.
- Las respuestas del API siguen las convenciones existentes de serialización/transformers.

### Frontend (`cd frontend`)

```bash
npm install
npm run dev
npm run build
npm run lint
npx prettier@3.9.6 --write .
```

Reglas:
- `npm run build` también valida TypeScript.
- El linter del frontend es **oxlint**, no ESLint.
- Prettier es el formateador del harness.
- No añadas dependencias si el mismo resultado puede lograrse con lo ya instalado.
- Mantén componentes pequeños y reutilizables cuando sea razonable.
- No cambies configuración del backend para resolver problemas puramente de UI.

## Contrato del backend que conviene descubrir antes de implementar UI

El backend ya incluye autenticación y perfil. Antes de construir cualquier flujo de UI, inspecciona `backend/start/routes.ts`, los controladores, validadores y transformers correspondientes para usar el contrato real, no uno supuesto.

Convenciones relevantes:
- Validación con VineJS.
- Persistencia con Lucid.
- Autenticación mediante los guards configurados por el proyecto.
- No devolver modelos crudos si el proyecto ya utiliza transformers/serialización.
- Nunca exponer tokens, contraseñas o secretos en logs, URLs o mensajes de error.

## Frontend

El frontend de `s1/start` es deliberadamente pequeño. Antes de crear arquitectura nueva:
- inspecciona `frontend/src/`;
- identifica qué existe y qué falta;
- conserva el estilo actual;
- evita sobreingeniería;
- centraliza acceso a API si empiezan a aparecer varias llamadas HTTP;
- trata errores de red, validación y autenticación de forma explícita;
- no guardes credenciales sensibles;
- si persistes un token, hazlo de forma intencional y documenta el criterio.

## Definition of Done mínima

Antes de dar una tarea por terminada:
1. El alcance del ticket está cubierto y no se cambió código fuera de necesidad.
2. `frontend`: `npm run lint` pasa.
3. `frontend`: `npm run build` pasa.
4. El código queda formateado con Prettier.
5. Si se tocó backend: ejecutar sus validaciones relevantes (`lint`, `typecheck`, tests aplicables).
6. Revisar manualmente seguridad básica, estados de error y edge cases.
7. Reportar con precisión qué quedó pendiente; no afirmar éxito si una comprobación no se ejecutó.

## Reglas de proceso

- Antes de tocar código: crear una rama nueva (`git checkout -b feat/<slug>`). Nunca commitear directo en `main` o `s1/start`.
- Trabaja a partir del ticket y sus criterios de aceptación; no conviertas huecos de producto en requisitos inventados.
- Mantén el diff pequeño y enfocado.
- Al cerrar la tarea: usa un commit convencional `tipo(scope): descripción`.
- Antes de dar el cambio por bueno: ejecutar las comprobaciones automáticas y una revisión adversarial.
- Si existe un PR, la revisión debe buscar bugs, seguridad, edge cases y desviaciones de estas instrucciones.
- La evidencia durable debe quedar en el repositorio/PR, no solo en el chat.
