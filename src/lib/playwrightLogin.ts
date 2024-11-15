import { chromium } from 'playwright';
import type { PoshmarkLoginResult } from '@/types/poshmark';
import fs from 'fs';

const SESSION_FILE = 'session.json';

export async function playwrightLogin(email: string, password: string): Promise<PoshmarkLoginResult> {
  const browser = await chromium.launch({ headless: false });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to Poshmark login page
    await page.goto('https://poshmark.com/login');

    // Fill in login form
    await page.fill('input[name="login_form[username_email]"]', email);
    await page.fill('input[name="login_form[password]"]', password);

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForNavigation({ waitUntil: 'networkidle' });

    // Check if login was successful
    const isLoggedIn = await page.evaluate(() => {
      return !document.querySelector('form[action="/login"]');
    });

    if (!isLoggedIn) {
      return {
        success: false,
        error: 'Login failed - please check your credentials',
      };
    }

    // Get cookies
    const cookies = await context.cookies();
    
    // Save session cookies after login
    fs.writeFileSync(
      SESSION_FILE,
      JSON.stringify(cookies.map((cookie) => ({ name: cookie.name, value: cookie.value, domain: cookie.domain })))
    );

    return {
      success: true,
      cookies: cookies.map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
      })),
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  } finally {
    await browser.close();
  }
}
