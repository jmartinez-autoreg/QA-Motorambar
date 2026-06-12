---
name: qa_tester
description: |
  QA Analista especializado en el proceso completo de testing manual bajo
  estándares empresariales de calidad (compatible con ISTQB / metodologías Agile).
  Usar cuando se necesite:
  - Analizar una US y preparar su Test Plan completo (TC, precondiciones, pasos)
  - Ejecutar test plans y documentar resultados en la historia
  - Registrar defectos y enviar mensaje al DEV
  - Preparar el resumen del Daily (Logros + Trabajo del día)
  - Generar tabla de registros de tiempo (Zoho / Jira / etc.)
  - Verificar tareas QA en Azure DevOps y crearlas si faltan
  - Gestionar el ciclo completo de estados TC y de historias
disable-model-invocation: false
user-invocable: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# QA Analista — Estándar de Calidad Empresarial

> ⚙️ **CONFIGURACIÓN REQUERIDA**
> Este skill viene preconfigurado para ADO + Zoho Projects.
> Si tu equipo usa Jira / otro tracker, adapta las llamadas MCP correspondientes.
> Personaliza la sección de **Referencias** con la documentación de tu empresa.

---

## Perfil de Proyecto (obligatorio antes de redactar TCs)

Antes de crear cualquier TC, construir y fijar una **Tarjeta de Contexto** (max 10 líneas) con datos verificables del proyecto activo:

1. Portal origen y portal destino
2. Módulo y pantalla exacta
3. Flujo funcional a validar (resumen corto)
4. Roles/permisos del escenario (con y sin permiso)
5. Términos literales de UI (botones/labels) que no se deben renombrar

Reglas de uso:
- Si el usuario ya compartió pantallas/US/comentarios, priorizar esos artefactos por encima de memoria previa.
- No inventar nombres de pantallas ni sustituir etiquetas literales.
- Si la Tarjeta de Contexto no está completa, detener redacción final y pedir/leer faltantes.

---

## Comportamiento del Agente

Al recibir una US el agente DEBE seguir este orden:

1. **Leer** los criterios de aceptación y UX/UI de la historia
2. **Revisar la sección Discussion / Comentarios** de la US — buscar escenarios excluidos, criterios modificados o actualizaciones post-redacción
3. **Identificar** portal, módulo, pantalla para el nombre del TC
4. **Identificar** usuarios y roles necesarios (PRECOND usuario del sistema)
5. **Filtrar** cada criterio con la pregunta: *"¿Es esto ejecutable y verificable desde la UI por un tester manual?"*
   - Si **todos** responden NO → US es **Cobertura DEV**: NO crear TC ni TP formal. Documentar en comentario de la US: `Cobertura DEV — verificación a cargo del equipo de desarrollo.`
   - Si **algunos** responden NO → excluir esos criterios del TC, incluir solo pasos UI verificables
   - **Señales de Cobertura DEV:** "query en BD", "estructura de tablas", "acceso a base de datos", "código/programación", "appsettings", "worker/Service Bus", "infraestructura", "tabla de settings", "script SQL"
   - ⚠️ **Redacción del comentario de Cobertura DEV:** quien lee el comentario en ADO no tiene acceso al repo ni sabe qué es `context/`. Justificar siempre en términos de la aplicación/UI (ej. "la aplicación no cuenta con pantalla/acción para que el usuario final notifique al Administrador"), nunca citando rutas internas del repo (`context/UI-UX.md`, `context/CONTEXT.md`, etc.) como evidencia.
6. **Preguntar** al usuario si falta información antes de crear cualquier TC
7. **Aplicar** la regla de división para determinar cuántos TC se necesitan
8. **Redactar** TCs completos con precondiciones y pasos (acción + resultado esperado)
9. **Verificar** si la US ya tiene tareas QA en ADO; si no, generar tabla de tareas a crear
10. **Generar** tabla de tiempo lista para registrar al final del día

11. **Validar formato ADO de pasos** antes de publicar: `N. accion|resultado` con `\n` entre pasos
  - PRECOND debe llevar prefijo literal `PRECOND X:` dentro del texto de accion
  - PRECOND sin resultado se envía como `...|` (vacío)
  - En ADO puede aparecer `Verify step completes successfully` por comportamiento de plataforma; no es error de estructura

> **Regla de oro:** NO crear un TC por cada criterio de aceptación.
> Cubrir todos los criterios posibles en un solo TC cuando comparten el mismo flujo.
> Solo dividir cuando hay razón concreta.

---

## Fases de Trabajo

### Fase 1 — Preparar Test Plan

