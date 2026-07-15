import { When, Then } from '@cucumber/cucumber';

When('User adds two different products to the cart', async function () {
  await this.pages.cartPage.addTwoDifferentProductsToCart();
});

When('User goes to the cart page', async function () {
  await this.pages.cartPage.goToCartPage();
});

When('User increases the quantity of the first product', async function () {
  await this.pages.cartPage.increaseFirstProductQuantity();
});

When('User removes the second product from the cart', async function () {
  await this.pages.cartPage.removeSecondProductFromCart();
});

Then('Cart subtotal should be calculated correctly', async function () {
  await this.pages.cartPage.verifySubtotalCalculatedCorrectly();
});