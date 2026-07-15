import { expect } from '@playwright/test';
import { parsePrice } from '../utils/priceUtils.js';

export class CartStatePage {
  constructor(page) {
    this.page = page;

    this.productCards = page.locator(
      'eb-product-card, .product-card, .product-item'
    );

    this.goToCartButton = page.locator(
      'a:has-text("Sepete Git"), button:has-text("Sepete Git")'
    );

    this.cartItems = page.locator(
      '.cart-item, [class*="cart-item"], [class*="basket-item"]'
    );
  }

  async addSingleProductToCartAsGuest() {
    await this.page.goto('/');

    await expect(this.productCards.first()).toBeVisible({
      timeout: 15000
    });

    await this.openProductDetailByIndex(0);

    await this.addProductToCartFromDetailPage();

    await this.goToCartPageFromMiniCart();
  }

  async openProductDetailByIndex(index) {
    const productCard = this.productCards.nth(index);

    await expect(productCard).toBeVisible({
      timeout: 15000
    });

    await productCard.scrollIntoViewIfNeeded();

    await productCard.click({
      timeout: 5000
    });

    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  }

  async addProductToCartFromDetailPage() {
    const addToCartButton = this.page.locator(
      'button:has-text("Sepete Ekle"), button:has-text("Sepete ekle"), button:has-text("SEPETE EKLE")'
    );

    await expect(addToCartButton.first()).toBeVisible({
      timeout: 15000
    });

    await expect(addToCartButton.first()).toBeEnabled({
      timeout: 15000
    });

    await addToCartButton.first().click({
      timeout: 5000
    });

    await expect(this.goToCartButton.first()).toBeVisible({
      timeout: 15000
    });
  }

  async goToCartPageFromMiniCart() {
    await expect(this.goToCartButton.first()).toBeVisible({
      timeout: 15000
    });

    await this.goToCartButton.first().click({
      timeout: 5000
    });

    await this.page.waitForLoadState('domcontentloaded').catch(() => {});

    await expect
      .poll(
        async () => this.cartItems.count(),
        {
          timeout: 15000,
          message: 'Expected cart item to be visible on cart page'
        }
      )
      .toBeGreaterThan(0);
  }

  async openLoginPageDirectly() {
    await this.page.goto('/login');

    await this.page.waitForLoadState('domcontentloaded').catch(() => {});

    await expect(this.page.locator('#btnLoginWithEmail')).toBeVisible({
      timeout: 15000
    });
  }

 async verifyLoginSuccessByLogoutButton() {
   const loginWithEmailButton = this.page.locator('#btnLoginWithEmail');
   const passwordInput = this.page.locator('#txtPassword');

   await expect(loginWithEmailButton).toBeHidden({
     timeout: 15000
   });

   await expect(passwordInput).toBeHidden({
     timeout: 15000
   });
 }

  async getCurrentCartState() {
    await expect(this.cartItems.first()).toBeVisible({
      timeout: 15000
    });

    const pageText = await this.page.locator('body').innerText();
    const cartText = await this.cartItems.first().innerText();
    const productName = this.getProductNameFromCartText(cartText);
    const selectedProductCount = this.getSelectedProductCountFromText(pageText);
    const subtotal = await this.getSubtotalAmount();

    return {
      pageText,
      cartText,
      productName,
      selectedProductCount,
      subtotal
    };
  }

  async openCartFromHeader() {
    await this.page.goto('/');

    await this.page.keyboard.press('Escape').catch(() => {});

    const cartHeaderButton = this.page.locator(
      'a[href*="sepet"], a[href*="cart"], button:has-text("Sepet"), button:has-text("Sepetim"), [aria-label*="sepet"], [aria-label*="Sepet"]'
    );

    await this.clickFirstVisibleLocator(
      cartHeaderButton,
      'Cart header button'
    );

    await this.page.waitForLoadState('domcontentloaded').catch(() => {});

    const isMiniCartVisible = await this.goToCartButton
      .first()
      .isVisible()
      .catch(() => false);

    if (isMiniCartVisible) {
      await this.goToCartButton.first().click({
        timeout: 5000
      });

      await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    }

    await expect
      .poll(
        async () => this.cartItems.count(),
        {
          timeout: 15000,
          message: 'Expected cart item to be visible after login'
        }
      )
      .toBeGreaterThan(0);
  }

  async verifyCartStatePreserved(expectedCartState) {
    if (!expectedCartState) {
      throw new Error('Guest cart state was not saved in World context');
    }

    const currentCartState = await this.getCurrentCartState();

    expect(
      currentCartState.pageText,
      'Expected guest cart product to be preserved after login'
    ).toContain(expectedCartState.productName);

    expect(
      currentCartState.selectedProductCount,
      `Expected selected product count to be preserved. Expected: ${expectedCartState.selectedProductCount}, Actual: ${currentCartState.selectedProductCount}`
    ).toBeGreaterThanOrEqual(expectedCartState.selectedProductCount);

    expect(
      currentCartState.subtotal,
      'Expected cart subtotal to be greater than zero after login'
    ).toBeGreaterThan(0);
  }

  getProductNameFromCartText(cartText) {
    const lines = cartText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const productName = lines.find(line => {
      const lowerLine = line.toLocaleLowerCase('tr-TR');

      return (
        !lowerLine.includes('tl') &&
        !lowerLine.includes('adet') &&
        !lowerLine.includes('sil') &&
        !lowerLine.includes('kargo') &&
        !lowerLine.includes('teslimat') &&
        line.length > 3
      );
    });

    if (!productName) {
      throw new Error(`Product name could not be parsed: ${cartText}`);
    }

    return productName;
  }

  getSelectedProductCountFromText(pageText) {
    const selectedProductMatch = pageText.match(
      /Seçili\s*Ürünler\s*\((\d+)\)/i
    );

    if (!selectedProductMatch) {
      return 0;
    }

    return Number(selectedProductMatch[1]);
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

  async clickFirstVisibleLocator(locator, locatorName) {
    let lastError;

    for (let attempt = 0; attempt < 5; attempt++) {
      const locatorCount = await locator.count().catch(() => 0);

      for (let index = 0; index < locatorCount; index++) {
        const currentLocator = locator.nth(index);

        const isVisible = await currentLocator
          .isVisible()
          .catch(() => false);

        if (!isVisible) {
          continue;
        }

        try {
          await currentLocator.evaluate(element => element.click());

          return;
        } catch (error) {
          lastError = error;
        }
      }

      await this.page.waitForTimeout(500);
    }

    throw new Error(
      `${locatorName} could not be clicked. Last error: ${lastError?.message}`
    );
  }
}