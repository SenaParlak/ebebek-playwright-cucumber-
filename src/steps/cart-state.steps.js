import { When, Then } from '@cucumber/cucumber';
import { config } from '../utils/config.js';

When('Guest user adds a product to the cart', async function () {
  await this.pages.cartStatePage.addSingleProductToCartAsGuest();
});

When('Guest cart state is saved', async function () {
  this.testData.guestCartState =
    await this.pages.cartStatePage.getCurrentCartState();
});

When('User logs in from the same browser session', async function () {
  await this.pages.cartStatePage.openLoginPageDirectly();

  await this.pages.loginPage.loginWithEmail(
    config.user.email,
    config.user.password
  );

  await this.pages.cartStatePage.verifyLoginSuccessByLogoutButton();
});

When('User opens the cart page from header', async function () {
  await this.pages.cartStatePage.openCartFromHeader();
});

Then('Guest cart state should be preserved after login', async function () {
  await this.pages.cartStatePage.verifyCartStatePreserved(
    this.testData.guestCartState
  );
});