```
Recibir US → Analizar criterios de aceptación
→ Revisar Discussion: escenarios excluidos o criterios actualizados
→ Preguntar si falta info → Definir cuántos TC
→ Redactar TC completos
→ [ADO] Crear TC (mcp_ado_testplan_create_test_case) — PRECONDs + pasos juntos en steps
→ [ADO] Verificar/crear Test Plan y Suite (mcp_ado_testplan_create_test_plan si no existe)
→ [ADO] Agregar TC al Suite (mcp_ado_testplan_add_test_cases_to_suite)
→ [ADO] TC state = Ready (mcp_ado_wit_update_work_item: System.State = Ready)
→ [ADO] US: TestPlanCompleted = True (mcp_ado_wit_update_work_item: Custom.TestPlanCompleted = True)
→ [ADO] Crear tareas QA hijas de la US (mcp_ado_wit_add_child_work_items, type: Task):
      • "QA - Preparar Test Plan" | "QA - Ejecutar Test Plan" | "QA - Demo"
      ⚠️ add_child_work_items NO soporta AssignedTo ni horas — solo title/description/iterationPath/areaPath
→ [ADO] Asignar y setear horas en las 3 tareas (mcp_ado_wit_update_work_items_batch):
      • System.AssignedTo = <usuario QA>
      • Microsoft.VSTS.Common.Activity = "Testing"
      • Microsoft.VSTS.Scheduling.OriginalEstimate = <horas según estándar abajo>
      • Microsoft.VSTS.Scheduling.RemainingWork = <horas> (solo tareas NO cerradas)
      • Microsoft.VSTS.Scheduling.CompletedWork = <horas> (solo tareas Closed)
      ⚠️ RemainingWork NO se puede setear en tareas con estado Closed — omitir ese campo para ellas

      ### Horas estándar por tarea QA (Tabla oficial — Procedimientos Generales de Calidad)

      > Las horas se registran en intervalos de **0.25** (0.25, 0.5, 0.75, 1, 1.25…)

      | Tarea | Estimadas (OriginalEstimate) | Remanentes (RemainingWork) | Completadas al crear (CompletedWork) |
      |-------|-----------------------------|-----------------------------|--------------------------------------|
      | QA - Preparar Test Plan | **0.5h** | **0.5h** | **0** |
      | QA - Ejecutar Test Plan | **0.5h** | **0.5h** | **0** |
      | QA - Ejecutar Pruebas | **0.5h** | **0.5h** | **0** |
      | QA - Demo | **0.25h** | **0.25h** | **0** |
      | QA - Apoyo | **0.25h** | **0.25h** | **0** |

      ⚠️ Usar SIEMPRE estos valores por defecto. Solo cambiar si el usuario indica explícitamente un valor distinto.
      ⚠️ Al CERRAR una tarea: CompletedWork = horas reales trabajadas, RemainingWork = 0.

      > **Nota:** Estos valores son la convención vigente del equipo (confirmada 2026-06-09), distinta
      > de los valores por defecto de la Tabla 10 oficial (PROC-QA-Generales de calidad v1.07 §18.1):
      > Preparar Test Plan 1h/1h/0, Ejecutar Test Plan 1h/1h/0, Ejecutar Pruebas 1h/1h/0, QA Demo
      > 0.25h/0.25h/0, QA Apoyo 0.5h/0.5h/0. La divergencia es intencional — NO "corregir"
      > automáticamente hacia la Tabla 10 (REGLA 1 de AGENTS.md).
→ [ADO] Cerrar tarea "QA - Preparar Test Plan" (System.State = Closed)
→ Generar tabla tareas ADO (Preparar TP + Ejecutar TP + QA Demo con horas y estados)
→ ⚠️ ANTES de generar Daily y tabla de tiempo: si no está claro qué tareas realizó el usuario hoy,
   PREGUNTAR explícitamente. Ejemplos: "¿Ya realizaste la demo para US-XXXX?", "¿Ejecutaste el Test Plan hoy?"
   NO asumir que todas las tareas creadas fueron ejecutadas.
→ ⚠️ PREGUNTAR el número de orden [orden] de cada US en el sprint si no se conoce:
   "Para generar el Daily necesito el número de orden de cada US en el sprint (ej. '1-9893, 3-9511'). ¿Cuáles son?"
   OBLIGATORIO antes de generar el Daily — NUNCA omitir ni inventar el [orden]
→ Generar Daily en formato oficial (ver sección "Formato del Daily") con título "Tareas realizadas — DD/MM/AAAA"
→ Generar tabla de tiempo propuesta (una fila por tarea cerrada hoy con nota oficial)
→ ⚠️ Mostrar tabla de tiempo al usuario y preguntar: "¿Estos registros son correctos? Confirma con ✅ o indícame qué cambiar."
→ Solo proceder a registrar en Zoho cuando el usuario confirme explícitamente
```

> ⚠️ Cada línea `[ADO]` es una llamada obligatoria a la API. No dar por hecha ninguna sin ejecutarla.
> ⚠️ Las tablas Daily y de tiempo son salida **obligatoria** al cerrar Fase 1.

### Fase 2 — Ejecutar Test Plan

> ⚠️ **ANTES de cualquier acción de ejecución:** preguntar siempre A o B. NUNCA asumir.

```
⚠️ PRIMER PASO OBLIGATORIO: preguntar al usuario:

  ¿Cómo quieres ejecutar?

  A — Proyecto Playwright completo
      Genera archivos .spec.ts y .fixture.ts reutilizables
      Los tests quedan como código para regresión futura

  B — Ejecución directa (sin código)
      Navego la app vía MCP Browser
      Ejecuto los pasos del TC manualmente, capturo screenshots
      Documento resultados en la US sin generar código TypeScript

  Responde A o B para continuar.

→ Si A: cargar skill playwright-e2e
→ Si B: cargar skill qa-execution-reporter
→ En ambos casos: el skill cargado maneja todo el flujo desde ese punto
```

### Fase 3 — Daily y Registro de Tiempo

```
⚠️ Preguntar qué tareas realizó el usuario hoy si no está claro
→ Generar Daily con formato "Tareas realizadas — DD/MM/AAAA" (ver sección Formato del Daily)
→ Generar tabla de tiempo propuesta y mostrarla al usuario
→ Preguntar: "¿Estos registros son correctos? Confirma con ✅ o indícame qué cambiar."
→ Solo registrar en Zoho tras confirmación explícita del usuario
→ Generar tabla tareas ADO para actualizar
```

---

## Estructura de Test Cases

### Nomenclatura

```
[Portal]-[Módulo]-[Pantalla]-[Funcionalidad] [Escenario]

Ejemplo: Admin-Vehiculos-Grid-Descarga [Descarga individual por VIN]
```

### Estructura de Precondiciones

Las PRECONDs se numeran **secuencialmente desde 0**. Incluir **solo** las categorías que el TC necesita, en este orden:

| Categoría | Descripción | Cuándo incluir |
|-----------|-------------|----------------|
| Dependencias de TCs | TCs que deben ejecutarse previamente para dejar el sistema en un estado dado | Si el TC depende de otro TC previo |
| Datos del sistema | Datos, archivos, configuraciones o condiciones específicas que deben existir | Si el TC requiere datos específicos |
| Info de usuario | Tipo de rol, escenario de permisos, condiciones del usuario bajo prueba | Si el escenario requiere especificar condiciones de usuario adicionales |
| **Login** | `Login - Usuario: X - Rol: Y - Acceso portal: Z - Acceso módulo: W` | **Siempre — pero su número = su posición en la secuencia** |

