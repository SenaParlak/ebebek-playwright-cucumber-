import { expect } from '@playwright/test';

function normalizeText(text) {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/\s+/g, ' ')
    .trim();
}

export class SearchPage {
  constructor(page) {
    this.page = page;

    this.searchInput = page.locator('#txtSearchBox');
    this.searchOpenButton = page.locator('button.search-back.search-on-close.search-on');
    this.productCards = page.locator('eb-product-card, .product-card, .product-item');
  }

  async searchFor(searchTerm) {
    await expect(this.searchOpenButton).toBeVisible();
    await this.searchOpenButton.click();

    await expect(this.searchInput).toBeVisible();
    await expect(this.searchInput).toBeEditable();

    await this.typeSearchTerm(searchTerm);

    await expect(this.searchInput).toHaveValue(searchTerm);

    await this.searchInput.press('Enter');

    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  }

  async typeSearchTerm(searchTerm) {
    await this.searchInput.click();

    await this.page.keyboard.press('Meta+A');
    await this.page.keyboard.press('Backspace');

    await this.page.keyboard.type(searchTerm, {
      delay: 80
    });
  }

  async verifyResultsRelatedTo(expectedKeyword) {
    const normalizedExpectedKeyword = normalizeText(expectedKeyword);

    await expect
      .poll(
        async () => {
          const productTexts = await this.getVisibleProductTexts();

          return productTexts.some(productText =>
            normalizeText(productText).includes(normalizedExpectedKeyword)
          );
        },
        {
          timeout: 15000,
          message: `Expected at least one visible product to be related to "${expectedKeyword}"`
        }
      )
      .toBeTruthy();
  }

  async verifyNoMatchingSearchResult(searchTerm) {
    await expect
      .poll(
        async () => {
          const productTexts = await this.getVisibleProductTexts();

          return productTexts.length;
        },
        {
          timeout: 15000,
          message: 'Expected recommendation or product list to be displayed'
        }
      )
      .toBeGreaterThan(0);

    const productTexts = await this.getVisibleProductTexts();
    const normalizedSearchTerm = normalizeText(searchTerm);

    const hasMatchingResult = productTexts.some(productText =>
      normalizeText(productText).includes(normalizedSearchTerm)
    );

    expect(
      hasMatchingResult,
      `Expected no visible product to match "${searchTerm}", but matching item was found. Visible products: ${productTexts.join(
        ' | '
      )}`
    ).toBeFalsy();
  }

  async verifyRecommendedProductsDisplayed() {
    await expect
      .poll(
        async () => {
          const productTexts = await this.getVisibleProductTexts();

          return productTexts.length;
        },
        {
          timeout: 15000,
          message: 'Expected recommended products to be displayed'
        }
      )
      .toBeGreaterThan(0);
  }

  async getVisibleProductTexts() {
    const productCount = await this.productCards.count();
    const visibleProductTexts = [];

    for (let index = 0; index < productCount; index++) {
      const productCard = this.productCards.nth(index);

      const isVisible = await productCard
        .isVisible()
        .catch(() => false);

      if (!isVisible) {
        continue;
      }

      const productText = await productCard
        .innerText()
        .catch(() => '');

      if (productText.trim()) {
        visibleProductTexts.push(productText);
      }

      if (visibleProductTexts.length === 5) {
        break;
      }
    }

    return visibleProductTexts;
  }
}