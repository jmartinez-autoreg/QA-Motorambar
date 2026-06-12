# Contexto del Proyecto

> ⚠️ Este archivo se auto-carga al inicio de cada sesión (vía `@context/CONTEXT.md` en `CLAUDE.md`).
> Completa cada sección con los datos reales del proyecto — el agente lo usa como **fuente de verdad** para TCs, USs y ejecución.
> NUNCA inventar datos de esta sección: si falta información, preguntar al usuario o usar el skill `project-onboarding`.

---

## Ambientes de Prueba

> Actualmente solo existe el ambiente de **Test**. No hay Dev/Preprod separados para QA — toda ejecución de pruebas (manual o automatizada) se hace contra Test.

| Ambiente | Portal | URL | Descripción |
|--------|-----|-----|-------------|
| **Test** | Autoreg / PDV — Login federado (SSO) | `https://testwaf.portaldevehiculos.com/Forms/Account/LoginNew.aspx` | Pantalla real donde el usuario se autentica; tras login exitoso redirige a Motorambar |
| **Test** | Motorambar — Web App (VehicleDocs) | `https://motorambartest.portaldevehiculos.com/` | Portal (Next.js) de gestión de inventario de vehículos importados — destino del SSO |
| Local | Motorambar — Web App (VehicleDocs) | `http://localhost:3000` | Desarrollo local |
| Local / Dev | API (Backend) | `http://localhost:8080` · Dev: `https://cap-motorambarapi-dev.politepebble-7d21ea4b.eastus2.azurecontainerapps.io/` | API .NET (DistributionCar.API) |

### Usuarios de prueba (ambiente Test)

| Usuario | Rol | Notas |
|---|---|---|
| `jovidio` | Cliente | Solo lectura — ve solo vehículos asignados a su cliente (Dealer o Banco) |
| `distri2` | Distribuidor | Permisos completos |

---

## Login — Flujos Conocidos

> **Flujo completo de acceso (ambiente Test):**
> 1. Login en Autoreg: `https://testwaf.portaldevehiculos.com/Forms/Account/LoginNew.aspx` (campos "Usuario"/"Contraseña", botón "INICIAR SESIÓN").
> 2. Landing "Bienvenido" de PDV (portaldevehiculos.com) — muestra el rol del usuario **en PDV** (ej. `jovidio` → Rol PDV "CASE LOCATION SUPERVISOR", distinto de su rol "Cliente" en Motorambar). Puede aparecer un modal condicional "Términos y Condiciones" (solo primera sesión).
> 3. Botón **"Portal Distribuidor"** (sección "Datos y Documentos") → redirige a Motorambar (`https://motorambartest.portaldevehiculos.com/`) con el token en el hash de la URL — ahí aplica el flujo "Login SSO (Autoreg)" descrito abajo.
>
> Ver detalle de pantallas en `UI-UX.md` → "Autoreg / PDV (sistema externo)".

### Login SSO (Autoreg) — flujo principal — `/sso-login`
- El usuario llega desde **Autoreg** (sistema externo de identidad) con un token en el hash de la URL (`#token=...`)
- **Pantalla de carga:** header morado con logo "VehicleDocs" + texto de carga (i18n `pages.ssoLogin.loading.*`)
- **Pantalla bloqueada** (sin token / token inválido o expirado): header rojo, ícono de candado, título y descripción "...autentícate a través de **Autoreg**", banner de advertencia ámbar
- Botón "Cambiar idioma" (ES/EN) visible en ambas pantallas (toggle de locale)
- Si el token es válido → login automático → redirige a `/` (Dashboard)

### Login interno / desarrollo — `/login`
- Header morado con logo "VehicleDocs" y subtítulo "Sistema Autoreg — Ingresa a tu cuenta"
- Dos tabs:
  - **"Login Normal"** — campos "Email" (placeholder `usuario@motorambar.com`) y "Contraseña" (placeholder `••••••••`), botón **"Iniciar sesión"** (estado loading: "Iniciando sesión...")
  - **"Login Externo"** — botón **"Generar token externo"** (estado loading: "Generando token externo...") que genera un token de prueba con datos hardcodeados: Usuario `jdoe@motorambar.com`, Rol `Admin`, Ubicación `Banco BHD Leon`, expira en 60 minutos