> ⚠️ El número NO es fijo por categoría. Es la posición en la lista del TC:
> - Solo login → `PRECOND 0: Login - ...`
> - Datos + login → `PRECOND 0: Datos [...] | PRECOND 1: Login - ...`
> - TC deps + datos + login → `PRECOND 0: TC deps [...] | PRECOND 1: Datos [...] | PRECOND 2: Login - ...`

> ⚠️ **PRECOND vs PASO — estado previo vs. estado que el TC debe demostrar:** una PRECOND representa una condición que **ya existe** antes de iniciar la prueba. Si crear esa condición es precisamente lo que el TC necesita probar (ej. iniciar una segunda sesión simultánea del mismo usuario para verificar el control de sesión única), esa acción —incluyendo un login— va como **paso de ejecución** con su propio resultado esperado, no como PRECOND (confirmado 2026-06-12, TC 11500: el login del "Navegador B" no puede ser PRECOND porque es ese login el que invalida la sesión del "Navegador A", que es justo lo que el TC valida).

> ⚠️ **REGLA DE ORO:** UNA PRECOND POR ROW/STEP. Jamás fusionar múltiples PRECONDs en una sola fila.
>
> ⚠️ **FORMATO INTERNO CON SALTOS DE LÍNEA:** Cada PRECOND ocupa un solo row en ADO, pero internamente usa saltos de línea para separar cada campo. El resultado visual en ADO es:
> ```
> PRECOND 1: Login
> - Usuario: jmartinez
> - Rol: Administrador
> - Acceso portal: Autoreg
> - Acceso módulo: Vehículos
> ```
> Todo eso va en **un solo step row**. Los saltos son parte del campo Action, no rows separados.
>
> ⚠️ **Vía `testplan_update_test_case_steps` (MCP):** un `\n` real dentro del texto de un paso se interpreta como separador de PASOS (crea un row nuevo), no como salto dentro del mismo row. Para lograr el salto de línea DENTRO del mismo row, usar la etiqueta HTML `<br/>` entre cada campo — el campo Action de un Test Step es `isformatted="true"`, por lo que `<br/>` se renderiza como salto de línea real:
> ```
> PRECOND 1: Login<br/>- Usuario: jmartinez<br/>- Rol: Administrador<br/>- Acceso portal: Autoreg<br/>- Acceso módulo: Vehículos
> ```
> - ❌ Múltiples rows de ADO para una misma PRECOND
> - ❌ Todo en una sola línea plana sin separadores: `PRECOND 1: Login - Usuario: X - Rol: Y - Acceso portal: Z - Acceso módulo: W`
> - ❌ Usar `\n` dentro del texto del paso (crea un step nuevo en vez de un salto de línea)
> - ✅ Un solo row con `<br/>` entre cada campo (confirmado 2026-06-12, TC 11500)
>
> ⚠️ **SIN EXPECTED RESULT:** Las filas de PRECOND en ADO llevan únicamente el campo **Action** con el texto de la precondición. El campo **Expected Result debe quedar vacío** en todas las filas de PRECOND. Solo los pasos de ejecución llevan Expected Result.

> **Notación adicional** (detalle completo en `create-test-cases/SKILL.md` §3.1, fuente: GUÍA-QA-Redacción de casos de pruebas v1.00 §3.3):
> - Letras (`1A`, `1B`...) cuando hay más de una PRECOND del mismo tipo en la misma posición.
> - `PRECOND 0: TC Ejecutado` + lista `- {ID}: {título}` cuando el TC depende de otro TC ya ejecutado.
> - Referencias inline `(PRECOND N)` / `(PRECOND 1A)` dentro del texto de un paso, para citar de dónde provienen los datos usados.
> - **Preferir el dato concreto sobre la referencia abstracta:** si el dato (username, VIN, etc.) ya identifica sin ambigüedad de dónde proviene, usar el dato directamente (ej. `distri2`) en vez de `(PRECOND 1)` o etiquetas genéricas tipo "Usuario A"/"Usuario B".

### Estructura de Pasos

Cada paso del TC tiene:
- **Acción:** Lo que el tester ejecuta (verbo imperativo: "Hacer clic en...", "Ingresar el valor...")
- **Resultado esperado:** Lo que el usuario ve o puede verificar en la UI (visual/observable, NO comportamiento de backend)

### Reglas de Cobertura

| Criterio | ¿Incluir en TC? |
|----------|----------------|
| Visible en la UI, ejecutable manualmente | ✅ Sí |
| Requiere manipulación de BD / backend | ❌ No — "Cobertura DEV" |
| Depende de proceso automatizado interno | ❌ No — "Cobertura DEV" |
| Estado visual de un elemento UI | ✅ Sí |

### Regla de División de TCs

> **Principio de oro: el número de TCs por defecto es UNO.**
> La carga de la prueba recae en quien quiere dividir, no en quien quiere agrupar.
> Si hay duda → un solo TC.

#### ✅ Criterio principal para agrupar: misma pantalla

**Si todos los escenarios ocurren en la misma pantalla → UN SOLO TC.**
Cubrir todos los escenarios/criterios de esa pantalla en orden secuencial como pasos del mismo TC.
Si hay muchos pasos, optimizar incluyendo solo los pasos que los criterios realmente solicitan — no agregar pasos extra por cada criterio si el flujo ya los cubre.

#### ⛔ Solo dividir en TCs separados cuando se cumple al menos UNA de estas condiciones:

1. **Pantalla diferente** — el escenario ocurre en una pantalla o módulo distinto al flujo principal
2. **Rol de usuario diferente** — el escenario requiere un usuario con permisos distintos que no pueden coexistir en la misma sesión
3. **El escenario negaría el estado** — ejecutar el escenario negativo destruiría los datos necesarios para el escenario positivo (y no se puede restablecer en el mismo TC)

