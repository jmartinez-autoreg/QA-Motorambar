# UI/UX — Mapa de Pantallas

> ⚠️ Este archivo se auto-carga al inicio de cada sesión (vía `@context/UI-UX.md` en `CLAUDE.md`).
> Contiene el mapa de pantallas reales de la aplicación para que el agente redacte Test Cases sin suponer labels, rutas ni comportamientos.

**Cómo se llena:** usa el skill `project-onboarding` — adjunta screenshots de las pantallas y el agente generará una entrada por cada una, guardando la imagen en `context/screenshots/`.

**Regla para el agente:** antes de redactar steps de un TC sobre una pantalla, busca su entrada aquí. Si no existe, NO supongas el diseño — pide un screenshot al usuario o inspecciona la app real vía MCP Browser antes de escribir el TC.

---

## Formato de cada entrada

Copia este bloque por cada pantalla nueva:

```markdown
## [Portal] > [Módulo] > [Nombre de pantalla]
- **Ruta/URL:** ...
- **Cómo se llega aquí:** [pantalla origen + acción/botón exacto]
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | ... | botón | "Guardar" | abre modal de confirmación |
- **Estados:** vacío / con datos / error / loading
- **Screenshot:** ![nombre](screenshots/nombre-pantalla.png)
- **Notas para TCs:** [detalles relevantes]
---
```

---

## ⚠️ Historial de cambios importantes de layout

### US 11366 (cerrada 2026-06-19): Reorganización del sidebar
**Qué cambió:**
- **Antes:** Botón "Acciones" en la parte superior derecha del grid "Vehículos Importados" con un menú dropdown que contenía: "Importar Vehículos", "Importar CFA", "Historial de Importaciones", "Configurar Importación".
- **Ahora:** Sidebar izquierdo con estructura jerárquica:
  - **Dashboard** (sin subopciones)
  - **Vehículos Importados** (expandible, badge numérico con total) → subopciones:
    - Importar Vehículos
    - Historial de Importaciones
  - **Importar CPA** (opción independiente, fuera del submenu)
  - **Mantenimiento** (expandible) → subopciones:
    - Plantilla de importación (antes "Configurar Importación" dentro de Vehículos Importados)

**Impacto en TCs:** TCs escritos antes del 2026-06-19 pueden mencionar "botón Acciones" o "menú Acciones" — al ejecutarlos, usar el sidebar en su lugar. "Configurar Importación" ya NO está en Vehículos Importados — buscar en Mantenimiento > Plantilla de importación. Ver sección obsoleta del menú Acciones en "Vehículos Importados > Grid de inventario > Componentes asociados" para referencia histórica.

**Permisos por rol (US 11366):**
- **DISTRIBUIDOR:** ve todas las opciones del sidebar.
- **CLIENTE:** solo ve Dashboard + "Vehículos Asignados" — NO ve Vehículos Importados ni Importar CPA.

---

## Pantallas documentadas

## Autoreg / PDV (sistema externo) > Login federado
- **Ruta/URL:** `https://testwaf.portaldevehiculos.com/Forms/Account/LoginNew.aspx` (ambiente Test)
- **Cómo se llega aquí:** acceso directo a la URL — es el punto de entrada real para autenticarse antes de llegar a Motorambar.
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Logo | texto/ícono | "portaldevehiculos" | esquina superior del card de login |
  | Barra de color | decorativo | — | franja de colores bajo el logo |
  | Campo | input | "Usuario" | ícono de usuario |
  | Campo | input | "Contraseña" | ícono de candado |
  | Link | link | "¿Olvidó su Contraseña?" | — |
  | Botón | primario naranja | "INICIAR SESIÓN" | autentica y redirige al landing de PDV ("Bienvenido") |
  | Botón secundario | botón | _(texto no legible en la captura — pendiente confirmar)_ | debajo de "INICIAR SESIÓN" |
  | Footer | texto | "Política de Privacidad" + copyright | — |
- **Estados:** solo documentado el estado vacío/inicial (sin credenciales). Error de credenciales — no documentado.
- **Screenshot:** ![autoreg-login](screenshots/autoreg-login.png)
- **Notas para TCs:** este es el login REAL del ambiente de Test — un TC de login E2E debe iniciar aquí (no en `/login` de Motorambar, que es solo para desarrollo). Tras "INICIAR SESIÓN" exitoso, el flujo llega al landing de PDV (ver entrada siguiente) y desde ahí, al botón "Portal Distribuidor", que redirige a Motorambar.
---

## Autoreg / PDV (sistema externo) > Bienvenido (landing post-login)
- **Ruta/URL:** _(pendiente — mismo dominio `portaldevehiculos.com`, ruta exacta no confirmada)_
- **Cómo se llega aquí:** tras "INICIAR SESIÓN" exitoso en el login federado de Autoreg.
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Logo | texto/ícono | "DISTO — directoria de servicios al conductor" | esquina superior izquierda |
  | Barra superior | info | "Usuario: {username}" / "Rol: {ROL_PDV}" / "Fecha: {dd-mmm-aaaa}" | ej. "Usuario: jovidio · Rol: CASE LOCATION SUPERVISOR" — el rol mostrado aquí es el **rol en PDV**, distinto del rol "Cliente"/"Distribuidor" que el mismo usuario tiene en Motorambar |
  | Link | link | "Perfil de Seguridad" | esquina superior derecha |
  | Botón | botón (ícono logout) | "Salida" | esquina superior derecha |
  | Título | texto | "Inicio: Bienvenido" | — |
  | Balance | texto naranja | "Balance: $XXX,XXX.XX" | + íconos casa/lupa |
  | Logo | texto/ícono | "portaldevehiculos.com" | logo principal del portal |
  | Dropdown | botón | "Opciones ▼" | — |
  | Sección | grupo de botones | "Consultas" | "Consulta Vehículo", "Consulta Persona", "Consulta Pre Venta" |
  | Sección | grupo de botones | "Registros" | "Registro de Autos en Lote", "Traspaso de Autos en Lote", "Pre Venta en Lote", "Pagos en Lote" |
  | Sección | grupo de botones | "Multas" | "Pagar Multas", "Pagar Multas Batch" |
  | Sección | grupo de botones | "Datos y Documentos" | "Documentos en Lote", "Integración Datos y Documentos", "Procesamiento Preventas Excel", **"Portal Distribuidor"** |
  | Botón | botón, sección "Datos y Documentos" | "Portal Distribuidor" | **redirige a Motorambar/VehicleDocs** (`https://motorambartest.portaldevehiculos.com/`) vía SSO |
  | Sección | grupo de botones | "Solicitud 770" | "Presentación de Gravamen", "Refinanciamiento", "Liberación de Gravamen", "Ley 253" |
- **Estados:** con datos (visto con usuario `jovidio`, Rol PDV "CASE LOCATION SUPERVISOR"). Para `distri2` u otros roles, los botones/secciones visibles podrían variar — no confirmado.
- **Screenshot:** ![pdv-bienvenido-portal-distribuidor](screenshots/pdv-bienvenido-portal-distribuidor.png)
- **Notas para TCs:** el botón **"Portal Distribuidor"** (sección "Datos y Documentos") es el paso final del flujo SSO hacia Motorambar — un TC de login E2E completo debe incluir: login en Autoreg → (cerrar modal "Términos y Condiciones" si aparece) → clic en "Portal Distribuidor" → llegar al Dashboard de Motorambar.

### Componente: Modal "Terminos y Condiciones" (condicional, primera sesión)
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Título | texto | "Terminos y Condiciones" | — |
| Lista de cláusulas | checkboxes | 4 párrafos de términos legales (texto firmado "Yo, {NOMBRE}, certifico/reconozco/acepto...") | las 3 primeras vienen pre-marcadas; la 4ª (sobre el procesador de pago del Depto. de Hacienda) viene **sin marcar** |
| Botón | primario | "Continuar" | cierra el modal y continúa al landing "Bienvenido" |

Screenshot: ![pdv-bienvenido-terminos-condiciones](screenshots/pdv-bienvenido-terminos-condiciones.png)

**Notas para TCs:** este modal es **condicional** — solo aparece en la primera sesión/login del usuario. Para un TC de login, documentar ambos casos: con modal (primera vez) y sin modal (sesiones posteriores). No asumir que siempre aparece.
---

## Motorambar > Dashboard > Dashboard Ejecutivo
- **Ruta/URL:** `/` (root)
- **Cómo se llega aquí:** Tras un login exitoso (SSO o login interno vía `/auth-test`), o haciendo clic en "Dashboard" en el menú lateral.
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Logo + nombre app | texto/ícono | "VehicleDocs" | esquina superior izquierda, con botón de colapsar sidebar |
  | Badge contexto | badge | "MANUFACTURER" | fijo bajo el logo en el sidebar |
  | Item de menú | nav link | "Dashboard" | activo/resaltado en esta pantalla |
  | Item de menú | nav link | "Vehículos Importados" | badge numérico con el total de vehículos (ej. `1057`); si el total es `0` el badge **desaparece** (no muestra "0"); navega al grid |
  | Ícono notificaciones | botón | (campana con badge "+") | abre dropdown "NOTIFICACIONES" |
  | Ícono ayuda | botón | "?" | — |
  | Perfil usuario | botón/dropdown | nombre de usuario + badge de rol (ej. "DISTRIBUIDOR") + chevron | abre menú de perfil |
  | Título de página | texto | "Dashboard Ejecutivo" | — |
  | Subtítulo | texto | "OPERACIONES EN TIEMPO REAL" | — |
  | Breadcrumb | texto | "DASHBOARD" | — |
  | Botón exportar | botón | "EXPORTAR DATOS" | esquina superior derecha, color morado |
  | Tarjeta KPI 1 | card | "CANTIDAD DE VEHÍCULOS" | valor numérico (ej. `1057`) + badge de variación (ej. `+105400%`) |
  | Tarjeta KPI 2 | card | "CANT. CO GENERADOS HOY" | valor (ej. `7`) + badge variación (ej. `+600%`) |
  | Tarjeta KPI 3 | card | "CANTIDAD DE CO GENERADOS" | valor (ej. `9`) + badge variación (`0%`) |
  | Tarjeta KPI 4 | card | "CANT. VEHÍCULOS ENVIADOS A PDV" | valor (ej. `389`) + badge variación |
  | Tarjeta KPI 5 | card | "CANT. VEHÍCULOS PENDIENTE DE ENVÍO A PDV" | valor (ej. `668`) + badge variación |
  | Tarjeta KPI 6 | card | `DASHBOARD.[PENDING TO DEFINE]` | ⚠️ key de traducción **sin traducir**, visible literalmente en UI; valor `0` |
  | Gráfico de barras | chart | "VEHÍCULOS POR MARCA POR MES" | leyenda por marca (ej. Infiniti, Kia, Nissan); link "Descargar Excel" |
  | Gráfico de líneas | chart | "CO GENERADOS ÚLTIMOS 6 MESES" | eje X meses (Ene-Jun); link "Descargar Excel" |
  | Gráfico donut | chart | "DISTRIBUCIÓN DE CO POR ESTADO" | leyenda "Anulados" (rojo) / "Generados" (verde) / "Pendientes" (morado); link "Descargar Excel" |
  | Footer | texto | "© 2026 VehicleDocs" | — |
- **Estados:**
  - Con datos (visto).
  - **Vacío:** todas las tarjetas KPI muestran `0`.
  - **Loading:** la pantalla se ve vacía (sin contenido ni skeleton visible) hasta que la data está disponible.
  - Error — no documentado.
- **Screenshot:** ![dashboard-ejecutivo](screenshots/dashboard-ejecutivo.png) · ![dashboard-ejecutivo-scroll](screenshots/dashboard-ejecutivo-scroll.png)
- **Notas para TCs:**
  - La 6ª tarjeta KPI muestra literalmente la key de i18n `DASHBOARD.[PENDING TO DEFINE]` sin traducir — si un TC valida el contenido de esta tarjeta, documentar el comportamiento actual (texto crudo) como hallazgo, no asumir que cambiará.
  - Los enlaces "Descargar Excel" de cada gráfico son acciones independientes — no asumir un único botón de exportación global (ese es "EXPORTAR DATOS").
---

