import { setWorldConstructor, World } from '@cucumber/cucumber';
import { LoginPage } from '../pages/LoginPage.js';
import { SearchPage } from '../pages/SearchPage.js';

class CustomWorld extends World {
  constructor(options) {
    super(options);

    this.browser = null;
    this.context = null;
    this.page = null;

    this.pages = {};
    this.testData = {};
  }

  initializePages() {
    this.pages = {
      loginPage: new LoginPage(this.page),
      searchPage: new SearchPage(this.page)
    };
  }
}

setWorldConstructor(CustomWorld);