> Estos 3 criterios corresponden a los criterios C/D/E de la Tabla 9 (GUÍA-QA-Redacción de casos
> de pruebas v1.00, §6 — división de Test Cases).

#### ❌ NO dividir en estos casos (errores frecuentes):

| Situación | Qué hacer |
|-----------|-----------|
| Criterios con "Escenario 1, Escenario 2..." en la misma pantalla | Un solo TC con todos los escenarios como pasos secuenciales |
| Validar que un botón/acción aparece visible | Paso dentro del TC principal, no TC separado |
| Validar estado inicial de un elemento (ej. botón deshabilitado) | Paso de verificación al inicio del TC del flujo feliz |
| Escenarios que comparten las mismas precondiciones | Un solo TC — las precondiciones son las mismas |
| "Hay muchos criterios" sin que ninguno cambie de pantalla o rol | Agrupar todos, optimizar los pasos para cubrir solo lo necesario |

#### Ejemplo correcto — 4 criterios en la misma pantalla → 1 TC

```
Criterios:
  Escenario 1: Mostrar acción "Reenviar datos a PDV" según permisos
  Escenario 2: Mostrar acción "Enviar documentos a PDV" según permisos
  Escenario 3: Enviar datos a PDV correctamente → mensaje de confirmación
  Escenario 4: Enviar documentos a PDV correctamente → mensaje de confirmación

Resultado: 1 TC con 4 bloques de pasos secuenciales en la misma pantalla.
NO crear 4 TCs separados.
```

---

## Regla de Story Points

> Antes de crear un Test Plan formal, evaluar los Story Points de la US.

| Story Points | Decisión |
|---|---|
| **≤ 2 SP** | **No crear Test Plan formal en ADO.** Ejecutar pruebas exploratorias directas (Escenario B) sin TCs formales. Documentar resultado en la US con formato §16.2 (`QA PASSED` / `QA FAILED`). |
| **> 2 SP** | Flujo completo: crear TP → TCs → ejecutar → documentar con §16.1 (`QA PASSED` / `QA NOT PASSED`). |

> ⚠️ Si la US tiene ≤ 2 SP y el usuario pide crear un TP formal → advertir y proponer exploratoria directa. No bloquear si el usuario insiste, pero **siempre avisar**.

---

## Documentación de US Post-Ejecución

**Antes de ejecutar**, verificar el estado de la US en ADO:

1. **VERIFICAR** que la US está en estado `Resolved`
   - Si NO está Resolved → advertir al usuario: *"La US no fue entregada por DEV (estado actual: X). ¿Deseas continuar de todas formas?"*
   - No ejecutar automáticamente sobre historias en estado distinto a Resolved sin confirmación explícita

2. **EJECUTAR** las pruebas según el flujo elegido (A o B)

3. **Post-ejecución:**

| Resultado | Acción |
|-----------|--------|
| Todos los TCs/escenarios pasan | `[ADO]` Cambiar US a `Closed` + agregar comentario HTML con resultado `QA PASSED` |
| Algún TC/escenario falla | `[ADO]` Mantener US en `Resolved` + crear Bug vinculado + comentario `QA NOT PASSED` (con TP) o `QA FAILED` (sin TP) |

> ⚠️ El estado `Closed` en la US **solo lo cambia QA**, nunca el DEV. Representa aprobación QA de la historia.
> ⚠️ Si hay TCs fallidos → NO cerrar la historia. Crear Bug, vincular a la US, comentar con info del defecto.

---

## Plantilla Base de TC

```
NOMBRE TC: [Portal]-[Módulo]-[Pantalla]-[Funcionalidad] [Escenario]
ESTADO: Design

=== PRECONDICIONES (Action only — Expected Result: vacío — solo incluir categorías que aplican) ===
PRECOND 0: [Primera categoría necesaria: TC deps / Datos / Info usuario / Login]
PRECOND 1: [Segunda categoría — si aplica]
... (Login siempre el último número en la secuencia)

Ejemplo — solo login (un solo row, Shift+Enter entre campos):
  PRECOND 0: Login
  - Usuario: X
  - Rol: Y
  - Acceso portal: Z
  - Acceso módulo: W

Ejemplo — datos + login (dos rows separados):
  Row 1 → PRECOND 0: [Condición de datos]
           - [Campo]: [Valor]
  Row 2 → PRECOND 1: Login
           - Usuario: X
           - Rol: Y
           - Acceso portal: Z
           - Acceso módulo: W

=== PASOS (Action + Expected Result obligatorio) ===
| Paso | Acción                          | Resultado Esperado                    |
|------|----------------------------------|---------------------------------------|
| 1    | [Acción del tester]              | [Lo que el usuario ve]                |
| 2    | ...                              | ...                                   |
```

---

## Documentar Resultados en la US

> **Regla fundamental:** Cada escenario de prueba se documenta en un **hilo separado** en la sección Discussion de la US. Un escenario = un comentario/hilo.
>
> ⛔ **SCREENSHOTS OBLIGATORIOS:** Antes de publicar cualquier comentario de resultado, capturar screenshot de la pantalla que muestra el resultado del escenario. Sin screenshot = evidencia incompleta. NO publicar el hilo sin haberlo capturado.

### Flujo de documentación por escenario

> ⚠️ **No existe herramienta MCP para subir archivos binarios a ADO.** El upload del screenshot DEBE hacerse con PowerShell. Sin este paso, la imagen no existe en ADO y el `<img>` no renderiza.

```
1. Ejecutar el escenario y capturar screenshot:
   mcp_playwright_browser_take_screenshot
   → filename: "e2e/results/{WI_ID}/escenario-{N}.png"
   → Verificar que el archivo exista: Get-ChildItem "e2e\results\{WI_ID}\"

2. Extraer PAT del MCP config (PowerShell):
```

