import Elysia from "elysia";
import { isSessionAuth } from "../../../middleware/authSession.middleware";
import ErrorHandler from "../../../services/errorHandler.service";
import { ActiveTask, Task } from "../_model";
import SuccessHandler from "../../../services/successHandler.service";
import { User } from "../../users/_model";
import TaskValidator from "../_setup";


const userHandleTask = new Elysia()
    .use(isSessionAuth("user"))
    .get("/get-tasks", async ({ set }) => {
        try {
            const tasks = await Task.find({}); // Fetch all tasks
            return SuccessHandler(set, "Tasks fetched successfully", tasks);
        } catch (error) {
            return ErrorHandler.ServerError(set, "Error fetching tasks", error);
        }
    }, TaskValidator.getTasks)
    .get("/join-task/:taskId", async ({ set, sessionClient, params: { taskId } }) => {
        try {
            const task = await Task.findById(taskId);
            const user = await User.findOne({ sessionClientId: sessionClient.sessionClientId._id });

            if (!task) {
                return ErrorHandler.ValidationError(
                    set,
                    "Task not found"
                );
            }

            if (!user) {
                return ErrorHandler.ValidationError(
                    set,
                    "User not found"
                );
            }

            // Check if user has already joined this task
            const existingActiveTask = await ActiveTask.findOne({
                taskId: taskId,
                userId: user._id
            });

            if (existingActiveTask) {
                return ErrorHandler.ValidationError(
                    set,
                    "You have already joined this task"
                );
            }

            // count due date if task is pending
            let activeTaskDueDate = new Date()
            if (task.activeFrom === "task launch" && task.verifyBy === "bot") {
                const dueDate = new Date(activeTaskDueDate.getTime() + task.duration * 60 * 60 * 1000); // duration in hours
                activeTaskDueDate = dueDate;
            }

            const activeTask = await ActiveTask.create({
                taskId: task._id,
                userId: user._id,
                status: "pending",
                dueDate: activeTaskDueDate,
                statusMessage: "Task joined successfully",
            })

            if (!activeTask) {
                return ErrorHandler.ValidationError(
                    set,
                    "Failed to create an active task"
                );
            }

            return SuccessHandler(
                set,
                "Active task created successfully",
                activeTask
            )

        } catch (error) {
            return ErrorHandler.ServerError(
                set,
                "Error handling user task",
                error
            );
        }
    }, TaskValidator.joinTask)
    .get("/verify-task/:taskId", async ({ set, sessionClient, params: { taskId } }) => {
        try {
            // Find the active task for this user and task
            const user = await User.findOne({ sessionClientId: sessionClient.sessionClientId._id });
            if (!user) {
                return ErrorHandler.ValidationError(
                    set,
                    "User not found"
                );
            }

            const activeTask = await ActiveTask.findOne({
                taskId: taskId,
                userId: user._id
            }).populate('taskId');

            if (!activeTask) {
                return ErrorHandler.ValidationError(
                    set,
                    "You haven't joined this task yet. Please join the task first."
                );
            }

            // Check if task is eligible for bot verification
            const task = activeTask.taskId as any;
            if (task.verifyBy !== "bot") {
                return ErrorHandler.ValidationError(
                    set,
                    "This task is not configured for bot verification"
                );
            }

            // Handle different task statuses
            switch (activeTask.status) {
                case "completed":
                    return SuccessHandler(
                        set,
                        "Task already completed! Congratulations!",
                        {
                            activeTaskId: activeTask._id,
                            status: activeTask.status,
                            statusMessage: activeTask.statusMessage || "Task completed successfully",
                            completedAt: activeTask.updatedAt,
                            verificationResult: activeTask.verificationResult ? JSON.parse(activeTask.verificationResult) : null,
                            pointsEarned: task.points
                        }
                    );

                // case "failed":
                //     return SuccessHandler(
                //         set,
                //         "Task verification failed. You can try again or check the requirements.",
                //         {
                //             activeTaskId: activeTask._id,
                //             status: activeTask.status,
                //             statusMessage: activeTask.statusMessage || "Task verification failed",
                //             failureReason: activeTask.verificationResult ? JSON.parse(activeTask.verificationResult) : null,
                //             canRetry: true,
                //             nextAction: "Please check task requirements and try again"
                //         }
                //     );

                case "ready_for_verification":
                    return SuccessHandler(
                        set,
                        "Task is already queued for verification. Please wait for the bot to process it.",
                        {
                            activeTaskId: activeTask._id,
                            status: activeTask.status,
                            statusMessage: activeTask.statusMessage || "Task is being verified by bot",
                            estimatedVerificationTime: "Within 1 hour",
                            lastBotCheck: activeTask.lastBotCheck,
                            botCheckCount: activeTask.botCheckCount || 0
                        }
                    );

                case "expired":
                    return ErrorHandler.ValidationError(
                        set,
                        "This task has expired and can no longer be verified"
                    );

                case "pending":
                    // Update the active task status to ready for verification
                    const updatedActiveTask = await ActiveTask.findByIdAndUpdate(
                        activeTask._id,
                        {
                            status: "ready_for_verification",
                            statusMessage: "Task marked as ready for bot verification",
                            lastBotCheck: null, // Reset to ensure cron picks it up
                            botCheckCount: 0, // Reset check count
                            verificationResult: null // Clear previous results
                        },
                        { new: true }
                    );

                    if (!updatedActiveTask) {
                        return ErrorHandler.ValidationError(
                            set,
                            "Failed to update active task status"
                        );
                    }

                    return SuccessHandler(
                        set,
                        "Task marked as ready for verification. Bot will verify your task within the next hour.",
                        {
                            activeTaskId: updatedActiveTask._id,
                            status: updatedActiveTask.status,
                            statusMessage: updatedActiveTask.statusMessage,
                            nextVerificationCheck: "Within 1 hour"
                        }
                    );

                default:
                    return ErrorHandler.ValidationError(
                        set,
                        `Unknown task status: ${activeTask.status}`
                    );
            }

        } catch (error) {
            return ErrorHandler.ServerError(
                set,
                "Error processing task verification request",
                error
            );
        }
    }, TaskValidator.verifyTask)
    .get("/social-username", async ({ set, sessionClient, query: { platform, username } }) => {
        try {
            const user = await User.findOne({ sessionClientId: sessionClient.sessionClientId._id });
            if (!user) {
                return ErrorHandler.ValidationError(set, "User not found");
            }

            // validate platform and query
            if (!platform || !["twitter", "instagram"].includes(platform)) {
                return ErrorHandler.ValidationError(set, "Invalid platform specified");
            }

            if (!username || typeof username !== "string") {
                return ErrorHandler.ValidationError(set, "Username must be a string");
            }

            // update user's social info
            if (platform === "twitter") {
                user.socialInfo.twitter = username;
            } else if (platform === "instagram") {
                user.socialInfo.instagram = username;
            }

            // save updated user
            await user.save();

            // return success response with social usernames

            return SuccessHandler(set, "Social usernames retrieved successfully", {
                twitter: user.socialInfo.twitter,
                instagram: user.socialInfo.instagram
            });
        } catch (error) {
            return ErrorHandler.ServerError(set, "Error retrieving social usernames", error);
        }
    }, TaskValidator.socialUsername);

export default userHandleTask;
