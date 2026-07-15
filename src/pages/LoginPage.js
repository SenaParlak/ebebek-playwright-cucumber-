import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.accountMenu = page.locator('#lnkMyAccount');
    this.loginWithEmailButton = page.locator('#btnLoginWithEmail');
    this.emailInput = page.locator('#txtEmail');
    this.phoneInput = page.locator('#txtPhoneNumberMobile');
    this.emailOrPhoneLoginButton = page.locator("button[type='submit']");
    this.passwordInput = page.locator('#txtPassword');
    this.loginButton = page.locator('#btnSubmitPassword');
    this.logoutButton = page.locator('#lnkSignOutNavNode');
  }

  async openHomePage() {
    await this.page.goto('/');
  }

  async goToLoginPage() {
    await expect(this.accountMenu).toBeVisible();
    await this.accountMenu.click();
  }

  async loginWithEmail(email, password) {
    await expect(this.loginWithEmailButton).toBeVisible();
    await this.loginWithEmailButton.click();

    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);

    await expect(this.emailOrPhoneLoginButton).toBeVisible();
    await this.emailOrPhoneLoginButton.click();

    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);

    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
  }

  async loginWithPhone(phone, password) {
    await expect(this.phoneInput).toBeVisible();
    await this.phoneInput.fill(phone);

    await expect(this.emailOrPhoneLoginButton).toBeVisible();
    await this.emailOrPhoneLoginButton.click();

    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);

    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
  }

  async attemptEmailLogin(email, password) {
    await expect(this.loginWithEmailButton).toBeVisible();
    await this.loginWithEmailButton.click();

    await expect(this.emailInput).toBeVisible();
    await this.emailInput.fill(email);

    if (!email) {
      await this.emailInput.blur();
      return;
    }

    await expect(this.emailOrPhoneLoginButton).toBeVisible();
    await this.emailOrPhoneLoginButton.click();

    const isPasswordVisible = await this.passwordInput
      .waitFor({
        state: 'visible',
        timeout: 5000
      })
      .then(() => true)
      .catch(() => false);

    if (!isPasswordVisible) {
      return;
    }

    await this.passwordInput.fill(password);

    if (!password) {
      await this.passwordInput.blur();
      return;
    }

    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
  }

  async verifyLoginSuccess() {
    await expect(this.accountMenu).toBeVisible();
    await this.accountMenu.click();

    await expect(this.logoutButton).toBeVisible();
  }

async verifyLoginErrorMessage(expectedError) {
  const errorMessage = this.page
    .getByText(expectedError, { exact: false })
    .filter({ visible: true })
    .first();

  await expect(errorMessage).toBeVisible();

  const actualMessage = await errorMessage.innerText();

  if (
    expectedError.includes(
      'Kullanıcı adı veya parolanız hatalıdır'
    )
  ) {
    expect(actualMessage).toMatch(
      /Kalan deneme hakkınız\s*:\s*\d+/
    );
  }
}

  async verifyRegisterPage(expectedValue) {
    await expect(
      this.page.getByRole('heading', { name: expectedValue })
    ).toBeVisible();
  }

  async verifyNegativeLoginResult(expectedResult, expectedValue) {
    const resultAssertions = {
      error: async () => {
        await this.verifyLoginErrorMessage(expectedValue);
      },

      register_page: async () => {
        await this.verifyRegisterPage(expectedValue);
      }
    };

    const assertion = resultAssertions[expectedResult];

    if (!assertion) {
      throw new Error(
        `Unsupported expected result type: ${expectedResult}`
      );
    }

    await assertion();
  }

  async logout() {
    await expect(this.accountMenu).toBeVisible();

    if (!(await this.logoutButton.isVisible())) {
      await this.accountMenu.click();
    }

    await expect(this.logoutButton).toBeVisible();
    await this.logoutButton.click();
  }

  async verifyLogoutSuccess() {
    await expect(this.accountMenu).toBeVisible();
    await this.accountMenu.click();

    await expect(this.loginWithEmailButton).toBeVisible();
  }
}