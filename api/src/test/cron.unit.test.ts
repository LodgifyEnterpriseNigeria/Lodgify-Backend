import { describe, it, expect } from 'bun:test';

describe('Cron System Unit Tests', () => {
    
    it('should import cron modules successfully', async () => {
        const cronIndex = await import('../utils/cron/index');
        expect(cronIndex).toBeDefined();
        expect(cronIndex.initializeCronJobs).toBeDefined();
        expect(cronIndex.getCronManagementRoutes).toBeDefined();
    });

    it('should import task verification service', async () => {
        const { default: TaskVerificationCronService } = await import('../utils/cron/taskVerification.cron');
        expect(TaskVerificationCronService).toBeDefined();
    });

    it('should import cron scheduler', async () => {
        const { default: CronJobScheduler } = await import('../utils/cron/cronScheduler');
        expect(CronJobScheduler).toBeDefined();
    });

    it('should import cron management routes', async () => {
        const { default: cronManagement } = await import('../utils/cron/cronManagement.route');
        expect(cronManagement).toBeDefined();
    });

    it('should validate task verification service methods', async () => {
        const { default: TaskVerificationCronService } = await import('../utils/cron/taskVerification.cron');
        const service = new TaskVerificationCronService();
        
        // Check if required methods exist
        expect(typeof service.processBotVerificationTasks).toBe('function');
        expect(typeof service.getVerificationStats).toBe('function');
        expect(typeof service.cleanup).toBe('function');
        
        // Cleanup
        await service.cleanup();
    });

    it('should validate cron scheduler methods', async () => {
        const { default: CronJobScheduler } = await import('../utils/cron/cronScheduler');
        const scheduler = new CronJobScheduler();
        
        // Check if required methods exist
        expect(typeof scheduler.getApp).toBe('function');
        expect(typeof scheduler.start).toBe('function');
        expect(typeof scheduler.stop).toBe('function');
        expect(typeof scheduler.getStatus).toBe('function');
        expect(typeof scheduler.triggerTaskVerification).toBe('function');
        
        // Cleanup
        await scheduler.stop();
    });
});