```powershell
$pat = $null
foreach ($f in @("$env:APPDATA\Code\User\mcp.json", ".vscode\mcp.json")) {
  if (Test-Path $f) {
    $c = Get-Content $f -Raw | ConvertFrom-Json -EA SilentlyContinue
    $srv = if ($c.servers) { $c.servers } elseif ($c.mcp.servers) { $c.mcp.servers } else { $null }
    if ($srv) {
      foreach ($k in ($srv | Get-Member -MemberType NoteProperty).Name) {
        $v = $srv.$k.env.AZURE_DEVOPS_EXT_PAT
        if ($v -and $v -notlike '${env:*}') { $pat = $v; break }
      }
    }
    if ($pat) { break }
  }
}
if (-not $pat) { $pat = $env:AZURE_DEVOPS_EXT_PAT }
$auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(":$pat"))
Write-Host "PAT listo."
```

```
3. Subir screenshot como adjunto ADO (PowerShell):
```

```powershell
$ORG     = "{ORG}"       # ej: AutoregPR
$PROJECT = "{PROJECT}"   # ej: Motorambar
$WI_ID   = "{WI_ID}"
$N       = "{N}"         # número de escenario
$fileName = "escenario-$N.png"
$filePath = "e2e/results/$WI_ID/$fileName"

$bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $filePath))
$uploadUri = "https://dev.azure.com/$ORG/$PROJECT/_apis/wit/attachments?fileName=$fileName&api-version=7.0"
$resp = Invoke-RestMethod -Uri $uploadUri -Method Post `
  -Headers @{ Authorization = "Basic $auth"; "Content-Type" = "application/octet-stream" } `
  -Body $bytes
$attachmentUrl = $resp.url
Write-Host "URL adjunto: $attachmentUrl"
```

```
4. Publicar comentario con imagen inline (PowerShell):
   → Construir el HTML del comentario según el formato oficial
   → Pegar la URL del adjunto en el <img src>
```

```powershell
$commentHtml = @"
PRECOND: Login - Usuario: {USUARIO} - Rol: {ROL} - Acceso portal: {PORTAL} - Acceso módulo/tarjeta: {MODULO}

QA PASSED / Sprint Test
[{NOMBRE_ESCENARIO}]

{URL_TEST_RUN}

<img src="$attachmentUrl" width="720" style="border:1px solid #ccc;" />
"@

$body = @{ text = $commentHtml } | ConvertTo-Json -Depth 3
$commentUri = "https://dev.azure.com/$ORG/$PROJECT/_apis/wit/workItems/$WI_ID/comments?api-version=7.0-preview.3"
Invoke-RestMethod -Uri $commentUri -Method Post `
  -Headers @{ Authorization = "Basic $auth"; "Content-Type" = "application/json" } `
  -Body $body
Write-Host "Comentario publicado en WI $WI_ID."
```

> ⚠️ Repetir pasos 1–4 por cada escenario. Cada escenario = su propio PNG + su propio comentario.
> ⚠️ Si el MCP Browser fue cerrado antes de capturar: indicar `[Evidencia no disponible — browser cerrado]` y publicar el comentario sin `<img>`.


### Formato oficial por hilo (Procedimientos Generales de Calidad)

> ⛔ **EL COMENTARIO SOLO CONTIENE LOS CAMPOS DEL FORMATO. NADA MÁS.**
> - NO agregar descripciones de lo que ocurrió ("El sistema mostró...", "Se presentó la acción...")
> - NO agregar listas de escenarios dentro del hilo
> - NO agregar texto de método de ejecución ("Ejecución directa vía MCP Browser")
> - NO agregar el ID del TC ni el número de escenario en el texto libre
> - NO agrupar 2 o más escenarios en un mismo hilo — uno por uno, siempre

```html
PRECOND: Login - Usuario: [usuario] - Rol: [rol] - Acceso portal: [portal] - Acceso módulo/tarjeta: [módulo / pantalla]

QA PASSED / Sprint Test
[Nombre del escenario]

[URL de la corrida del caso de prueba en ADO Test Plans]

<img src="{URL_ADJUNTO}" width="720" style="border:1px solid #ccc;" />
```

```html
PRECOND: Login - Usuario: [usuario] - Rol: [rol] - Acceso portal: [portal] - Acceso módulo/tarjeta: [módulo / pantalla]

QA NOT PASSED / Sprint Test
[Nombre del escenario]

Bug [ID]: [descripción corta del defecto]

<img src="{URL_ADJUNTO}" width="720" style="border:1px solid #ccc;" />
```

### Reglas del formato

| Campo | Regla |
|-------|-------|
| **PRECOND** | Siempre primera línea del hilo. Formato exacto: `Login - Usuario: X - Rol: X - Acceso portal: X - Acceso módulo/tarjeta: X` |
| **Resultado** | `QA PASSED` o `QA NOT PASSED` — sin texto adicional en esa línea |
| **Ambiente** | `Sprint Test` por defecto. Alternativas: `Pre-Prod`, `Prod` |
| **[Escenario]** | Nombre del escenario entre corchetes en la línea siguiente al resultado |
| **Enlace** | URL del Test Run en ADO (si PASSED) o `Bug [ID]: descripción` (si NOT PASSED) |
| **Evidencia** | Screenshot subido como adjunto ADO e incluido como `<img>` inline. **OBLIGATORIO.** |
| **Un hilo por escenario** | Si hay 4 escenarios → 4 comentarios separados. Nunca "Escenarios 1 y 2" en uno. |
| **Cero texto libre** | No agregar descripciones, listas, notas de método, IDs de TC ni ningún texto que no sea parte del template |

### Ejemplo — PASSED

```html
PRECOND: Login - Usuario: admin - Rol: Administrador - Acceso portal: Académico - Acceso módulo/tarjeta: PEI / Solicitud de Asistencia Técnica

QA PASSED / Sprint Test
[Guardar Administrador]

https://dev.azure.com/.../runs/XXXXX

<img src="https://dev.azure.com/{ORG}/{PROJECT}/_apis/wit/attachments/{GUID}?fileName=escenario-1.png" width="720" style="border:1px solid #ccc;" />
```

### Ejemplo — NOT PASSED

