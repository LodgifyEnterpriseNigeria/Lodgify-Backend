import { checkInstagramPost } from "../configs/playwright.config";

class VerifyService {
    public static async twitter(payload: {
        username: string;
        hashtags: string[];
        task: string;
    }) {
        // Replace with actual scraping/verification logic
        return {
            success: true,
            message: "X (Twitter) task is complete",
            data: { ...payload },
        };
    }

    public static async instagram(payload: {
        username: string;
        hashtags: string[];
        task: string;
    }) {
        const { username, hashtags, task } = payload;
        try {
            const success = await checkInstagramPost(username, hashtags);
            const result = {
                success,
                message: success
                    ? "Instagram task is complete"
                    : "No matching Instagram post found",
                data: payload,
            };

            return result;
        } catch (error) {
            return {
                success: false,
                message:
                    "Error scraping Instagram: " +
                    (error instanceof Error ? error.message : String(error)),
                data: payload,
            };
        }
    }

    public static async tiktok(payload: {
        username: string;
        hashtags: string[];
        task: string;
    }) {
        return {
            success: true,
            message: "TikTok task is complete",
            data: { ...payload },
        };
    }

    public static async youtube(payload: {
        username: string;
        hashtags: string[];
        task: string;
    }) {
        return {
            success: false,
            message: "YouTube task verification is coming soon",
            data: { ...payload },
        };
    }
}

export default VerifyService;
