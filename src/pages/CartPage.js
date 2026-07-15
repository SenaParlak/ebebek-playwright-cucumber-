import { expect } from '@playwright/test';
import { parsePrice } from '../utils/priceUtils.js';

export class CartPage {
  constructor(page) {
    this.page = page;

    this.productCards = page.locator(
      'eb-product-card, .product-card, .product-item'
    );

    this.goToCartButton = page.locator(
      'a:has-text("Sepete Git"), button:has-text("Sepete Git")'
    );

    this.continueShoppingButton = page.locator(
      'a:has-text("Alışverişe Devam Et"), button:has-text("Alışverişe Devam Et")'
    );

    this.cartItems = page.locator(
      '.cart-item, [class*="cart-item"], [class*="basket-item"]'
    );

    this.removeButtons = page.locator(
      'span.remove-item:has(img[alt="bin"]), span.remove-item:has(img[src*="cart-bin-icon"])'
    );

    this.expectedSubtotal = 0;
  }

  async addTwoDifferentProductsToCart() {
    await expect(this.productCards.first()).toBeVisible();

    await this.openProductDetailByIndex(0);
    await this.addProductToCartFromDetailPage();
    await this.closeCartModalIfVisible();

    await this.page.goBack();
    await expect(this.productCards.first()).toBeVisible();

    await this.openProductDetailByIndex(1);
    await this.addProductToCartFromDetailPage();
  }

  async openProductDetailByIndex(index) {
    const productCard = this.productCards.nth(index);

    await expect(productCard).toBeVisible();

    await productCard.scrollIntoViewIfNeeded();
    await productCard.click();

    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  }

  async addProductToCartFromDetailPage() {
    const addToCartButton = this.page.locator(
      'button:has-text("Sepete Ekle"), button:has-text("Sepete ekle"), button:has-text("SEPETE EKLE")'
    );

    await expect(addToCartButton.first()).toBeVisible();
    await addToCartButton.first().click();

    await expect(this.goToCartButton.first()).toBeVisible();
  }

  async closeCartModalIfVisible() {
    const isContinueShoppingVisible = await this.continueShoppingButton
      .first()
      .isVisible()
      .catch(() => false);

    if (isContinueShoppingVisible) {
      await this.continueShoppingButton.first().click();
      return;
    }

    await this.closeCartPanelIfStillOpen();
  }

  async goToCartPage() {
    await expect(this.goToCartButton.first()).toBeVisible();

    await this.goToCartButton.first().click();

    await this.page.waitForLoadState('domcontentloaded').catch(() => {});

    await this.closeCartPanelIfStillOpen();

    await expect
      .poll(
        async () => this.cartItems.count(),
        {
          timeout: 15000,
          message: 'Expected cart items to be visible on cart page'
        }
      )
      .toBeGreaterThan(0);
  }

  async closeCartPanelIfStillOpen() {
    const isCartPanelVisible = await this.goToCartButton
      .first()
      .isVisible()
      .catch(() => false);

    if (!isCartPanelVisible) {
      return;
    }

    const closeButton = this.page.locator(
      'button.close-button, button[aria-label="Close"], button[aria-label*="Kapat"], button[aria-label*="kapat"], [class*="close-button"]'
    );

    const closeButtonCount = await closeButton.count();

    for (let index = closeButtonCount - 1; index >= 0; index--) {
      const currentCloseButton = closeButton.nth(index);

      const isVisible = await currentCloseButton
        .isVisible()
        .catch(() => false);

      if (!isVisible) {
        continue;
      }

      await currentCloseButton
        .click({
          force: true,
          timeout: 2000
        })
        .catch(() => {});

      await expect(this.goToCartButton.first())
        .toBeHidden({
          timeout: 3000
        })
        .catch(() => {});

      const isPanelStillVisible = await this.goToCartButton
        .first()
        .isVisible()
        .catch(() => false);

      if (!isPanelStillVisible) {
        return;
      }
    }

    await this.page.keyboard.press('Escape').catch(() => {});

    await expect(this.goToCartButton.first())
      .toBeHidden({
        timeout: 3000
      })
      .catch(() => {});
  }

