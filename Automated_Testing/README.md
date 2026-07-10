# Automated Testing - TC 11454

Pruebas automatizadas E2E con Playwright para Motorambar.

## TC 11454: Autoreg-Acceso-Login-Redirección federada [Credenciales válidas]

**Flujo:**
1. Login en Autoreg (testwaf.portaldevehiculos.com)
2. Manejar modal de Términos y Condiciones (si aparece)
3. Clic en botón "Portal Distribuidor" 
4. Verificar carga exitosa de Motorambar en nueva pestaña

---

## 📋 Requisitos Previos

- Node.js 16+ instalado
- Credenciales de acceso configuradas en `.env`

---

## 🚀 Instalación

```bash
npm install
npx playwright install chromium
```

---

## ⚙️ Configuración

El archivo `.env` contiene las credenciales y URL base:

```env
BASE_URL=https://testwaf.portaldevehiculos.com
TEST_USER_MOTORAMBAR_DISTRIBUIDOR=motorambar.distribuidor
TEST_PASS_MOTORAMBAR_DISTRIBUIDOR=123456
```

---

## ▶️ Ejecución de Tests

### Modo normal (headed - con UI visible)
```bash
npm test
```

### Modo lento (800ms por acción - para verificación visual)
```bash
npm run test:slow
```

### Modo debug (paso a paso con Playwright Inspector)
```bash
npm run test:debug
```

### Ejecutar test específico
```bash
npx playwright test tc-11454-sso-login --headed
```

### Modo headless (sin UI - para CI/CD)
```bash
npx playwright test tc-11454-sso-login
```

---

## 📊 Reportes

Generar y ver el reporte HTML con screenshots:

```bash
npm run report
```

El reporte incluye:
- ✅ Estado de cada test (passed/failed)
- 📸 Screenshots de evidencia en cada paso
- ⏱️ Tiempos de ejecución
- 📝 Anotaciones con TC ID y detalles

---

## 📁 Estructura del Proyecto

```
Automated_Testing/
├── fixtures/
│   ├── tc-11454-sso-login.fixture.ts  # Page Objects y helpers
│   └── files/
│       └── dummy.pdf                   # Archivo de prueba
├── tests/
│   └── tc-11454-sso-login.spec.ts     # Test del TC 11454
├── playwright.config.ts                # Configuración de Playwright
├── .env                                # Credenciales (no versionar)
├── package.json
└── README.md
```

---

## 📸 Screenshots de Evidencia

El test captura screenshots en estos puntos:

| Nombre | Momento | Propósito |
|--------|---------|-----------|
| `01-login-page-cargada` | Página de login visible | Verificar estado inicial |
| `01-credenciales-ingresadas` | Usuario/contraseña llenos | **OBLIGATORIO**: evidencia de datos ingresados |
| `02-dashboard-autoreg-cargado` | Post-login exitoso | Verificar acceso a Autoreg |
| `02-modal-tyc-aceptado` | Modal T&C cerrado | Solo si modal aparece |
| `03-antes-click-portal-distribuidor` | Antes del clic | Estado previo a navegación |
| `04-motorambar-cargado` | Motorambar en nueva pestaña | Verificar redirección SSO |
| `99-resultado-final` | Estado final | Evidencia de test exitoso |

---

## 🔧 Troubleshooting

### El test falla en el login
- Verificar credenciales en `.env`
- Verificar que la URL base sea correcta
- Ejecutar en modo `--headed` para ver el error visual

### El test no encuentra el botón "Portal Distribuidor"
- El usuario puede no tener permisos de "Distribuidor"
- Ejecutar con `test:debug` para inspeccionar el DOM

### Timeout en la carga de Motorambar
- La aplicación puede estar lenta
- Aumentar timeout en `playwright.config.ts`: `timeout: 180_000`

---

## 📝 Mantenimiento

### Agregar nuevos tests
1. Crear fixture en `fixtures/<nombre>.fixture.ts`
2. Crear spec en `tests/<nombre>.spec.ts`
3. Seguir patrón de screenshots obligatorios
4. Ejecutar y validar que pasa

### Actualizar selectores
- Verificar cambios en el DOM con: `npx playwright codegen <URL>`
- Actualizar selectores en el fixture correspondiente
- Prioridad de selectores: `#id` > `[name]` > `data-*` > role > texto

---

## 🎯 Estado Actual

| TC | Nombre | Estado | Última Ejecución |
|----|--------|--------|------------------|
| 11454 | SSO Login y Redirección | ✅ PASS | 2026-06-24 |

---

## 📞 Soporte

- **Documentación Playwright**: https://playwright.dev
- **Skills del agente**: `.claude/skills/playwright-e2e/SKILL.md`
- **Contexto del proyecto**: `../context/CONTEXT.md`
