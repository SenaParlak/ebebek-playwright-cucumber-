import {
  Before,
  After,
  BeforeAll,
  AfterAll,
  Status,
  setDefaultTimeout
} from '@cucumber/cucumber';

import { launchBrowser } from './browserManager.js';
import { config } from '../utils/config.js';

let browser;

setDefaultTimeout(config.timeout);

BeforeAll(async function () {
  browser = await launchBrowser();
});

Before(async function () {
  this.browser = browser;

  this.context = await browser.newContext({
    baseURL: config.baseUrl,
    viewport: {
      width: 1440,
      height: 900
    }
  });

  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(config.timeout);

  this.initializePages();
});

After(async function ({ result }) {
  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({
      fullPage: true
    });

    await this.attach(screenshot, 'image/png');
  }

  if (this.context) {
    await this.context.close();
  }
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});