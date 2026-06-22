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
  | **SIDEBAR (Menú lateral)** | nav vertical | — | colapsable/expandible con botón hamburguesa; muestra badge "MANUFACTURER" bajo el logo |
  | Item sidebar (nivel 1) | nav link | "Dashboard" | ícono grid; navega al Dashboard Ejecutivo |
  | Item sidebar (nivel 1) | nav link expandible | "Vehículos Importados" | ícono vehículo + badge numérico con total de vehículos (ej. `1057`); **despliega/colapsa submenu** con 3 opciones |
  | Submenu (nivel 2) | nav link | "Importar Vehículos" | opción dentro de "Vehículos Importados"; navega a `/import/new` (ruta pendiente confirmar) |
  | Submenu (nivel 2) | nav link | "Historial de Importaciones" | opción dentro de "Vehículos Importados"; navega a `/import` (esta pantalla — **activa por defecto**) |
  | Submenu (nivel 2) | nav link | "Configurar Importación" | opción dentro de "Vehículos Importados"; navega a `/import/config` (ruta pendiente confirmar) |
  | Item sidebar (nivel 1) | nav link | "Importar CPA" | ícono documento; navega a `/import/cpa`; **NO está dentro del submenu** de "Vehículos Importados" |
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
  - **DISTRIBUIDOR:** puede ver y acceder a todas las opciones del sidebar (Dashboard, Vehículos Importados con sus 3 subopciones, Importar CPA).
  - **CLIENTE:** solo ve "Dashboard" y "Vehículos Asignados" en el sidebar; **NO** ve "Vehículos Importados" ni "Importar CPA". Si intenta acceder a URLs restringidas directamente, el sistema lo redirige al Dashboard mostrando mensaje *"No tienes permisos para acceder a esta funcionalidad"*.
- **Screenshot:** ![vehiculos-importados-grid](screenshots/vehiculos-importados-grid.png) · ![vehiculos-importados-iconos-fila](screenshots/vehiculos-importados-iconos-fila.png) · ![vehiculos-importados-grid-loading](screenshots/vehiculos-importados-grid-loading.png) · ![vehiculos-importados-sidebar-layout](screenshots/vehiculos-importados-sidebar-layout.png)

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

**Tab "HISTORIAL":** (contenido pendiente documentar)

**Screenshot:** (usuario mostró screenshots — pendiente agregar a `context/screenshots/`)

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

**Menú "Acciones"** (botón "Acciones")
| Elemento | Tipo | Texto/label literal | Comportamiento |
|---|---|---|---|
| Opción de menú | item | "Importar Vehículos" (ícono upload) | navega a `/import/vehicles` — abre pantalla de carga de Excel con vehículos |
| Opción de menú | item | "Importar CFA" (ícono documento) | navega a `/import/cpa` (nota: la UI dice "CFA" pero la ruta es `/import/cpa`) |
| Opción de menú | item | "Historial de Importaciones" (ícono historial) | navega a `/import/history` — muestra tabla con todas las importaciones realizadas |
| Opción de menú | item | "Configurar Importación" (ícono settings) | navega a `/import/config` — permite mapear columnas del Excel con propiedades del vehículo |

Screenshot: ![vehiculos-importados-acciones-menu-completo](screenshots/vehiculos-importados-acciones-menu-completo.png)

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

