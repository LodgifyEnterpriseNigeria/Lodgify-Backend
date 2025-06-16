import { model, Schema, Types } from "mongoose";

// Task interface
export interface ITask {
    name: string;
    points: number;
    message: string;
    type: "core" | "special" | "daily" | "collab" | "giveaway";
    duration: number; // in hours, 0 = uncapped
    activeFrom: "signUp" | "task launch" | "time bound";
    verifyBy: "bot" | "admin";
    platform: "tiktok" | "x" | "instagram" | "youtube" | "other";
    usersOnTask: Types.ObjectId[];
}

// Task schema
const TaskSchema = new Schema<ITask>(
    {
        name: { type: String, required: true },
        points: { type: Number, required: true },
        message: { type: String, required: true },
        type: {
            type: String,
            enum: ["core", "special", "daily", "collab", "giveaway"],
            required: true,
        },
        duration: { type: Number, required: true },
        activeFrom: {
            type: String,
            enum: ["signUp", "task launch"],
            required: true,
        },
        verifyBy: {
            type: String,
            enum: ["bot", "admin"],
            required: true,
        },
        platform: {
            type: String,
            enum: ["tiktok", "x", "instagram", "youtube", "other"],
            required: true,
        },
        usersOnTask: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);

// Export model
export const Task = model<ITask>("Task", TaskSchema);



// ActiveTask interface
export interface IActiveTask {
    taskId: Types.ObjectId;
    userId: Types.ObjectId;
    status: "pending" | "completed" | "";
    statusMessage: string;
}

// ActiveTask schema
const ActiveTaskSchema = new Schema<IActiveTask>(
    {
        taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["pending", "completed", ""],
            default: "pending",
        },
        statusMessage: { type: String, default: "" },
    },
    { timestamps: true }
);

// Export model
export const ActiveTask = model<IActiveTask>("ActiveTask", ActiveTaskSchema);
