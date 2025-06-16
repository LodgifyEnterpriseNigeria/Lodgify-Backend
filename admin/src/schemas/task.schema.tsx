import { z } from "zod"

export const taskSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  points: z.number().min(1, "Points must be at least 1"),
  duration: z.number().min(1, "Duration must be at least 1 second"),

  message: z.string().min(5, "Message must be at least 5 characters"),

  type: z.enum(["core", "special", "daily", "collab", "giveaway"]),


  activeFrom: z.enum(["signUp", "task launch"]),

  verifyBy: z.enum(["bot", "admin"]),

  platform: z.enum(["tiktok", "x", "instagram", "youtube", "other"]),
})