## Motorambar > Import > Importar CPA
- **Ruta/URL:** `/import/cpa`
- **Cómo se llega aquí:** botón "Acciones" → "Importar CPA" desde "Vehículos Importados" (`/import`).
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
- **Paso 2 "PROCESANDO VINS":** ejecuta en tiempo real un proceso en background (OCR) que la UI consulta por **polling** hasta completarse. _(Labels/UI exactos pendientes — falta screenshot real; existe skeleton `CpaProcessingSkeleton` en el código.)_
- **Paso 3 "RESUMEN":** pantalla de resumen del resultado del procesamiento. _(Labels/UI exactos pendientes — falta screenshot real; existe skeleton `CpaSummarySkeleton` en el código.)_
- **Estados:** documentado solo el paso 1 "SUBIR ARCHIVO" (vacío, sin archivo, y el caso de error por PDF de una sola página descrito arriba). Pasos "PROCESANDO VINS" y "RESUMEN" — pendiente screenshot real para confirmar labels exactos.
- **Screenshot:** ![import-cpa](screenshots/import-cpa.png)
- **Notas para TCs:** "CPA" = Certificados de Pago de Arbitrios (definición oficial dada en esta pantalla). El comportamiento de validación (1 página → error / multi-página → avanza) fue confirmado por el usuario, pero los textos literales exactos de UI para pasos 2-3 no están confirmados — antes de escribir steps detallados para esos pasos, inspeccionar la app real vía MCP Browser o solicitar screenshot.
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

## Motorambar > Admin > Usuarios (Gestionar Usuarios)
- **Ruta/URL:** _(pendiente confirmar — sección "Admin", rol Sys Admin)_
- **Cómo se llega aquí:** menú lateral (rol Sys Admin) → opción "Usuarios".
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Ícono | botón ícono de "prohibido" (círculo con línea diagonal, por fila de usuario) | — | abre el modal "Revocar Token" para ese usuario |
- **Estados:** _(pendiente — falta screenshot completo de la lista de usuarios)_
- **Screenshot:** _(pendiente)_
- **Notas para TCs:** ver modal "Revocar Token" abajo — descripción literal confirmada por el usuario (sin captura adjunta aún).

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
- **Cómo se llega aquí:** botón "Acciones" → "Historial de Importaciones" desde "Vehículos Importados" (`/import`).
- **Elementos clave:**
  | Elemento | Tipo | Texto/label literal | Comportamiento |
  |---|---|---|---|
  | Título | texto (con ícono historial circular morado) | "Historial de Importaciones de Vehículos" | — |
  | Subtítulo | texto gris | "Visualiza todas las importaciones de vehículos realizadas" | — |
  | Botón | primario morado (esquina superior derecha) | "Nueva Importación" (ícono upload) | navega a `/import/vehicles` |
  | Tabla | grid | columnas: NOMBRE DE ARCHIVO / FECHA ↓ / ESTADO | ordenado descendente por fecha |
  | Columna NOMBRE DE ARCHIVO | texto con ícono documento | nombre del archivo Excel original (ej. "xBTh3wK3D", "s%3D", "20260518_122734_1100_PDVFile.xlsx%3t=2026-06...") | los nombres pueden estar truncados o codificados si son muy largos |
  | Columna FECHA | texto | formato "DD jun AAAA, HH:MM" (ej. "14 jun 2026, 01:00", "14 jun 2026, 00:00") | zona horaria UTC-4 (Puerto Rico) |
  | Columna ESTADO | badge verde | "Completado" | todas las importaciones visibles tienen estado "Completado" — estados de error/pendiente no documentados en captura |
  | Paginación | controles | — | presente pero no visible en captura (scroll necesario) |
- **Estados:** con datos (historial con múltiples importaciones) / vacío (sin importaciones previas — no documentado).
- **Screenshot:** ![import-historial](screenshots/import-historial.png)
- **Notas para TCs:** los nombres de archivo mostrados en la tabla pueden estar codificados/truncados (URL encoding + límite de caracteres) — al validar el historial en un TC, no asumir que el nombre mostrado coincide exactamente con el nombre original del archivo subido. El badge "Completado" confirma que la importación finalizó sin errores críticos, pero no garantiza que **todos** los VINs del archivo fueron procesados exitosamente (ej. duplicados ignorados, VINs inválidos omitidos). Para validar el detalle de una importación, se requiere funcionalidad de "ver detalle" (ícono/acción no visible en captura actual — pendiente confirmar si existe).
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
