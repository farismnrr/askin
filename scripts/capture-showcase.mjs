import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseUrl = process.env.FRONTEND_URL || 'http://127.0.0.1:3003';
const outputDir = process.env.SCREENSHOT_DIR || 'screenshots/showcase';
const browser = await chromium.launch({ headless: true });
const captures = [];
await mkdir(outputDir, { recursive: true });

try {
	const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, colorScheme: 'light' });
	await context.addInitScript(() => {
		localStorage.setItem('token', 'mock-demo-token');
		localStorage.setItem('version', '0.3.7');
		localStorage.setItem('theme', 'light');
		localStorage.setItem('locale', 'en-US');
	});
	const page = await context.newPage();
	const pageErrors = [];
	page.on('pageerror', error => pageErrors.push(error.message));

	async function ready() {
		await page.evaluate(() => document.fonts.ready);
		await page.waitForFunction(() => Array.from(document.images).every(image => image.complete));
		await page.waitForTimeout(350);
		const broken = await page.evaluate(() => Array.from(document.images).filter(image => image.naturalWidth === 0).map(image => image.getAttribute('src')));
		if (broken.length) throw new Error(`Broken images: ${broken.join(', ')}`);
		if (pageErrors.length) throw new Error(`Page errors: ${pageErrors.join('; ')}`);
	}
	async function capture(file, screen, description) {
		await ready();
		await page.screenshot({ path: join(outputDir, file), fullPage: false, animations: 'disabled' });
		captures.push({ file, screen, url: new URL(page.url()).pathname, description, width: 1920, height: 1080 });
		console.log(`Saved ${file}`);
	}
	async function go(path, locator) {
		pageErrors.length = 0;
		await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' });
		await locator().waitFor({ state: 'visible', timeout: 30000 });
	}

	await go('/', () => page.locator('#chat-textarea'));
	await capture('askin-showcase.png', 'New Chat', 'Primary showcase: the complete AskIn chat interface, sidebar, model selection, and prompt suggestions.');

	await go('/c/chat-code-review', () => page.locator('#chat-textarea'));
	await page.locator('pre code .hljs-keyword').first().waitFor({ timeout: 30000 });
	await capture('02-code-review.png', 'Code review', 'Conversation history and syntax-highlighted code.');

	await page.getByRole('button', { name: 'Select a model', exact: true }).click();
	await page.getByText('GPT-4o Mini (Mock)', { exact: true }).waitFor();
	await capture('03-model-selector.png', 'Model selection', 'The model selector showing available demo models.');
	await page.keyboard.press('Escape');

	await go('/workspace/prompts', () => page.getByRole('button', { name: 'Import Prompts', exact: true }));
	await capture('04-workspace-prompts.png', 'Prompt workspace', 'Reusable prompt templates with import/export actions.');

	await go('/workspace/models', () => page.locator('#model-list'));
	await capture('05-workspace-models.png', 'Model workspace', 'Model presets in the workspace.');

	await go('/', () => page.locator('#chat-textarea'));
	await page.getByRole('button', { name: 'User profile Faris', exact: true }).first().click();
	await page.getByRole('button', { name: 'Settings', exact: true }).click();
	await page.getByText('General', { exact: true }).waitFor();
	await capture('06-settings.png', 'Settings', 'Theme, language, and chat preferences.');

	await writeFile(join(outputDir, 'screens.json'), JSON.stringify({ viewport: '1920×1080', aspectRatio: '16:9', source: 'AskIn Vite development UI with demo data', captures }, null, 2) + '\n');
	await context.close();
} finally {
	await browser.close();
}
