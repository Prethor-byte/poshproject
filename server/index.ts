import express from 'express';
import cors from 'cors';
import { chromium, Browser, BrowserContext } from 'playwright';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

interface PoshmarkSession {
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
  }>;
  username?: string;
}

// Verify if a session is still valid
async function verifySession(sessionData: PoshmarkSession): Promise<boolean> {
  const browser = await chromium.launch({ headless: true });
  
  try {
    const context = await browser.newContext();
    
    // Set the cookies from the session
    await context.addCookies(sessionData.cookies.map(cookie => ({
      ...cookie,
      path: '/',
      secure: true,
      sameSite: 'Lax' as const,
    })));

    const page = await context.newPage();
    
    // Try to access the user's profile page
    await page.goto('https://poshmark.com/closet');
    
    // Check if we're still logged in by looking for logout button
    const logoutButton = await page.$('a[href="/logout"]');
    return !!logoutButton;
  } catch (error) {
    console.error('Session verification failed:', error);
    return false;
  } finally {
    await browser.close();
  }
}

// Import session from browser
app.post('/api/poshmark/import-session', async (req, res) => {
  const browser = await chromium.launch({ headless: false });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to Poshmark
    await page.goto('https://poshmark.com');
    
    // Wait for user to log in manually
    console.log('Waiting for user to log in...');
    
    // Wait for either the logout link (success) or 5 minutes timeout
    await Promise.race([
      page.waitForSelector('a[href="/logout"]', { timeout: 300000 }),
      page.waitForSelector('.navbar-username', { timeout: 300000 })
    ]);

    // Get username if available
    let username: string | undefined;
    try {
      const usernameElement = await page.$('.navbar-username');
      if (usernameElement) {
        username = await usernameElement.textContent() || undefined;
      }
    } catch (error) {
      console.warn('Could not get username:', error);
    }

    // Get cookies
    const cookies = await context.cookies();
    
    res.json({
      success: true,
      session: {
        cookies: cookies.map(cookie => ({
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
        })),
        username,
      },
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

// Verify an existing session
app.post('/api/poshmark/verify-session', async (req, res) => {
  const { session } = req.body;
  
  if (!session?.cookies) {
    return res.status(400).json({
      success: false,
      error: 'Invalid session data',
    });
  }

  try {
    const isValid = await verifySession(session);
    res.json({
      success: true,
      isValid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
