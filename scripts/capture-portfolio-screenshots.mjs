import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const baseUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:4173';
const outputDir = process.env.SCREENSHOT_DIR || 'screenshots/portfolio';
const apiOrigin = 'http://127.0.0.1:8080';

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

const config = {
  status: true,
  name: 'AskIn',
  version: 'portfolio-ci',
  default_locale: 'en-US',
  default_models: null,
  default_prompt_suggestions: [
    { title: ['Explain a concept', 'in simple terms'], content: 'Explain this concept in simple terms.' },
    { title: ['Work with a document', 'using its context'], content: 'Use the attached document as context.' }
  ],
  features: {
    auth: true,
    auth_trusted_header: false,
    enable_signup: true,
    enable_web_search: false,
    enable_image_generation: false,
    enable_community_sharing: false,
    enable_message_rating: false,
    enable_admin_export: false
  },
  oauth: { providers: {} }
};

const demoUser = {
  id: 'portfolio-demo-user',
  email: 'faris@example.com',
  name: 'Faris',
  role: 'user',
  profile_image_url: '/static/favicon.png',
  last_active_at: Math.floor(Date.now() / 1000),
  created_at: Math.floor(Date.now() / 1000)
};

const demoModels = {
  data: [
    {
      id: 'askin-assistant',
      name: 'AskIn Assistant',
      object: 'model',
      created: Math.floor(Date.now() / 1000),
      owned_by: 'AskIn',
      info: { meta: { position: 0 } }
    }
  ]
};

const favicon = await readFile(join(process.cwd(), 'backend', 'static', 'favicon.png'));

const installApiRoutes = async (page) => {
  await page.route(`${apiOrigin}/**`, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname;

    if (path === '/api/config') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(config) });
    }

    if (path === '/api/models') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(demoModels) });
    }

    if (path === '/api/v1/auths/' || path === '/api/v1/auths') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(demoUser) });
    }

    if (path.includes('/users/user/settings')) {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ui: { theme: 'light' } }) });
    }

    if (path === '/static/favicon.png') {
      return route.fulfill({ status: 200, contentType: 'image/png', body: favicon });
    }

    if (path.startsWith('/ws/socket.io')) {
      return route.fulfill({ status: 400, contentType: 'text/plain', body: '' });
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: request.method() === 'GET' ? '[]' : '{}'
    });
  });
};

const seedSession = async (page) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'portfolio-demo-token');
    localStorage.setItem('version', 'portfolio-ci');
    localStorage.setItem('theme', 'light');
    localStorage.setItem('locale', 'en-US');
  });
};

try {
  const authContext = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const authPage = await authContext.newPage();
  await installApiRoutes(authPage);
  await authPage.goto(`${baseUrl}/auth`, { waitUntil: 'domcontentloaded' });
  await authPage.getByText('Sign in', { exact: false }).first().waitFor();
  await authPage.screenshot({ path: join(outputDir, 'askin-auth-desktop.png'), fullPage: true });
  await authContext.close();

  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  const desktopPage = await desktopContext.newPage();
  await installApiRoutes(desktopPage);
  await seedSession(desktopPage);
  await desktopPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await desktopPage.locator('#chat-textarea').waitFor({ state: 'visible', timeout: 15000 });
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: join(outputDir, 'askin-workspace-desktop.png'), fullPage: true });
  await desktopContext.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await installApiRoutes(mobilePage);
  await seedSession(mobilePage);
  await mobilePage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await mobilePage.locator('#chat-textarea').waitFor({ state: 'visible', timeout: 15000 });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: join(outputDir, 'askin-workspace-mobile.png'), fullPage: true });
  await mobileContext.close();

  console.log(`Saved AskIn portfolio screenshots to ${outputDir}`);
} finally {
  await browser.close();
}