  async increaseFirstProductQuantity() {
    await expect(this.cartItems.first()).toBeVisible();

    const firstCartItem = this.cartItems.nth(0);

    const increaseButton = firstCartItem.locator(
      'button:has-text("+"), [aria-label*="artır"], [aria-label*="increase"], [class*="increase"], [class*="plus"]'
    );

    await expect(increaseButton.first()).toBeVisible();
    await increaseButton.first().click();

    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  }

  async removeSecondProductFromCart() {
    await expect
      .poll(
        async () => this.getVisibleLocatorCount(this.removeButtons),
        {
          timeout: 15000,
          message: 'Expected at least two remove buttons in the cart'
        }
      )
      .toBeGreaterThan(1);

    await this.clickVisibleLocatorByIndex(this.removeButtons, 1);

    await this.confirmRemoveFromSidePanel();

    await this.waitForSelectedProductCount(1);

    await this.calculateExpectedSubtotalFromRemainingProduct();
  }

  async confirmRemoveFromSidePanel() {
    const confirmRemoveButton = this.page.locator(
      'button.btn-remove:has-text("Sil")'
    );

    await expect(confirmRemoveButton.first()).toBeVisible({
      timeout: 15000
    });

    await confirmRemoveButton.first().click({
      timeout: 5000
    });

    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  }

  async waitForSelectedProductCount(expectedCount) {
    await expect
      .poll(
        async () => {
          const pageText = await this.page.locator('body').innerText();

          const match = pageText.match(
            /Seçili\s*Ürünler\s*\((\d+)\)/i
          );

          return match ? Number(match[1]) : null;
        },
        {
          timeout: 15000,
          message: `Expected selected product count to be ${expectedCount}`
        }
      )
      .toBe(expectedCount);
  }

  async calculateExpectedSubtotalFromRemainingProduct() {
    await expect(this.cartItems.first()).toBeVisible();

    const remainingCartText = await this.cartItems.first().innerText();

    this.expectedSubtotal = parsePrice(remainingCartText);
  }

  async verifySubtotalCalculatedCorrectly() {
    const actualSubtotal = await this.getSubtotalAmount();

    expect(
      actualSubtotal,
      `Expected subtotal to be ${this.expectedSubtotal}, but actual subtotal was ${actualSubtotal}`
    ).toBeCloseTo(this.expectedSubtotal, 2);
  }

  async getSubtotalAmount() {
    const pageText = await this.page.locator('body').innerText();

    const productsTotalMatch = pageText.match(
      /Ürünler\s*Toplamı\s*([\d.]+,\d{2})\s*TL/i
    );

    if (!productsTotalMatch) {
      throw new Error(
        `Ürünler Toplamı price could not be found. Page text: ${pageText}`
      );
    }

    const discountMatch = pageText.match(
      /Toplam\s*İndirim\s*Tutarı\s*-?\s*([\d.]+,\d{2})\s*TL/i
    );

    const productsTotal = parsePrice(productsTotalMatch[1]);
    const discountTotal = discountMatch ? parsePrice(discountMatch[1]) : 0;

    return Number((productsTotal - discountTotal).toFixed(2));
  }

  async getVisibleLocatorCount(locator) {
    const count = await locator.count();
    let visibleCount = 0;

    for (let index = 0; index < count; index++) {
      const isVisible = await locator
        .nth(index)
        .isVisible()
        .catch(() => false);

      if (isVisible) {
        visibleCount++;
      }
    }

    return visibleCount;
  }

  async clickVisibleLocatorByIndex(locator, visibleIndex) {
    const count = await locator.count();
    let currentVisibleIndex = 0;

    for (let index = 0; index < count; index++) {
      const currentLocator = locator.nth(index);

      const isVisible = await currentLocator
        .isVisible()
        .catch(() => false);

      if (!isVisible) {
        continue;
      }

      if (currentVisibleIndex === visibleIndex) {
        await currentLocator.click({
          timeout: 5000
        });

        return;
      }

      currentVisibleIndex++;
    }

    throw new Error(`Visible locator index not found: ${visibleIndex}`);
  }
}