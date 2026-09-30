# Cuentas y acceso

## Purpose

Describir el comportamiento que FlowSync ofrece hoy para que una persona cree una cuenta, inicie sesión, mantenga su sesión entre recargas, consulte su perfil y cierre sesión. Cubre tanto la API (bajo `/api/v1`) como la aplicación web. Refleja la verdad actual del sistema, no un cambio propuesto.

## Requirements

### Requirement: Registro de cuenta
El sistema SHALL permitir crear una cuenta nueva a partir de un email, una contraseña, la confirmación de esa contraseña y, opcionalmente, un nombre completo; y, al crearla, SHALL devolver los datos públicos del usuario junto con un token de acceso ya utilizable, de modo que la persona queda con la sesión iniciada sin tener que hacer login aparte.

#### Scenario: Registro correcto con nombre
- **WHEN** una persona envía `POST /api/v1/auth/signup` con un email válido no registrado, un nombre completo, una contraseña de entre 8 y 32 caracteres y una confirmación idéntica
- **THEN** la respuesta es satisfactoria y contiene, dentro de `data`, el usuario creado y un token de acceso

#### Scenario: Registro correcto sin nombre
- **WHEN** una persona se registra dejando el nombre completo vacío en la pantalla de registro
- **THEN** la cuenta se crea igualmente, sin nombre asociado

#### Scenario: Registro desde la web inicia sesión y lleva al perfil
- **WHEN** una persona completa correctamente el formulario de registro en la aplicación web
- **THEN** queda con la sesión iniciada y es llevada a la pantalla de perfil

### Requirement: Validación de los datos de registro
El sistema SHALL rechazar el registro, sin crear la cuenta, cuando el email no tenga formato válido, supere 254 caracteres o ya pertenezca a otra cuenta; cuando la contraseña tenga menos de 8 o más de 32 caracteres; o cuando la confirmación no coincida con la contraseña. La aplicación web SHALL mostrar cada error en castellano junto al campo afectado.

#### Scenario: Email ya registrado
- **WHEN** una persona intenta registrarse con un email que ya tiene cuenta
- **THEN** la API responde con un error de validación (422) sobre el email y la web muestra junto a ese campo «Ese email ya está registrado. Inicia sesión en su lugar.»

#### Scenario: Contraseña demasiado corta o demasiado larga
- **WHEN** la contraseña enviada tiene menos de 8 caracteres o más de 32
- **THEN** la API responde con un error de validación (422) sobre la contraseña y la web indica el límite mínimo o máximo incumplido

#### Scenario: Email con formato inválido
- **WHEN** el email enviado no tiene formato de dirección de correo
- **THEN** la API responde con un error de validación (422) y la web muestra «Introduce una dirección de email válida.»

#### Scenario: Confirmación distinta detectada en la web
- **WHEN** en la pantalla de registro la contraseña y su repetición no coinciden y se pulsa «Crear cuenta»
- **THEN** la web muestra «Las contraseñas no coinciden.» junto al campo de repetición sin llegar a enviar la petición al servidor

#### Scenario: Confirmación distinta enviada directamente a la API
- **WHEN** se llama a la API de registro con una confirmación distinta de la contraseña
- **THEN** la API responde con un error de validación (422) y no crea la cuenta

### Requirement: Inicio de sesión con email y contraseña
El sistema SHALL permitir iniciar sesión con el email y la contraseña de una cuenta existente y, si las credenciales son correctas, SHALL devolver los datos públicos del usuario y un token de acceso nuevo. Cada inicio de sesión correcto SHALL emitir un token distinto, sin invalidar los emitidos anteriormente.

#### Scenario: Credenciales correctas por API
- **WHEN** se envía `POST /api/v1/auth/login` con el email y la contraseña correctos de una cuenta
- **THEN** la respuesta es satisfactoria y contiene, dentro de `data`, el usuario y un token de acceso

#### Scenario: Credenciales correctas en la web
- **WHEN** una persona introduce sus credenciales correctas en la pantalla de inicio de sesión y pulsa «Entrar»
- **THEN** queda con la sesión iniciada y es llevada a la pantalla de perfil

#### Scenario: Varios inicios de sesión conviven
- **WHEN** la misma persona inicia sesión dos veces
- **THEN** recibe dos tokens distintos y ambos permiten acceder a las operaciones protegidas

### Requirement: Rechazo de credenciales incorrectas
El sistema SHALL rechazar el inicio de sesión cuando el email no pertenezca a ninguna cuenta o la contraseña no sea la correcta, sin revelar cuál de los dos datos ha fallado. SHALL rechazar también, como error de validación, un email con formato inválido.