## Motorambar > Vehículos Importados > Grid de inventario
- **Ruta/URL:** `/import`
- **Cómo se llega aquí:** clic en "Vehículos Importados" en el menú lateral (sidebar) → clic en "Historial de Importaciones" en el submenu desplegable.
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | **SIDEBAR (Menú lateral)** | nav vertical | — | colapsable/expandible con botón hamburguesa; muestra badge "MANUFACTURER" bajo el logo. **US 11366: opciones que antes estaban en superior derecha se movieron aquí** |
  | Item sidebar (nivel 1) | nav link | "Dashboard" | ícono grid; navega al Dashboard Ejecutivo; sin subopciones |
  | Item sidebar (nivel 1) | nav link expandible | "Vehículos Importados" | ícono vehículo + badge numérico con total de vehículos (ej. `1057`); el badge **desaparece** si total = 0; **despliega/colapsa submenu** con 2 opciones |
  | Submenu (nivel 2) | nav link | "Importar Vehículos" | opción dentro de "Vehículos Importados"; navega a pantalla de carga de Excel |
  | Submenu (nivel 2) | nav link | "Historial de Importaciones" | opción dentro de "Vehículos Importados"; navega a `/import` (esta pantalla — **activa por defecto** al entrar a Vehículos Importados) |
  | Item sidebar (nivel 1) | nav link | "Importar CPA" | ícono documento; navega a `/import/cpa`; **opción independiente fuera del submenu** de "Vehículos Importados" |
  | Item sidebar (nivel 1) | nav link expandible | "Mantenimiento" | ícono settings o llave; **despliega/colapsa submenu** con opciones de administración |
  | Submenu (nivel 2) | nav link | "Plantilla de importación" | opción dentro de "Mantenimiento"; navega a pantalla de mapeo de columnas Excel (antes "Configurar Importación") |
  | Título | texto | "Vehículos Importados" | — |
  | Subtítulo | texto | "Historial de Inventario" | — |
  | Botón | botón primario | "Generar Reporte" | abre modal "Reporte de Inventario de Vehículos" |
  | Buscador | input | placeholder "Buscar por VIN" | ícono de expandir habilita búsqueda multi-VIN (uno por línea), con contadores "Total" / "Válidos" / "Inválidos" y chips removibles |
  | Filtro de localidades | botón + dropdown | "Todas las Localidades" | ver detalle abajo (popup) |
  | Favoritos | ícono estrella | — | activa/desactiva filtro "solo favoritos" |
  | Filtro | select | "Estado CO: Todos" | — |
  | Filtro | select | "Estado CPA: Todos" | — |
  | Filtro | select | "Estado Factura: Todos" | — |
  | Sección colapsable | toggle | "MÁS FILTROS" | expande/colapsa filtros adicionales |
  | Filtro adicional | select | "RANGO DE FECHA" → "Todo el Tiempo" | opciones: Hoy, Semana Actual, Mes Actual, Últimos 30 Días, Año a la Fecha, Rango personalizado |
  | Filtro adicional | select | "MARCA" → "Todas las Marcas" | — |
  | Filtro adicional | input multi-valor tipo VIN | "CONCESIONARIO" → placeholder "Buscar por concesionario..." | **US 11367:** búsqueda por prefijo (proximidad) con chips; acepta múltiples valores separados por coma o líneas; cada valor es un chip removible; filtra Dealers cuyo nombre comience con el texto ingresado (ej. "popular" muestra "POPULAR AUTO") |
  | Filtro adicional | input multi-valor tipo VIN | "INSTITUCIÓN FINANCIERA" → placeholder "Buscar por institución financiera..." | **US 11367:** búsqueda por prefijo (proximidad) con chips; acepta múltiples valores separados por coma o líneas; cada valor es un chip removible; filtra Bancos cuyo nombre comience con el texto ingresado |
  | Filtro adicional | input | "N.° FACTURA" → "Buscar por no. de factura..." | — |
  | Filtro adicional | input | "N.° CARTA DE CRÉDITO" → "Buscar por no. de carta de crédito..." | — |
  | Filtro adicional | input | "N.° ORDEN DE VENTA" → "Buscar por no. de orden de venta..." | — |
  | Tabla | grid | columnas: checkbox, VIN, VEHÍCULO, ASIGNADO A, FACTURA, PRECIO DE VENTA, ESTADO CO, ESTADO CPA, ESTADO DE FACTURA, PDV-DATOS, PDV-DOCUMENTOS, ACCIONES | cada fila tiene chevron para expandir detalle inline |
  | Badge de estado | badge | "PENDIENTE" (naranja) | aparece en columnas ESTADO CO / ESTADO CPA / ESTADO DE FACTURA |
  | Indicador PDV | ícono | ✓ verde / ✕ rojo (circulares) | estado de sincronización de Datos/Documentos a PDV |
  | Acciones por fila | íconos | ojo (ver), descarga, "añadir documento", "..." (más opciones) | ver detalle abajo |
  | Chevron expandir | ícono | flecha derecha (o similar) | expande el detalle inline del vehículo mostrando tabs horizontales |
- **Estados:**
  - Con datos (1057 registros).
  - **Vacío:** la tabla aparece sin filas (ej. un filtro/búsqueda sin resultados); el badge del total en el menú "Vehículos Importados" desaparece (ver Dashboard).
  - **Loading:** toda la pantalla (buscador, filtros, tabla y paginación) se muestra como **skeleton** (placeholders grises) hasta que la data carga.
  - Error — no documentado.
- **Permisos por rol:**
  - **DISTRIBUIDOR:** puede ver y acceder a todas las opciones del sidebar (Dashboard, Vehículos Importados con sus 2 subopciones, Importar CPA, Mantenimiento con sus subopciones incluyendo Plantilla de importación).
  - **CLIENTE:** solo ve "Dashboard" y "Vehículos Asignados" en el sidebar; **NO** ve "Vehículos Importados" (ni su badge ni subopciones), ni "Importar CPA", ni "Mantenimiento". Si intenta acceder a URLs restringidas directamente, el sistema lo redirige al Dashboard mostrando mensaje *"No tienes permisos para acceder a esta funcionalidad"*.
- **Screenshot:** ![vehiculos-importados-grid](screenshots/vehiculos-importados-grid.png) · ![vehiculos-importados-iconos-fila](screenshots/vehiculos-importados-iconos-fila.png) · ![vehiculos-importados-grid-loading](screenshots/vehiculos-importados-grid-loading.png) · ![vehiculos-importados-sidebar-layout](screenshots/vehiculos-importados-sidebar-layout.png)
- **Notas para TCs:**
  - **US 11366:** Actualización de layout del sidebar. Las opciones que antes estaban en la parte superior derecha (botón "Acciones", etc.) se reorganizaron al menú lateral izquierdo con la estructura Dashboard > Vehículos Importados (expandible con 2 subopciones) > Importar CPA > Mantenimiento (expandible).
  - El badge del total en el menú "Vehículos Importados" desaparece si el total es `0` (no muestra "0") — ver comportamiento documentado en Dashboard.
  - **"Configurar Importación" ya NO está en el sidebar de "Vehículos Importados"** — se movió a Mantenimiento > Plantilla de importación.

### Componente: Detalle inline expandido por fila (tabs)

**Cómo se llega aquí:** clic en el chevron/flecha de expandir de una fila del grid "Vehículos Importados".

| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Tabs horizontales | nav tabs | "MÁS INFORMACIÓN" / "CO" / "CPA" / "FACTURA" / "DOCS ADICIONALES" / "HISTORIAL" | tabs para navegar entre secciones del detalle del vehículo sin salir del grid |
| Tab activo | tab resaltado | primer tab activo por defecto: "MÁS INFORMACIÓN" | — |

**Tab "MÁS INFORMACIÓN":** (contenido pendiente documentar)

**Tab "CO" (Certificado de Origen):** (contenido pendiente documentar)

**Tab "CPA" (Certificado de Pago de Arbitrios):**
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Sección título | texto | "CONTRATO DE COMPRA (CPA)" ⚠️ | ⚠️ Label antiguo en la UI — término correcto: "CERTIFICADO DE PAGO DE ARBITRIOS (CPA)" |
| Badge estado | badge | "SUBIDO" (verde) / "PENDIENTE" (naranja) / "COMPLETADO" (verde) | indica el estado del documento CPA |
| Campo | label + valor | "PRECIO VENTA" | valor monetario (ej. "$37,614.42") |
| Campo | label + valor | "IMPUESTO VENTA" | valor monetario (ej. "$7,162.11") |
| Campo | label + valor | "FECHA IMPUESTO" | fecha (ej. "23/2/2026") |
| Campo | label + valor | "DECLARACIÓN ARB" | texto/código (ej. "—" si vacío) |
| Campo | label + valor | "ID CPA" | texto/código (ej. "—" si vacío) |
| Campo | label + valor | "RNC CONTRIBUYENTE" | código (ej. "12502-40512") |
| Botón | outline morado | "DESCARGAR" | descarga el PDF del CPA actual |
| Botón | outline morado | "PREVISUALIZAR" | abre el PDF en visor inline o nueva pestaña |
| Botón | outline morado | "REEMPLAZO" (ícono subir) | abre diálogo de selección de archivo para reemplazar el CPA actual |
| Panel derecho | card | "HISTORIAL DE SEGUIMIENTO" | muestra eventos cronológicos del CPA (ej. "CPA Importado" con fecha + nombre de archivo) |

**Comportamiento "REEMPLAZO":**
1. Clic en "REEMPLAZO" → se abre explorador de archivos del sistema operativo
2. Usuario selecciona nuevo PDF de CPA → confirma
3. Sistema sube el archivo, muestra toast verde "Documento sustituido correctamente."
4. Sistema detecta automáticamente que el documento CPA cambió y envía el nuevo documento al Portal DTOP en background mediante el Worker de retry

**Tab "FACTURA":** (contenido pendiente documentar)

**Tab "DOCS ADICIONALES":** (contenido pendiente documentar)

**Tab "HISTORIAL":**
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Título sección | texto | "LÍNEA DE TIEMPO DEL REGISTRO" | con ícono de reloj (⏱) |
| Filtros de tipo documento | tabs/pills | "TODO" (activo por defecto) / "CO" / "CPA" / "DOCS" / "FACTURA" | filtra la línea de tiempo por tipo de documento |
| Botón principal | botón morado | "DESCARGAR HISTORIAL" | esquina superior derecha; descarga el historial completo del vehículo (todos los documentos) |
| Ítem de historial | card/item | nombre de archivo (ej. "certificate-5N1DR3CU1TC240132-20260624000030.pdf") + badge de estado | estado puede ser "COMPLETADO" (verde) / "REEMPLAZADO" (naranja); ícono CO/documento; botón "co" pequeño morado para previsualizar/descargar |
| Fecha/hora | texto | timestamp (ej. "23 JUN 2026, 20:06") | debajo del botón de cada ítem |
| Estado vacío | mensaje + ilustración | "Sin historial de documentos" | **se muestra cuando NO hay registros en la línea de tiempo** — puede mostrar ilustración/ícono de carpeta vacía |

**Comportamiento "DESCARGAR HISTORIAL":**
1. Clic en el botón → descarga archivo ZIP con todos los documentos del vehículo (CO, CPA, Factura, Docs Adicionales)
2. Nombre del archivo descargado: pendiente documentar (ej. `historial-{VIN}-{fecha}.zip`)

**Estado "Sin historial de documentos":**
- Si el vehículo **no tiene** ningún documento cargado (ni CO, ni CPA, ni Factura, ni Docs Adicionales), el tab HISTORIAL muestra el mensaje **"Sin historial de documentos"** en lugar de la línea de tiempo.
- Los filtros (TODO/CO/CPA/DOCS/FACTURA) **siguen visibles** pero la línea de tiempo está vacía con el mensaje.
- El botón "DESCARGAR HISTORIAL" puede estar **deshabilitado** o no visible cuando no hay documentos — pendiente confirmar.

**Screenshot:** ![Vehiculo expandito pantalla Vehiculos Importados TAB Historia ](screenshots/Vehiculo expandito pantalla Vehiculos Importados TAB Historia .png)

**Notas para TCs:**
- **CO = Certificado de Origen** — término oficial, usado consistentemente en la UI como "CERTIFICADO DE ORIGEN (CO)".
- **CPA = Certificado de Pago de Arbitrios** — término oficial. La UI puede mostrar variantes ("CONTRATO DE COMPRA (CPA)" en algunas secciones antiguas), pero **los TCs deben usar siempre "CERTIFICADO DE PAGO DE ARBITRIOS (CPA)"** como término oficial del dominio.
- El detalle inline expandido es **más rápido** que navegar a "Editar Vehículo" — usar este flujo para TCs que solo necesitan consultar o reemplazar documentos sin editar campos VHE.
- El toast "Documento sustituido correctamente." confirma que la operación de reemplazo fue exitosa en el frontend; la sincronización al Portal DTOP ocurre en background (el TC debe verificar en Autoreg "Consulta CO & CPA" que el documento llegó).



### Componentes / popups asociados a esta pantalla

**Filtro de localidades** (clic en "Todas las Localidades")
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Toggle | ícono grid | — | filtra "Todas las Localidades" |
| Toggle | ícono carrito | — | filtra por **Dealer** |
| Toggle | ícono casita | — | filtra por **Banco** |
| Estrella | ícono | — | filtra solo localidades marcadas como favorito |
| Buscador | input | "Buscar cliente..." | — |
| Lista | items | "Todas las Localidades" (✓ activo), "AUTOCOREANA PR LLC" ★, "POPULAR AUTO" ★, "ADRIEL KIA", "ADRIEL NISSAN CAGUAS", "ADRIEL NISSAN TOA BAJA" | ítems con ícono carrito = Dealer, ícono casita = Banco; ⭐ amarilla = favorito |

Screenshot: ![vehiculos-importados-filtro-localidades](screenshots/vehiculos-importados-filtro-localidades.png)

**Menú "Acciones"** (botón "Acciones" - **OBSOLETO tras US 11366**)
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Opción de menú | item | "Importar Vehículos" (ícono upload) | **Ahora accesible desde sidebar > Vehículos Importados > Importar Vehículos** |
| Opción de menú | item | "Importar CFA" (ícono documento) | **Ahora accesible desde sidebar > Importar CPA** (nota: la UI anterior decía "CFA", ahora es "CPA") |
| Opción de menú | item | "Historial de Importaciones" (ícono historial) | **Ahora accesible desde sidebar > Vehículos Importados > Historial de Importaciones** |
| Opción de menú | item | "Configurar Importación" (ícono settings) | **Se movió fuera del menú Vehículos Importados → ahora en sidebar > Mantenimiento > Plantilla de importación** |

Screenshot: ![vehiculos-importados-acciones-menu-completo](screenshots/vehiculos-importados-acciones-menu-completo.png)

**⚠️ NOTA IMPORTANTE:** Este menú "Acciones" (botón en parte superior) existió hasta la **US 11366** (cerrada 2026-06-19). **Tras la US 11366, estas opciones se movieron al sidebar izquierdo** (ver tabla de sidebar arriba). "Configurar Importación" ya NO está en Vehículos Importados — ahora está en Mantenimiento > Plantilla de importación. TCs escritos antes de 2026-06-19 pueden mencionar "botón Acciones" — al ejecutarlos, usar el sidebar en su lugar.

**Menú "..." por fila / barra de acciones batch**
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Opción de menú (fila) | item | "Agregar documento adicional" | abre modal "Añadir Documento" |
| Opción de menú (fila) | item | "Editar Vehículo" | navega a `/vehicle/[id]` en modo edición |
| Opción de menú (fila) | item | "Asignar A" | abre modal "Asignar Cliente" |
| Opción de menú (fila) | item | "Reenviar Datos a PDV" | — |
| Opción de menú (fila) | item | "Enviar Docs a PDV" | — |
| Opción de menú (fila) | item, rojo | "Eliminar" | abre modal "Eliminar Registros" |
| Barra batch (al seleccionar checkboxes) | toolbar flotante | "{n} VEHÍCULOS SELECCIONADOS" | aparece al pie de la tabla |
| Acción batch | botón | "Descargar ({n})" | abre modal "Descargar Documentos" |
| Acción batch | botón | "Asignar A" | abre modal "Asignar Cliente" |
| Acción batch | botón | "Reenviar Datos a PDV" | — |
| Acción batch | botón | "Enviar Docs a PDV" | — |
| Acción batch | botón, rojo | "Eliminar" | abre modal "Eliminar Registros" |
| Cerrar barra batch | ícono "X" | — | deselecciona todo |