- Tras login exitoso (ambos modos) → redirige a `/auth-test`
- Toasts: "Sesión iniciada correctamente" / "Token externo generado correctamente" / mensajes de error de API

---

## Roles y Permisos

| Rol (Id / enum) | Nombre en BD | Permisos conocidos (`RolePermissions`) | Resultado visible |
|---|---|---|---|
| Distributor (1) | "Distribuidor" | `Vehicles.Edit`, `Vehicles.Delete`, `GridVehicles.LocationFilter` | Permisos completos: edita y elimina vehículos; ve el filtro de localidades (Dealer/Banco/Favoritos) en el grid de "Vehículos importados" |
| Client (2) | "Cliente" (antes "Institución Financiera") | Solo lectura: descarga y previsualización de documentos | Solo ve los vehículos asignados a su cliente (Dealer o Banco); no edita ni elimina |
| SysAdmin (3) | "Sys Admin" (antes "Dealer") | _(aún sin integrar)_ | _(aún sin integrar — el usuario indicó que se detallará más adelante)_ |
| SystemWorker (4) | "SystemWorker" | _(pendiente)_ | Rol técnico interno para procesos en background (Worker) — no es un usuario final con UI |
| Idle (0) | — | — | Rol por defecto / sin asignar |

> ⚠️ Nota: el middleware del frontend (`middleware.ts`) tiene un stub `logRoleRestriction` para un rol `"Banco"` (no coincide exactamente con los nombres de `Roles` en BD). El rol **Cliente** se asigna a un cliente de tipo **Dealer o Banco** (ver `ParentLocation` / filtros de localidad) — pendiente confirmar si el stub `"Banco"` del middleware se refiere a este tipo de cliente o a un rol distinto. La restricción de rutas por rol está **pendiente de implementación**, hoy solo se registra en consola.

---

## Módulos Principales

- **Dashboard** (`/`) — pantalla principal tras login; incluye vista general del inventario
- **Vehículos importados** (`/import`) — grid principal del inventario: búsqueda por VIN (incluye búsqueda multi-VIN), filtros por Localidad/Favoritos, Estado CO, Estado CPA, Estado de Factura, Marca, rango de fechas, N.º Factura/Carta de Crédito/Orden de Venta. Acciones individuales y por lote (batch), descarga de documentos
- **CPA** (`/import/cpa`) — importación de archivos CPA con stepper de 3 pasos: "Subir Archivo" → "Procesando VINs" (OCR) → "Resumen"
- **Detalle de vehículo** (`/vehicle/[id]`) — ficha del vehículo de una sola página con scroll (no tabs), secciones: "DETALLES", "ESPECIFICACIONES TÉCNICAS", "REGULATORIO Y ORIGEN", "FINANCIERO", "CERTIFICADO DE ORIGEN" (CO), "CONTRATO DE COMPRA (CPA)", "DETALLES DE FACTURACIÓN", "DOCUMENTOS ADICIONALES"; modo solo lectura y modo edición
- **Admin** (`/admin`) — sección administrativa _(pendiente detallar — sin screenshot ni exploración de código aún)_
- **Auth** — `/login`, `/sso-login`, `/auth-test` (pantalla de prueba post-login)

---

## Organización ADO

- **Organización:** `AutoregPR`
- **Proyecto:** `Motorambar`
- **Repo:** `Motorambar`
- **Usuario QA:** Jhon Martinez — `jmartinez@portaldevehiculos.com`

---

## Terminología Literal (NO cambiar nombres)