#### Scenario: Contraseña incorrecta o email desconocido
- **WHEN** se intenta iniciar sesión con una contraseña incorrecta o con un email sin cuenta
- **THEN** la API responde con un error 400 sin token y la web muestra «El email o la contraseña no son correctos.»

#### Scenario: Email mal formado en el login
- **WHEN** se intenta iniciar sesión con un email sin formato válido
- **THEN** la API responde con un error de validación (422) y la web muestra el error junto al campo email

### Requirement: Datos públicos del usuario
El sistema SHALL exponer de cada usuario únicamente su identificador, nombre completo (que puede ser nulo), email, fecha de creación, fecha de última actualización e iniciales. La contraseña SHALL no aparecer nunca en ninguna respuesta.

#### Scenario: Forma del usuario devuelto
- **WHEN** el sistema devuelve un usuario tras registro, inicio de sesión o consulta de perfil
- **THEN** el usuario contiene solo identificador, nombre completo, email, fechas de creación y actualización e iniciales, y no contiene la contraseña

#### Scenario: Iniciales con nombre de dos o más palabras
- **WHEN** el usuario tiene un nombre completo de al menos dos palabras, por ejemplo «Ada Lovelace»
- **THEN** sus iniciales son la primera letra de la primera y de la segunda palabra, en mayúsculas («AL»)

#### Scenario: Iniciales con nombre de una sola palabra
- **WHEN** el usuario tiene un nombre completo de una sola palabra, por ejemplo «Ada»
- **THEN** sus iniciales son las dos primeras letras de esa palabra, en mayúsculas («AD»)

#### Scenario: Iniciales sin nombre
- **WHEN** el usuario no tiene nombre completo
- **THEN** sus iniciales se forman con la primera letra de la parte del email anterior a la arroba y la primera letra de la parte posterior, en mayúsculas

### Requirement: Acceso protegido mediante token
El sistema SHALL exigir una credencial de acceso aceptada por el sistema para consultar el perfil y para cerrar sesión, y SHALL denegar el acceso a esas operaciones a cualquier petición que no la presente.

#### Scenario: Petición protegida sin credencial
- **WHEN** se intenta consultar el perfil o cerrar sesión sin presentar ninguna credencial de acceso
- **THEN** el sistema no da acceso al recurso protegido

#### Scenario: Petición protegida con credencial no aceptada
- **WHEN** se intenta consultar el perfil o cerrar sesión con una credencial que el sistema no acepta, por ejemplo una ya revocada por un cierre de sesión
- **THEN** el sistema no da acceso al recurso protegido

### Requirement: Consulta del perfil propio
El sistema SHALL devolver, a quien presente un token válido, los datos públicos de su propia cuenta, y la aplicación web SHALL mostrarlos en la pantalla de perfil.

#### Scenario: Perfil por API
- **WHEN** se llama a `GET /api/v1/account/profile` con un token válido
- **THEN** la respuesta contiene, dentro de `data`, el usuario dueño de ese token

#### Scenario: Pantalla de perfil
- **WHEN** una persona con sesión iniciada abre la pantalla de perfil
- **THEN** ve sus iniciales, su nombre completo (o «Sin nombre» si no tiene), su email, la fecha de alta como «Miembro desde» en formato de fecha larga en castellano y un botón «Cerrar sesión»

### Requirement: Cierre de sesión
El sistema SHALL permitir cerrar sesión, revocando en el servidor únicamente el token con el que se hace la petición; los demás tokens de la misma cuenta SHALL seguir siendo válidos. En la aplicación web, la sesión local SHALL cerrarse siempre, aunque el servidor no confirme la revocación.

#### Scenario: Logout por API
- **WHEN** se llama a `POST /api/v1/account/logout` con un token válido
- **THEN** la API responde satisfactoriamente con el mensaje «Logged out successfully» y ese token deja de ser aceptado

#### Scenario: Otros tokens siguen activos
- **WHEN** una persona con dos tokens activos cierra sesión con uno de ellos
- **THEN** el otro token sigue permitiendo consultar el perfil

#### Scenario: Logout desde la web
- **WHEN** una persona pulsa «Cerrar sesión» en la pantalla de perfil
- **THEN** la web olvida el token guardado y la lleva a la pantalla de inicio de sesión, incluso si el servidor no responde

### Requirement: Persistencia de la sesión en el navegador
La aplicación web SHALL recordar la sesión entre recargas y visitas guardando el token en el navegador y, al arrancar, SHALL validarlo contra el servidor antes de considerar a la persona autenticada. Mientras se valida SHALL mostrar un indicador de carga en lugar de redirigir.

