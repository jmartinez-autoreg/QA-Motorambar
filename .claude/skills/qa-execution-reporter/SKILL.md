---
name: qa-execution-reporter
description: 'Ejecuta Test Plans de Azure DevOps, captura 1 screenshot OBLIGATORIO por cada STEP con Expected Result (PRECONDs NO necesitan screenshots), publica resultados en la US con formato simple. UN comentario por ejecución con TODAS las evidencias apiladas.'
argument-hint: 'Test Plan ID, Suite ID, TC IDs, URL de la app'
---

# QA Execution Reporter — Ejecución y Documentación de Test Plans

> **Propósito:** Ejecutar Test Cases de Azure DevOps, **capturar evidencia completa (1 screenshot por STEP con Expected Result, PRECONDs NO necesitan evidencia)**, y publicar UN comentario simple en la US.

---

## FORMATO DE SALIDA (lo que el usuario verá en ADO)

### Con Test Plan (caso más común):

```
US 10801 - Discussion - UN comentario:

┌─────────────────────────────────────────────┐
│ QA PASSED / Sprint Test                     │
│                                             │
│ [Link del resultado aquí]                  │
│                                             │
│ [Imagen 1 - full width]                    │
│                                             │
│ [Imagen 2 - full width]                    │
│                                             │
│ [Imagen 3 - full width]                    │
└─────────────────────────────────────────────┘
```

**Reglas:**
- ❌ SIN PRECONDs (están en el TC del Test Plan)
- ❌ SIN tabla de pasos
- ❌ SIN labels en imágenes ("STEP 1", "CA-02", etc.)
- ✅ Placeholder `[Link del resultado aquí]` — el usuario debe ejecutar el TC manualmente desde el Test Plan y actualizar con el link real
- ✅ **1 screenshot por CADA STEP con Expected Result** (PRECONDs NO necesitan screenshots)
- ✅ SOLO: Resultado + Placeholder + Imágenes apiladas

### Sin Test Plan (pruebas exploratorias, ≤2 SP):

```
┌─────────────────────────────────────────────┐
│ PRECOND 0: Datos en sistema [...]          │
│ PRECOND 1: Login - Usuario: X - Rol: Y ... │
│                                             │
│ QA PASSED / Sprint Test                     │
│                                             │
│ [Imagen 1]                                  │
│                                             │
│ [Imagen 2]                                  │
└─────────────────────────────────────────────┘
```

**Reglas:**
- ✅ SÍ PRECONDs (no hay TC formal)
- ❌ SIN URL de Test Run (no existe)
- ❌ SIN labels en imágenes

---

## ESTADOS DE EJECUCIÓN DE TCs (Tabla 9, PROC-QA-Generales de calidad v1.07 §14)

Ciclo de vida oficial de un Test Case durante su ejecución en ADO Test Plans:

| Estado | Descripción | Cuándo se usa |
|---|---|---|
| Active | Ejecución no comenzada | Al crear el caso de pruebas |
| In Progress | Ejecución en progreso | Al comenzar la ejecución |
| Blocked | No puede continuarse | Imprevisto/impedimento; vuelve a `In Progress` al resolverse |
| Paused | Se retoma luego | QA debe atender algo de mayor prioridad; vuelve a `In Progress` al regresar |
| Not Applicable | No vigente | TC ya completado (Ready) pero la corrida se descarta por cambios de requerimientos o no aplica al sprint |
| Failed | No cumple un resultado esperado | QA registra desviación y notifica a DEV; se re-ejecuta tras la corrección |
| Passed | Cumple todos los resultados esperados | QA registra éxito |

> Este skill genera el comentario simplificado (`QA PASSED` / `QA NOT PASSED`) que corresponde a
> los estados terminales **Passed** / **Failed**. Los estados intermedios (`Active`, `In
> Progress`, `Blocked`, `Paused`, `Not Applicable`) se reflejan en la corrida manual del Test Plan
> que el usuario ejecuta en el paso "ACCIÓN REQUERIDA" (PASO 3.4).

