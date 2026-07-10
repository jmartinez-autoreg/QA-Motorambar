import { Page, Locator, expect } from '@playwright/test';

/**
 * Fixture para TC 11454: Autoreg-Acceso-Login-Redirección federada [Credenciales válidas]
 * 
 * Flujo SSO: Login Autoreg → Landing PDV → Botón Portal Distribuidor → Motorambar
 */

// ══════════════════════════════════════════════════════════════
// SELECTORES — Verificados en DOM real
// ══════════════════════════════════════════════════════════════

export const SEL = {
  // ── PANTALLA 1 — Login Autoreg ────────────────────────────
  // URL: https://testwaf.portaldevehiculos.com/Forms/Account/LoginNew.aspx
  // LOCATOR_EVIDENCE: Verificado via DOM inspection 2026-06-24
  loginPage: {
    usernameInput: '#LoginUser_UserName',        // ID único ✅ PRIORITY 1
    passwordInput: '#LoginUser_Password',        // ID único ✅ PRIORITY 1
    submitButton:  '#btnTriggerLogin',           // ID único ✅ PRIORITY 1 (DIV clickeable, no input)
  },

  // ── PANTALLA 2 — Landing PDV (después de login) ──────────
  // URL: https://testwaf.portaldevehiculos.com/Default.aspx
  landingPage: {
    roleLabel: '#lblRole',                       // Muestra "Distribuidor" - para verificación
    // Botón Portal Distribuidor: se usa getByRole por ser más estable en este contexto
  },

  // ── PANTALLA 3 — Modal T&C (condicional) ─────────────────
  // Aparece solo en primera sesión
  termsModal: {
    // Selectores condicionales - se manejan con try/catch en el fixture
  },

  // ── PANTALLA 4 — Dashboard Motorambar (nueva pestaña) ────
  // URL: https://motorambartest.portaldevehiculos.com/
  motorambar: {
    // Verificación por URL + networkidle (sin selectores inventados)
  },
};

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

/**
 * Esperar que la página esté completamente cargada
 * Variante A: ASP.NET WebForms con UpdatePanel
 */
export async function waitForPageIdle(page: Page, timeout = 20_000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
  await page.waitForFunction(() => {
    const prm = (window as any).Sys?.WebForms?.PageRequestManager?.getInstance?.();
    return !prm || !prm.get_isInAsyncPostBack();
  }, { timeout }).catch(() => {});
}

// ══════════════════════════════════════════════════════════════
// PAGE OBJECTS
// ══════════════════════════════════════════════════════════════

/**
 * Página de Login de Autoreg
 */
export class AutoregLoginPage {
  constructor(private page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/Forms/Account/LoginNew.aspx');
    await waitForPageIdle(this.page);
  }

  async fillCredentials(username: string, password: string): Promise<void> {
    await this.page.locator(SEL.loginPage.usernameInput).fill(username);
    await this.page.locator(SEL.loginPage.passwordInput).fill(password);
    // NO hace clic - permite capturar screenshot antes del submit
  }

  async submit(): Promise<void> {
    await this.page.locator(SEL.loginPage.submitButton).click();
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillCredentials(username, password);
    await this.submit();
  }
}

/**
 * Página de Landing PDV (post-login)
 */
export class AutoregLandingPage {
  constructor(private page: Page) {}

  async waitForLoad(): Promise<void> {
    await this.page.waitForURL('**/Default.aspx', { timeout: 30_000 });
    await waitForPageIdle(this.page);
    // Verificar que el rol se muestre
    await expect(this.page.locator(SEL.landingPage.roleLabel)).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Maneja modal de Términos y Condiciones si aparece
   * Usa try/catch condicional - no es un error si no aparece
   */
  async handleOptionalTermsModal(): Promise<boolean> {
    try {
      // Esperar el modal con timeout corto (4s)
      // Ajustar selector cuando se documente el modal en UI-UX.md
      const modal = this.page.locator('[id*="Terms"], [id*="Modal"], .modal');
      await modal.waitFor({ state: 'visible', timeout: 4_000 });
      
      // Si llegamos aquí, el modal apareció → interactuar
      // Marcar los 4 checkboxes (ajustar selectores según DOM real)
      const checkboxes = this.page.locator('input[type="checkbox"]');
      const count = await checkboxes.count();
      for (let i = 0; i < Math.min(count, 4); i++) {
        await checkboxes.nth(i).click();
      }
      
      // Clic en botón Continuar
      await this.page.getByRole('button', { name: /continuar/i }).click();
      await modal.waitFor({ state: 'hidden', timeout: 5_000 });
      
      return true; // Modal apareció y fue manejado
    } catch {
      // Timeout → modal no apareció → no es un error
      return false;
    }
  }

  /**
   * Hace clic en "Portal Distribuidor" y retorna la nueva pestaña
   */
  async clickPortalDistribuidor(): Promise<Page> {
    const popupPromise = this.page.waitForEvent('popup', { timeout: 30_000 });
    
    // Usar getByRole que funciona en este contexto
    await this.page.getByRole('button', { name: 'Portal Distribuidor' }).click();
    
    const popup = await popupPromise;
    return popup;
  }
}

/**
 * Dashboard de Motorambar (nueva pestaña/dominio)
 */
export class MotorambarDashboard {
  constructor(private page: Page) {}

  async waitForLoad(): Promise<void> {
    // Verificación mínima confiable: URL + networkidle
    // NO inventar selectores del dominio destino sin discovery previo
    await this.page.waitForLoadState('networkidle', { timeout: 45_000 });
    await expect(this.page).toHaveURL(/motorambartest\.portaldevehiculos\.com/, { timeout: 15_000 });
  }
}