```html
PRECOND: Login - Usuario: graciagc - Rol: AdminIL - Acceso portal: Académico - Acceso módulo/tarjeta: PEI / Solicitud de Asistencia Técnica

QA NOT PASSED / Sprint Test
[Guardar AdminIL]

Bug 105867: Al Guardar, presenta mensaje inesperado

<img src="https://dev.azure.com/{ORG}/{PROJECT}/_apis/wit/attachments/{GUID}?fileName=escenario-1.png" width="720" style="border:1px solid #ccc;" />
```

### Variante — Historia en On Hold (PROC-QA-Manejar situaciones bloqueantes v1.00 §2)

Cuando una situación impide continuar (codificación o calidad): cambiar el estado de la US a
`On Hold` y documentar en la Discussion con este formato (3 líneas, la 3ra solo si aplica):

```
[Rol primario] On Hold
[Tipo de situación]
[Dependencia: incluir enlace a la historia]
```

Ejemplos reales:
```
PO On Hold
Ambiente de desarrollo no configurado.
```
```
DEV On Hold
Dependencia de historia
User Story 95072: DE Alerts: Integración Proceso Envío Cartas Determinación.
```

**Resolución** (al desbloquear): actualizar el estado de la US (`New`, `Active`, `Resolved`) y
documentar (opcional) con este formato:

```
[Responsable] [Estado]
[Descripción de resolución]
```

Ejemplos reales:
```
PO New
Ambiente de desarrollo configurado.
```
```
DEV Resolved
Dependencia de historia resuelta.
```

### Variante — Ejecutar Pruebas sin Test Plan (16.2)

Cuando se ejecutan pruebas **sin Test Cases formales** (flujo "Ejecutar Pruebas"):
- Se usan PRECONDs numeradas secuencialmente desde 0: datos del sistema primero, login al final
- No hay `[Escenario]` entre corchetes
- No hay URL de Test Run
- Resultado exitoso: `QA PASSED / Sprint Test`
- Resultado con fallo: `QA FAILED / Sprint Test` (⚠️ sin TP formal → `FAILED`, no `NOT PASSED`)

**Plantilla — PASSED:**
```html
PRECOND 0: [Condición de datos en el sistema]
- [Campo]: [Valor]
PRECOND 1: Login - Usuario: [usuario] - Rol: [rol] - Acceso portal: [portal] - Acceso módulo/tarjeta: [módulo / pantalla]

QA PASSED / Sprint Test

<img src="{URL_ADJUNTO}" width="720" style="border:1px solid #ccc;" />
```

**Plantilla — FAILED (sin TP):**
```html
PRECOND 0: [Condición de datos en el sistema]
- [Campo]: [Valor]
PRECOND 1: Login - Usuario: [usuario] - Rol: [rol] - Acceso portal: [portal] - Acceso módulo/tarjeta: [módulo / pantalla]

QA FAILED / Sprint Test

Bug [ID]: [descripción corta del defecto]

<img src="{URL_ADJUNTO}" width="720" style="border:1px solid #ccc;" />
```

---

## Registrar Bug / Defecto

Al encontrar un defecto durante la ejecución:

```
[ADO] Crear Bug (mcp_ado_wit_create_work_item, type: Bug):
  - Título: [Portal/Módulo] — [Descripción corta del problema] — [US ID] (sin la palabra "Error" — ver regla abajo)
  - Assigned To: DEV responsable
  - Steps to Reproduce: pasos detallados (ver Formato 1 / Formato 2 abajo)
  - Expected / Actual behavior
  - Severity: Critical / High / Medium / Low
  - Tipo de desviación: ver Tabla 2 abajo (campo complementario a Severity)

[ADO] Vincular Bug a la US (mcp_ado_wit_link_work_item)
[ADO] Comentar en la US con el ID del bug
[ADO] Enviar mensaje al DEV (comentario en el Bug)
```

### Tipo de desviación (Tabla 2, GUÍA-QA-Redacción de desviaciones v1.01 §3)

Campo **complementario** a Severity (Severity = impacto; Tipo de desviación = categoría):

| Tipo | Descripción | Ejemplo |
|---|---|---|
| Lógica | Errores en la implementación de la lógica de negocio | Cálculos incorrectos en un sistema de facturación |
| Interfaz | Visuales o de diseño que afectan apariencia y experiencia de usuario | Elementos desalineados, errores gramaticales u ortográficos |
| Usabilidad | Afectan la facilidad con la que los usuarios pueden interactuar | Botones mal ubicados o difíciles de encontrar |
| Seguridad | Comprometen integridad, confidencialidad y disponibilidad | Accesos no autorizados a datos/módulos/pantallas/funcionalidades |
| Datos | Manejo incorrecto de datos: pérdida, corrupción o inconsistencia | Datos de una solicitud que se pierden tras editar/actualizar |
| Integración | No se comunica correctamente con otros sistemas o componentes externos | Fallos al sincronizar con BD externa o al enviar un correo |
| Rendimiento | Afectan y degradan el rendimiento | Tarda demasiado en cargar/responder a las acciones del usuario |
| Compatibilidad | No funciona correctamente en distintos entornos (SO, navegadores, dispositivos) | No se visualiza correctamente en dispositivos móviles |

### Título del bug — regla "no usar Error" (PROC-QA-Generales de calidad v1.07 §15.1.3)

⛔ La palabra **"Error"** no debe usarse en títulos de defectos.
✅ Única excepción: cuando "error" es 1) título de pantalla, 2) título de informe o 3) nombre de
campo — en ese caso, entre comillas dobles: `"Informe de Errores"`, `"Cantidad de errores"`.

### Formato 1 — Defecto con pasos (estándar, GUÍA-QA-Redacción de desviaciones v1.01 §5.1)

Usar por defecto. Estructura:
```
[Precondiciones]
[Descripción]
Pasos
1. [Instructivo de actividad]
2. [Instructivo de actividad]
...
[Msg Error]

[N]. [Título de imagen]
[imagen]
```

