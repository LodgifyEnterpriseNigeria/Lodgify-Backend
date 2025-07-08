import { socialMediaHealthCheck } from '../configs/puppeteer.config';

// Test the social media health check
async function testSocialMediaHealthCheck() {
    console.log('🔍 Testing social media platform accessibility...');
    
    try {
        const result = await socialMediaHealthCheck();
        console.log('📊 Health Check Results:');
        console.log(`✅ Overall Success: ${result.success}`);
        console.log(`🐦 X/Twitter: ${result.platforms.x ? '✅' : '❌'}`);
        console.log(`📸 Instagram: ${result.platforms.instagram ? '✅' : '❌'}`);
        
        if (result.error) {
            console.log('❌ Error:', result.error);
        }
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testSocialMediaHealthCheck().catch(console.error);

export { testSocialMediaHealthCheck };
