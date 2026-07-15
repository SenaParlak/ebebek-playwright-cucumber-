import { When, Then } from '@cucumber/cucumber';

When('User searches for no result term {string}', async function (searchTerm) {
  this.testData.searchTerm = searchTerm;

  await this.pages.searchPage.searchFor(searchTerm);
});

Then(
  'User should verify no matching search result is displayed for {string}',
  async function (searchTerm) {
    await this.pages.searchPage.verifyNoMatchingSearchResult(searchTerm);
  }
);

Then('Recommended products should be displayed', async function () {
  await this.pages.searchPage.verifyRecommendedProductsDisplayed();
});