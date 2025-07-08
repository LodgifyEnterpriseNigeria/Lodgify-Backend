import { Elysia } from "elysia";
import { ActiveTask, Task } from "../_model";
import ErrorHandler from "../../../services/errorHandler.service";

const adminHandleTask = new Elysia({
    prefix: "/admin"
})
    .get("/getTask", async ({ set }) => {
        try {
            // Total number of tasks
            const tasks = await Task.find()
            const totalTasks = await Task.countDocuments();

            // Total completed task entries (across all users)
            const totalCompletedTasks = await ActiveTask.countDocuments({ status: "completed" });

            // Active/Ongoing tasks (those with non-zero duration)
            const ongoingTasks = await Task.countDocuments({ duration: { $gt: 0 } });

            return {
                success: true,
                message: "Task and analytics fetched",
                data: {
                    totalTasks,
                    totalCompletedTasks,
                    ongoingTasks,
                    tasks
                }
            };

        } catch (error) {
            return ErrorHandler.ServerError(
                set,
                "Error getting task metrics",
                error
            );
        }
    });


export default adminHandleTask