### Sub-procedimiento al marcar un TC como `Failed` (PROC-QA-Generales de calidad v1.07 §15.1.1)

1. En el paso (STEP) que falla, agregar un comentario con el título del defecto a registrar.
2. Marcar el **paso** como `Failed (x)`.
3. Adjuntar evidencia (imagen requerida; documento o video opcional).
4. `Save` y `Create bug` — usar los formatos de `qa_tester/SKILL.md` § Registrar Bug / Defecto
   (Tipo de desviación + Formato 1/2 + mensaje a DEV).
5. Marcar el **caso de pruebas** como `Failed`.

> El ciclo de estados de **historias** (US) es independiente — Tabla 3: `New` / `Active` /
> `Resolved` / `Closed` / `On Hold` (ver `agents/QA-PRO.agent.md` § Documentación de US
> Post-Ejecución). `Closed` ocurre cuando el Test Plan/prueba se ejecutó y dio `Passed`.

---

## INPUT DEL USUARIO

```
Ejecuta el Test Plan 10939, Suite 10940, TC 10941
URL: https://motorambar.autoregpr.com
```

O para múltiples TCs:

```
Ejecuta el Test Plan 10939, Suite 10940, TCs: 10941, 10942, 10943
URL: https://motorambar.autoregpr.com
```

---

## PHASE 1 — LEER TCs DE ADO

**Objetivo:** Obtener los pasos, resultados esperados y WI vinculada (US).

### PASO 1.1: Leer cada TC

Por cada TC ID:

```
mcp_ado_work_items_get(id: {TC_ID})
```

### PASO 1.2: Extraer información

Del resultado, extraer:

```javascript
{
  "tcId": 10941,
  "title": "Portal / Vehículos / Editar - Asignar Cliente [Popup estructura completa]",
  "linkedUS": 10801,  // campo "Parent" o "System.Parent"
  "steps": [
    { "action": "...", "expected": "..." },
    { "action": "...", "expected": "..." }
  ]
}
```

### PASO 1.3: Guardar en memoria

```javascript
const testCases = [
  { tcId: 10941, linkedUS: 10801, steps: [...] },
  { tcId: 10942, linkedUS: 10801, steps: [...] }
];
```

**✅ OUTPUT:** Array de TCs con sus pasos y US vinculada.

---

## ⚠️ REGLA OBLIGATORIA: SCREENSHOTS POR CRITERIO

**Cada PASO (STEP) del TC con "Expected Result" = 1 screenshot OBLIGATORIO.**

### 🔑 IMPORTANTE: PRECONDs vs STEPs

**PRECOND (Precondiciones) = Setup ANTES del TC:**
- PRECOND 0: Datos en sistema
- PRECOND 1: Login completado
- PRECOND 2: Usuario tiene permisos X
- ❌ **NO necesitan Expected Result**
- ❌ **NO necesitan screenshots** (son requisitos previos, no validaciones)

**STEP (Pasos del TC) = Acciones CON validaciones:**
- STEP 1: Hacer clic en botón "Editar" → Expected: Pantalla de edición visible
- STEP 2: Seleccionar dropdown → Expected: Lista desplegada con opción "Todos"
- ✅ **Cada Expected Result = 1 screenshot OBLIGATORIO**

### 📊 Ejemplo práctico completo:

**TC 10941: Portal / Vehículos / Editar - Asignar Cliente**

| Tipo | Descripción | Expected Result | Screenshot |
|------|-------------|-----------------|------------|
| PRECOND 0 | Datos de vehículos en sistema | - | ❌ NO (setup) |
| PRECOND 1 | Login - Usuario: admin - Rol: Administrador | - | ❌ NO (setup) |
| **STEP 1** | Abrir pantalla de edición de vehículo | Pantalla "Editar Vehículo" visible | ✅ step1.png |
| **STEP 2** | Hacer clic en botón "Asignar Cliente" | Popup "Asignar Cliente" abierto | ✅ step2.png |
| **STEP 3** | Seleccionar dropdown "Cliente" | Lista desplegada con opción "Todos" | ✅ step3.png |
| **STEP 4** | Hacer clic en "Guardar" | Mensaje "Cliente asignado exitosamente" | ✅ step4.png |
| **STEP 5** | Verificar tabla de clientes | Cliente aparece en fila 1 | ✅ step5.png |

