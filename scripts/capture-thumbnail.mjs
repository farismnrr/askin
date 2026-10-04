import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3003';
const outputDir = 'screenshots/showcase/thumbnail-ui';
await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1120, height: 694 }, deviceScaleFactor: 2, colorScheme: 'light' });
  await context.addInitScript(() => {
    localStorage.setItem('token', 'mock-demo-token');
    localStorage.setItem('version', '0.3.7');
    localStorage.setItem('theme', 'light');
    localStorage.setItem('locale', 'en-US');
  });
  const page = await context.newPage();
  async function capture(name, clip) {
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => Array.from(document.images).every(image => image.complete && image.naturalWidth > 0));
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(outputDir, `${name}.png`), ...(clip ? { clip } : {}), animations: 'disabled' });
    console.log(`Saved ${name}.png`);
  }
  await page.goto(`${baseUrl}/`);
  await page.locator('#chat-textarea').waitFor();
  await capture('chat');
  await page.getByRole('button', { name: 'Select a model', exact: true }).click();
  await page.getByText('GPT-4o Mini (Mock)', { exact: true }).waitFor();
  await capture('models', { x: 280, y: 45, width: 470, height: 205 });
  await page.goto(`${baseUrl}/c/chat-code-review`);
  await page.locator('pre code .hljs-keyword').first().waitFor();
  await page.waitForTimeout(500);
  await page.locator('#messages-container').evaluate(element => { element.scrollTop = 0; });
  await capture('code', { x: 275, y: 80, width: 825, height: 390 });
  await page.goto(`${baseUrl}/workspace/prompts`);
  await page.getByRole('button', { name: 'Import Prompts', exact: true }).waitFor();
  await capture('prompts', { x: 275, y: 105, width: 825, height: 335 });
} finally {
  await browser.close();
}
