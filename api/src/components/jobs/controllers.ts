import { Elysia } from 'elysia';
import ErrorHandler from '../../services/errorHandler.service';
import { ActiveTask } from '../task/_model';
import SuccessHandler from '../../services/successHandler.service';
import SocialHandlerService from '../../services/socialHandler.service';

// Create a function to get or create social handler instance
let globalSocialHandler: SocialHandlerService | null = null;
let handlerUsageCount = 0;
let cleanupTimeout: NodeJS.Timeout | null = null;

function getSocialHandler(): SocialHandlerService {
    if (!globalSocialHandler) {
        globalSocialHandler = new SocialHandlerService({
            x: {
                username: Bun.env.TWITTER_USERNAME ?? '',
                password: Bun.env.TWITTER_PASSWORD ?? '',
                email: Bun.env.PLATFORM_EMAIL ?? ''
            },
            instagram: {
                username: Bun.env.INSTAGRAM_USERNAME ?? '',   
                password: Bun.env.INSTAGRAM_PASSWORD ?? ''
            }
        });
    }
    handlerUsageCount++;
    
    // Clear any existing cleanup timeout
    if (cleanupTimeout) {
        clearTimeout(cleanupTimeout);
        cleanupTimeout = null;
    }
    
    return globalSocialHandler;
}

async function releaseSocialHandler(): Promise<void> {
    handlerUsageCount--;
    
    if (handlerUsageCount <= 0 && globalSocialHandler) {
        // Schedule cleanup after 30 seconds of inactivity
        cleanupTimeout = setTimeout(async () => {
            if (handlerUsageCount <= 0 && globalSocialHandler) {
                console.log('Cleaning up idle social handler...');
                try {
                    await globalSocialHandler.cleanup();
                } catch (cleanupError) {
                    console.error('Error cleaning up social handler:', cleanupError);
                }
                globalSocialHandler = null;
                handlerUsageCount = 0;
                cleanupTimeout = null;
            }
        }, 30000); // 30 seconds
    }
}


export const jobs = new Elysia()
    .get('/verifyTask', async ({ set }) => {
        try {
            const tasks = await ActiveTask.find({
                status: { $in: ['ready_for_verification'] },
            }).populate("taskId").populate("userId");

            if (!tasks || tasks.length === 0) {
                console.log('No tasks found for verification - continuing gracefully');
                return SuccessHandler(set, 'No tasks ready for verification', []);
            }

            console.log(`Found ${tasks.length} tasks ready for verification`);

            // Process the tasks for verification and get results
            const verificationResults = await processTasksForVerification(tasks);

            // Fetch updated tasks to return current status
            const updatedTasks = await ActiveTask.find({
                _id: { $in: tasks.map(t => t._id) }
            }).populate("taskId").populate("userId");

            console.log('Verification completed. Results:', verificationResults);
            
            return SuccessHandler(set, 'Task verification completed', {
                processedTasks: updatedTasks,
                verificationSummary: verificationResults
            });

        } catch (error) {
            console.error('Error in verifyTask endpoint:', error);
            return ErrorHandler.ServerError(set, 'Failed to verify tasks', error);
        } finally {
            // Release social handler resources (will cleanup if no longer in use)
            try {
                await releaseSocialHandler();
            } catch (cleanupError) {
                console.error('Error releasing social handler:', cleanupError);
            }
        }
    })