**Resultado:** 2 PRECONDs (sin screenshots) + 5 STEPs con Expected Result → **5 screenshots** ✓

### ✅ Capturar screenshot cuando:
- Es un **STEP** (no PRECOND) del TC
- El paso tiene un Expected Result definido
- El criterio es verificable en pantalla (mensaje, popup, tabla, campo, botón, etc.)

### ❌ NO capturar cuando:
- Es una **PRECOND** (setup previo al TC)
- El paso no tiene Expected Result
- El resultado esperado es interno del sistema (ej: "Registro guardado en BD")

### 📋 Regla general:
**Si el TC tiene N STEPs con Expected Result, debe haber N screenshots como mínimo.**
**Las PRECONDs NO cuentan para el conteo de screenshots.**

**Ejemplo:**
```
STEP 1: Login
→ Expected: Dashboard visible
→ Screenshot: ✅ OBLIGATORIO

STEP 2: Abrir popup
→ Expected: Popup con título "Asignar Cliente"
→ Screenshot: ✅ OBLIGATORIO

STEP 3: Seleccionar dropdown
→ Expected: Lista con opción "Todos"
→ Screenshot: ✅ OBLIGATORIO
```

---

## PHASE 2 — EJECUTAR PRUEBAS (MCP BROWSER)

**Objetivo:** Navegar la app, ejecutar pasos, **capturar 1 screenshot por cada criterio de aceptación**.

### PASO 2.1: Abrir navegador y login

```
mcp_playwright_browser_navigate_to(url: {APP_URL})
mcp_playwright_browser_fill(selector: "#username", value: "admin")
mcp_playwright_browser_fill(selector: "#password", value: "***")
mcp_playwright_browser_click(selector: "#btnLogin")
mcp_playwright_browser_wait_for_navigation()
```

### PASO 2.2: Por cada TC, ejecutar sus pasos Y CAPTURAR EVIDENCIA

**⚠️ OBLIGATORIO: Capturar screenshot después de CADA STEP con Expected Result.**
**⚠️ PRECONDs NO necesitan screenshots** (son setup previo, no validaciones).

```javascript
for (const tc of testCases) {
  const screenshots = [];
  let stepIndex = 1;
  
  for (const step of tc.steps) {
    // ❌ SALTAR PRECONDs — no necesitan evidencia
    if (step.type === "PRECOND" || step.action.startsWith("PRECOND")) {
      continue;  // PRECONDs son setup, no validaciones
    }
    
    // 1. Ejecutar la acción del STEP
    // (navegar, llenar campos, hacer clic, etc.)
    
    // 2. Esperar a que la pantalla se estabilice
    mcp_playwright_browser_wait_for_idle();
    
    // 3. ¿El STEP tiene resultado esperado (criterio de aceptación)?
    if (step.expected && step.expected.trim() !== "") {
      // ✅ CAPTURAR SCREENSHOT OBLIGATORIO
      const filename = `step${stepIndex}-${sanitize(step.expected.substring(0, 30))}.png`;
      mcp_playwright_browser_take_screenshot(
        fullPage: true,
        path: `e2e/results/${tc.tcId}/${filename}`
      );
      screenshots.push(filename);
      stepIndex++;
      
      Write-Host "📸 Screenshot capturado: ${filename}" -ForegroundColor Cyan;
    }
  }
  
  tc.screenshots = screenshots;
  tc.status = "PASSED";  // o "FAILED" — si FAILED, seguir el sub-procedimiento de
                          // "ESTADOS DE EJECUCIÓN DE TCs" antes de continuar
  
  // ⚠️ VALIDACIÓN: ¿Capturamos suficientes screenshots?
  // Contar solo STEPs con Expected Result (excluir PRECONDs)
  const stepsWithExpected = tc.steps.filter(s => 
    s.expected && 
    s.type !== "PRECOND" && 
    !s.action.startsWith("PRECOND")
  ).length;
  
  if (screenshots.length < stepsWithExpected) {
    Write-Host "⚠️  ADVERTENCIA: TC ${tc.tcId} tiene ${stepsWithExpected} STEPs con Expected Result pero solo ${screenshots.length} screenshots" -ForegroundColor Yellow;
  }
}
```

