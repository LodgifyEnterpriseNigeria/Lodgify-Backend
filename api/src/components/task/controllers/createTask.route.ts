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
				isTimeBound,
				// Enhanced fields
				taskType,
				requirements,
				verification
			} = body

			try {
				const taskDupCheck = await Task.findOne({ name })
				if (taskDupCheck) {
					return ErrorHandler.ValidationError(set, "Task name is already in use.")
				}

				// ✅ Enhanced Validation: If verifyBy is "bot", validate task requirements
				if (verifyBy === "bot") {
					const nameToCheck = name.toLowerCase()
					const requiredKeywords = ["follow", "mention", "tag", "hashtag", "post", "tweet", "share", "like", "comment"]
					
					// Check if taskType is provided and valid
					if (taskType && !["follow", "post", "like", "share", "comment", "custom"].includes(taskType)) {
						return ErrorHandler.ValidationError(
							set,
							`Invalid taskType. Must be one of: follow, post, like, share, comment, custom`
						)
					}
					
					// If taskType is provided, use it for validation, otherwise check name
					const hasValidType = taskType === "follow" || taskType === "post" || 
						requiredKeywords.some(keyword => nameToCheck.includes(keyword))

					console.log({
						nameToCheck,
						taskType,
						requiredKeywords,
						hasValidType
					})

					if (!hasValidType) {
						return ErrorHandler.ValidationError(
							set,
							`When verifyBy is bot, either provide a valid taskType (follow, post, etc.) or include keywords in name: ${requiredKeywords.join(", ")}. Current name: ${name}`
						)
					}
					
					// Validate post task requirements
					if ((taskType === "post" || nameToCheck.includes("post") || nameToCheck.includes("hashtag") || nameToCheck.includes("mention")) && 
						platform !== "other") {
						
						// Check if requirements or verification fields are provided
						const hasHashtagRequirement = requirements?.hashtags?.length > 0 || 
							verification?.requiresHashtag || 
							nameToCheck.includes("#")
							
						const hasMentionRequirement = requirements?.mentions?.length > 0 || 
							verification?.requiresMention || 
							nameToCheck.includes("@")
						
						if (!hasHashtagRequirement && !hasMentionRequirement) {
							console.log("⚠️ Post task without hashtag/mention requirements - will use defaults")
						}
					}
				}

				const newTask = await Task.create({
					name,
					points,
					message,
					type,
					duration,
					activeFrom,
					platform,
					verifyBy,
					isTimeBound,
					// Enhanced fields
					...(taskType && { taskType }),
					...(requirements && { requirements }),
					...(verification && { verification })
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
