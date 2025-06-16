import { t } from "elysia"

const TaskValdation = {
  creatTask: {
    body: t.Object({
      name: t.String({ error: "Name is required and must be a string" }),
      points: t.Number({ error: "Points are required and must be a number" }),
      message: t.String({ error: "Message is required and must be a string" }),
      type: t.Enum(
        {
          core: "core",
          special: "special",
          daily: "daily",
          collab: "collab",
          giveaway: "giveaway",
        },
        { error: "Type must be one of: core, special, daily, collab, giveaway" }
      ),
      duration: t.Number({ error: "Duration is required and must be a number" }),
      activeFrom: t.Enum(
        {
          signUp: "signUp",
          taskLaunch: "task launch", // 👈 Match your Mongoose string exactly
        },
        { error: "ActiveFrom must be 'signUp' or 'task launch'" }
      ),
      verifyBy: t.Enum(
        {
          bot: "bot",
          admin: "admin",
        },
        { error: "verifyBy must be 'bot' or 'admin'" }
      ),
      platform: t.Enum(
        {
          tiktok: "tiktok",
          x: "x",
          instagram: "instagram",
          youtube: "youtube",
          other: "other",
        },
        { error: "Platform must be one of: tiktok, x, instagram, youtube, other" }
      ),
    }),
    detail: {
      tags: ["Task"],
    },
  },
}

export default TaskValdation
