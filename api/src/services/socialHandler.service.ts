import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'puppeteer';
import { createStealthBrowser, configurePage } from '../configs/puppeteer.config';

puppeteer.use(StealthPlugin());

interface SocialCredentials {
    username: string;
    password: string;
    email?: string; // Optional email for X verification steps
}

interface SocialConfig {
    x: SocialCredentials;
    instagram: SocialCredentials;
}

interface FollowCheckResult {
    isFollowing: boolean;
    error?: string;
}

interface PostCheckResult {
    hasPosted: boolean;
    posts?: string[];
    error?: string;
}

class SocialHandlerService {
    private browser: Browser | null = null;
    private socialConfig: SocialConfig;
    private loginPages: Map<string, Page> = new Map();

    constructor(socialConfig: SocialConfig) {
        this.socialConfig = socialConfig;
    }

    /**
     * Initialize the browser with stealth settings
     */
    private async initBrowser(): Promise<Browser> {
        if (this.browser) {
            return this.browser as Browser;
        }

        this.browser = await createStealthBrowser();
        return this.browser;
    }

    /**
     * Create a new page with stealth settings
     */
    private async createStealthPage(): Promise<Page> {
        const browser = await this.initBrowser();
        const page = await browser.newPage();
        
        // Apply enhanced stealth configuration
        await configurePage(page);
        
        // Set longer default timeouts for this page
        page.setDefaultTimeout(30000);
        page.setDefaultNavigationTimeout(45000);
        
        return page;
    }

    /**
     * Helper method to wait for a specified amount of time
     */
    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Login to X (Twitter)
     */
    private async loginToX(): Promise<Page> {
        if (this.loginPages.has('x')) {
            return this.loginPages.get('x')!;
        }

        const page = await this.createStealthPage();
        
        try {
            // Set viewport to match the recording
            await page.setViewport({
                width: 1520,
                height: 729
            });

            // Set longer default timeouts
            page.setDefaultTimeout(30000);

            // Go to X homepage first, then click login button
            await page.goto('https://x.com/', { 
                waitUntil: 'networkidle2', 
                timeout: 30000 
            });
            await this.delay(3000); // Wait for page to fully load
            
            // Click the login button using the recorded selector
            await page.waitForSelector('[data-testid="loginButton"]', { timeout: 15000 });
            await page.click('[data-testid="loginButton"]');
            await this.delay(3000); // Wait for login form to load
            
            // Wait for username input field and clear it first
            const usernameSelector = 'input[autocomplete="username"]';
            await page.waitForSelector(usernameSelector, { timeout: 15000 });
            await page.click(usernameSelector, { clickCount: 3 }); // Triple click to select all
            await page.keyboard.press('Backspace');
            await this.delay(500);
            await page.type(usernameSelector, this.socialConfig.x.username, { delay: 150 });
            await this.delay(2000);
            
            // Click next button - look for the specific button with "Next" text
            await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button'));
                const nextButton = buttons.find(button => 
                    button.textContent?.trim() === 'Next' || 
                    button.querySelector('span')?.textContent?.trim() === 'Next'
                );
                if (nextButton) {
                    (nextButton as HTMLElement).click();
                }
            });
            await this.delay(3000);
            
            // Handle email verification step if it appears
            try {
                await page.waitForSelector('[data-testid="ocfEnterTextTextInput"]', { timeout: 8000 });
                console.log('Email verification step detected');
                
                if (this.socialConfig.x.email) {
                    await page.click('[data-testid="ocfEnterTextTextInput"]', { clickCount: 3 });
                    await page.keyboard.press('Backspace');
                    await this.delay(500);
                    await page.type('[data-testid="ocfEnterTextTextInput"]', this.socialConfig.x.email, { delay: 150 });
                    await this.delay(2000);
                    
                    // Click next button for email verification
                    await page.click('[data-testid="ocfEnterTextNextButton"]');
                    await this.delay(3000);
                } else {
                    throw new Error('Email verification required but no email provided in config');
                }
            } catch (e) {
                console.log('No email verification step, proceeding to password');
            }
            
