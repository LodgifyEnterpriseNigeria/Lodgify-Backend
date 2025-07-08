import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import SocialHandlerService from '../services/socialHandler.service';

describe('SocialHandlerService', () => {
    let socialHandler: SocialHandlerService;

    beforeEach(() => {
        socialHandler = new SocialHandlerService({
            x: {
                username: 'test_user',
                password: 'test_password'
            },
            instagram: {
                username: 'test_user',
                password: 'test_password'
            }
        });
    });

    afterEach(async () => {
        await socialHandler.cleanup();
    });

    it('should create an instance', () => {
        expect(socialHandler).toBeDefined();
    });

    it('should pass health check', async () => {
        const result = await socialHandler.healthCheck();
        expect(result.success).toBe(true);
    }, 30000);

    it('should handle invalid platform gracefully', async () => {
        const result = await socialHandler.isFollowing('invalid' as any, 'test_user');
        expect(result.isFollowing).toBe(false);
        expect(result.error).toContain('Unsupported platform');
    });

    it('should handle invalid platform for hashtag check gracefully', async () => {
        const result = await socialHandler.hasPostedWithHashtag('invalid' as any, 'test_user', '#test');
        expect(result.hasPosted).toBe(false);
        expect(result.error).toContain('Unsupported platform');
    });

    // Note: The following tests would require valid credentials and actual social media accounts
    // They are commented out to prevent actual API calls during testing
    
    /*
    it('should check if user is following on X', async () => {
        const result = await socialHandler.isFollowing('x', 'test_user');
        expect(result).toHaveProperty('isFollowing');
        expect(typeof result.isFollowing).toBe('boolean');
    }, 60000);

    it('should check if user is following on Instagram', async () => {
        const result = await socialHandler.isFollowing('instagram', 'test_user');
        expect(result).toHaveProperty('isFollowing');
        expect(typeof result.isFollowing).toBe('boolean');
    }, 60000);

    it('should check for hashtag posts on X', async () => {
        const result = await socialHandler.hasPostedWithHashtag('x', 'test_user', '#test');
        expect(result).toHaveProperty('hasPosted');
        expect(typeof result.hasPosted).toBe('boolean');
    }, 60000);

    it('should check for hashtag posts on Instagram', async () => {
        const result = await socialHandler.hasPostedWithHashtag('instagram', 'test_user', '#test');
        expect(result).toHaveProperty('hasPosted');
        expect(typeof result.hasPosted).toBe('boolean');
    }, 60000);
    */
});
