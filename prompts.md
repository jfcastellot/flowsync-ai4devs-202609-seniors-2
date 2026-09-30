# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Estamos haciendo el ejercicio del Módulo 3 de AI4Devs sobre una spec viva.

Quiero que inspecciones el código actual de FlowSync y escribas la spec del comportamiento que YA existe hoy para el vertical completo de cuentas y acceso: registro, inicio de sesión, sesión, perfil y cierre de sesión.

Debes revisar las dos capas:
- backend: rutas, controladores, modelo de usuario, validadores y middlewares relacionados con cuentas y acceso;
- frontend: pantallas de acceso, estado de sesión y protección de rutas.

Reglas obligatorias:

1. No propongas funcionalidades nuevas.
2. No modifiques código de aplicación.
3. No inicialices OpenSpec en este repositorio.
4. Limítate exclusivamente al vertical de cuentas y acceso.
5. Describe únicamente comportamiento observable desde fuera. No pongas nombres de clases, archivos, funciones ni detalles de implementación dentro de la spec.
6. La spec debe estar en castellano, salvo SHALL, WHEN y THEN.
7. Usa exactamente esta estructura:

## Purpose

## Requirements

### Requirement: ...
El sistema SHALL ...

#### Scenario: ...
- **WHEN** ...
- **THEN** ...

Cada Requirement debe tener al menos un Scenario.

8. No uses ADDED, MODIFIED ni REMOVED: esto describe la verdad actual del sistema, no un delta.
9. Escribe el resultado directamente en:
   docs/spec-viva/jfc.md
10. NO escribas todavía las tres listas de la Parte B. Las completaremos después de contrastar la spec contra el código.

Después de escribir el archivo, no cambies nada más. En tu respuesta:
- dime cuántos Requirements escribiste;
- enuméralos;
- para cada uno indícame qué archivos o zonas concretas del código debo abrir para comprobar manualmente que ese requisito realmente está implementado.

La lista de evidencias puede contener nombres de archivos porque es para la revisión humana; esos nombres NO deben aparecer dentro de la spec.
```

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Ahora vamos a cerrar la Parte B del ejercicio.

Escribiste 11 Requirements en docs/spec-viva/jfc.md. Yo he contrastado manualmente contra el código 4 de ellos: Requirements 2, 3, 8 y 9.

Durante la revisión humana confirmé:

- Requirement 2: el registro acepta fullName nullable, exige email válido y único, contraseña entre 8 y 32 caracteres y passwordConfirmation igual a password.
- Requirement 3: el login valida email/password, verifica las credenciales y crea un access token.
- Requirement 8: el logout elimina el currentAccessToken en backend; en frontend se limpia primero la sesión local y después se intenta el logout remoto, ignorando su error.
- Requirement 9: al arrancar, el frontend recupera flowsync.token de localStorage y valida el token consultando el perfil. Si recibe 401 elimina completamente la sesión. Si ocurre un error diferente de 401, conserva el token en localStorage pero pone token y user en memoria a null y status en anonymous.

No sigas comprobando los otros Requirements y no modifiques código.

Debajo de la spec existente, en docs/spec-viva/jfc.md, añade una sección:

## Parte B

Incluye exactamente estas tres listas:

1. Requisitos escritos y comprobados
Indica literalmente:
- Requisitos escritos por el agente: 11
- Requisitos comprobados manualmente contra el código: 4

2. Incoherencias encontradas
Incluye únicamente incoherencias que puedas justificar contra el código y especifica dónde se observan. No inventes ninguna para rellenar la lista.

3. No supe decidir si era un bug o el contrato
Incluye al menos el caso de la rehidratación de sesión ante un error distinto de 401: una lectura es que conservar el token en localStorage permite reintentar en una recarga cuando el backend vuelva; la otra es que presentar al usuario como anonymous mientras se conserva una credencial persistida deja dos estados de sesión contradictorios. Explica ambas lecturas en una sola frase clara.
Si encuentras otra ambigüedad real en lo que ya revisamos, puedes añadirla, pero no investigues código nuevo para buscarla.

Después actualiza prompts.md.

Sustituye el ejemplo existente por los prompts reales que hemos usado en este ejercicio, en orden, incluyendo este mismo prompt. Para cada uno indica:

Modelo: Opus 5.5
Herramienta: Claude Code

Copia los prompts literalmente tal como fueron enviados en esta conversación; no los mejores ni los resumas.

No hagas commit, no hagas push, no abras PR y no modifiques ningún otro archivo.

Al terminar, dime únicamente:
- qué archivos modificaste;
- cuántas incoherencias quedaron en la Parte B;
- cuántos casos quedaron en “bug o contrato”.
```

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Haz una corrección puntual antes de cerrar el ejercicio.

NO investigues código nuevo y NO modifiques ningún archivo salvo:
- docs/spec-viva/jfc.md
- prompts.md

1. En docs/spec-viva/jfc.md, Parte B > “Incoherencias encontradas”:

Elimina completamente la incoherencia que afirma que “los tokens se crean sin caducidad” o que un 401 nunca puede proceder de un token caducado.

No tenemos evidencia suficiente para afirmar eso únicamente porque DbAccessTokensProvider.forModel(User) no muestra un expiresIn explícito, así que no debe aparecer como hecho.

No inventes una incoherencia para sustituirla. Si después de eliminarla queda una sola incoherencia, está bien.

Conserva los dos casos actuales de “No supe decidir si era un bug o el contrato”.

2. En prompts.md:

Comprueba que el ejemplo original haya desaparecido completamente.

En particular, elimina cualquier línea residual:

**Modelo:** Opus 1M xHigh

Cada prompt real debe tener exactamente:

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

Asegúrate también de que estén incluidos literalmente y en orden los tres prompts reales que hemos utilizado en este ejercicio, incluido este Prompt 3. No los resumas ni los mejores.

3. No hagas commit, push ni PR.

Al terminar responde únicamente:
- número de Requirements de la spec;
- número de Requirements comprobados;
- número de incoherencias;
- número de casos “bug o contrato”;
- número de prompts guardados en prompts.md.
```

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Haz una última corrección puntual.

NO investigues código nuevo y NO modifiques ningún archivo salvo:
- docs/spec-viva/jfc.md
- prompts.md

1. En docs/spec-viva/jfc.md corrige únicamente el Requirement 6.

Elimina cualquier afirmación de que los tokens:
- no caducan;
- duran indefinidamente;
- no expiran por el paso del tiempo;
o cualquier equivalente.

Esa afirmación no fue comprobada y no debe formar parte de la spec viva.

Mantén el Requirement 6 limitado al comportamiento observable y soportado por lo que ya revisamos: las operaciones protegidas de cuenta requieren una credencial de acceso aceptada por el sistema; una petición sin una credencial aceptada no obtiene acceso al recurso protegido.

No añadas códigos HTTP ni reglas de expiración que no hayamos comprobado.

No cambies ningún otro Requirement ni la Parte B.

2. Añade este Prompt 4 literalmente al final de prompts.md con:

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

No alteres los Prompts 1, 2 ni 3. Es correcto que dentro del texto literal del Prompt 3 aparezca la cadena “Opus 1M xHigh”, porque formaba parte del prompt realmente enviado.

3. No hagas commit, push ni PR.

Al terminar responde únicamente:
- Requirements: X
- comprobados: X
- incoherencias: X
- casos bug o contrato: X
- prompts: X
- confirma si Requirement 6 ya no contiene ninguna afirmación sobre expiración o duración de tokens.
```
