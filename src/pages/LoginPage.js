import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.accountMenu = page.locator('#lnkMyAccount');
    this.loginWithEmail = page.locator('#btnLoginWithEmail');
    this.emailInput = page.locator('#txtEmail');
    this.emailLoginButton = page.locator("button[type='submit']");
    this.passwordInput = page.locator('#txtPassword');
    this.loginButton = page.locator('#btnSubmitPassword');
    this.logoutButton = page.locator('#lnkSignOutNavNode');
  }

  async openHomePage() {
    await this.page.goto('/');
  }

  async goToLoginPage() {
    await this.accountMenu.click();
    await this.loginWithEmail.click();
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.emailLoginButton.click();
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyLoginSuccess() {
    await this.accountMenu.click();
    await expect(this.logoutButton).toBeVisible();
  }
}