Screenshot: ![vehiculos-importados-opciones-fila-y-batch](screenshots/vehiculos-importados-opciones-fila-y-batch.png)

**Modal "Eliminar Registros"**
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Ícono | basura roja | — | — |
| Título | texto | "Eliminar Registros" | — |
| Subtítulo | texto rojo | "ESTA ACCIÓN NO SE PUEDE DESHACER" | — |
| Cuerpo | texto | "¿Estás seguro que deseas eliminar {n} registros de vehículos seleccionados?" | `{n}` = cantidad seleccionada |
| Botón | secundario | "CANCELAR" | cierra modal sin acción |
| Botón | primario rojo | "ELIMINAR" | confirma eliminación |
| Cerrar | ícono "X" | — | esquina superior derecha |

Screenshot: ![vehiculos-importados-modal-eliminar](screenshots/vehiculos-importados-modal-eliminar.png)

**Modal "Asignar Cliente"**
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Ícono | persona+ morado | — | — |
| Título | texto | "Asignar Cliente" | — |
| Subtítulo | texto morado | "ACTUALIZANDO {n} VEHÍCULO(S)" | — |
| Label | texto | "SELECCIONAR CLIENTE" | — |
| Toggles | íconos grid/carrito/casita | — | filtran la lista de clientes por Todos/Dealer/Banco |
| Dropdown | select | "Elegir un cliente..." | + ícono estrella (favoritos); ej. "ADRIEL NISSAN CAGUAS" |
| Buscador | input | "Buscar cliente..." | — |
| Lista de clientes | items | "POPULAR AUTO" ★, "FIRSTBANK", "ORIENTAL BANK", "PDV", "TOYOTA CREDIT" | cada uno con ícono casita (Banco) |
| Botón | secundario | "CANCELAR" | cierra modal sin acción |
| Botón | primario morado | "CONFIRMAR" | confirma la asignación del cliente seleccionado |

Screenshot: ![vehiculos-importados-asignar-cliente](screenshots/vehiculos-importados-asignar-cliente.png) · ![vehiculos-importados-asignar-cliente-confirmar](screenshots/vehiculos-importados-asignar-cliente-confirmar.png)

**Menú de descarga individual** (ícono descarga en columna ACCIONES de una fila)
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Opción | item (habilitado) | "Descargar Todos" | — |
| Opción | item (habilitado) | "Descargar CO" | — |
| Opción | item (habilitado) | "Descargar CPA" | — |
| Opción | item (deshabilitado) | "Descargar Factura" | gris — depende de si existe el documento |
| Opción | item (deshabilitado) | "Descargar Carta Exento de Arbitrios" | gris |
| Opción | item (deshabilitado) | "Descargar Otros" | gris |

Screenshot: ![vehiculos-importados-descarga-individual](screenshots/vehiculos-importados-descarga-individual.png)

**Modal "Descargar Documentos"** (batch, desde la barra de selección)
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Ícono | descarga morada | — | — |
| Título | texto | "Descargar Documentos" | — |
| Subtítulo | texto morado | "{n} VEHÍCULOS SELECCIONADOS" | — |
| Checkbox | checkbox | "SELECCIONAR TODOS" | marca/desmarca todas las opciones |
| Checkbox (marcado) | checkbox | "CO" | — |
| Checkbox (marcado) | checkbox | "CPA" | — |
| Checkbox (marcado) | checkbox | "Carta Exento de Arbitrios" | — |
| Checkbox (marcado) | checkbox | "Factura" | — |
| Checkbox (sin marcar) | checkbox | "Otros" | — |
| Botón | secundario | "CANCELAR" | — |
| Botón | primario morado | "DESCARGAR" | — |

Screenshot: ![vehiculos-importados-descarga-lote](screenshots/vehiculos-importados-descarga-lote.png)

**Modal "Reporte de Inventario de Vehículos"** (botón "Generar Reporte")
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Ícono | gráfico morado | — | — |
| Título | texto | "Reporte de Inventario de Vehículos" | — |
| Subtítulo | texto | "• {año} • {n} VEHÍCULOS ENCONTRADOS" | — |
| Botón | botón outline | "EXPORTAR PDF" | — |
| Filtro | label | "REFINAMIENTO PRE-EXPORTACIÓN" / "FILTRAR POR PERIODO DE REPORTE" | — |
| Filtro periodo | botones (toggle group) | "TODO" / "HOY" / "SEMANA" / "MES" / "AÑO" | "TODO" activo por defecto (morado) |
| Tarjeta | card | "VALOR TOTAL" | ej. `$27,718,891.25` |
| Tarjeta | card | "PRECIO PROMEDIO" | ej. `$26,224.12` |
| Tarjeta | card | "COS COMPLETADOS" | ej. `15` |
| Tarjeta | card | "FACTURAS EMITIDAS" | ej. `10` |
| Tabla | grid | columnas VIN / MODELO / FECHA DE VENTA / PRECIO | lista de vehículos del periodo filtrado |
| Cerrar | ícono "X" | — | esquina superior derecha |

Screenshot: ![vehiculos-importados-reporte-inventario](screenshots/vehiculos-importados-reporte-inventario.png)

### Componente: Desasignar cliente (individual y batch) — **US 11383**

**Cómo se llega aquí (individual):** En el grid de "Vehículos Importados", hacer clic en el menú de opciones "..." (tres puntos) en la columna ACCIONES de una fila que tenga cliente asignado → seleccionar "Desasignar".

**Cómo se llega aquí (batch):** En el grid de "Vehículos Importados", marcar los checkboxes de 2 o más vehículos que tengan cliente asignado → en la barra inferior de acciones batch, hacer clic en "Desasignar" (dentro del menú "Asignar A" o como botón independiente).

**Modal "Desasignar Cliente" (individual):**
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Ícono | persona con signo menos, naranja | — | esquina superior izquierda del modal |
| Título | texto | "Desasignar Cliente" | — |
| Subtítulo | texto naranja mayúsculas | "ESTA ACCIÓN REMOVERÁ EL ACCESO DEL CLIENTE AL VEHÍCULO" | advertencia |
| Mensaje | texto | "¿Quitar la asignación de {CLIENTE} al vehículo {VIN}?" | ej. "¿Quitar la asignación de ORIENTAL BANK al vehículo KNDEP2AA3T7958212?" |
| Botón | secundario gris | "CANCELAR" | cierra modal sin realizar acción |
| Botón | primario naranja | "CONFIRMAR" | ejecuta la desasignación y cierra el modal |

**Modal "Desasignar Clientes" (batch):**
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Ícono | persona con signo menos, naranja | — | esquina superior izquierda del modal |
| Título | texto | "Desasignar Clientes" | — |
| Subtítulo | texto naranja mayúsculas | "SE REMOVERÁ EL ACCESO DE LOS CLIENTES A LOS VEHÍCULOS SELECCIONADOS" | advertencia |
| Mensaje | texto | "¿Quitar la asignación de cliente a los vehículos seleccionados?" | — |
| Botón | secundario gris | "CANCELAR" | cierra modal sin realizar acción |
| Botón | primario naranja | "CONFIRMAR" | ejecuta la desasignación batch y cierra el modal |

**Comportamiento tras confirmación:**
- **Individual:** El sistema remueve la asignación del cliente al vehículo seleccionado. La columna "ASIGNADO A" de esa fila queda vacía (muestra "—" o simplemente sin valor). Aparece un toast verde con el mensaje: **"Cliente removido del vehículo exitosamente."**
- **Batch:** El sistema remueve la asignación de clientes de todos los vehículos seleccionados (solo afecta a los que tenían cliente asignado). La columna "ASIGNADO A" de esas filas queda vacía. Aparece un toast verde con el mensaje: **"Clientes removidos de {N} vehículos"** (donde {N} es la cantidad de vehículos que efectivamente tenían cliente asignado).

**Reglas de negocio:**
1. **Opción "Desasignar" solo visible si hay cliente asignado:** Si un vehículo **no tiene cliente asignado** (columna "ASIGNADO A" vacía), la opción "Desasignar" **NO** aparece en el menú de opciones individuales.
2. **Batch con vehículos sin cliente:** Si el usuario selecciona 5 vehículos y solo 3 tienen cliente asignado, el modal batch muestra un mensaje adicional: *"De 5 vehículos seleccionados, 2 no tienen cliente asignado. La operación solo afectará 3 registros."* (pendiente confirmar en UI si este mensaje aparece en el subtítulo del modal o como texto adicional).
3. **Persistencia:** Tras desasignar, el cliente pierde acceso al vehículo. El Distribuidor mantiene acceso completo.

**Estados:**
- Vehículo con cliente asignado (columna "ASIGNADO A" con valor, ej. "ORIENTAL BANK").
- Vehículo sin cliente asignado (columna "ASIGNADO A" vacía o "—").
- Modal de confirmación abierto (individual o batch).
- Toast de éxito visible.

**Screenshot:** Los screenshots provistos por el usuario muestran el flujo completo de desasignación individual y batch, incluyendo el menú de opciones con "Desasignar" resaltado, modales de confirmación y toasts de éxito.

**Notas para TCs:**
- **US-11383:** Esta funcionalidad permite al Distribuidor quitar la asignación de cliente de uno o varios vehículos para que queden sin cliente asignado. Los clientes pierden acceso a esos vehículos; el Distribuidor mantiene acceso completo.
- El modal individual usa singular "Cliente" / "vehículo"; el modal batch usa plural "Clientes" / "vehículos seleccionados".
- El toast de éxito muestra un mensaje diferente según si fue operación individual (1 vehículo) o batch (N vehículos).
- Verificar que la opción "Desasignar" NO aparece en el menú de opciones de un vehículo que no tiene cliente asignado (Escenario 3 de los criterios de aceptación).
---

**Componente: Filtros multi-valor con chips** (Estado CO, Estado CPA, Estado Factura, Marca) — **US 11369**

**Cómo se llega aquí:** Los filtros "Estado CO", "Estado CPA", "Estado Factura" y "Marca" en el grid de "Vehículos Importados" — al hacer clic en cualquiera de ellos.

| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| **Estado inicial (sin selección)** | dropdown colapsado | "Estado CO" / "Estado CPA" / "Estado de Factura" / "Marca" | color gris claro, sin badge numérico; al hacer clic abre el dropdown con checkboxes y buscador interno |
| **Dropdown abierto** | menu desplegable | — | fondo blanco con sombra; muestra buscador interno + lista de checkboxes con opciones del catálogo; se posiciona sobre el resto de contenido |
| Buscador interno (dropdown) | input | placeholder "Buscar..." | permite filtrar la lista de opciones dentro del dropdown; funciona con búsqueda incremental (ej. "pen" muestra "Pendiente") |
| Opción "Seleccionar todos" | checkbox con texto | checkbox + texto "Pendiente" / "Completado" | primera opción de la lista; al marcar/desmarcar afecta **todas** las opciones de ese filtro a la vez |
| Opción individual (ejemplo Estado CO) | checkbox + label | "Pendiente" | puede estar marcado ✓ (checkbox morado lleno) o sin marcar (checkbox vacío con borde gris) |
| Opción individual (ejemplo Estado CO) | checkbox + label | "Completado" | — |
| Opción individual (ejemplo Marca) | checkbox + label | "Infiniti" / "Kia" / "Nissan" / "+1 más" | el "+1 más" o "+N más" aparece cuando hay muchas opciones en el catálogo y el dropdown tiene scroll |
| **Dropdown con selección** (cerrado) | dropdown resaltado con badge | "Estado CO" con badge morado "(1)" | borde morado, badge numérico morado con fondo claro a la derecha del label; el badge muestra **cuántas** opciones están seleccionadas (ej. "(1)", "(2)", "(3)") |
| Chips removibles | chips con "✕" | ej. "Completado ✕" | aparecen **debajo** del dropdown cerrado en una fila horizontal; cada chip tiene fondo morado claro con texto morado oscuro y una "✕" clickeable; son removibles individualmente |
| Múltiples chips | fila de chips | "Infiniti ✕" · "Kia ✕" · "+1 más" | cuando hay más de 2-3 chips, la UI puede mostrar solo los primeros y un indicador "+N más" para evitar que la fila de chips ocupe demasiado espacio vertical; al hacer clic en "+N más" despliega los chips ocultos |
| **Combinar múltiples filtros** | varios dropdowns con chips | ej. "Estado CO (1)" + chip "Completado" · "Marca (3)" + chips "Infiniti", "Kia", "+1 más" | cada filtro es independiente; se pueden aplicar varios a la vez; la tabla aplica **AND** entre filtros distintos y **OR** dentro del mismo filtro |
| Botones de acción del filtro | botones | "ACTUALIZAR" (morado) · "LIMPIAR FILTROS" (outline gris) | "ACTUALIZAR" aplica los filtros activos y cierra dropdowns; "LIMPIAR FILTROS" elimina **todos** los chips de **todos** los filtros y resetea la tabla |

**Comportamiento de multi-selección:**
1. Usuario hace clic en el dropdown "Estado CO" → se abre mostrando buscador + lista de checkboxes (ej. "Pendiente", "Completado").
2. Usuario marca "Completado" → el checkbox se llena de morado ✓.
3. Usuario cierra el dropdown (clic fuera o en "ACTUALIZAR") → el dropdown ahora muestra badge morado **(1)** y aparece 1 chip debajo: `Completado ✕`.
4. La tabla se filtra automáticamente mostrando solo vehículos con Estado CO = "Completado".
5. Usuario reabre el dropdown y marca "Pendiente" también → cierra → ahora badge **(2)** y 2 chips: `Completado ✕` · `Pendiente ✕`.
6. La tabla muestra vehículos con Estado CO = "Completado" **O** "Pendiente" (operador **OR** dentro del mismo filtro).
7. Usuario hace clic en la "✕" del chip "Completado" → ese chip desaparece, badge cambia a **(1)**, tabla se actualiza mostrando solo "Pendiente".
8. Usuario hace clic en "LIMPIAR FILTROS" → **todos** los chips de **todos** los filtros desaparecen, badges numéricos desaparecen, tabla muestra todos los registros sin filtrar.

**Comportamiento al combinar múltiples filtros:**
- **Ejemplo:** Usuario aplica "Estado CO = Completado" (1 chip) + "Marca = Infiniti, Kia" (2 chips).
- La tabla muestra vehículos que cumplan **ambas condiciones a la vez** (AND):
  - Estado CO = Completado **Y**
  - (Marca = Infiniti **O** Marca = Kia)
