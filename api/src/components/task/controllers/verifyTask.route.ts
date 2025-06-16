import Elysia from "elysia";
import ErrorHandler from "../../../services/errorHandler.service";
import SuccessHandler from "../../../services/successHandler.service";
import { isSessionAuth } from "../../../middleware/authSession.middleware";
import { ActiveTask, Task } from "../_model";
import VerifyService from "../../../services/verifyTask.service";

const verifyTask = new Elysia()
    .use(isSessionAuth("user"))

    // Add task to user's active list
    .post("/add/:taskId", async ({ set, params: { taskId }, sessionClient }) => {
        try {
            const task = await Task.findById(taskId);
            if (!task) {
                return ErrorHandler.ValidationError(set, "Invalid task ID");
            }

            // Normally: create active task here
            // Example:
            const userId = sessionClient.sessionClientId
            await ActiveTask.create({ taskId, userId, status: "pending", statusMessage: "" });

            return SuccessHandler(set, "The task has been added", {});
        } catch (error) {
            return ErrorHandler.ServerError(set, "Error adding task", error);
        }
    })

    // Verify task completion based on social
    .post("/verify", async ({ set, body }) => {
        const {
            socialUsername,
            hashtags,
            social,
            taskId
        } = body;

        const supportedSocials = ["instagram", "x", "tiktok"];

        try {
            if (!supportedSocials.includes(social)) {
                return ErrorHandler.ValidationError(set, "The given social is not supported");
            }

            if (!taskId || !socialUsername) {
                return ErrorHandler.ValidationError(set, "Missing required fields");
            }

            const task = await Task.findById(taskId);
            if (!task) {
                return ErrorHandler.ValidationError(set, "Task not found or invalid taskId");
            }

            let verificationResult: any;

            if (social === "instagram") {
                verificationResult = VerifyService.instagram({
                    username: socialUsername,
                    hashtags,
                    task: task._id.toString(),
                });
            } else if (social === "x") {
                verificationResult = VerifyService.twitter({
                    username: socialUsername,
                    hashtags,
                    task: task._id.toString(),
                });
            } else if (social === "tiktok") {
                verificationResult = VerifyService.tiktok({
                    username: socialUsername,
                    hashtags,
                    task: task._id.toString(),
                });
            }

            if (!verificationResult?.success) {
                return ErrorHandler.ValidationError(set, verificationResult?.message || "Verification failed");
            }

            // Optionally update ActiveTask status here...

            return SuccessHandler(set, `${social} task has been verified`, {
                result: verificationResult,
            });
        } catch (error) {
            return ErrorHandler.ServerError(set, "Error verifying task", error);
        }
    });

export default verifyTask;