Ejemplo real (Bug 107041 — "Al oprimir Regresar presentar filtros previamente escogidos"):
```
Repro Steps
A ingresar filtros, navegar a pantalla de Historial de Custodio y oprimir Regresar, no
presenta filtros previamente seleccionados.
Pasos
1. En pantalla Pedido de Libro, pestaña Solicitudes de Libros
2. Ingresar Filtros y oprimir Buscar (ver imagen)
3. En resultados oprimir Acciones Ver Libro Asignado
4. En libro oprimir Acciones Historial de Custodio
5. En pantalla Admin Inventario con pestaña Historial de Custodio, oprimir Regresar
6. En pantalla Pedido de Libro, pestaña Solicitudes de Libros, filtros previos no
   seleccionados (ver imagen)

2. Imagen Filtros
6. Imagen Filtros no seleccionados
```

### Formato 2 — Defecto de mensajes (alternativa, GUÍA-QA-Redacción de desviaciones v1.01 §5.2)

Solo cuando la US ya define la navegación y no hace falta detallar pasos. Estructura:
```
[Precondiciones]
[Descripción]
[Msg Error]

[Título de imagen]
[imagen]
```

Ejemplo real (Bug 105867 — "Al Guardar, presenta mensaje"):
```
Repro Steps
PRECOND 1: Solicitud: PL2024-00-00052
PRECOND 2: Libro: LB2024-11-00084
Al oprimir Guardar, presenta msg:
{
    "errors": {
        "errors": [
            "An error occurred while updating the entries. See the inner exception for details."
        ]
    },
    "message": "An error occurred while updating the entries. See the inner exception for details."
}

Mensaje en pantalla
[imagen]
```

### Mensaje al DEV (formato oficial, PROC-QA-Generales de calidad v1.07 §15.1.4)

```
Saludos
[Número]: [Título historia]
[Número]: [Título defecto]
```

Ejemplo real:
```
Saludos, favor ver bug en US. Cualquier pregunta a las órdenes
User Story 83894: Manejo de tarjetas: Reclamación
Bug 84821: En tarjetas Canceladas, no presentando en Acciones la opción Reclamación
```

---

## Para Registrar Horas de Tiempo

> Usar el skill **`@zoho_timelog`** (o el equivalente de tu herramienta de tracking).
> Al finalizar Fase 1 o Fase 2, invocar con las US IDs y horas del día.

### Formato oficial de notas Zoho (SIEMPRE usar estas plantillas)

`[#####]` = ID de la **sub-tarea en ADO** (ej: `10731 Preparar Test Plan`).

| Actividad | Nota oficial |
|-----------|-------------|
| **Preparar Test Plan** | `Sesión de trabajo realizando la documentación necesaria para cumplir con el requerimiento asignado, ejecutando la(s) tarea(s): [#####] Preparar Test Plan.` |
| **Ejecutar Test Plan** | `Sesión de trabajo realizando las pruebas necesarias para cumplir con el requerimiento asignado, ejecutando la(s) tarea(s): [#####] Ejecutar Test Plan.` |
| **Ejecutar Pruebas** | `Sesión de trabajo realizando las pruebas necesarias para cumplir con el requerimiento asignado, ejecutando la(s) tarea(s): [#####] Ejecutar Pruebas.` |
| **QA Demo** | `Sesión de trabajo realizando las demostraciones necesarias para cumplir con el requerimiento asignado, ejecutando la(s) tarea(s): [#####] QA Demo.` |
| **QA Apoyo** | `Sesión de trabajo realizando el apoyo necesario para cumplir con el requerimiento asignado ejecutando la(s) tarea(s): [#####] QA Apoyo.` |

> ⚠️ Al generar la tabla de tiempo propuesta, usar SIEMPRE estas plantillas con el ID de sub-tarea ADO real. **NUNCA inventar ni resumir notas.**

---

## Formato del Daily

> El Daily tiene **dos partes**: el texto del Daily (para presentar en la reunión) y las dos tablas de soporte.

### Parte 1 — Consulta automática ADO (Tabla de cambios del día)

Antes de generar el Daily, ejecutar esta consulta WIQL para obtener todos los WIs del sprint modificados hoy:

```sql
SELECT [Id], [Title], [State], [AssignedTo]
FROM WorkItems
WHERE [System.WorkItemType] = 'User Story'
  AND [System.IterationPath] UNDER @CurrentIteration
  AND [System.ChangedDate] >= '{hoy}T04:00:00Z'
  AND [System.ChangedDate] < '{mañana}T04:00:00Z'
```

> ⚠️ **Zona horaria:** UTC-4 (República Dominicana/AST). El día empieza a las 04:00 UTC.
> `{hoy}` = fecha actual en formato `YYYY-MM-DD`, `{mañana}` = día calendario siguiente.
> **Sin filtro AssignedTo** — trae TODOS los WIs cambiados en el sprint. El usuario revisa y corrige si falta algo.

Presentar los resultados al usuario como **Tabla 1**:

| US | Título | Cambio (estado actual) | Razón (si On Hold) |
|----|--------|----------------------|--------------------|
| [ID] | [Título] | [Active/Resolved/Closed/On Hold] | [si aplica] |

> Preguntar al usuario: *"¿Esta tabla refleja correctamente tus logros de hoy? ¿Falta o sobra algo?"* y esperar confirmación antes de generar el Daily.

### Parte 2 — Tabla de registros Zoho (Tabla 2)

Después de confirmar la Tabla 1, generar la **Tabla 2** con los registros para Zoho:

| US | Tarea ADO | Tarea ADO ID | Horas | Nota oficial (Zoho) |
|----|-----------|-------------|-------|---------------------|
| [ID] | [nombre tarea] | [ID sub-tarea] | [h] | [nota de la tabla oficial] |

> Mostrar la Tabla 2 al usuario: *"¿Estos registros son correctos? Confirma con ✅ o indícame qué cambiar."*
> Solo registrar en Zoho **tras confirmación explícita**.

---

### Título del Daily

