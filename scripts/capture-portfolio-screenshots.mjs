import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const baseUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:4173';
const outputDir = process.env.SCREENSHOT_DIR || 'artifacts/portfolio-screenshots';

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

const seedSession = async (page) => {
  await page.addInitScript(() => {
    localStorage.setItem('token', 'portfolio-demo-token');
    localStorage.setItem('version', 'portfolio-ci');
    localStorage.setItem('theme', 'light');
    localStorage.setItem('locale', 'en-US');
  });
};

const waitForSettledUi = async (page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2500);
};

try {
  const authContext = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 1
  });
  const authPage = await authContext.newPage();
  await authPage.goto(`${baseUrl}/auth`, { waitUntil: 'domcontentloaded' });
  await waitForSettledUi(authPage);
  await authPage.screenshot({
    path: join(outputDir, 'askin-auth-desktop.png'),
    fullPage: true
  });
  await authContext.close();

  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 1
  });
  const desktopPage = await desktopContext.newPage();
  await seedSession(desktopPage);
  await desktopPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await waitForSettledUi(desktopPage);
  await desktopPage.screenshot({
    path: join(outputDir, 'askin-workspace-desktop.png'),
    fullPage: true
  });
  await desktopContext.close();

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await seedSession(mobilePage);
  await mobilePage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await waitForSettledUi(mobilePage);
  await mobilePage.screenshot({
    path: join(outputDir, 'askin-workspace-mobile.png'),
    fullPage: true
  });
  await mobileContext.close();

  console.log(`Saved AskIn portfolio screenshots to ${outputDir}`);
} finally {
  await browser.close();
}
