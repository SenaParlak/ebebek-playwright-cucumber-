import dotenv from 'dotenv';

dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL,
  browser: process.env.BROWSER ?? 'chromium',
  headless: process.env.HEADLESS !== 'false',
  timeout: Number(process.env.DEFAULT_TIMEOUT ?? 30000),

  user: {
    email: process.env.TEST_USER_EMAIL,
    password: process.env.TEST_USER_PASSWORD,
    phone: process.env.TEST_USER_PHONE
  },

  unregisteredEmail: process.env.UNREGISTERED_EMAIL,
  invalidPassword: process.env.INVALID_PASSWORD ?? 'WrongPassword123!'
};