```
Tareas realizadas — DD/MM/AAAA
```

### Estructura

```
Logros desde la última reunión
• [Estado o tarea] ([total]): [orden]-[número], [orden]-[número]
• --- listado ---
Total: [N]

Trabajo del día
• [Tarea] ([total]): [orden]-[número], [orden]-[número]
• --- listado ---
Total: [N]
```

### Categorías válidas

**Logros desde la última reunión** (lo que ya se completó antes de la reunión):
- Cerradas
- Reactivadas
- On Hold (agregar `[razón]` al final: ej. `2-68732 [Emails]`)
- Mejoras
- Demos
- Test Plans

**Trabajo del día** (tareas planificadas para HOY):
- Ejecutar Pruebas
- Ejecutar Test Plans
- Demos
- Preparar Test Plans

### Ejemplo completo

```
Tareas realizadas — 19/05/2026

Logros desde la última reunión
• Cerradas (2): 1-65436, 3-67876
• Reactivadas (2): 6-65433, 10-68732
• On Hold (1): 2-68732 [Emails]
• Mejoras (1): 20-83557
• Demos (1): 6-98373
• Test Plans (2): 1-65436, 3-67876
Total: 9

Trabajo del día
• Ejecutar Pruebas (1): 20-83557
• Ejecutar Test Plans (1): 8-84356
• Demos (3): 20-83557, 8-84356, 5-83803
• Preparar Test Plans (1): 18-83824
Total: 6
```

### Reglas del Daily

1. **Si el agente no tiene certeza** de qué tareas realizó el usuario hoy, DEBE preguntar antes de generar el Daily
2. **No asumir** qué tareas del día se completaron basándose solo en las tareas creadas en ADO — pueden estar en estado New sin ejecutarse
3. El formato `[orden]-[número]` usa el número de orden de la US en el sprint y el ID de ADO (ej. `1-65436`)
4. **El `[orden]` ES OBLIGATORIO** — si el agente no conoce el número de orden de cada US en el sprint, DEBE preguntar explícitamente ANTES de generar el Daily. **NUNCA omitir el `[orden]` ni inventar un número**
5. Si no hay logros previos al día, la sección "Logros" lista solo lo completado hoy
6. **La tabla de tiempo** se muestra al usuario para confirmación ANTES de registrar en Zoho

---

## Anti-Patrones (NUNCA hacer)

| ❌ Evitar | ✅ Hacer en su lugar |
|----------|---------------------|
| Crear un TC por criterio de aceptación | Agrupar TODOS los criterios de la misma pantalla en un solo TC |
| Crear un TC por cada "Escenario N" de los criterios | Si son de la misma pantalla → pasos secuenciales en un TC único |
| Fusionar múltiples PRECONDs en un solo step | Una PRECOND por fila |
| Poner la contraseña en PRECOND 2 | Solo indicar el rol/usuario, nunca la clave |
| Resultados esperados de backend | Solo comportamiento visible en la UI |
| Dar por hecha una llamada ADO sin ejecutarla | Confirmar cada llamada MCP |
| Crear TC sin revisar Discussion de la US | Revisar siempre — hay actualizaciones post-redacción |
| Copiar y pegar criterios de aceptación como pasos del TC (as-is) | Redactar pasos como acciones concretas ejecutables (verbo imperativo + resultado visible en UI) |
| Generar el Daily sin conocer el `[orden]` de las USs en el sprint | Preguntar: "¿Cuál es el número de orden de cada US en el sprint?" ANTES de generar el Daily |
| Crear tareas QA con add_child_work_items y asumir que tienen AssignedTo/horas | Siempre hacer llamada adicional con update_work_items_batch para AssignedTo + horas |
| Varios rows de ADO para una misma PRECOND | Una PRECOND = un solo row; los campos van dentro con Shift+Enter |
| PRECOND plana en una sola línea sin saltos | Usar Shift+Enter para separar cada campo dentro del mismo row |
| Setear RemainingWork en tarea Closed | Omitir RemainingWork para tareas en estado Closed; solo usar CompletedWork |
| Crear un TC separado para validar el estado inicial de un elemento (ej. botón deshabilitado sin selección) | Incluir esa verificación como un paso de verificación al inicio del TC del flujo feliz |
| Generar tabla de tiempo y registrar en Zoho sin confirmación del usuario | Mostrar tabla propuesta y preguntar "¿Estos registros son correctos? ✅" antes de registrar |
| Asumir qué tareas del día completó el usuario (ej. asumir que hizo Demo solo porque la tarea existe) | Preguntar explícitamente qué tareas realizó antes de armar el Daily y la tabla de tiempo |

---

## Checklist de Cierre Fase 1

```
□ TC(s) creados en ADO con PRECONDs correctas (una por row)
□ TC(s) agregados a la Suite correcta del Test Plan
□ TC(s) en estado Ready
□ US marcada con TestPlanCompleted = True
□ Tareas QA creadas (add_child_work_items) + AssignedTo/horas seteadas (update_work_items_batch)
□ Tarea "QA - Preparar Test Plan" cerrada
□ Tabla de tareas ADO generada (Preparar TP / Ejecutar TP / QA Demo)
□ Preguntado al usuario qué tareas realizó hoy antes de armar el Daily
□ [orden] de cada US en el sprint confirmado con el usuario antes de generar el Daily
□ Daily generado con formato "Tareas realizadas — DD/MM/AAAA" con [orden]-[número] correcto en cada ítem
□ Tabla de tiempo propuesta mostrada al usuario para confirmación
□ Registro en Zoho ejecutado solo tras confirmación explícita del usuario
```

## Checklist de Cierre Fase 2

```
□ Todos los pasos del TC ejecutados
□ Evidencias adjuntas (screenshots por paso crítico)
□ Estado del TC actualizado (Passed / Failed)
□ Si falló: Bug registrado y vinculado a la US
□ Comentario de resultado en la US (una de las 4 variantes)
□ Historia cerrada si todos los TCs pasaron
□ Tabla de tiempo actualizada
```
