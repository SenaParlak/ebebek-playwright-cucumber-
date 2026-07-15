import { chromium, firefox, webkit } from 'playwright';
import { config } from '../utils/config.js';

const browserTypes = {
  chromium,
  firefox,
  webkit
};

export async function launchBrowser() {
  const browserType = browserTypes[config.browser];

  if (!browserType) {
    throw new Error(`Unsupported browser type: ${config.browser}`);
  }

  return browserType.launch({
    headless: config.headless
  });
}