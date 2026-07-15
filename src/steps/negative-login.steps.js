import { When, Then } from '@cucumber/cucumber';
import { config } from '../utils/config.js';

function resolveEmail(emailType) {
  const emails = {
    registered: config.user.email,
    unregistered: config.unregisteredEmail,
    empty: ''
  };

  if (!(emailType in emails)) {
    throw new Error(`Unsupported email type: ${emailType}`);
  }

  return emails[emailType];
}

function resolvePassword(passwordType) {
  const passwords = {
    valid: config.user.password,
    invalid_password: config.invalidPassword,
    empty: ''
  };

  if (!(passwordType in passwords)) {
    throw new Error(`Unsupported password type: ${passwordType}`);
  }

  return passwords[passwordType];
}

When(
  'User attempts email login with {string} email and {string} password',
  async function (emailType, passwordType) {
    const email = resolveEmail(emailType);
    const password = resolvePassword(passwordType);

    await this.pages.loginPage.attemptEmailLogin(email, password);
  }
);

Then(
  'User should verify {string} with {string}',
  async function (expectedResult, expectedValue) {
    await this.pages.loginPage.verifyNegativeLoginResult(
      expectedResult,
      expectedValue
    );
  }
);