#### Scenario: Recarga con sesión válida
- **WHEN** una persona con sesión iniciada recarga la aplicación
- **THEN** ve brevemente un indicador de carga y sigue autenticada, sin tener que volver a iniciar sesión

#### Scenario: Token guardado rechazado por el servidor
- **WHEN** la aplicación arranca con un token guardado que el servidor rechaza con 401
- **THEN** la web descarta ese token, lleva a la pantalla de inicio de sesión y muestra «Tu sesión ha caducado. Vuelve a iniciar sesión.»

#### Scenario: Servidor inaccesible al arrancar
- **WHEN** la aplicación arranca con un token guardado y no puede contactar con el servidor o este falla
- **THEN** la web trata a la persona como no autenticada y muestra el motivo en la pantalla de inicio de sesión, pero conserva el token guardado para que una recarga posterior con el servidor disponible restaure la sesión

### Requirement: Protección de pantallas según el estado de sesión
La aplicación web SHALL restringir la pantalla de perfil a personas autenticadas y las pantallas de inicio de sesión y registro a personas no autenticadas, redirigiendo en cada caso a la pantalla que corresponde. Cualquier otra dirección SHALL redirigir a la pantalla de perfil.

#### Scenario: Perfil sin sesión
- **WHEN** una persona sin sesión abre `/profile`
- **THEN** es redirigida a `/login`

#### Scenario: Login o registro con sesión
- **WHEN** una persona con sesión iniciada abre `/login` o `/register`
- **THEN** es redirigida a `/profile`

#### Scenario: Dirección desconocida
- **WHEN** una persona abre una dirección que no corresponde a ninguna pantalla
- **THEN** es redirigida a `/profile`, y de ahí a `/login` si no tiene sesión

#### Scenario: Navegación entre login y registro
- **WHEN** una persona sin sesión está en la pantalla de inicio de sesión o en la de registro
- **THEN** dispone de un enlace para pasar a la otra («Crea una» / «Inicia sesión»)

### Requirement: Comunicación de errores y estado de envío en los formularios
Los formularios de inicio de sesión y registro SHALL mostrar los errores en castellano, junto al campo afectado cuando el error es de un campo concreto y como aviso general en otro caso, y SHALL deshabilitar el botón de envío mientras la petición está en curso.

#### Scenario: Envío en curso
- **WHEN** una persona envía el formulario de inicio de sesión o de registro
- **THEN** el botón queda deshabilitado y muestra «Entrando…» o «Creando cuenta…» hasta que llega la respuesta

#### Scenario: Servidor no disponible
- **WHEN** se envía un formulario y no se puede contactar con el servidor
- **THEN** la web muestra como aviso general «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.»

#### Scenario: Error inesperado del servidor
- **WHEN** el servidor responde con un error no previsto
- **THEN** la web muestra como aviso general «Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.»

## Parte B

### 1. Requisitos escritos y comprobados

- Requisitos escritos por el agente: 11
- Requisitos comprobados manualmente contra el código: 4

### 2. Incoherencias encontradas

- **La respuesta de logout no sigue el formato del resto de la API** (Requirement 8). Todas las demás respuestas de cuentas y acceso llegan envueltas en `{ data: ... }`. En cambio, el logout devuelve un objeto plano `{ message: 'Logged out successfully' }`, en inglés y sin envoltorio. Esto choca con la convención del proyecto de que toda respuesta pasa por `serialize()`. Dónde se observa: `backend/app/controllers/access_tokens_controller.ts`, método `destroy`, que devuelve el literal sin llamar a `serialize`.

### 3. No supe decidir si era un bug o el contrato

- **Rehidratación de sesión ante un error distinto de 401** (Requirement 9; `frontend/src/auth/auth-provider.tsx`): puede ser el contrato, porque conservar el token en localStorage permite recuperar la sesión con solo recargar cuando el backend vuelva, o puede ser un bug, porque presentar a la persona como `anonymous` mientras se conserva una credencial persistida deja dos estados de sesión contradictorios.
- **Logout remoto cuyo error se ignora** (Requirement 8; `frontend/src/auth/auth-provider.tsx`, `logout`). Puede ser el contrato: para la persona, el objetivo de dejar de estar autenticada se cumple aunque el servidor falle. Puede ser un bug: si la llamada remota falla, el token sigue siendo válido en el servidor mientras la web presenta la sesión como cerrada, sin aviso.
