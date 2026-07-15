import { When, Then } from '@cucumber/cucumber';

When('User logs out', async function () {
  await this.pages.loginPage.logout();
});

Then('User should verify logout success', async function () {
  await this.pages.loginPage.verifyLogoutSuccess();
});