- Dentro de cada filtro el operador es **OR**, entre filtros distintos el operador es **AND**.

**Diferencias con el buscador multi-VIN:**
- **Búsqueda por VIN:** usa un input de texto expandible con textarea; cada línea escrita es un chip; tiene validación de formato 17 caracteres alfanuméricos; muestra contadores "Total {n}" (verde), "Válidos {n}" (verde), "Inválidos {n}" (rojo); los chips válidos son verdes, los inválidos son rojos.
- **Filtros de estado/marca:** usan dropdowns con checkboxes; cada opción seleccionada del catálogo es un chip; sin validación (todas las opciones vienen de BD); muestra solo contador total "(N)" en el badge del dropdown; todos los chips son morados (no hay inválidos).

**Estados:**
- Vacío (sin badge numérico, sin chips).
- Con 1 selección (badge morado "(1)", 1 chip).
- Con múltiples selecciones (badge "(2)" o "(3)", varios chips en fila horizontal).
- Dropdown abierto mostrando buscador + checkboxes (algunos marcados ✓).
- Combinación de múltiples filtros activos (varios dropdowns con badges y chips simultáneos).

**Screenshot:** 
![us11369-filtros-vacio](screenshots/us11369-filtros-vacio.png) — pantalla inicial sin filtros aplicados
![us11369-busqueda-vin-autocompletado](screenshots/us11369-busqueda-vin-autocompletado.png) — búsqueda por VIN con dropdown de sugerencias
![us11369-busqueda-vin-chips](screenshots/us11369-busqueda-vin-chips.png) — VINs seleccionados con chips y contadores (Verde: 9 Válidos, Rojo: 2 Inválidos, Total: 11)
![us11369-busqueda-vin-textarea](screenshots/us11369-busqueda-vin-textarea.png) — textarea para pegar múltiples VINs (uno por línea)
![us11369-filtros-vin-aplicados-tabla](screenshots/us11369-filtros-vin-aplicados-tabla.png) — tabla filtrada mostrando solo los 11 VINs seleccionados
![us11369-estado-co-dropdown-abierto](screenshots/us11369-estado-co-dropdown-abierto.png) — dropdown "Estado CO" expandido con checkboxes "Pendiente" y "Completado"
![us11369-multiples-filtros-activos](screenshots/us11369-multiples-filtros-activos.png) — Estado CO (badge "1" + chip "Completado") + Marca (badge "3" + chips "Infiniti", "Kia", "+1 más")
![us11369-vista-completa-sidebar-filtros](screenshots/us11369-vista-completa-sidebar-filtros.png) — vista completa: sidebar izquierdo + tabla con múltiples filtros aplicados

**Notas para TCs:**
- **US-11369:** este comportamiento multi-valor con chips se aplica a los filtros "Estado CO", "Estado CPA", "Estado de Factura" y "Marca" — **antes solo eran dropdowns simples de selección única**; ahora permiten seleccionar **múltiples valores** del catálogo mediante checkboxes.
- El badge numérico **(N)** es **dinámico** — se actualiza automáticamente al agregar/remover chips; cuando no hay selección el badge **desaparece** (no muestra "(0)").
- Los chips son **removibles individualmente** (clic en "✕" de cada chip) o **todos a la vez** (botón "LIMPIAR FILTROS").
- **Operador de filtro:** dentro del mismo filtro es **OR** (si selecciono "Completado" y "Pendiente" en Estado CO, la tabla muestra vehículos con **cualquiera** de esos estados); entre filtros distintos es **AND** (si aplico Estado CO + Marca, la tabla muestra vehículos que cumplan **ambos** filtros a la vez).
- **Búsqueda por VIN** también soporta multi-valor con chips, pero usa un input de texto con validación en lugar de checkboxes — ver comportamiento detallado en la tabla de la sección "Buscador" más arriba.
- **Antes de la US 11369:** los filtros eran dropdowns simples de un solo valor — si el usuario quería ver vehículos con Estado CO "Pendiente" **y** "Completado" a la vez, tenía que hacerlo en 2 consultas separadas; ahora puede hacerlo en 1 sola consulta seleccionando ambos valores.

---

**Componente: Selector de rango de fechas** (filtro "Fecha" en grid de Vehículos Importados)

**Cómo se llega aquí:** clic en el botón "Seleccionar fecha" (ícono calendario) en el header del grid de "Vehículos Importados" (junto a "Todas las Localidades", estrella de favoritos, etc.).

| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| **Modal calendario** | modal flotante | fondo blanco con sombra | se posiciona junto al botón "Seleccionar fecha"; cierra al hacer clic fuera o en "Cancelar"/"OK" |
| Header del modal | título dinámico | ej. "Jun 2026" (con navegación ‹ ›) | actualiza según el mes/año navegado |
| Navegación | flechas | "‹" / "›" (mes anterior/siguiente) · "«" / "»" (año anterior/siguiente, solo modo Mes) | color morado al hacer hover |
| **Tabs de modo** | tabs horizontales | "Rango" / "Mes" / "Semana" / "Día" | el tab activo se muestra en texto morado |

**Modo "Rango" (activo por defecto):**
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Calendarios duales | 2 calendarios lado a lado | ej. "Jun 2026" (izq.) y "Jul 2026" (der.) | permite seleccionar un rango de fechas entre ambos meses |
| Días de la semana | labels | "DOM" / "LUN" / "MAR" / "MIÉ" / "JUE" / "VIE" / "SÁB" | color gris claro, mayúsculas |
| Día actual | celda resaltada | ej. "26" con círculo morado | se marca automáticamente el día de hoy |
| Selección de rango | celdas resaltadas | días entre la fecha inicial y final con fondo morado claro | al hacer clic en un día inicial y luego en un día final, todos los días intermedios se resaltan |
| Botón "Cancelar" | botón secundario gris | "Cancelar" | cierra el modal sin aplicar el filtro |
| Botón "OK" | botón primario morado | "OK" | aplica el rango seleccionado y cierra el modal; el botón "Seleccionar fecha" en el grid muestra el rango (ej. "1 Jun – 15 Jun") |

**Modo "Mes":**
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Grid de meses | grid 4x3 | "Ene" / "Feb" / "Mar" / "Abr" / "May" / "Jun" / "Jul" / "Ago" / "Sep" / "Oct" / "Nov" / "Dic" | cada mes es un botón; el mes actual o seleccionado se resalta en morado |
| Navegación de año | flechas "«" / "»" | — | cambia entre años (ej. 2025 ← 2026 → 2027) |
| Selección de mes | celda morada | ej. "Jun" con fondo morado | al hacer clic en un mes, se selecciona ese mes completo (del 1 al último día del mes) |
| Botones "Cancelar" / "OK" | igual que Rango | — | — |

**Modo "Semana":**
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Calendario individual | calendario de un solo mes | ej. "Jun 2026" | muestra un mes completo |
| Selección de semana | 7 celdas resaltadas | ej. días 21-27 con fondo morado | al hacer clic en un día, se selecciona la **semana completa** que contiene ese día (domingo a sábado) |
| Días de la semana | encabezado calendario | "DOM" / "LUN" / "MAR" / "MIÉ" / "JUE" / "VIE" / "SÁB" | — |
| Botones "Cancelar" / "OK" | igual que Rango | — | — |

**Modo "Día":**
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Calendario individual | calendario de un solo mes | ej. "Jun 2026" | muestra un mes completo |
| Selección de día | 1 celda resaltada | ej. día "26" con fondo morado | al hacer clic en un día, se selecciona **solo ese día** |
| Botones "Cancelar" / "OK" | igual que Rango | — | — |

**Estados:**
- Sin selección (modal abierto, modo Rango por defecto, día actual marcado con círculo pero sin rango aplicado).
- Con rango seleccionado (modo Rango, días resaltados).
- Con mes seleccionado (modo Mes, mes resaltado).
- Con semana seleccionada (modo Semana, 7 días resaltados).
- Con día seleccionado (modo Día, 1 día resaltado).

**Screenshot:** ![selector-fecha-range](screenshots/selector-fecha-range.png) · ![selector-fecha-month](screenshots/selector-fecha-month.png) · ![selector-fecha-week](screenshots/selector-fecha-week.png) · ![selector-fecha-day](screenshots/selector-fecha-day.png)

**Notas para TCs:**
- **Modo por defecto:** al abrir el selector, siempre abre en modo "Rango" con el día actual marcado (círculo morado).
- **Rango personalizado:** en modo Rango, se puede seleccionar desde una fecha en un mes hasta una fecha en el mes siguiente (span multi-mes).
- **Semana (Semana):** la semana siempre va de **domingo a sábado** (7 días completos) — si hago clic en un jueves, se seleccionan desde el domingo anterior hasta el sábado siguiente.
- **Botón "Seleccionar fecha" en el grid:** tras aplicar un filtro, el botón muestra el rango seleccionado en formato corto (ej. "1 Jun – 15 Jun" / "May 2026" / "Semana 21-27 Jun" / "25 Jun") — **debe mostrar la selección activa**, no solo el ícono de calendario.

---

## Motorambar > Vehículos Importados > Detalle de vehículo (solo lectura)
- **Ruta/URL:** `/vehicle/[id]` (modo lectura)
- **Cómo se llega aquí:** ícono "ojo" (ver) en la columna ACCIONES de una fila del grid "Vehículos Importados".
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Flecha volver | ícono | "←" | regresa al grid |
  | Título | texto | "Nro. {VIN}" | ej. "Nro. 5XYRL4JC9TG442904" |
  | Subtítulo | texto | "{MARCA} {MODELO} {AÑO}" | ej. "KIA SORENTO 2026" |
  | Botón | outline rojo | "Eliminar" | ícono basura |
  | Botón | outline morado | "Editar" | ícono lápiz; navega a modo edición |
  | Sección "DETALLES" | fieldset | VIN `CO`, MARCA `CO`, MODELO, AÑO `CO`, CLIENTE ASIGNADO | campos de solo lectura; badge `CO` = el dato proviene/está validado contra el Certificado de Origen |
  | Sección "ESPECIFICACIONES TÉCNICAS" | fieldset | COLOR AUTO, PUERTAS, CILINDROS `CO`, CABALLOS DE FUERZA `CO`, TIPO DE PROPULSIÓN, PESO DE VEHÍCULO `CO`, CAPACIDAD DE CARGA `CO`, UNIDAD DE VEHÍCULO, SERIE O MODELO `CO` | — |
  | Sección "REGULATORIO Y ORIGEN" | fieldset | CÓDIGO DE ORIGEN, TIPO DE CARROCERÍA `CO`, NO. TÍTULO, FECHA TÍTULO `CO` | — |
  | Sección "FINANCIERO" | fieldset | PRECIO CONTRIBUTIVO, ARBITRIOS, FECHA DE PAGO DE ARBITRIOS, NRO. DECLARACIÓN DE ARBITRIOS, CPA ID, ID CONTRIBUYENTE, NRO. FACTURA `CO`, CONCESIONARIO `CO`, NRO. DE LICENCIA, ID CLIENTE, NRO. DE ORDEN DE VENTA, NRO. CARTA DE CRÉDITO, INSTITUCIÓN FINANCIERA | — |
  | Sección "CERTIFICADO DE ORIGEN" | card + badge estado | badge "COMPLETADO" (verde); campos CÓDIGO ORIGEN, NO. TITULO, TIPO DE CUERPO, FECHA TITULO; botones "DESCARGAR" / "PREVISUALIZAR" | panel derecho "HISTORIAL DE SEGUIMIENTO" con eventos "CO Generado" / "CO Reemplazado" (fecha + nombre de archivo PDF) |
  | Sección "CERTIFICADO DE PAGO DE ARBITRIOS (CPA)" ⚠️ | card + badge estado | ⚠️ UI puede mostrar label antiguo "CONTRATO DE COMPRA (CPA)" — término correcto: "CERTIFICADO DE PAGO DE ARBITRIOS (CPA)". Badge "SUBIDO" (verde); campos PRECIO VENTA, IMPUESTO VENTA, FECHA IMPUESTO, DECLARACIÓN ARB, ID CPA, RNC CONTRIBUYENTE; botones "DESCARGAR" / "PREVISUALIZAR" | panel derecho "HISTORIAL DE SEGUIMIENTO" con evento "CPA Importado" (fecha + nombre de archivo PDF) |
  | Sección "DETALLES DE FACTURACIÓN" | card + badge estado | badge "PENDIENTE" (naranja); estado vacío: ícono subir, "FACTURA FALTANTE" / "No hay factura disponible para este registro." | panel derecho "SEGUIMIENTO FINANCIERO" → "SINCRONIZACIÓN FINANCIERA ACTIVA" / "CONECTADO A {institución financiera}" |
  | Sección "DOCUMENTOS ADICIONALES" | card | (vacío en captura) | — |
- **Estados:** con datos, todas las secciones con badge de estado (COMPLETADO/SUBIDO/PENDIENTE). Vacío total no documentado.
- **Screenshot:** ![vehiculo-detalle-readonly](screenshots/vehiculo-detalle-readonly.png) · ![vehiculo-detalle-readonly-scroll-medio](screenshots/vehiculo-detalle-readonly-scroll-medio.png) · ![vehiculo-detalle-readonly-scroll-abajo](screenshots/vehiculo-detalle-readonly-scroll-abajo.png)
- **Notas para TCs:**
  - El badge `CO` junto a un campo indica que el valor proviene del Certificado de Origen — útil para TCs que validan precarga de datos desde CO.
---

