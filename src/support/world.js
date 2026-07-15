import { setWorldConstructor, World } from '@cucumber/cucumber';
import { LoginPage } from '../pages/LoginPage.js';

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
      loginPage: new LoginPage(this.page)
    };
  }
}

setWorldConstructor(CustomWorld);