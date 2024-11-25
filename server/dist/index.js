"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const playwright_1 = require("playwright");
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Configure CORS to allow requests from our frontend
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
    methods: ['GET', 'POST'],
    credentials: true,
}));
app.use(express_1.default.json());
// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error',
    });
});
const POSHMARK_URLS = {
    US: 'https://poshmark.com',
    CA: 'https://poshmark.ca'
};
// Browser configuration to appear more human-like
const browserConfig = {
    headless: false,
    args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--window-position=0,0',
        '--ignore-certifcate-errors',
        '--ignore-certifcate-errors-spki-list',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    ]
};
// Context configuration to appear more human-like
const contextConfig = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    javaScriptEnabled: true,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    geolocation: { longitude: -73.935242, latitude: 40.730610 }, // New York coordinates
    permissions: ['geolocation'],
};
// Anti-automation detection script
const antiDetectionScript = `
  Object.defineProperty(window.navigator, 'webdriver', { get: () => false });
  window.navigator.chrome = { runtime: {} };
  Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
`;
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Verify if a session is still valid
async function verifySession(sessionData) {
    const browser = await playwright_1.chromium.launch(browserConfig);
    try {
        const context = await browser.newContext(contextConfig);
        const page = await context.newPage();
        // Add anti-detection script
        await page.addInitScript(antiDetectionScript);
        // Set the cookies from the session
        await context.addCookies(sessionData.cookies.map(cookie => ({
            ...cookie,
            path: '/',
            secure: true,
            sameSite: 'Lax',
        })));
        // Try to access the user's profile page using the correct domain
        const baseUrl = POSHMARK_URLS[sessionData.region];
        await page.goto(`${baseUrl}/closet`);
        // Check if we're still logged in by looking for logout button
        const logoutButton = await page.$('a[href="/logout"]');
        return !!logoutButton;
    }
    catch (error) {
        console.error('Session verification failed:', error);
        return false;
    }
    finally {
        await browser.close();
    }
}
// Import session from browser
app.post('/api/poshmark/import-session', async (req, res) => {
    console.log('Starting import session...');
    const { region } = req.body;
    if (!region || !POSHMARK_URLS[region]) {
        return res.status(400).json({
            success: false,
            error: 'Invalid region specified',
        });
    }
    let browser = null;
    try {
        browser = await playwright_1.chromium.launch(browserConfig);
        const context = await browser.newContext(contextConfig);
        const page = await context.newPage();
        // Add anti-detection script
        await page.addInitScript(antiDetectionScript);
        console.log(`Navigating to Poshmark ${region}...`);
        // Navigate to Poshmark using the correct domain
        await page.goto(POSHMARK_URLS[region]);
        console.log('Waiting for user to log in...');
        // Wait for login success or failure
        try {
            // Wait for either successful login indicators or error message
            const result = await Promise.race([
                // Success cases
                Promise.all([
                    page.waitForSelector('a[href="/logout"]', { timeout: 300000 }).catch(() => null),
                    page.waitForSelector('.navbar-username', { timeout: 300000 }).catch(() => null)
                ]),
                // Error cases
                page.waitForSelector('.error-message, .alert-danger', { timeout: 300000 }).catch(() => null),
                // Page close case
                new Promise((_, reject) => {
                    page.on('close', () => reject(new Error('Login window was closed')));
                })
            ]);
            // If we got an error message
            const errorElement = await page.$('.error-message, .alert-danger');
            if (errorElement) {
                const errorText = await errorElement.textContent();
                throw new Error(errorText || 'Login failed');
            }
            // If we didn't get either success or error, something went wrong
            if (!result) {
                throw new Error('Login process was interrupted');
            }
            console.log('User logged in successfully');
            // Get username if available
            let username;
            try {
                const usernameElement = await page.$('.navbar-username');
                if (usernameElement) {
                    username = await usernameElement.textContent() || undefined;
                }
            }
            catch (error) {
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
                    region,
                },
            });
        }
        catch (error) {
            throw new Error(error instanceof Error
                ? `Login failed: ${error.message}`
                : 'Login process failed');
        }
    }
    catch (error) {
        console.error('Import session failed:', error);
        res.status(400).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            errorCode: 'LOGIN_FAILED'
        });
    }
    finally {
        if (browser) {
            await browser.close();
        }
    }
});
// Verify an existing session
app.post('/api/poshmark/verify-session', async (req, res) => {
    const { session } = req.body;
    if (!session?.cookies || !session?.region) {
        return res.status(400).json({
            success: false,
            error: 'Invalid session data',
        });
    }
    try {
        const isValid = await verifySession(session);
        res.json({
            success: true,
            is_active: isValid,
        });
    }
    catch (error) {
        console.error('Verify session failed:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