### PASO 2.3: Cerrar navegador

```
mcp_playwright_browser_close()
```

**✅ OUTPUT:** Cada TC tiene `screenshots: ["step1.png", "step2.png", "step3.png", ...]` (1 por cada STEP con Expected Result) y `status: "PASSED"`.

**⚠️ VALIDACIÓN:** Verificar que `screenshots.length >= número_de_STEPs_con_expected_result`.
**⚠️ NOTA:** PRECONDs NO cuentan para esta validación.

---

## PHASE 3 — PUBLICAR COMENTARIO EN LA US

**Objetivo:** Publicar comentario con evidencia en la US. Usar placeholder para el link del Test Run (el usuario lo actualizará después de ejecutar manualmente).

### PASO 3.1: Extraer PAT de ADO

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
```

**✅ OUTPUT:** `$auth` contiene el token de autenticación.

### PASO 3.2: Subir screenshots como attachments

**Objetivo:** Por cada PNG, subirlo a ADO y obtener su URL.

### PASO 4.1: Por cada TC, subir sus screenshots

```powershell
$attachmentUrls = @{}

foreach ($tc in $testCases) {
  $tcUrls = @()
  
  foreach ($filename in $tc.screenshots) {
    $filePath = "e2e/results/$($tc.tcId)/$filename"
    
    if (Test-Path $filePath) {
      $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $filePath))
      $uploadUri = "https://dev.azure.com/$ORG/$PROJECT/_apis/wit/attachments?fileName=$filename&api-version=7.0"
      
      $resp = Invoke-RestMethod -Uri $uploadUri -Method Post `
        -Headers @{ Authorization = "Basic $auth"; "Content-Type" = "application/octet-stream" } `
        -Body $bytes
      
      $tcUrls += $resp.url
      Write-Host "✅ Screenshot subido: $filename → $($resp.url)"
    }
  }
  
  $attachmentUrls[$tc.tcId] = $tcUrls
}
```

**✅ OUTPUT:** `$attachmentUrls` = `@{ 10941 = @("https://...", "https://...") }`

### PASO 3.3: Construir HTML con placeholder

```powershell
foreach ($tc in $testCases) {
  $overallStatus = if ($tc.status -eq "PASSED") { "QA PASSED" } else { "QA NOT PASSED" }
  
  # Construir HTML simple con PLACEHOLDER para el link
  $html = "$overallStatus / Sprint Test<br/><br/>`n`n"
  $html += "[Link del resultado aquí]<br/><br/>`n`n"
  
  # Agregar imágenes apiladas (sin labels)
  foreach ($url in $attachmentUrls[$tc.tcId]) {
    $html += "<img src=`"$url`" width=`"720`" style=`"border:1px solid #ccc;`" /><br/><br/>`n`n"
  }
  
  # Publicar comentario en la US vinculada
  $commentBody = @{ text = $html } | ConvertTo-Json -Depth 3
  $commentUri = "https://dev.azure.com/$ORG/$PROJECT/_apis/wit/workItems/$($tc.linkedUS)/comments?api-version=7.0-preview.3"
  
  Invoke-RestMethod -Uri $commentUri -Method Post `
    -Headers @{ Authorization = "Basic $auth"; "Content-Type" = "application/json" } `
    -Body $commentBody
  
  Write-Host "✅ Comentario publicado en US $($tc.linkedUS)"
}
```

**✅ OUTPUT:** Comentarios creados en las USs con placeholder `[Link del resultado aquí]`.

### PASO 3.4: Informar al usuario

```powershell
Write-Host "`n⚠️  ACCIÓN REQUERIDA:" -ForegroundColor Yellow
Write-Host "1. Abre el Test Plan: https://dev.azure.com/$ORG/$PROJECT/_testPlans/execute?planId=$PLAN_ID&suiteId=$SUITE_ID"
Write-Host "2. Ejecuta manualmente el TC desde la UI del Test Plan"
Write-Host "3. Cuando termines, copia el link del Test Run"
Write-Host "4. Actualiza el comentario en la US reemplazando '[Link del resultado aquí]' con el link real"
Write-Host "`n✅ Comentarios publicados en:" -ForegroundColor Green
foreach ($tc in $testCases) {
  Write-Host "   US $($tc.linkedUS): https://dev.azure.com/$ORG/$PROJECT/_workitems/edit/$($tc.linkedUS)"
}
```

**✅ OUTPUT:** Usuario sabe que debe ejecutar manualmente el TC y actualizar el comentario.

---

## RESUMEN DEL FLUJO

```
USER: "Ejecuta Test Plan 10939, Suite 10940, TC 10941"

