import { model, Schema, Types } from "mongoose";

// Task interface
export interface ITask {
    name: string;
    points: number;
    message: string;
    type: "core" | "special" | "daily" | "collab" | "giveaway";
    duration: number; // in hours, 0 = uncapped
    activeFrom: "signUp" | "task launch";
    isTimeBound?: boolean; // Optional, true if task is time bound
    verifyBy: "bot" | "admin";
    platform: "x" | "instagram" | "other";
    isActive?: boolean; // Optional, true if task is active
    
    // Enhanced fields for social media tasks
    taskType?: "follow" | "post" | "like" | "share" | "comment" | "custom";
    requirements?: {
        hashtags?: string[];
        mentions?: string[];
        keywords?: string[];
        minLength?: number;
        maxLength?: number;
        mediaRequired?: boolean;
    };
    verification?: {
        checkType?: "follow_status" | "recent_posts" | "specific_post" | "engagement";
        timeWindow?: number; // hours to check back for posts
        requiresHashtag?: string; // Legacy support
        requiresMention?: string; // Legacy support
    };
}

// Task schema
const TaskSchema = new Schema<ITask>(
    {
        name: { type: String, required: true },
        points: { type: Number, required: true }, // points avaliable for a task
        message: { type: String, required: true }, // task info
        type: {
            type: String,
            enum: ["core", "special", "daily", "collab", "giveaway"],
            required: true,
        },
        duration: { type: Number, required: true }, // in hours, 0 = uncapped
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
            enum: ["x", "instagram", "other"],
            required: true,
        },
        isTimeBound: { type: Boolean, default: false }, // Optional, true if task is time bound
        isActive: { type: Boolean, default: true }, // Optional, true if task is active
        
        // Enhanced fields for social media tasks
        taskType: {
            type: String,
            enum: ["follow", "post", "like", "share", "comment", "custom"],
            default: "custom"
        },
        requirements: {
            hashtags: [{ type: String }],
            mentions: [{ type: String }],
            keywords: [{ type: String }],
            minLength: { type: Number },
            maxLength: { type: Number },
            mediaRequired: { type: Boolean, default: false }
        },
        verification: {
            checkType: {
                type: String,
                enum: ["follow_status", "recent_posts", "specific_post", "engagement"],
                default: "recent_posts"
            },
            timeWindow: { type: Number, default: 24 }, // hours
            requiresHashtag: { type: String }, // Legacy support
            requiresMention: { type: String }  // Legacy support
        }
    },
    { timestamps: true }
);

// Export model
export const Task = model<ITask>("Task", TaskSchema);



// ActiveTask interface
export interface IActiveTask {
    taskId: Types.ObjectId;
    userId: Types.ObjectId;
    status: "pending" | "ready_for_verification" | "completed" | "notActive" | "expired"; // Status of the task
    statusMessage: string;
    dueDate?: Date; // Optional due date for the task
    verifyLink?: string; // Optional verification link for the task
    lastBotCheck?: Date; // Last time bot checked this specific task
    botCheckCount?: number; // Number of times bot has checked this task
    verificationResult?: string; // Result of bot verification
}

// ActiveTask schema
const ActiveTaskSchema = new Schema<IActiveTask>(
    {
        taskId: { type: Schema.Types.ObjectId, ref: "Task", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["pending", "ready_for_verification", "completed", "notActive", "expired"],
            default: "pending",
        },
        statusMessage: { type: String, default: "" },
        dueDate: { type: Date, default: null }, // Optional due date
        verifyLink: { type: String, default: null }, // Optional verification link
        lastBotCheck: { type: Date, default: null }, // Last time bot checked this specific task
        botCheckCount: { type: Number, default: 0 }, // Number of times bot has checked this task
        verificationResult: { type: String, default: null }, // Result of bot verification
    },
    { timestamps: true }
);

// Export model
export const ActiveTask = model<IActiveTask>("ActiveTask", ActiveTaskSchema);
