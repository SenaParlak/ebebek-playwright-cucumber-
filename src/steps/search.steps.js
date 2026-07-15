import { When, Then } from '@cucumber/cucumber';

When('User searches for result term {string}', async function (searchTerm) {
  this.testData.searchTerm = searchTerm;

  await this.pages.searchPage.searchFor(searchTerm);
});

Then('Search results should be related to {string}', async function (expectedKeyword) {
  await this.pages.searchPage.verifyResultsRelatedTo(expectedKeyword);
});