            // Wait for password input and enter password
            const passwordSelector = 'input[name="password"]';
            await page.waitForSelector(passwordSelector, { timeout: 15000 });
            await page.click(passwordSelector, { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await this.delay(500);
            await page.type(passwordSelector, this.socialConfig.x.password, { delay: 150 });
            await this.delay(2000);
            
            // Click login button
            await page.click('[data-testid="LoginForm_Login_Button"]');
            
            // Wait for successful login with increased timeout and better error handling
            try {
                await page.waitForNavigation({ 
                    waitUntil: 'networkidle2', 
                    timeout: 45000 
                });
            } catch (navError) {
                // If navigation timeout, check if we're actually logged in by checking URL
                const currentUrl = page.url();
                console.log('Navigation timeout, current URL:', currentUrl);
                
                if (currentUrl.includes('x.com') && !currentUrl.includes('login')) {
                    console.log('Login appears successful despite navigation timeout');
                } else {
                    throw new Error(`Login failed - still on login page or error page. Current URL: ${currentUrl}`);
                }
            }
            
            // Double check we're logged in by looking for home page elements
            await this.delay(3000);
            try {
                await page.waitForSelector('[data-testid="SideNav_AccountSwitcher_Button"]', { timeout: 10000 });
                console.log('✅ X login successful - found account switcher');
            } catch (e) {
                // Try alternative selector for logged in state
                try {
                    await page.waitForSelector('[aria-label="Home"]', { timeout: 5000 });
                    console.log('✅ X login successful - found home button');
                } catch (e2) {
                    console.log('⚠️ Login verification failed, but proceeding anyway');
                }
            }
            
            this.loginPages.set('x', page);
            return page;
        } catch (error) {
            console.error('X login error:', error);
            await page.close();
            throw new Error(`Failed to login to X: ${error}`);
        }
    }

    /**
     * Login to Instagram
     */
    private async loginToInstagram(): Promise<Page> {
        if (this.loginPages.has('instagram')) {
            return this.loginPages.get('instagram')!;
        }

        const page = await this.createStealthPage();
        
        try {
            await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });
            
            // Wait for username input
            await page.waitForSelector('input[name="username"]', { timeout: 10000 });
            await page.type('input[name="username"]', this.socialConfig.instagram.username);
            
            // Type password
            await page.waitForSelector('input[name="password"]', { timeout: 10000 });
            await page.type('input[name="password"]', this.socialConfig.instagram.password);
            
            // Click login
            await page.click('button[type="submit"]');
            
            // Wait for successful login
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
            
            // Handle "Save Your Login Info" prompt if it appears
            try {
                await page.waitForSelector('button', { timeout: 5000 });
                await page.evaluate(() => {
                    const buttons = Array.from(document.querySelectorAll('button'));
                    const notNowButton = buttons.find(button => button.textContent?.includes('Not Now'));
                    if (notNowButton) {
                        notNowButton.click();
                    }
                });
            } catch (e) {
                // Ignore if prompt doesn't appear
            }
            
