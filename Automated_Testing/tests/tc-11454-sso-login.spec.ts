import { test, expect } from '@playwright/test';
import {
  AutoregLoginPage,
  AutoregLandingPage,
  MotorambarDashboard,
  waitForPageIdle,
} from '../fixtures/tc-11454-sso-login.fixture';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * TC 11454: Autoreg-Acceso-Login-Redirección federada [Credenciales válidas]
 * 
 * Flujo:
 * 1. Login en Autoreg (testwaf.portaldevehiculos.com)
 * 2. (Condicional) Manejar modal T&C si aparece
 * 3. Clic en botón "Portal Distribuidor"
 * 4. Verificar carga de Motorambar en nueva pestaña
 */

test.describe('TC 11454 - SSO Login y Redirección Federada', () => {
  
  test('debe completar login SSO y redirigir a Motorambar correctamente', async ({ page }, testInfo) => {
    // ══════════════════════════════════════════════════════════
    // SETUP - Helper para screenshots con testInfo.attach()
    // ══════════════════════════════════════════════════════════
    
    const ss = async (name: string) => {
      const buf = await page.screenshot({ fullPage: true });
      await testInfo.attach(name, { body: buf, contentType: 'image/png' });
    };

    // ══════════════════════════════════════════════════════════
    // CREDENCIALES desde .env
    // ══════════════════════════════════════════════════════════
    
    const username = process.env.TEST_USER_MOTORAMBAR_DISTRIBUIDOR;
    const password = process.env.TEST_PASS_MOTORAMBAR_DISTRIBUIDOR;

    if (!username || !password) {
      throw new Error('Credenciales faltantes en .env - verifica TEST_USER_MOTORAMBAR_DISTRIBUIDOR y TEST_PASS_MOTORAMBAR_DISTRIBUIDOR');
    }

    // ══════════════════════════════════════════════════════════
    // STEP 1 — Login en Autoreg
    // ══════════════════════════════════════════════════════════
    
    const loginPage = new AutoregLoginPage(page);
    
    await loginPage.goto();
    await ss('01-login-page-cargada');
    
    // Llenar credenciales (sin submit todavía)
    await loginPage.fillCredentials(username, password);
    await ss('01-credenciales-ingresadas'); // ✅ OBLIGATORIO: usuario visible antes del submit
    
    // Submit y esperar navegación
    await loginPage.submit();
    
    // ══════════════════════════════════════════════════════════
    // STEP 2 — Verificar Dashboard de Autoreg + Manejar Modal T&C
    // ══════════════════════════════════════════════════════════
    
    const landingPage = new AutoregLandingPage(page);
    await landingPage.waitForLoad();
    await ss('02-dashboard-autoreg-cargado');
    
    // Modal T&C condicional
    const modalAppeared = await landingPage.handleOptionalTermsModal();
    if (modalAppeared) {
      await ss('02-modal-tyc-aceptado');
    }
    
    // ══════════════════════════════════════════════════════════
    // STEP 3 — Clic en "Portal Distribuidor"
    // ══════════════════════════════════════════════════════════
    
    await ss('03-antes-click-portal-distribuidor');
    
    const motorambarPage = await landingPage.clickPortalDistribuidor();
    
    // Helper para screenshots de la nueva pestaña
    const ssPop = async (name: string) => {
      const buf = await motorambarPage.screenshot({ fullPage: true });
      await testInfo.attach(name, { body: buf, contentType: 'image/png' });
    };
    
    // ══════════════════════════════════════════════════════════
    // STEP 4 — Verificar Motorambar (nueva pestaña)
    // ══════════════════════════════════════════════════════════
    
    const motorambar = new MotorambarDashboard(motorambarPage);
    await motorambar.waitForLoad();
    
    await ssPop('04-motorambar-cargado');
    
    // Verificación explícita de URL destino
    expect(motorambarPage.url()).toContain('motorambartest.portaldevehiculos.com');
    
    await ssPop('99-resultado-final');
    
    // ══════════════════════════════════════════════════════════
    // ANOTACIONES (para el reporte)
    // ══════════════════════════════════════════════════════════
    
    testInfo.annotations.push({
      type: 'Test Case ADO',
      description: 'TC 11454',
    });
    
    testInfo.annotations.push({
      type: 'Resultado',
      description: `Login SSO exitoso - Usuario: ${username} - Motorambar cargado en nueva pestaña`,
    });
  });
});
