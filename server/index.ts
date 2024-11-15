import express from 'express';
import cors from 'cors';
import { chromium } from 'playwright';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/api/poshmark/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email and password are required' 
    });
  }

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

    // Check if login was successful by looking for the login form
    // If we're still on the login page, the form will exist
    const loginForm = await page.$('form[action="/login"]');
    const isLoggedIn = !loginForm;

    if (!isLoggedIn) {
      return res.json({
        success: false,
        error: 'Login failed - please check your credentials',
      });
    }

    // Get cookies
    const cookies = await context.cookies();
    
    res.json({
      success: true,
      cookies: cookies.map(cookie => ({
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
      })),
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  } finally {
    await browser.close();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