## Motorambar > Vehículos Importados > Editar vehículo
- **Ruta/URL:** `/vehicle/[id]` (modo edición)
- **Cómo se llega aquí:** botón "Editar" en el detalle de vehículo, o "Editar Vehículo" desde el menú "..." de una fila del grid.
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | texto | "Editar Vehiculo: {VIN}" | — |
  | Subtítulo | texto | "{MARCA} {MODELO} {AÑO}" | — |
  | Botón | outline | "Cancelar" | ícono "X"; descarta cambios |
  | Botón | outline morado | "Asignar Cliente" | ícono persona+; abre modal "Asignar Cliente" |
  | Botón | primario morado | "Guardar Cambios" | ícono disco; persiste cambios |
  | Banner cambios sin guardar | alert amarillo | "Cambios sin guardar" / "Has modificado {n} campo(s). No olvides guardar tus cambios." | lista chips con el nombre de cada campo modificado (ej. "PUERTAS") |
  | Campos editables | input/select | mismas secciones "DETALLES", "ESPECIFICACIONES TÉCNICAS", "REGULATORIO Y ORIGEN" que en modo lectura | MARCA, MODELO, COLOR AUTO y TIPO DE PROPULSIÓN son `<select>`; campos numéricos (ej. PUERTAS) tienen spinner +/- |
  | Campo modificado | input resaltado | borde naranja + punto naranja | indica que ese campo difiere del valor original |
  | Sección "CERTIFICADO DE ORIGEN" / "CERTIFICADO DE PAGO DE ARBITRIOS (CPA)" ⚠️ | card | ⚠️ UI puede mostrar label antiguo "CONTRATO DE COMPRA (CPA)". Igual que en solo lectura + botón adicional "REEMPLAZO" (ícono subir) | permite reemplazar el archivo del documento |
  | Sección "DETALLES DE FACTURACIÓN" | card | estado vacío "FACTURA FALTANTE" + botón "IMPORTAR FACTURA" (morado, ícono subir) | botón solo visible en modo edición |
  | Sección "DOCUMENTOS ADICIONALES" | card | link "+ AGREGAR DOCUMENTO" (arriba a la derecha) + dropzone "SUBIR NUEVO" | abre modal "Añadir Documento" |
- **Estados:** sin cambios / con campo(s) modificado(s) (banner amarillo + chip por campo).
- **Screenshot:** ![vehiculo-editar](screenshots/vehiculo-editar.png) · ![vehiculo-editar-scroll-medio](screenshots/vehiculo-editar-scroll-medio.png) · ![vehiculo-editar-scroll-abajo](screenshots/vehiculo-editar-scroll-abajo.png)
- **Notas para TCs:** el banner "Cambios sin guardar" + el chip con el nombre del campo es la evidencia principal para TCs de edición — capturar screenshot de este banner como evidencia del campo modificado.

### Componente asociado: Modal "Añadir Documento"
- **Cómo se llega aquí:** "+ AGREGAR DOCUMENTO" en "Documentos Adicionales" (modo edición), o "Agregar documento adicional" desde el menú "..." de una fila del grid.
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | texto | "Añadir Documento" | — |
  | Chip vehículo | info | "{VIN}" / "{Marca} {Modelo} {Año}" | ej. "JN8BT3BA1TW330333" / "Nissan ROGUE 2025" |
  | Label | texto | "CATEGORÍA DE DOCUMENTO *" | obligatorio |
  | Dropdown | select | "Seleccione una categoría..." | opciones: "Carta Explicativa Exento de Arbitrios", "Certificado de Pago de Arbitrios", "Factura", "Otro" |
  | Label | texto | "ARCHIVO *" | obligatorio |
  | Dropzone | input file | "Arrastre un archivo aquí o **seleccione uno**" / "Solo archivos PDF permitidos" | al seleccionar, muestra chip con nombre de archivo + ícono "X" para quitar |
  | Botón | secundario | "CANCELAR" | — |
  | Botón | primario morado | "AÑADIR DOCUMENTO" | deshabilitado (gris claro) hasta que categoría + archivo estén completos; habilitado (morado sólido) al completarse |
- **Estados:** vacío (sin categoría ni archivo) / con categoría seleccionada (dropdown abierto) / con archivo adjunto (botón habilitado).
- **Screenshot:** ![vehiculo-anadir-documento](screenshots/vehiculo-anadir-documento.png) · ![vehiculo-anadir-documento-categorias](screenshots/vehiculo-anadir-documento-categorias.png) · ![vehiculo-anadir-documento-seleccionado](screenshots/vehiculo-anadir-documento-seleccionado.png)
- **Notas para TCs:** la categoría "Certificado de Pago de Arbitrios" es el documento "CPA" — confirma la terminología usada en `/import/cpa`.
---

## Motorambar > Configuración de Usuario > Dark Mode (Tema Oscuro) — **US 12168**

**Cómo se activa/desactiva:** Menú desplegable del perfil del usuario (esquina superior derecha, clic en nombre/foto de perfil) → opción "Tema Oscuro" o "Tema Claro".

**Descripción general:**
- **Modo Claro (por defecto):** Fondos blancos o gris muy claro, texto oscuro sobre fondos claros.
- **Modo Oscuro:** Fondos oscuros (gris oscuro/negro), texto claro (blanco o gris claro) sobre fondos oscuros.
- La preferencia se aplica inmediatamente (cambio suave) a toda la interfaz: Dashboard, grid de vehículos, detalle de vehículo, modales, sidebar, header, formularios, etc.
- La preferencia se persiste — si el usuario cierra sesión y vuelve a entrar, el tema se mantiene.

**Evidencia visual de Dark Mode activo:**
- Header y sidebar con fondo oscuro
- Cards y secciones de contenido con fondo gris oscuro
- Texto de labels y campos en color claro (blanco/gris claro)
- Bordes de inputs y cards más suaves (gris medio)
- Badges y botones adaptan sus colores para mantener contraste

**Screenshot de referencia:**  
![dark-mode-vehiculo-financiero](screenshots/dark-mode-vehiculo-financiero.png) — Detalle de vehículo, sección "FINANCIERO" con Dark Mode activado. Muestra los campos "CONCESIONARIO" (VICTOR PEREZ ZAPATA INC, badge CO) e "INSTITUCIÓN FINANCIERA" (POPULAR AUTO) con fondo oscuro y texto claro.

**Notas para TCs:**
- Verificar que el cambio de tema afecta **todas** las pantallas del portal (no solo algunas).
- El toggle del tema debe mostrar el label correcto según el modo activo:  
  - Si está en Modo Claro → muestra "Tema Oscuro"  
  - Si está en Modo Oscuro → muestra "Tema Claro"
- Verificar persistencia: cerrar sesión → volver a entrar → el tema se mantiene.
---

## Motorambar > Import > Importar CPA
- **Ruta/URL:** `/import/cpa`
- **Cómo se llega aquí:** **sidebar > "Importar CPA"** (opción independiente del menú lateral). *(Antes de US 11366: botón "Acciones" → "Importar CPA" desde `/import`)*
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Link volver | link | "← VOLVER A IMPORTADOS" | regresa a `/import` |
  | Stepper | stepper (3 pasos) | "SUBIR ARCHIVO" → "PROCESANDO VINS" → "RESUMEN" | paso 1 activo (morado) al entrar |
  | Título card | texto | "Importar CPA" | — |
  | Descripción | texto | "Sube el PDF de batch de Certificados de Pago de Arbitrios para procesamiento automático." | define el término "CPA" |
  | Dropzone | input file | "Arrastra y suelta tu PDF aquí" / "o **haz clic para seleccionar**" | — |
  | Botón | primario morado (claro/deshabilitado) | "Vincular VINs" | habilita tras subir un PDF |
- **Validación paso 1 (regla de negocio):** el PDF debe ser un **batch de múltiples páginas/VINs**. Si se sube un PDF de **una sola página**, el sistema muestra un mensaje de error indicando que para vehículos individuales se debe usar el grid de "Vehículos Importados" en lugar de este flujo. Si el PDF es válido (multi-página), avanza al paso 2.
- **Screenshot paso 1:** ![cpa-paso1-subir-archivo](screenshots/cpa-paso1-subir-archivo.png) · ![cpa-paso1-archivo-seleccionado](screenshots/cpa-paso1-archivo-seleccionado.png)

### Paso 2 "PROCESANDO VINS" — Vinculación en tiempo real
- **Título:** "Vinculando VINs"
- **Subtítulo archivo:** nombre del PDF subido (ej. "CPAINFINITI.pdf")
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Progress bar | barra morada animada | porcentaje dinámico (ej. "0%", "67%") | actualiza en tiempo real por polling |
  | Mensaje principal | texto | "Procesando archivo..." | — |
  | Mensaje secundario | texto | "Estamos vinculando los VIN's." | — |
  | Nota | texto gris con ícono morado | "Esto puede tomar unos minutos." | — |
  | Card resumen | card con ícono check verde | "0 COMPLETADOS" (dinámico) | actualiza en tiempo real |
  | Card resumen | card con ícono alerta naranja | "0 PENDIENTES" (dinámico) | actualiza en tiempo real |
  | Card resumen | card con ícono X rojo | "0 ERRORES" (dinámico) | actualiza en tiempo real |
  | Buscador | input texto con lupa | placeholder: "Buscar VIN, N.º CPA..." | filtro en tiempo real de la tabla |
  | Filtro estado | dropdown | "Todos los esta..." (texto truncado) | despliega estados: Completado, Pendiente (probablemente) |
  | Tabla | grid | columnas: ESTADO / NO. VIN / NO. CPA / RNC CONTRIBUYENTE / CERTIFICACIÓN | se va poblando dinámicamente conforme avanza el procesamiento |
  | Columna ESTADO | badge verde/naranja | "COMPLETADO" (verde) / "PENDIENTE" (naranja) | actualiza en tiempo real |
- **Comportamiento:** polling automático cada X segundos hasta que todos los VINs sean procesados. Al completarse (100%), el stepper avanza automáticamente al paso 3 "RESUMEN".
- **Screenshot paso 2:** ![cpa-paso2-procesando-vins](screenshots/cpa-paso2-procesando-vins.png)

### Paso 3 "RESUMEN" — Resultado del procesamiento
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Banner resultado | card amarillo (con advertencias) o verde (éxito total) | "Proceso completado con advertencias" + "2 de 3 VINs vinculados correctamente." | solo aparece si hay advertencias (VINs no vinculados) o errores |
  | Card resumen | card con ícono documento morado | "3 VINS DETECTADOS" | total de páginas/VINs en el PDF |
  | Card resumen | card con ícono check verde | "2 VINCULADOS" | VINs procesados correctamente |
  | Card resumen | card con ícono X rojo | "0 ERRORES" | VINs con fallo OCR |
  | Card resumen | card con ícono alerta naranja | "1 NO VINCULADOS" | VINs detectados pero no asociados a vehículos en BD |
  | Tabs | nav tabs horizontales | "Completados (2)" / "Fallidos (0)" / "No vinculados (1)" | contador dinámico entre paréntesis |
  | Buscador | input texto con lupa | placeholder: "Buscar VIN, N.º CPA..." | filtro de la tabla |
  | Filtro estado | dropdown | "Todos los esta..." | despliega estados disponibles |
  | Tabla | grid | columnas: ESTADO / NO. VIN / NO. CPA / RNC CONTRIBUYENTE / CERTIFICACIÓN | misma estructura del paso 2, pero sin actualizaciones dinámicas |
  | Columna ESTADO | badge | "COMPLETADO" (verde) / "NO VINCULADO" (naranja) | — |
  | Botón secundario | outline morado | "Importar otro" | regresa al paso 1 (nueva importación) |
  | Botón primario | primario morado | "Finalizar" | cierra el flujo y regresa a "Historial de CPA" |
- **Screenshot paso 3:** ![cpa-paso3-resumen](screenshots/cpa-paso3-resumen.png)
- **Estados:** con advertencias (banner amarillo + contadores con valores > 0 en "No vinculados" o "Errores") / éxito total (banner verde, todos los VINs vinculados correctamente).
- **Notas para TCs:**
  - "CPA" = Certificados de Pago de Arbitrios (definición oficial dada en esta pantalla).
  - El comportamiento de validación (1 página → error / multi-página → avanza) fue confirmado por el usuario.
  - Los 3 pasos del flujo están completamente documentados con sus labels y elementos UI exactos.
  - **US 11366:** Acceso a esta pantalla cambió. Antes: grid `/import` > botón "Acciones" > "Importar CPA". Ahora: sidebar > "Importar CPA" (opción directa).

**Estados de CPA (referencia oficial — aplica en Historial de CPA y paso 2 "PROCESANDO VINS"):**

| Status (código) | English | Español | Descripción |
|---|---|---|---|
| `Received` | Received | Recibido | Archivo recibido, esperando inicio del procesamiento |
| `Processing` | Processing | Procesando | Split del PDF en curso |
| `Split` | Split | Dividido | PDF dividido en páginas individuales, listo para encolar |
| `OcrPending` | OCR Pending | OCR Pendiente | Páginas encoladas en Service Bus, OCR en progreso |
| `Processed` | Completed | Completado | Todas las páginas procesadas correctamente por OCR |
| `ProcessedWithErrors` | Completed with errors | Completado con errores | Procesamiento finalizado pero al menos una página falló OCR |
| `Invalid` | Critical error | Error crítico | Archivo inválido detectado en el split (ej. menos de 2 páginas) |
| `Error` | Critical error | Error crítico | Fallo técnico no recuperable (API OCR caída, error de red, etc.) |
| `Cancelled` | Cancelled | Cancelado | Cancelado manualmente por el usuario antes de finalizar |

---

## Motorambar > Import > Historial de CPA
- **Ruta/URL:** `/import/cpa/history` _(pendiente confirmar)_
- **Cómo se llega aquí:** **sidebar > "Importar CPA" > "Historial de CPA"** (submenu). *(Ruta exacta de navegación pendiente confirmar — puede ser opción en sidebar o dentro de `/import/cpa`)*
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | texto (con ícono reloj circular morado) | "Historial de CPA" | — |
  | Subtítulo | texto gris | "Listado de todos los CPA procesados por tu organización." | — |
  | Botón | primario morado (esquina superior derecha, con ícono upload) | "Importar CPA" | navega a `/import/cpa` (paso 1 "SUBIR ARCHIVO") |
  | Campo búsqueda | input texto con ícono lupa | placeholder: "Buscar por archivo, usuario o VIN..." | búsqueda en tiempo real por nombre de archivo, usuario que subió el PDF o VIN contenido en el procesamiento |
  | Filtro estado | dropdown | "Todos los estados" | despliega lista con las opciones de estados de la tabla oficial (Recibido, Procesando, Dividido, OCR Pendiente, Completado, Completado con errores, Error crítico, Cancelado) |
  | Tabla | grid | columnas: ARCHIVO / FECHA / USUARIO / PÁGINAS / ERRORES / ESTADO | — |
  | Columna ARCHIVO | texto con ícono documento | nombre del archivo PDF (ej. "CPANINFINITI.pdf", "CPA 5 vins.pdf") | — |
  | Columna FECHA | texto | formato "DD mmm AAAA, HH:MM" (ej. "30 jun 2026, 17:14") | zona horaria UTC-4 |
  | Columna USUARIO | texto | nombre del distribuidor (ej. "Jhon Distribuidor", "Adrian Test Cliente", "stribuidor") | quien subió el archivo |
  | Columna PÁGINAS | texto | formato "N/M" (ej. "3/3", "0/3", "0/5") | páginas procesadas exitosamente / total de páginas del PDF |
  | Columna ERRORES | badge con número o "—" | ej. "1" (rojo), "2" (rojo), "—" (si cero errores) | cantidad de páginas con fallo OCR; "—" indica cero errores |
  | Columna ESTADO | badge de color | ej. "Completado con errores" (amarillo), "Cancelado" (gris), "Dividido" (azul) | ver tabla de estados oficial arriba |
