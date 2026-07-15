import { Given, When, Then } from '@cucumber/cucumber';
import { config } from '../utils/config.js';

Given('User is on the e-bebek home page', async function () {
  await this.pages.loginPage.openHomePage();
});

When('User navigates to the login page', async function () {
  await this.pages.loginPage.goToLoginPage();
});

When('User logs in with valid email credentials', async function () {
  await this.pages.loginPage.loginWithEmail(
    config.user.email,
    config.user.password
  );
});

When('User logs in with valid phone credentials', async function () {
  await this.pages.loginPage.loginWithPhone(
    config.user.phone,
    config.user.password
  );
});

Then('User should verify successful login', async function () {
  await this.pages.loginPage.verifyLoginSuccess();
});