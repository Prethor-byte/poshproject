import { chromium } from 'playwright';
import fs from 'fs';

const SESSION_FILE = 'session.json';

export const playwrightLogin = async (email: string, password: string) => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('https://poshmark.com/login');
    await page.fill('input[name="username"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for navigation after login
    await page.waitForNavigation();

    // Check if login was successful
    const isLoggedIn = await page.evaluate(() => {
      return !!document.querySelector('.user-profile'); // Adjust selector based on Poshmark's DOM
    });

    if (!isLoggedIn) {
      throw new Error('Login failed. Please check your credentials.');
    }

    // Save session cookies after login
    const cookies = await page.context().cookies();
    fs.writeFileSync(SESSION_FILE, JSON.stringify(cookies));

    return { success: true, browser };
  } catch (error) {
    console.error('Error during login:', error);
    return { success: false, error: error.message };
  }
};