- **Estados:** con datos (historial con múltiples importaciones CPA) / vacío (sin importaciones previas — no documentado).
- **Screenshot:** ![historial-cpa](screenshots/historial-cpa.png) · ![estados-cpa-referencia](screenshots/estados-cpa-referencia.png)
- **Notas para TCs:**
  - **US 11962:** esta pantalla implementa filtrado por estado + búsqueda combinada. Los filtros NO deben perderse al buscar (criterio de la US).
  - El campo de búsqueda es multi-criterio: busca en **nombre de archivo**, **usuario** y **VIN** simultáneamente (no requiere seleccionar qué campo buscar).
  - La columna PÁGINAS muestra el progreso del OCR: "0/5" = ninguna página procesada aún (estados iniciales: Recibido, Procesando, Dividido, OCR Pendiente), "3/3" = todas procesadas (estados finales: Completado, Completado con errores).
  - La columna ERRORES muestra un badge numérico solo si hubo fallos OCR; si todas las páginas procesaron OK, muestra "—" (guion).
  - **Al hacer clic en una fila del historial**, se abre el modal "Detalle del lote CPA" (ver sección abajo).

### Modal "Detalle del lote CPA" — Exportación mejorada de certificados (US 11964)
- **Cómo se abre:** clic en cualquier fila de la tabla de "Historial de CPA".
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | texto | "Detalle del lote CPA" | — |
  | Subtítulo | texto gris | nombre del archivo PDF (ej. "CPAINFINITI.pdf", "CPA-5VALID-3INVALID.pdf") | — |
  | Badge estado | badge color según estado | ej. "Completado con errores" (amarillo) / "Completado" (verde) | ver tabla de estados oficial arriba |
  | Usuario y fecha | texto gris | "Jhon Distribuidor · 02 jul 2026, 19:14" | quien subió + fecha |
  | Progress bar | barra morada | "3 de 3 páginas procesadas" / "8 de 8 páginas procesadas" | resumen del procesamiento |
  | Tabs | nav tabs horizontales | "Completados (2)" / "Fallidos (0)" / "No vinculados (1)" | contador dinámico entre paréntesis — **tab activo define el botón de descarga** |
  | **Botón descarga dinámico** | outline morado (esquina superior derecha) | **"Descargar Completados"** / **"Descargar No vinculados"** / **"Descargar Fallidos"** | **texto cambia según el tab activo** — descarga un ZIP solo con los PDFs de ese tab |
  | Botón cerrar | ícono X | — | cierra el modal |
  | Tabla | grid | columnas: PÁGINA / VIN / NRO. CPA / FECHA CERT. / ACCIONES | — |
  | Columna PÁGINA | número | ej. "1", "2", "3" | número de página del PDF original |
  | Columna VIN | texto (con ícono lápiz en tab "No vinculados") | ej. "5N1AC0FX7VC600743", "JN8AZ3BDXT921007" | en tab "No vinculados" tiene ícono lápiz para corregir VIN |
  | Columna NRO. CPA | texto | ej. "L0399405856" | número del certificado |
  | Columna FECHA CERT. | texto | formato "DD-mmm-AAAA" (ej. "15-jun-2026") | fecha de emisión del certificado |
  | Columna ACCIONES | botones | botón "PREVISUALIZAR" (outline morado) | abre el PDF individual en nueva ventana/modal |
  | Link adicional (solo tab "No vinculados") | link naranja | "Re-asociar" | abre modal "Corregir VIN" |
- **Comportamiento del botón dinámico:**
  - Tab "Completados" activo → botón muestra **"Descargar Completados"** → descarga ZIP solo con PDFs vinculados correctamente
  - Tab "No vinculados" activo → botón muestra **"Descargar No vinculados"** → descarga ZIP solo con PDFs no asociados a vehículos
  - Tab "Fallidos" activo → botón muestra **"Descargar Fallidos"** → descarga ZIP solo con PDFs con error OCR
- **Nomenclatura de archivos en el ZIP descargado (US 11964):** cada PDF individual se nombra con el formato **{VIN}_{NumeroPagina}.pdf** (ej. `5N1AC0FX7VC600743_001.pdf`, `5N1AC0FX9VC602090_002.pdf`).
- **Screenshot:** ![historial-cpa-modal-detalle-completados](screenshots/historial-cpa-modal-detalle-completados.png) · ![historial-cpa-modal-detalle-no-vinculados](screenshots/historial-cpa-modal-detalle-no-vinculados.png) · ![historial-cpa-modal-detalle-todo-ok](screenshots/historial-cpa-modal-detalle-todo-ok.png)

### Modal "Corregir VIN" (dentro del modal "Detalle del lote CPA")
- **Cómo se abre:** clic en el ícono lápiz junto al VIN en el tab "No vinculados", o clic en el link "Re-asociar".
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | texto | "Corregir VIN" | — |
  | Label campo | texto | "Nuevo VIN" | — |
  | Input | campo texto | placeholder: — | campo editable con el VIN incorrecto pre-cargado (ej. "JN8AZ3BDXT921007") |
  | Botón secundario | outline morado | "Cancelar" | cierra el modal |
  | Botón primario | primario morado | "Guardar VIN" | guarda el VIN corregido y re-procesa la asociación |
- **Screenshot:** ![modal-corregir-vin](screenshots/modal-corregir-vin.png)
---

## Motorambar > Componentes Globales > Header (autenticado)
- **Ruta/URL:** presente en todas las rutas autenticadas (sidebar + topbar).
- **Cómo se llega aquí:** siempre visible tras login.
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Ícono notificaciones | botón (campana + badge) | — | abre dropdown "NOTIFICACIONES" |
  | Ícono ayuda | botón | "?" | — |
  | Perfil | botón/dropdown | nombre usuario + badge rol + chevron | abre menú de perfil |
- **Estados:** —
- **Screenshot:** ver componentes asociados abajo.

### Componente: Dropdown "NOTIFICACIONES"
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Header | texto | "NOTIFICACIONES" | — |
| Acción global | link morado | "Marcar todas" | + badge contador (ej. "40") |
| Item | notificación | "Factura procesada" (título morado) + hora (ej. "18:07") | descripción: "La factura {número} fue procesada el {fecha}" |
| Acción item | link | "Ver detalle" (ícono enlace externo) | — |
| Acción item | link | "Marcar leída" (ícono check) | — |
| Acción item | ícono rojo | basura | elimina la notificación |

Screenshot: ![header-notificaciones](screenshots/header-notificaciones.png)

### Componente: Dropdown de perfil
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Nombre | texto | "{Nombre Apellido}" (ej. "distri distri") | — |
| Username | texto gris | ej. "distri2" | — |
| Rol + empresa | info | ícono edificio + rol (ej. "DISTRIBUIDOR") + nombre empresa (ej. "Motorambar") | — |
| Opción | item | "Cambiar a Inglés" (ícono traducir) | toggle de idioma ES/EN |
| Opción | item rojo | "Cerrar sesión" (ícono logout) | cierra sesión |

Screenshot: ![header-perfil](screenshots/header-perfil.png)

### Componente: Modal "Tu sesión está por cerrar" (timeout por inactividad)
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Ícono | reloj naranja | — | — |
| Título | texto | "Tu sesión está por cerrar" | — |
| Cuerpo | texto | "Has estado inactivo. Tu sesión se cerrará en:" | seguido de contador en segundos (ej. "51s", naranja, grande) |
| Botón | secundario | "CANCELAR" | — |
| Botón | primario naranja | "CONTINUAR" | extiende la sesión |
| Cerrar | ícono "X" | — | — |

Screenshot: ![header-sesion-inactividad](screenshots/header-sesion-inactividad.png)

**Notas para TCs:** el contador regresivo es dinámico — para TCs de este modal, validar la presencia del modal y los botones, no un valor exacto de segundos.
---

## Motorambar > Administración > Reglas de Completitud
- **Ruta/URL:** _(pendiente confirmar — sección "Administración", accesible desde dropdown superior)_
- **Cómo se llega aquí:** hacer clic en el dropdown "Administración" (parte superior de la pantalla) → seleccionar "Reglas de Completitud" de la lista desplegable.
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | texto | "Administración" | — |
  | Dropdown sección | dropdown | "Reglas de Completitud" | muestra la opción activa; al hacer clic despliega todas las secciones de Administración (ver lista completa abajo) |
  | Descripción | texto | "Define qué documentos deben estar asociados a un vehículo para que se considere completo, por tenant." | — |
  | Botón | primario morado (esquina superior derecha) | "+ NUEVA REGLA" | abre el modal "Nueva Regla de Completitud" |
  | Tabla | grid | columnas: TENANT / ESTADO / CO / CPA / FACTURA / AGRUPAR CL# / FECHA / ACCIONES | cada fila representa una regla de completitud por tenant |
  | Columna TENANT | texto | ej. "Mitsubishi", "Motorambar", "PDV" | nombre del tenant al que aplica la regla |
  | Columna ESTADO | badge | "Activo" (verde) / "Inactivo" (gris con ícono prohibido) | indica si la regla está activa o no |
  | Columna CO | badge verde con check | "✓ CO" | indica que el documento CO (Certificado de Origen) es requerido para este tenant |
  | Columna CPA | badge verde con check | "✓ CPA" | indica que el documento CPA (Carta Porte de Aduana) es requerido |
  | Columna FACTURA | badge verde con check | "✓ Factura" | indica que el documento Factura es requerido |
  | Columna AGRUPAR CL# | badge verde con check | "✓ Agrupar CL#" | **Nueva columna (US 11809)** — indica que la regla de agrupación por Credit Letter Number está activada para este tenant |
  | Columna FECHA | texto | formato "DD/M/AAAA" (ej. "9/6/2026", "30/6/2026") | fecha de creación o última modificación de la regla |
  | Columna ACCIONES | íconos | ícono lápiz (editar) + ícono basura (eliminar) | por fila; permite editar o eliminar la regla |
- **Estados:** con datos (tabla con múltiples tenants y reglas) / vacío (sin reglas configuradas — no documentado).
- **Screenshot:** ![admin-reglas-completitud](screenshots/admin-reglas-completitud.png) · ![admin-dropdown-menu](screenshots/admin-dropdown-menu.png)
- **Notas para TCs:**
  - **US 11809:** Esta pantalla implementa la nueva columna "AGRUPAR CL#" que permite activar/desactivar la agrupación por Credit Letter Number por tenant.
  - El acceso a esta pantalla requiere rol **"ADMINISTRADOR DEL SISTEMA"** (caseplusadmin) — no es visible para roles Distribuidor o Cliente.
  - **Secciones disponibles en el dropdown "Administración"** (menú completo):
    - Tenants
    - Plantillas Email
    - Marcas
    - Modelos
    - Colores
    - Propulsión
    - Clientes Padre
    - Ubicaciones
    - Favoritos
    - Teams
    - SMTP
    - **Reglas de Completitud** (esta pantalla)
    - Usuarios
    - Plantilla de Importación
    - Firma Digital
    - Plantilla CO

### Componente: Modal "Nueva Regla de Completitud"
- **Cómo se llega aquí:** clic en el botón "+ NUEVA REGLA" desde la pantalla "Reglas de Completitud".
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | texto | "Nueva Regla de Completitud" | — |
  | Subtítulo | texto gris | "Selecciona el tenant y los documentos requeridos" | — |
  | Cerrar | ícono "X" | — | esquina superior derecha; cierra el modal sin guardar |
  | Label | label | "Tenant" | — |
  | Campo Tenant | dropdown | placeholder "Seleccionar tenant..." | despliega lista de tenants disponibles (ej. Mitsubishi, Motorambar, PDV) |
  | Label sección | label | "Documentos requeridos" | encabezado de la sección de checkboxes |
  | Checkbox 1 | checkbox sin marcar/marcado | "CO — Certificado de Origen" | descripción debajo: "Documento que certifica el país de origen del vehículo." |
  | Checkbox 2 | checkbox sin marcar/marcado | "CPA — Carta Porte de Aduana" | descripción debajo: "Documento de importación aduanal del vehículo." |
  | Checkbox 3 | checkbox sin marcar/marcado | "Factura" | descripción debajo: "Factura comercial del vehículo." |
  | Checkbox 4 | checkbox sin marcar/marcado | **"Agrupar por N. Carta de Crédito"** | **Nueva opción (US 11809)** — descripción debajo: "Agrupa los vehículos por número de carta de crédito para evaluar completitud." |
  | Botón | secundario gris | "CANCELAR" | cierra el modal sin guardar |
  | Botón | primario morado | "GUARDAR" | guarda la nueva regla y cierra el modal; la nueva regla aparece en la tabla principal |
- **Estados:**
  - Sin tenant seleccionado (botón "GUARDAR" deshabilitado).
  - Con tenant seleccionado + al menos un documento/regla marcado (botón "GUARDAR" habilitado).
  - Con tenant "Motorambar" seleccionado y "Agrupar por N. Carta de Crédito" marcado (screenshot proporcionado).
- **Screenshot:** ![admin-nueva-regla-modal](screenshots/admin-nueva-regla-modal.png) · ![admin-nueva-regla-agrupar-cl](screenshots/admin-nueva-regla-agrupar-cl.png)
- **Notas para TCs:**
  - La checkbox **"Agrupar por N. Carta de Crédito"** es la nueva funcionalidad introducida por la US 11809.
  - Al guardar, la regla aparece en la tabla principal con un badge verde "✓ Agrupar CL#" en la columna correspondiente.
  - Las descripciones de cada checkbox explican el propósito de cada documento/regla de completitud.
---

