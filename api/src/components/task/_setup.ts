import { t } from "elysia";

const TaskValdation = {
    creatTask: {
        body: t.Object({
            name: t.String({ error: "Name is required and must be a string" }),
            points: t.Number({ error: "Points are required and must be a number" }),
            message: t.String({ error: "Message is required and must be a string" }),
            type: t.Enum({ core: "core", special: "special" }, { error: "Type must be either 'core' or 'special'" }),
            duration: t.Number({ error: "Duration is required and must be a number" }),
            activeFrom: t.Enum({ signUp: "signUp", launch: "launch" }, { error: "ActiveFrom must be either 'signUp' or 'launch'" }),
            platform: t.Enum(
                { tiktok: "tiktok", x: "x", instagram: "instagram", youtube: "youtube", other: "other" },
                { error: "Platform must be one of the specified values" }
            )
        }),
        detail: {
            tags: ['Task']
        }
    }
}

export default TaskValdation