↓ PHASE 1: mcp_ado_work_items_get → Extraer steps, US vinculada
↓ PHASE 2: MCP Browser → Ejecutar + capturar screenshots
↓ PHASE 3: REST API → Subir PNGs + Publicar comentario con placeholder

✅ DONE — Usuario debe ejecutar TC manualmente desde Test Plan
```

---

## VALIDACIÓN FINAL

Después de ejecutar todo, confirmar al usuario:

```
✅ TC 10941: 2 PRECONDs + 3 STEPs con Expected Result → 3 screenshots capturados ✓
✅ 3 screenshots subidos a ADO
✅ Comentario publicado en US 10801 con placeholder "[Link del resultado aquí]"

⚠️  ACCIÓN REQUERIDA:
1. Ejecuta manualmente el TC desde el Test Plan:
   https://dev.azure.com/AutoregPR/Motorambar/_testPlans/execute?planId=10939&suiteId=10940
2. Copia el link del Test Run generado
3. Actualiza el comentario en la US 10801 reemplazando el placeholder
```

---

## TROUBLESHOOTING

| Error | Solución |
|-------|----------|
| PAT no encontrado | Verificar `mcp.json` tiene `AZURE_DEVOPS_EXT_PAT` |
| Screenshot no capturado | Verificar que el criterio es visible en pantalla antes de capturar |
| Faltan screenshots | **REGLA:** 1 screenshot por cada STEP con Expected Result. PRECONDs NO cuentan. Si TC tiene 2 PRECONDs + 5 STEPs → 5 screenshots |
| Screenshots.length < expected | Advertir al usuario: "⚠️ Cobertura incompleta: TC {ID} tiene {N} STEPs con Expected Result pero solo {M} screenshots" |
| Usuario confunde PRECONDs con STEPs | Recordar: **PRECONDs = setup previo (NO screenshots), STEPs = acciones con validación (SÍ screenshots)** |
| Comentario sin imágenes | Verificar que las URLs de attachments son correctas (GUID válido) |
| Usuario olvida actualizar placeholder | Recordar en el mensaje final que debe ejecutar manualmente el TC |

---

## ANTI-PATRONES (NUNCA HACER)

❌ NO crear múltiples comentarios (uno por TC) — consolidar todos en uno
❌ NO agregar labels a las imágenes ("STEP 1", "CA-02")
❌ NO incluir tabla de pasos en el comentario
❌ NO incluir PRECONDs cuando hay Test Plan (solo cuando es exploratorio)
❌ NO generar archivos JavaScript — ejecutar directamente con PowerShell
❌ NO poner link real del Test Run — usar placeholder `[Link del resultado aquí]`
❌ NO intentar actualizar resultados del Test Run programáticamente — no funciona
❌ **NO capturar screenshots de PRECONDs** — Son setup previo, no validaciones
❌ **NO saltarse screenshots de STEPs con Expected Result** — Cada STEP con criterio REQUIERE su screenshot
❌ NO capturar screenshots "selectivamente" — Cobertura completa de STEPs es OBLIGATORIA