## Motorambar > Admin > Usuarios (Gestionar Usuarios)
- **Ruta/URL:** _(pendiente confirmar — sección "Administración" > "Usuarios", rol Administrador del Sistema)_
- **Cómo se llega aquí:** dropdown "Administración" → opción "Usuarios".
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Ícono | botón ícono de "prohibido" (círculo con línea diagonal, por fila de usuario) | — | abre el modal "Revocar Token" para ese usuario |
- **Estados:** _(pendiente — falta screenshot completo de la lista de usuarios)_
- **Screenshot:** _(pendiente)_
- **Notas para TCs:** ver modal "Revocar Token" abajo — descripción literal confirmada por el usuario (sin captura adjunta aún). Acceso requiere rol "ADMINISTRADOR DEL SISTEMA".

### Componente: Modal "Revocar Token"
- **Cómo se llega aquí:** clic en el ícono de "prohibido" (círculo con línea diagonal) de un usuario en "Usuarios".
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Cuerpo | texto | "¿Estás seguro de que deseas revocar el token de {Nombre}? El usuario deberá iniciar sesión nuevamente." | `{Nombre}` = nombre del usuario (ej. "distri distri" para `distri2`) |
  | Botón | secundario | "Cancelar" | cierra el modal sin realizar ninguna acción |
  | Botón | primario | "Revocar Token" | revoca el token de sesión del usuario; muestra toast "Token revocado exitosamente" |
  | Cerrar | ícono "X" | — | cierra el modal sin realizar ninguna acción (igual que "Cancelar") |
- **Estados:** —
- **Screenshot:** _(pendiente)_
- **Notas para TCs:** tras "Revocar Token", el usuario afectado queda desconectado en su siguiente interacción que requiera autenticación → pantalla de acceso bloqueado (`/sso-login`, ver "Login SSO (Autoreg)" en `CONTEXT.md`).
---

## Motorambar > Import > Importar Vehículos
- **Ruta/URL:** `/import/vehicles`
- **Cómo se llega aquí:** botón "Acciones" → "Importar Vehículos" desde "Vehículos Importados" (`/import`).
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | texto | "Importar Vehículos" | — |
  | Descripción | texto | "Sube un archivo Excel con los vehículos a importar" | — |
  | Dropzone | input file | ícono upload + "Arrastra y suelta tu archivo aquí" / "o **haz clic para seleccionar**" | solo acepta archivos Excel (.xlsx, .xls) hasta 10 MB |
  | Texto ayuda | texto gris | "Solo archivos Excel (.xlsx, .xls) hasta 10 MB" | — |
  | Botón | outline | "Seleccionar archivo" | abre explorador de archivos |
- **Reglas de validación (mensajes de "Importante"):**
  | Mensaje | Descripción |
  |---|---|
  | "El archivo debe contener la columna VIN configurada en la importación" | la columna VIN es obligatoria y debe estar definida en "Configurar Importación" |
  | "Los VINs duplicados en el archivo serán ignorados" | si el Excel contiene el mismo VIN varias veces, solo se procesa la primera ocurrencia |
  | "Asegúrate de configurar las columnas de importación antes de subir el archivo" | antes de importar, verificar en "Configurar Importación" que el mapeo Excel → Propiedades esté completo |
