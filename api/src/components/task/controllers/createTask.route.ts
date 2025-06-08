import Elysia from "elysia";
import ErrorHandler from "../../../services/errorHandler.service";
import SuccessHandler from "../../../services/successHandler.service";
import Task from "../_model";
import TaskValdation from "../_setup";
import { isSessionAuth } from "../../../middleware/authSession.middleware";

const createTask = new Elysia()
    .use(isSessionAuth("admin"))
    .post("/newTask", async ({ set, body }) => {
        const {
            name,
            points,
            message,
            type,
            duration,
            activeFrom,
            platform
        } = body
        try {

            const taskDupCheck = await Task.findOne({ name })

            if (taskDupCheck) {
                return ErrorHandler.ValidationError(set, "task name is alread in use.")
            }

            const newTask = await Task.create({
                name,
                points,
                message,
                type,
                duration,
                activeFrom,
                platform
            })

            if (!newTask) {
                return ErrorHandler.ValidationError(set, "Error creating new task.")
            }

            return SuccessHandler(
                set,
                "User Created",
                newTask,
                true
            )
        } catch (error) {
            return ErrorHandler.ServerError(
                set,
                "Error registering user",
                error
            );
        }
    }, TaskValdation.creatTask)

export default createTask