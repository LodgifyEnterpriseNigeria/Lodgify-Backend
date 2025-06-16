import Elysia from "elysia"
import ErrorHandler from "../../../services/errorHandler.service"
import SuccessHandler from "../../../services/successHandler.service"
import { Task } from "../_model"
import TaskValdation from "../_setup"
import { isSessionAuth } from "../../../middleware/authSession.middleware"

const createTask = new Elysia()
  .use(isSessionAuth("admin"))
  .post(
    "/newTask",
    async ({ set, body }) => {
      const {
        name,
        points,
        message,
        type,
        duration,
        activeFrom,
        platform,
        verifyBy, // ✅ now required
      } = body

      try {
        const taskDupCheck = await Task.findOne({ name })
        if (taskDupCheck) {
          return ErrorHandler.ValidationError(set, "Task name is already in use.")
        }

        const newTask = await Task.create({
          name,
          points,
          message,
          type,
          duration,
          activeFrom,
          platform,
          verifyBy, // ✅ added this to match Mongoose schema
        })

        if (!newTask) {
          return ErrorHandler.ValidationError(set, "Error creating new task.")
        }

        return SuccessHandler(set, "Task Created", newTask, true)
      } catch (error) {
        return ErrorHandler.ServerError(set, "Error creating task", error)
      }
    },
    TaskValdation.creatTask 
  )

export default createTask
