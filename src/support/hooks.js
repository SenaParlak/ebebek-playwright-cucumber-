import {
  BeforeAll,
  Before,
  After,
  AfterAll,
  Status,
  setDefaultTimeout
} from '@cucumber/cucumber';

import { config } from '../utils/config.js';
import { launchBrowser } from './browserManager.js';

let browser;

setDefaultTimeout(60 * 1000);

BeforeAll(async function () {
  browser = await launchBrowser();
});

Before(async function () {
  this.browser = browser;

  this.context = await browser.newContext({
    baseURL: config.baseUrl
  });

  this.page = await this.context.newPage();

  this.initializePages();
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.page.screenshot({
      fullPage: true
    });

    await this.attach(screenshot, 'image/png');
  }

  await this.page.close();
  await this.context.close();
});

AfterAll(async function () {
  await browser.close();
});