- **Estados:** vacío (sin archivo seleccionado) / con archivo adjunto (muestra nombre de archivo + botón "Subir" habilitado) / procesando (progress bar + mensaje "Procesando..." / completado (mensaje de éxito + resumen de vehículos importados).
- **Screenshot:** ![import-vehiculos](screenshots/import-vehiculos.png)
- **Notas para TCs:** esta pantalla depende de que la "Configuración de Importación" (`/import/config`) esté completa — si el mapeo de columnas está vacío o incompleto, el sistema rechazará el archivo con un mensaje de error indicando qué columnas faltan. Validar ambos casos (configuración completa vs. incompleta) en los TCs.
---

## Motorambar > Import > Historial de Importaciones de Vehículos
- **Ruta/URL:** `/import/history`
- **Cómo se llega aquí:** sidebar > "Vehículos Importados" (expandir) → "Historial de Importaciones".
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | texto (con ícono historial circular morado) | "Historial de Importaciones de Vehículos" | — |
  | Subtítulo | texto gris | "Visualiza todas las importaciones de vehículos realizadas" | — |
  | Botón | primario morado (esquina superior derecha) | "Nueva Importación" (ícono upload) | navega a `/import/vehicles` |
  | Filtro fecha | input date picker | "Seleccionar fecha" | filtra importaciones por fecha |
  | Tabla | grid | columnas: NOMBRE DE ARCHIVO / FECHA ↓ / ESTADO / ACCIONES | ordenado descendente por fecha |
  | Columna NOMBRE DE ARCHIVO | texto con ícono documento | nombre del archivo Excel original (ej. "PDV REPORT 6.08 a 7.01 2026_1797.xlsx") | nombres pueden estar truncados si son muy largos |
  | Columna FECHA | texto | formato "DD mmm AAAA, HH:MM" (ej. "08 jul 2026, 12:36") | zona horaria UTC-4 (Puerto Rico) |
  | Columna ESTADO | badge | "COMPLETADO" (verde) / "ERROR" (rojo) / "PENDIENTE" (azul claro) / "COMPLETADO CON ERRORES" (amarillo — pendiente documentar) | indica el resultado de la importación |
  | Columna ACCIONES | ícono circular | ícono refresh (circular con flecha) cuando estado = "ERROR" / ícono X roja cuando estado = "PENDIENTE" | clic en refresh abre modal "Detalle de Importación"; X cancela el reproceso pendiente |
  | Paginación | controles | — | presente cuando hay muchas importaciones |
- **Estados de importación (badges):**
  | Estado | Color | Significado |
  |---|---|---|
  | COMPLETADO | verde | importación finalizada sin errores — todos los registros procesados exitosamente |
  | ERROR | rojo | fallo crítico durante la importación (ej. columnas faltantes, archivo corrupto) — **ningún** registro fue procesado |
  | PENDIENTE | azul claro | importación reencolada tras un error — esperando reproceso en background |
  | COMPLETADO CON ERRORES | amarillo | importación parcial — algunos registros procesados, otros fallaron (ej. VINs inválidos en ciertas filas) — **pendiente documentar** |
- **Estados UI:** con datos (múltiples importaciones) / vacío (sin importaciones previas — no documentado).
- **Screenshot:** ![import-historial-estados](screenshots/import-historial-estados.png)
- **Notas para TCs:**
  - **US 12076:** la funcionalidad de editar VIN y reprocesar filas fallidas aplica cuando el estado es **"COMPLETADO CON ERRORES"** (importación parcial). El modal "Detalle de Importación" en ese caso muestra la sección "ERRORES DE IMPORTACIÓN" con cards individuales de cada fila fallida y un ícono de lápiz morado para corregir el VIN.
  - Cuando el estado es **"ERROR"** (fallo crítico), el modal muestra el botón "Reintentar importación" que reencola el archivo completo — no hay edición de VINs individuales.
  - Los nombres de archivo mostrados en la tabla coinciden con el nombre original del Excel subido.

### Modal "Detalle de Importación" (estado ERROR)

**Cómo se llega aquí:** clic en el ícono refresh (circular) de la columna ACCIONES cuando el estado = "ERROR".

| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Título | texto | "Detalle de Importación: {nombre-archivo.xlsx}" | ej. "Detalle de Importación: PDV REPORT 6.08 a 7.01 2026_1797.xlsx" |
| Subtítulo | texto gris | "Intento #{N} — Failed" | ej. "Intento #1 — Failed" |
| ID importación | texto gris pequeño | "ID: {guid}" | ej. "ID: 9796a889-816b-4381-92bd-21bd0254791" |
| Botón cerrar | ícono X | esquina superior derecha | cierra el modal |
| Card de error principal | card rosa con ícono X rojo | título "Importación Fallida" + nombre de archivo | indica fallo crítico general |
| Sección errores | collapsible section | título "ERRORES DE IMPORTACIÓN" (con ícono info circular) | muestra lista de errores detectados |
| Card de error individual | card blanco con borde | "#0" + descripción del error + link "Ver Datos" | ej. "#0 Columnas faltantes: AutoColor1" → el link "Ver Datos" abre detalle del error (comportamiento no documentado) |
| Botón principal | botón azul oscuro | "Reintentar importación" (ícono refresh circular) | abre modal de confirmación "¿Reintentar importación?" |

**Screenshot:** ![import-detalle-error](screenshots/import-detalle-error.png)

**Notas para TCs:**
- Este modal aparece cuando la importación falló **completamente** (estado ERROR) — no se procesó ningún registro.
- El botón "Reintentar importación" reencola el archivo completo — el sistema volverá a procesarlo desde cero en background.
- Los errores típicos en este estado son: columnas faltantes (configuración de importación incorrecta), archivo corrupto, formato inválido.
- Este flujo es **distinto** al de la US 12076 — esa US trata sobre importaciones en estado "COMPLETADO CON ERRORES" (parcial) donde se pueden corregir VINs individuales.

### Modal "¿Reintentar importación?" (confirmación)

**Cómo se llega aquí:** clic en "Reintentar importación" desde el modal "Detalle de Importación" (estado ERROR).

| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Ícono | ícono alerta (triángulo naranja) | — | esquina superior del modal |
| Título | texto | "¿Reintentar importación?" | — |
| Descripción | texto gris | "Se volverá a procesar el archivo. Los datos existentes podrían actualizarse." | advierte que registros ya procesados pueden modificarse |
| Botón secundario | texto gris | "CANCELAR" | cierra el modal sin acción |
| Botón principal | botón rojo | "REINTENTAR IMPORTACIÓN" | confirma el reproceso — reencola el archivo y cierra el modal |

**Screenshot:** ![import-confirmar-reintento](screenshots/import-confirmar-reintento.png)

**Comportamiento tras confirmar:**
1. Modal se cierra
2. El estado de la importación en la tabla cambia de "ERROR" (rojo) a "PENDIENTE" (azul claro)
3. El ícono de ACCIONES cambia de refresh (circular) a X roja (cancelar reproceso)
4. Toast verde "Importación reencolada exitosamente" aparece en la esquina superior derecha
5. El Worker procesa el archivo en background — cuando termine, el estado cambiará a "COMPLETADO" o volverá a "ERROR"

**Screenshot (después del reproceso):** ![import-reproceso-pendiente](screenshots/import-reproceso-pendiente.png)

**Notas para TCs:**
- El botón X rojo (ACCIONES) que aparece tras reencolar permite **cancelar** el reproceso pendiente — útil si el usuario detectó que el error no fue corregido (ej. olvidó actualizar la configuración de columnas).
- El mensaje "Los datos existentes podrían actualizarse" aplica cuando la importación previa procesó algunos registros antes de fallar — al reintentar, esos registros pueden modificarse con los valores del Excel actual.
- Este flujo es para fallos **críticos** (ERROR). La US 12076 trata sobre fallos **parciales** (COMPLETADO CON ERRORES) donde se corrigen VINs individuales, no se reintenta todo el archivo.

---

### Modal "Detalle de Importación" (estado COMPLETADO CON ERRORES — US 12076)

**Cómo se llega aquí:** clic en la fila de la tabla cuando el estado = "COMPLETADO CON ERRORES" (amarillo).

| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Título | texto | "Detalle de Importación: {nombre-archivo.xlsx}" | ej. "Detalle de Importación: PDV REPORT 6.08 a 7.01 2026_1797.xlsx" |
| Subtítulo | texto gris | "Intento #{N} — CompletedWithErrors" | ej. "Intento #1 — CompletedWithErrors" |
| ID importación | texto gris pequeño | "ID: {guid}" | ej. "ID: 6a8758ce-2652-412c-8a33-6f28a9a8e33e" |
| Botón cerrar | ícono X | esquina superior derecha | cierra el modal |
| Card resumen | card amarillo con ícono alerta (triángulo) | título "Completado con Errores" + "{insertadas} de {total} filas insertadas" | ej. "880 de 882 filas insertadas" |
| **Métricas (4 cards)** | — | — | — |
| Métrica 1 | card con ícono lista | "882 TOTAL FILAS" | total de filas en el Excel (incluye exitosas + fallidas + omitidas) |
| Métrica 2 | card con ícono check verde | "880 INSERTADAS" | filas procesadas exitosamente |
| Métrica 3 | card con ícono X roja | "2 FALLIDAS" | filas que no se pudieron procesar (ej. VIN inválido) |
| Métrica 4 | card con ícono play naranja | "0 OMITIDAS" | filas que se saltaron (ej. VINs duplicados en el mismo Excel) |
| **Sección errores** | collapsible section expandida | título "ERRORES DE IMPORTACIÓN" (con ícono info circular) | muestra lista de filas fallidas |
| Card de error individual | card blanco | "#{número-fila}" + texto del error en rojo + link "Ver Datos" + botón "REPROCESAR" | ej. "#2 VIN inválido. El VIN debe contener 17 caracteres alfanuméricos." |
| Link "Ver Datos" | link gris/azul | "Ver Datos" / "Ocultar" (toggle) | expande/colapsa el detalle de todos los campos de esa fila (VIN, AUTOCOLOR, HORSEPOWER, MAKE, MODEL, etc.) |
| Botón "REPROCESAR" | botón azul oscuro | "REPROCESAR" (ícono refresh circular) | abre modal "Reprocesar Fila" con el campo "VIN corregido" prellenado con el VIN original inválido |

**Estados de la sección "ERRORES DE IMPORTACIÓN":**
- **Con errores:** muestra lista de cards con las filas fallidas (ej. 2 cards: #2 y #3).
- **Sin errores** (tras reprocesar todas las filas): muestra "No se encontraron errores" con ícono check verde.

**Screenshot:** ![import-detalle-completado-con-errores](screenshots/import-detalle-completado-con-errores.png) · ![import-detalle-ver-datos](screenshots/import-detalle-ver-datos.png)

**Notas para TCs:**
- Este modal aparece cuando la importación se completó **parcialmente** (estado COMPLETADO CON ERRORES) — la mayoría de registros se procesaron, pero algunos fallaron.
- Las causas típicas de fallas individuales: VIN inválido (≠ 17 caracteres o contiene caracteres especiales), VIN duplicado dentro del mismo Excel, campos obligatorios vacíos.
- El botón "REPROCESAR" permite corregir el VIN de cada fila fallida **individualmente** — no reintenta todo el archivo como en el flujo de ERROR.
- Las métricas se actualizan en **tiempo real** tras reprocesar cada fila: INSERTADAS aumenta, FALLIDAS disminuye.
- Si todas las filas se reprocesaran exitosamente, el estado de la importación en la tabla cambia de "COMPLETADO CON ERRORES" (amarillo) a "COMPLETADO" (verde).

---

### Modal "Reprocesar Fila" (US 12076)

**Cómo se llega aquí:** clic en "REPROCESAR" desde un card de error en "Detalle de Importación" (estado COMPLETADO CON ERRORES).

| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Título | texto | "Reprocesar Fila" | — |
| Botón cerrar | ícono X | esquina superior derecha | cierra el modal sin guardar |
| Card info | card gris claro | "FILA" + "#{número}" + "VIN ORIGINAL" + VIN inválido | ej. "FILA #2", "VIN ORIGINAL 5XYK6CDFXTG4477646" |
| Label campo | texto | "VIN corregido: *" | asterisco rojo indica campo obligatorio |
| Campo VIN | input texto | prellenado con el VIN original inválido | el usuario puede editar |
| Texto ayuda | texto gris pequeño | "17 caracteres alfanuméricos (A-H, J-N, P-Z, 0-9, sin I/O/Q)" | debajo del campo |
| Botón secundario | texto outline gris | "CANCELAR" | cierra el modal sin guardar |
| Botón principal | botón morado | "CONFIRMAR Y REPROCESAR" | valida el VIN, guarda y reprocesa la fila |

**Validaciones del campo "VIN corregido":**
| Validación | Comportamiento |
|---|---|
| **Limpieza automática** (silenciosa) | el sistema elimina **todos los espacios** del texto ingresado **antes** de validar (ej. "3N8AP6GCE2TL 37850 0" → "3N8AP6GCE2TL378500") |
| **Longitud** | debe tener **exactamente 17 caracteres** (después de eliminar espacios) |
| **Formato** | solo caracteres **alfanuméricos** (A-Z, 0-9), sin espacios ni caracteres especiales |
| **Caracteres prohibidos** | no puede contener I, O, Q (por estándar VIN) |
| **Mensaje de error** | si alguna validación falla, muestra: *"VIN inválido. Debe contener exactamente 17 caracteres alfanuméricos."* en rojo debajo del campo + campo resaltado en rojo |
| **Estado válido** | si todas las validaciones pasan, el campo se resalta en **verde** (borde verde) |

**Estados del campo:**
- **Inicial:** campo prellenado con VIN inválido, sin borde de color.
- **Inválido:** borde rojo + mensaje de error rojo debajo del campo.
- **Válido:** borde verde + sin mensaje de error.

**Screenshot:** ![import-reprocesar-fila-inicial](screenshots/import-reprocesar-fila-inicial.png) · ![import-reprocesar-fila-error](screenshots/import-reprocesar-fila-error.png) · ![import-reprocesar-fila-valido](screenshots/import-reprocesar-fila-valido.png)

**Comportamiento tras confirmar (VIN válido):**
1. Modal se cierra
2. Toast verde "Fila reprocesada exitosamente" aparece en la esquina superior derecha
3. El sistema reprocesa la fila en background — inserta el vehículo con el VIN corregido
4. El modal "Detalle de Importación" se actualiza automáticamente:
   - Card de la fila #2 desaparece de la lista de errores
   - Métricas se actualizan: INSERTADAS aumenta de 880 → 881, FALLIDAS disminuye de 2 → 1
5. Si todas las filas se reprocesaran exitosamente (FALLIDAS = 0):
   - Card principal cambia de "Completado con Errores" (amarillo) a "Importación Exitosa" (verde)
   - Métricas: INSERTADAS = TOTAL FILAS, FALLIDAS = 0
   - Sección "ERRORES DE IMPORTACIÓN" muestra "No se encontraron errores" con ícono check verde
   - El estado en la tabla de fondo cambia de "COMPLETADO CON ERRORES" (amarillo) a "COMPLETADO" (verde)

**Screenshot (después del reproceso exitoso):** ![import-reproceso-exitoso](screenshots/import-reproceso-exitoso.png)

**Notas para TCs:**
- **Limpieza automática de espacios:** el sistema elimina espacios **antes** de validar — el usuario puede ingresar "3N8AP6GCE2TL 37850 0" (con espacios) y el sistema lo acepta como válido tras limpiar.
- **Caracteres prohibidos I/O/Q:** el mensaje de error **no** menciona explícitamente estos caracteres — simplifica diciendo "alfanuméricos", pero la validación sí los rechaza (estándar VIN internacional).
- **Reproceso inmediato:** el sistema no espera un worker batch — reprocesa la fila en background al confirmar, y la UI se actualiza en ~1-2 segundos.
- **No hay modal de confirmación adicional:** "CONFIRMAR Y REPROCESAR" ejecuta directamente — no pide confirmación tipo "¿Estás seguro?".

---

## Motorambar > Import > Configuración de Importación
- **Ruta/URL:** `/import/config`
- **Cómo se llega aquí:** botón "Acciones" → "Configurar Importación" desde "Vehículos Importados" (`/import`).
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | texto | "Configuración de Importación" | — |
  | Descripción | texto | "Personaliza los nombres de las columnas del archivo Excel que usa tu empresa para importar vehículos." | — |
  | Botón | outline gris (esquina superior derecha) | "Restaurar Todo" (ícono reset) | restaura todas las columnas a sus valores por defecto |
  | Botón | primario morado (esquina superior derecha) | "Guardar Cambios" (ícono disco) | persiste la configuración modificada |
  | Tabla | grid | columnas: PROPIEDAD DEL VEHÍCULO / COLUMNA EN EXCEL / VALOR POR DEFECTO / ACCIONES | cada fila representa un campo del modelo de vehículo |
  | Columna PROPIEDAD | label fijo | ej. "Auto Color", "Bank Name", "Body Type", "Client Id", "Contributor Id", "Country Origin Code", "Credit Letter Number", "Dealer", "Dealer Licence", "Doors", "EIN (Tax ID)", "Horse Power", "Invoice"... | lista completa de propiedades del modelo Vehicle en el sistema |
  | Columna COLUMNA EN EXCEL | input de texto editable | ej. "autoColor", "BankName", "BodyType", "clientId", "contributorId", "countryOriginCode", "CreditLetterNumber", "dealer", "dealerLicence", "doors", "EIN(TaxID)", "horsePower", "invoice"... | el nombre **exacto** de la columna en el Excel del usuario (case-sensitive) |
  | Columna VALOR POR DEFECTO | label fijo (solo lectura) | ej. "autoColor", "BankName", "BodyType"... | valor sugerido por el sistema — coincide con el nombre del campo en el backend |
  | Columna ACCIONES | ícono(s) por fila | — | no visibles en captura (scroll necesario) — posible editar/eliminar mapeo |
- **Comportamiento del mapeo:**
  - El usuario puede personalizar el nombre de cada columna en "COLUMNA EN EXCEL" para que coincida con el archivo Excel de su empresa.
  - Al importar un archivo (`/import/vehicles`), el sistema busca en el Excel la columna con el nombre exacto configurado aquí.
  - Si una columna obligatoria (ej. VIN) no está mapeada o el Excel no contiene esa columna, la importación falla con error.
  - "VALOR POR DEFECTO" es de solo lectura — muestra el nombre del campo en el modelo del backend, pero el usuario NO está obligado a usar ese nombre en su Excel.
- **Estados:** con configuración guardada (valores en "COLUMNA EN EXCEL") / sin configuración (campos vacíos — importación fallará) / modificado sin guardar (banner amarillo "Cambios sin guardar" — no visible en captura).
- **Screenshot:** ![import-configuracion](screenshots/import-configuracion.png)
- **Notas para TCs:**
  - Esta es una **configuración global por empresa/usuario** — una vez guardada, aplica a todas las importaciones futuras de ese usuario.
  - Caso de uso típico: la empresa usa un Excel con columnas en español ("Color", "Marca", "Puertas") pero el sistema espera inglés ("autoColor", "brand", "doors") → aquí se mapea "Color" → "autoColor".
  - Al escribir TCs de importación, **siempre verificar primero** que la configuración esté completa antes de subir el Excel — si no, el TC fallará por configuración incompleta, no por un bug en la importación.
  - El screenshot muestra una configuración ya guardada (todos los campos poblados). Estado inicial (sin configuración) — no documentado.
---

## Autoreg / PDV > DTOP > Consulta CO & CPA
- **Ruta/URL:** (ruta exacta pendiente — accesible desde el menú lateral "Consulta CO & CPA")
- **Cómo se llega aquí:** login en Autoreg con usuario **dtopsup** (rol: Case Manager) → menú lateral → opción "Consulta CO & CPA".
- **Propósito:** pantalla de verificación que consulta los datos vehiculares (VHE) sincronizados desde Motorambar (Portal Distribuidor) hacia el Portal DTOP (Autoreg). Cuando un usuario edita un campo VHE en Motorambar (ej. cilindros, color, etc.), el sistema detecta el cambio y envía los datos actualizados al PDV — esta pantalla confirma que esos valores llegaron correctamente al Portal DTOP.
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Menú lateral | nav link | "Consulta CO & CPA" | activo/resaltado en esta pantalla |
  | Título | texto | "Consulta CO & CPA" (o similar — pendiente confirmar en app real) | — |
  | Label | texto | "Número de VIN" (o "VIN" — pendiente confirmar) | — |
  | Input VIN | input de texto | placeholder: (pendiente confirmar) | campo de entrada para el VIN a consultar |
  | Botón | primario | "Buscar" (o "Consultar" — pendiente confirmar) | ejecuta la búsqueda del vehículo por VIN |
  | Mensaje de error | alert/texto rojo | "No se encontró el vehículo con este número de Número de VIN" | aparece cuando el VIN no existe o no ha sido sincronizado desde Motorambar |
  | Panel de resultados | card/sección | muestra datos del vehículo encontrado | título con marca/modelo/año (ej. "NISSAN PATHFINDER 2025"); campos: VIN, Año, Marca, Modelo, Color, Puertas, Cilindros, Caballos de Fuerza, Tipo de Propulsión, Peso, Capacidad de Carga, etc. (lista completa pendiente confirmar) |
- **Estados:**
  - **Vacío:** al entrar a la pantalla, solo muestra el input VIN + botón "Buscar".
  - **Error — VIN no encontrado:** mensaje "No se encontró el vehículo con este número de Número de VIN" (literal).
  - **Éxito — vehículo encontrado:** panel de resultados con todos los datos VHE del vehículo (marca, modelo, año, color, puertas, cilindros, etc.).
- **Screenshot:** (usuario mostró screenshots — pendiente agregar a `context/screenshots/`)
- **Notas para TCs:**
  - Esta pantalla es la **verificación final** de que los datos editados en Motorambar llegaron correctamente al Portal DTOP (Autoreg).
  - **Flujo típico de verificación (2 sesiones en paralelo):**
    1. Sesión A (Motorambar): login como `distri2` (Distribuidor) → editar un campo VHE de un vehículo (ej. cambiar cilindros de 4 a 6).
    2. Sesión B (Autoreg): login como `dtopsup` (Case Manager) → "Consulta CO & CPA" → ingresar el VIN → verificar que el valor actualizado (6 cilindros) aparece en los resultados.
  - **Prerequisito:** el VIN debe haber sido **previamente transmitido al Portal DTOP** (Send to PDV exitoso) — si el VIN nunca se envió, esta pantalla mostrará el error "No se encontró el vehículo".
  - El mensaje de error dice literalmente "No se encontró el vehículo con este número de **Número de VIN**" (redundancia "número de Número de VIN" — así está en la UI real).
  - Los labels exactos del input VIN, botón y campos del panel de resultados están pendientes de confirmar mediante inspección de la app real vía MCP Browser — los textos aquí son aproximaciones basadas en la descripción del usuario.

### Componente: Modal "Documentos En Lote" (desde Consulta CO & CPA)
- **Cómo se llega aquí:** después de buscar un VIN en "Consulta CO & CPA" y obtener resultados exitosos, hacer clic en el ícono de documentos (ícono carpeta/documentos — pendiente confirmar exactamente cuál ícono) en el panel de resultados.
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | texto | "Documentos En Lote" | — |
  | Botón cerrar | ícono "X" | — | esquina superior derecha; cierra el modal |
  | Tabla | grid | columnas: "Nombre del Archivo" / "Acción" | lista de todos los CPAs (Certificados de Pago de Arbitrio) del vehículo consultado |
  | Columna Nombre del Archivo | texto con ícono documento | ej. "Certificado de Pago de Arbitrio_CPAJTDB4MEE8S3027120.pdf", "Certificado de Pago de Arbitrio_f35d5ea3-adf9-4a6a-8743-262ce22d506b.pdf" | nombres de archivos PDF de los CPAs |
  | Columna Acción | ícono lupa | — | clic en la lupa previsualiza/descarga el documento (comportamiento exacto pendiente confirmar) |
- **Estados:**
  - **Con documentos:** la tabla muestra todos los CPAs del vehículo (1 o más filas).
  - **Sin documentos:** _(pendiente confirmar si el modal aparece vacío o no se muestra el ícono de documentos en el panel de resultados)_
- **Screenshot:** (usuario mostró screenshots — pendiente agregar a `context/screenshots/`)
- **Notas para TCs:**
  - Este modal es la **verificación de documentos (CPAs) sincronizados** desde Motorambar al Portal DTOP — análogo a la verificación de datos VHE que se hace directamente en el panel de resultados.
  - **Flujo típico de verificación de documentos (2 sesiones en paralelo):**
    1. Sesión A (Motorambar): login como `distri2` (Distribuidor) → navegar al detalle del vehículo → sección "CERTIFICADO DE PAGO DE ARBITRIOS (CPA)" → botón "REEMPLAZO" → subir nuevo CPA → guardar.
    2. Sesión B (Autoreg): login como `dtopsup` (Case Manager) → "Consulta CO & CPA" → buscar el VIN → clic en ícono de documentos → verificar que el nuevo CPA (nombre de archivo actualizado) aparece en la lista del modal "Documentos En Lote".
  - El nombre de los archivos incluye el prefijo "Certificado de Pago de Arbitrio_" seguido de un identificador único (puede ser un código como "CPAJTDB4MEE8S3027120" o un UUID como "f35d5ea3-adf9-4a6a-8743-262ce22d506b").
  - Para validar el reenvío automático, el TC debe comparar el nombre del archivo antes vs. después de la actualización — si el nombre cambió (nuevo UUID o timestamp), confirma que el sistema detectó el cambio y reenvió automáticamente al PDV.
---
