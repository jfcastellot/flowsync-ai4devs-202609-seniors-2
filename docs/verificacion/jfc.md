# Verificación — Lo que cada tarea muestra de su responsable

**Scenarios del requisito:** 3  
**Scenarios cubiertos en la suite antes de añadir pruebas:** 0

| Scenario | Prueba que lo cubría al empezar | Estado | Si es «No lo sé», qué faltó para decidir |
|---|---|---|---|
| Responsable identificable: una tarea de Ada Lovelace trae su nombre y sus iniciales | — | No cubierto | — |
| La tarea no filtra datos de cuenta: el `assignee` no expone el email ni datos de acceso | — | No cubierto | — |
| Responsable sin nombre: `fullName` llega nulo y siguen llegando iniciales | `sin nombre, las iniciales salen del email` | No lo sé | Esa prueba verifica las iniciales en la respuesta de autenticación, pero no comprueba que una tarea serialice a su responsable sin nombre con `fullName: null` e iniciales, ni que lo haga sin recurrir al email. |

## Tests añadidos para los huecos «No cubierto»

- `la tarea identifica al responsable por nombre e iniciales`
- `el responsable de la tarea no expone el email de la cuenta`

> Los dos tests se añadieron después de levantar la matriz y no cambian el dato de cobertura inicial de arriba. Desde este entorno delegado no fue posible ejecutar la suite local; se entregan sin maquillar y el segundo está diseñado para comprobar explícitamente la fuga de email observada en el serializado de la lista.

## Parte B — tres líneas

1. **Antes de mirar creía cubiertos 2 scenarios; al contrastar la suite, 0 lo estaban.**
2. **No supe si «Responsable sin nombre» era un hueco de test o un hueco de spec:** existe una prueba de auth que fija cómo salen las iniciales sin nombre, pero este scenario de tasks solo exige que sigan llegando; no queda claro si aquí debía duplicarse esa regla o limitarse a verificar la representación de la tarea.
3. **El scenario no decidía si el identificador interno del responsable cuenta como “otro dato de la cuenta”:** al escribir la prueba decidí no prohibir `assignee.id` y comprobar de forma explícita la ausencia del email, que sí está nombrado por el contrato.