async function processTasksForVerification(tasks: any[]): Promise<any[]> {
    console.log(`Processing ${tasks.length} tasks for verification`);
    
    const results: any[] = [];
    
    for (const activeTask of tasks) {
        try {
            const taskData = activeTask.taskId as any;
            const userData = activeTask.userId as any;

            if (!taskData || !userData) {
                console.log(`⚠️  Skipping task - missing data: taskId=${!!taskData}, userId=${!!userData}`);
                results.push({
                    taskId: activeTask._id,
                    status: 'skipped',
                    reason: 'Missing task or user data'
                });
                continue;
            }

            const verifyBy = taskData.verifyBy;
            const taskName = taskData.name?.toLowerCase() || '';
            const taskPlatform = taskData.platform;

            console.log(`Processing task: ${taskData.name} for user: ${userData.username || userData._id}`);

            if (verifyBy === 'bot') {
                // Update last check time
                await ActiveTask.findByIdAndUpdate(activeTask._id, {
                    lastBotCheck: new Date(),
                    $inc: { botCheckCount: 1 }
                });

                let verificationResult;
                
                // Enhanced task type detection
                const taskType = taskData.taskType || 'custom';
                
                if (taskType === 'follow' || taskName.includes('follow')) {
                    verificationResult = await verifyFollowTask(activeTask, taskData, userData, taskPlatform);
                } else if (taskType === 'post' || taskName.includes('post') || taskName.includes('hashtag') || taskName.includes('mention') || taskName.includes('tweet')) {
                    verificationResult = await verifyPostTask(activeTask, taskData, userData, taskPlatform);
                } else {
                    console.log(`⚠️  Unknown task type for: ${taskData.name} (taskType: ${taskType})`);
                    await ActiveTask.findByIdAndUpdate(activeTask._id, {
                        status: 'failed',
                        statusMessage: 'Unknown task type for bot verification',
                        verificationResult: JSON.stringify({ 
                            error: 'Task type not supported',
                            taskName: taskData.name,
                            taskType: taskType
                        })
                    });
                    verificationResult = {
                        taskId: activeTask._id,
                        status: 'failed',
                        reason: 'Unknown task type'
                    };
                }
                
                results.push(verificationResult);
            } else {
                results.push({
                    taskId: activeTask._id,
                    status: 'skipped',
                    reason: 'Not bot verification task'
                });
            }
        } catch (error) {
            console.error(`Error processing task:`, error);
            await ActiveTask.findByIdAndUpdate(activeTask._id, {
                status: 'failed',
                statusMessage: 'Bot verification failed due to error',
                verificationResult: JSON.stringify({ 
                    error: error instanceof Error ? error.message.substring(0, 500) : 'Unknown error'
                })
            });
            
            results.push({
                taskId: activeTask._id,
                status: 'error',
                reason: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    
    return results;
}

async function verifyFollowTask(activeTask: any, taskData: any, userData: any, platform: string): Promise<any> {
    try {
        // Get user's social username
        let socialUsername = '';
        if (platform === 'x' || platform === 'twitter') {
            socialUsername = userData.socialInfo?.twitter || userData.socialInfo?.x;
        } else if (platform === 'instagram') {
            socialUsername = userData.socialInfo?.instagram;
        }

        if (!socialUsername) {
            await ActiveTask.findByIdAndUpdate(activeTask._id, {
                status: 'pending',
                statusMessage: `Social username not found for ${platform}. Please add your ${platform} username and try again.`,
                verificationResult: JSON.stringify({ 
                    error: `No ${platform} username provided`,
                    platform,
                    type: 'follow'
                })
            });
            return {
                taskId: activeTask._id,
                status: 'pending',
                reason: `No ${platform} username provided`,
                platform
            };
        }

        console.log(`Checking if ${socialUsername} is following us on ${platform}`);

        // Get social handler instance
        const socialHandler = getSocialHandler();

        // Check if user is following
        const followResult = await socialHandler.isFollowing(
            platform === 'twitter' ? 'x' : platform as 'x' | 'instagram', 
            socialUsername
        );

        if (followResult.isFollowing) {
            console.log(`✅ User ${socialUsername} is following us on ${platform}`);
            await ActiveTask.findByIdAndUpdate(activeTask._id, {
                status: 'completed',
                statusMessage: 'Follow verification successful',
                verificationResult: JSON.stringify({ 
                    verified: true, 
                    platform,
                    username: socialUsername,
                    type: 'follow'
                })
            });
            return {
                taskId: activeTask._id,
                status: 'completed',
                reason: 'Follow verification successful',
                platform,
                username: socialUsername
            };
        } else {
            console.log(`❌ User ${socialUsername} is not following us on ${platform}`);
            await ActiveTask.findByIdAndUpdate(activeTask._id, {
                status: 'pending',
                statusMessage: 'Follow verification failed - not following. Please follow and try again.',
                verificationResult: JSON.stringify({ 
                    verified: false, 
                    platform,
                    username: socialUsername,
                    type: 'follow',
                    error: followResult.error?.substring(0, 500) || 'User is not following'
                })
            });
            return {
                taskId: activeTask._id,
                status: 'pending',
                reason: 'User is not following',
                platform,
                username: socialUsername,
                error: followResult.error
            };
        }
    } catch (error) {
        console.error(`Error verifying follow task:`, error);
        await ActiveTask.findByIdAndUpdate(activeTask._id, {
            status: 'failed',
            statusMessage: 'Follow verification failed due to error',
            verificationResult: JSON.stringify({ 
                error: error instanceof Error ? error.message.substring(0, 500) : 'Unknown error',
                type: 'follow'
            })
        });
        return {
            taskId: activeTask._id,
            status: 'failed',
            reason: error instanceof Error ? error.message : 'Unknown error',
            type: 'follow'
        };
    }
}

async function verifyPostTask(activeTask: any, taskData: any, userData: any, platform: string): Promise<any> {
    try {
        // Get user's social username
        let socialUsername = '';
        if (platform === 'x' || platform === 'twitter') {
            socialUsername = userData.socialInfo?.twitter || userData.socialInfo?.x;
        } else if (platform === 'instagram') {
            socialUsername = userData.socialInfo?.instagram;
        }

        if (!socialUsername) {
            await ActiveTask.findByIdAndUpdate(activeTask._id, {
                status: 'pending',
                statusMessage: `Social username not found for ${platform}. Please add your ${platform} username and try again.`,
                verificationResult: JSON.stringify({ 
                    error: `No ${platform} username provided`,
                    platform,
                    type: 'post'
                })
            });
            return {
                taskId: activeTask._id,
                status: 'pending',
                reason: `No ${platform} username provided`,
                platform,
                type: 'post'
            };
        }

        // Enhanced hashtag/mention detection with priority order
        let hashtags: string[] = [];
        let mentions: string[] = [];
        
        // 1. Use new requirements structure (highest priority)
        if (taskData.requirements?.hashtags && taskData.requirements.hashtags.length > 0) {
            hashtags = taskData.requirements.hashtags;
        }
        if (taskData.requirements?.mentions && taskData.requirements.mentions.length > 0) {
            mentions = taskData.requirements.mentions;
        }
        
        // 2. Use legacy verification fields (medium priority)
        if (hashtags.length === 0 && taskData.verification?.requiresHashtag) {
            hashtags = [taskData.verification.requiresHashtag];
        }
        if (mentions.length === 0 && taskData.verification?.requiresMention) {
            mentions = [taskData.verification.requiresMention];
        }
        
        // 3. Use legacy direct fields (medium priority)
        if (hashtags.length === 0 && taskData.requiresHashtag) {
            hashtags = [taskData.requiresHashtag];
        }
        if (mentions.length === 0 && taskData.requiresMention) {
            mentions = [taskData.requiresMention];
        }
        
        // 4. Extract from task name or message (lower priority)
        if (hashtags.length === 0) {
            const hashtagMatches = (taskData.name + ' ' + taskData.message).match(/#\w+/g);
            if (hashtagMatches) hashtags = hashtagMatches;
        }
        if (mentions.length === 0) {
            const mentionMatches = (taskData.name + ' ' + taskData.message).match(/@\w+/g);
            if (mentionMatches) mentions = mentionMatches;
        }
        
        // 5. Fallback to defaults (lowest priority)
        if (hashtags.length === 0) hashtags = ['#lodgify'];
        if (mentions.length === 0) mentions = ['@lodgify'];
        
        // Use primary hashtag and mention for verification
        const primaryHashtag = hashtags[0];
        const primaryMention = mentions[0];

        console.log(`Checking if ${socialUsername} posted with ${primaryHashtag} ${primaryMention} on ${platform}`);

        // Get social handler instance
        const socialHandler = getSocialHandler();

        // Check if user has posted with hashtag/mention
        const postResult = await socialHandler.hasPostedWithHashtag(
            platform === 'twitter' ? 'x' : platform as 'x' | 'instagram',
            socialUsername,
            primaryHashtag,
            primaryMention
        );

        if (postResult.hasPosted) {
            console.log(`✅ User ${socialUsername} has posted with required content on ${platform}`);
            await ActiveTask.findByIdAndUpdate(activeTask._id, {
                status: 'completed',
                statusMessage: 'Post verification successful',
                verificationResult: JSON.stringify({ 
                    verified: true, 
                    platform,
                    username: socialUsername,
                    type: 'post',
                    hashtag: primaryHashtag,
                    mention: primaryMention,
                    allHashtags: hashtags,
                    allMentions: mentions,
                    postsCount: postResult.posts?.length || 0,
                    foundPosts: postResult.posts?.slice(0, 3) // Store first 3 matching posts
                })
            });
            return {
                taskId: activeTask._id,
                status: 'completed',
                reason: 'Post verification successful',
                platform,
                username: socialUsername,
                hashtag: primaryHashtag,
                mention: primaryMention,
                postsCount: postResult.posts?.length || 0
            };
        } else {
            console.log(`❌ User ${socialUsername} has not posted with required content on ${platform}`);
            await ActiveTask.findByIdAndUpdate(activeTask._id, {
                status: 'pending',
                statusMessage: `Post verification failed - required post not found. Please post with ${primaryHashtag} ${primaryMention} and try again.`,
                verificationResult: JSON.stringify({ 
                    verified: false, 
                    platform,
                    username: socialUsername,
                    type: 'post',
                    hashtag: primaryHashtag,
                    mention: primaryMention,
                    allHashtags: hashtags,
                    allMentions: mentions,
                    error: postResult.error?.substring(0, 500) || 'No matching posts found',
                    searchedFor: `Required: ${primaryHashtag} ${primaryMention}`
                })
            });
            return {
                taskId: activeTask._id,
                status: 'pending',
                reason: 'No matching posts found',
                platform,
                username: socialUsername,
                hashtag: primaryHashtag,
                mention: primaryMention,
                error: postResult.error
            };
        }
    } catch (error) {
        console.error(`Error verifying post task:`, error);
        await ActiveTask.findByIdAndUpdate(activeTask._id, {
            status: 'failed',
            statusMessage: 'Post verification failed due to error',
            verificationResult: JSON.stringify({ 
                error: error instanceof Error ? error.message.substring(0, 500) : 'Unknown error',
                type: 'post'
            })
        });
        return {
            taskId: activeTask._id,
            status: 'failed',
            reason: error instanceof Error ? error.message : 'Unknown error',
            type: 'post'
        };
    }
}

// ...existing code...


export default jobs;