            this.loginPages.set('instagram', page);
            return page;
        } catch (error) {
            await page.close();
            throw new Error(`Failed to login to Instagram: ${error}`);
        }
    }

    /**
     * Check if a user is following us on X
     */
    private async isFollowingX(username: string): Promise<FollowCheckResult> {
        let retryCount = 0;
        const maxRetries = 2;

        while (retryCount <= maxRetries) {
            try {
                const page = await this.loginToX();
                
                // Navigate to user's profile with increased timeout
                console.log(`Navigating to X profile: @${username}`);
                await page.goto(`https://x.com/${username}`, { 
                    waitUntil: 'networkidle2', 
                    timeout: 30000 
                });
                
                // Wait for profile to load
                await this.delay(3000);
                
                // Check if "Follows you" indicator is present
                const followsYou = await page.evaluate(() => {
                    const spans = Array.from(document.querySelectorAll('span'));
                    const followsIndicator = spans.some(span => 
                        span.textContent?.includes('Follows you') ||
                        span.textContent?.includes('Following you')
                    );
                    
                    // Also check for any variation of the follow indicator
                    const followElements = Array.from(document.querySelectorAll('[data-testid*="follow"]'));
                    const hasFollowBack = followElements.some(el => 
                        el.textContent?.toLowerCase().includes('follows you')
                    );
                    
                    return followsIndicator || hasFollowBack;
                });
                
                console.log(`Follow status for @${username}: ${followsYou ? '✅ Following' : '❌ Not following'}`);
                
                return {
                    isFollowing: followsYou
                };
            } catch (error) {
                retryCount++;
                console.error(`Error checking X follow status (attempt ${retryCount}):`, error);
                
                if (retryCount <= maxRetries) {
                    console.log(`Retrying in 5 seconds... (${retryCount}/${maxRetries})`);
                    await this.delay(5000);
                    
                    // Clear the cached login page to force re-login
                    const page = this.loginPages.get('x');
                    if (page) {
                        try {
                            await page.close();
                        } catch (e) {
                            console.error('Error closing page:', e);
                        }
                        this.loginPages.delete('x');
                    }
                } else {
                    return {
                        isFollowing: false,
                        error: `Error checking X follow status after ${maxRetries + 1} attempts: ${error}`
                    };
                }
            }
        }

        return {
            isFollowing: false,
            error: 'Max retries exceeded'
        };
    }

    /**
     * Check if a user is following us on Instagram
     */
    private async isFollowingInstagram(username: string): Promise<FollowCheckResult> {
        try {
            const page = await this.loginToInstagram();
            
            // Navigate to user's profile
            await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: 'networkidle2' });
            
            // Check if "Follows you" indicator is present
            const followsYou = await page.evaluate(() => {
                const spans = Array.from(document.querySelectorAll('span'));
                return spans.some(span => span.textContent?.includes('Follows you'));
            });
            
            return {
                isFollowing: followsYou
            };
        } catch (error) {
            return {
                isFollowing: false,
                error: `Error checking Instagram follow status: ${error}`
            };
        }
    }

    /**
     * Check if user has posted with certain hashtag/mention on X
     */
    private async hasPostedWithHashtagX(username: string, hashtag: string, mention?: string): Promise<PostCheckResult> {
        try {
            const page = await this.loginToX();
            
            // Navigate to user's profile
            await page.goto(`https://x.com/${username}`, { waitUntil: 'networkidle2' });
            
            // Get recent tweets
            const tweets = await page.$$eval('article[data-testid="tweet"]', (elements) => {
                return elements.slice(0, 10).map(tweet => {
                    const textElement = tweet.querySelector('[data-testid="tweetText"]');
                    return textElement ? textElement.textContent || '' : '';
                });
            });
            
            // Check for hashtag and mention
            const matchingPosts = tweets.filter(tweet => {
                const hasHashtag = tweet.toLowerCase().includes(hashtag.toLowerCase());
                const hasMention = mention ? tweet.toLowerCase().includes(mention.toLowerCase()) : true;
                return hasHashtag && hasMention;
            });
            
            return {
                hasPosted: matchingPosts.length > 0,
                posts: matchingPosts
            };
        } catch (error) {
            return {
                hasPosted: false,
                error: `Error checking X posts: ${error}`
            };
        }
    }

    /**
     * Check if user has posted with certain hashtag/mention on Instagram
     */
    private async hasPostedWithHashtagInstagram(username: string, hashtag: string, mention?: string): Promise<PostCheckResult> {
        try {
            const page = await this.loginToInstagram();
            
            // Navigate to user's profile
            await page.goto(`https://www.instagram.com/${username}/`, { waitUntil: 'networkidle2' });
            
            // Click on recent posts to check captions
            const posts = await page.$$('article a');
            const matchingPosts: string[] = [];
            
            for (let i = 0; i < Math.min(posts.length, 9); i++) {
                try {
                    await posts[i].click();
                    await new Promise(res => setTimeout(res, 2000));
                    
                    // Get post caption
                    const caption = await page.$eval('meta[property="og:description"]', el => el.getAttribute('content') || '');
                    
                    const hasHashtag = caption.toLowerCase().includes(hashtag.toLowerCase());
                    const hasMention = mention ? caption.toLowerCase().includes(mention.toLowerCase()) : true;
                    
                    if (hasHashtag && hasMention) {
                        matchingPosts.push(caption);
                    }
                    
                    // Close post modal
                    await page.keyboard.press('Escape');
                    await new Promise(res => setTimeout(res, 1000));
                } catch (e) {
                    // Skip this post if error
                    continue;
                }
            }
            
            return {
                hasPosted: matchingPosts.length > 0,
                posts: matchingPosts
            };
        } catch (error) {
            return {
                hasPosted: false,
                error: `Error checking Instagram posts: ${error}`
            };
        }
    }

    /**
     * Public method to check if user is following us
     */
    public async isFollowing(platform: 'x' | 'instagram', username: string): Promise<FollowCheckResult> {
        switch (platform) {
            case 'x':
                return await this.isFollowingX(username);
            case 'instagram':
                return await this.isFollowingInstagram(username);
            default:
                return {
                    isFollowing: false,
                    error: `Unsupported platform: ${platform}`
                };
        }
    }

    /**
     * Public method to check if user has posted with hashtag/mention
     */
    public async hasPostedWithHashtag(
        platform: 'x' | 'instagram',
        username: string,
        hashtag: string,
        mention?: string
    ): Promise<PostCheckResult> {
        switch (platform) {
            case 'x':
                return await this.hasPostedWithHashtagX(username, hashtag, mention);
            case 'instagram':
                return await this.hasPostedWithHashtagInstagram(username, hashtag, mention);
            default:
                return {
                    hasPosted: false,
                    error: `Unsupported platform: ${platform}`
                };
        }
    }

    /**
     * Clean up resources
     */
    public async cleanup(): Promise<void> {
        // Close all login pages
        for (const [platform, page] of this.loginPages.entries()) {
            try {
                await page.close();
            } catch (e) {
                console.error(`Error closing ${platform} page:`, e);
            }
        }
        this.loginPages.clear();

        // Close browser
        if (this.browser) {
            try {
                await this.browser.close();
            } catch (e) {
                console.error('Error closing browser:', e);
            }
            this.browser = null;
        }
    }
}

export default SocialHandlerService;