| Término en sistema | Descripción |
|--------------------|-------------|
| `VehicleDocs` | Nombre/marca del producto mostrado en las pantallas de login |
| `Autoreg` | Sistema externo de SSO/identidad — origen del login principal |
| `Motorambar` / `DistributionCar` | Nombre del proyecto (Motorambar = nombre comercial/repo ADO; DistributionCar = nombre interno de la solución .NET) |
| `VIN` | Número de identificación del vehículo — campo de búsqueda principal en "Vehículos importados" |
| `CO` | "Certificado de Origen" — sección en el detalle de vehículo (badge de estado COMPLETADO/etc.), y badge junto a campos cuyo valor proviene de ese certificado (ej. "MARCA `CO`"). También filtro/columna "Estado CO" en el grid |
| `CPA` | "Certificado(s) de Pago de Arbitrios" — sección "CONTRATO DE COMPRA (CPA)" en el detalle de vehículo, módulo de importación `/import/cpa` ("Importar CPA"), categoría de documento "Certificado de Pago de Arbitrios" en el modal "Añadir Documento", y filtro/columna "Estado CPA" en el grid |
| `PDV` | "Portal de Vehículos" — sistema de Autoreg; mismo origen del login federado (SSO) |
| `PDV-Datos` / `PDV-Documentos` | Columnas del grid de "Vehículos importados" con indicador ✓/✕ de sincronización hacia **PDV (Portal de Vehículos / Autoreg)**. Existe también una entidad/cliente llamada "PDV" en la lista de "Asignar Cliente" (junto a POPULAR AUTO, FIRSTBANK, ORIENTAL BANK, TOYOTA CREDIT) — relación exacta entre la columna de sincronización y este cliente "PDV" _(pendiente confirmar)_ |
| `ParentLocation` | Agrupador de localidades — seed actual: "Banco Popular", "First Bank", "Oriental Bank" |
| `Dealer` | Tipo de localidad/cliente distribuidor — uno de los filtros de localidad (ícono carrito) |
| `Banco` | Tipo de localidad financiera — uno de los filtros de localidad (ícono casita) |
| `Docs Adicionales` / `DOCUMENTOS ADICIONALES` | Sección de documentos extra en la ficha de vehículo — categorías conocidas: "Carta Explicativa Exento de Arbitrios", "Certificado de Pago de Arbitrios", "Factura", "Otro" |

---

## Tecnología Frontend

- **Web App (único portal):** Next.js 16 (App Router) + React 19 + TypeScript
  - UI: Tailwind CSS 4, librería propia de componentes `Dc*` (DcButton, DcField, DcStepper, DcStatusBadge, DcSectionCard, etc.), íconos `lucide-react`
  - i18n: `next-intl` + `i18next`/`react-i18next` (es/en), archivos `_i18n/*.es.json` / `*.en.json` por módulo
  - Estado: Zustand (`useUserSession`, `useNotificationsStore`)
  - Data fetching: TanStack React Query + axios
  - Formularios: react-hook-form + zod
  - Realtime: SignalR (notificaciones)
  - Gráficos: recharts
  - Toasts: sonner

---

## Backend (referencia)

- .NET — Clean Architecture: `DistributionCar.API`, `.Application`, `.Domain`, `.Infrastructure`, `.Migrator`, `.Worker`
- Base de datos: PostgreSQL (`distribution_car_db`)
- Storage: Azure Blob Storage (Azurite en local)
- Mensajería: Azure Service Bus (emulador en local)

---

## Pendientes

- Detalle del módulo Admin (`/admin`) — depende de la integración del rol Sys Admin
- Significado exacto de "Estado CO" (badge en el grid de "Vehículos importados")
- Relación exacta entre la columna "PDV-Datos"/"PDV-Documentos" del grid y el cliente "PDV" del modal "Asignar Cliente"
- Aclarar si el stub `"Banco"` de `middleware.ts` se refiere al tipo de cliente (Dealer/Banco) o a un rol distinto
- Permisos detallados del rol "Sys Admin" (aún sin integrar en el sistema)
- Pasos 2 y 3 de "Importar CPA" ("Procesando VINs" / "Resumen") — falta screenshot real de la UI (ver `UI-UX.md`)
- Estados vacío/loading de Dashboard y grid ya documentados (ver `UI-UX.md`); falta: estados de **error** (API falla) en cualquier pantalla, y estados vacío/loading del **detalle de vehículo**
- Ruta/URL exacta del landing "Bienvenido" de PDV (ver `UI-UX.md` → "Autoreg / PDV")
- Texto exacto del botón secundario debajo de "INICIAR SESIÓN" en el login de Autoreg (no legible en captura — ver `UI-UX.md`)
