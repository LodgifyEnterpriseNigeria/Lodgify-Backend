import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';

puppeteer.use(StealthPlugin());

export async function createStealthBrowser(): Promise<Browser> {
	return await puppeteer.launch({ 
		headless: false,
		args: [
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--disable-accelerated-2d-canvas',
			'--disable-gpu',
			'--window-size=1920,1080',
			'--disable-blink-features=AutomationControlled',
			'--disable-extensions',
			'--disable-plugins',
			'--disable-images',
			'--disable-javascript',
			'--disable-default-apps',
			'--disable-background-timer-throttling',
			'--disable-backgrounding-occluded-windows',
			'--disable-renderer-backgrounding'
		]
	});
}

export async function configurePage(page: Page): Promise<void> {
	// Set a realistic user agent
	await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
	
	// Set viewport
	await page.setViewport({ width: 1920, height: 1080 });
	
	// Remove webdriver property
	await page.evaluateOnNewDocument(() => {
		Object.defineProperty(navigator, 'webdriver', {
			get: () => undefined,
		});
	});
	
	// Override the plugins property to use a custom getter
	await page.evaluateOnNewDocument(() => {
		Object.defineProperty(navigator, 'plugins', {
			get: () => [1, 2, 3, 4, 5],
		});
	});
	
	// Override the languages property to use a custom getter
	await page.evaluateOnNewDocument(() => {
		Object.defineProperty(navigator, 'languages', {
			get: () => ['en-US', 'en'],
		});
	});
	
	// Override the permissions property
	await page.evaluateOnNewDocument(() => {
		const originalQuery = window.navigator.permissions.query;
		window.navigator.permissions.query = (parameters) => (
			parameters.name === 'notifications' ?
				Promise.resolve({ state: 'granted' as PermissionState } as PermissionStatus) :
				originalQuery(parameters)
		);
	});
}

export async function puppeteerHealthCheck(): Promise<{
	success: boolean;
	title?: string;
	error?: any;
}> {
	let browser;
	try {
		browser = await createStealthBrowser();
		const page = await browser.newPage();
		
		// Apply stealth configuration
		await configurePage(page);
		
		// Navigate with retry mechanism
		let retries = 3;
		let pageTitle;
		
		while (retries > 0) {
			try {
				await page.goto('https://x.com', { 
					waitUntil: 'networkidle2', 
					timeout: 30000 
				});
				
				// Wait for page to be ready
				await new Promise(resolve => setTimeout(resolve, 2000));
				
				pageTitle = await page.title();
				break;
			} catch (navError) {
				retries--;
				if (retries === 0) {
					throw navError;
				}
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		}
		
		await browser.close();
		
		// ✅ Just return — don't log here
		return { success: true, title: pageTitle };
	} catch (error) {
		if (browser) {
			try {
				await browser.close();
			} catch (closeError) {
				// Ignore close errors
			}
		}
		return { success: false, error };
	}
}