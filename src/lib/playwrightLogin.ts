import { chromium, type Browser, type BrowserContext } from 'playwright';
import fs from 'fs';

const SESSION_FILE = 'session.json';

interface LoginResult {
  success: boolean;
  error?: string;
  cookies?: { name: string; value: string; domain: string }[];
}

export async function playwrightLogin(
  email: string,
  password: string
): Promise<LoginResult> {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;

  try {
    // Launch browser
    browser = await chromium.launch({
      headless: false, // Set to true in production
    });

    // Create a new context
    context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to Poshmark login
    await page.goto('https://poshmark.com/login');

    // Fill in login form
    await page.fill('input[name="login_form[username_email]"]', email);
    await page.fill('input[name="login_form[password]"]', password);

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForNavigation();

    // Check if login was successful
    const isLoggedIn = await page.evaluate(() => {
      return !document.querySelector('form[action="/login"]');
    });

    if (!isLoggedIn) {
      return {
        success: false,
        error: 'Login failed - incorrect credentials or captcha required',
      };
    }

    // Get cookies
    const cookies = await context.cookies();
    const relevantCookies = cookies.filter(
      (cookie) => cookie.domain.includes('poshmark.com')
    );

    // Save session cookies after login
    fs.writeFileSync(
      SESSION_FILE,
      JSON.stringify(relevantCookies.map((cookie) => ({ name: cookie.name, value: cookie.value, domain: cookie.domain })))
    );

    return {
      success: true,
      cookies: relevantCookies.map((cookie) => ({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  } finally {
    // Clean up
    if (context) await context.close();
    if (browser) await browser.close();
  }
}
