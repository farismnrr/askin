import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const source = resolve('screenshots/showcase/thumbnail.html');
const output = resolve('screenshots/showcase/thumbnail.png');
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(source).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => Array.from(document.images).every(image => image.complete && image.naturalWidth > 0));
  await page.screenshot({ path: output, fullPage: false, animations: 'disabled' });
  console.log(`Saved ${output} (1920×1080)`);
} finally {
  await browser.close();
}
