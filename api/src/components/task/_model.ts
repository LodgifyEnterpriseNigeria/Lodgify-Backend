import { model, Schema } from "mongoose";

interface ITasks {
    name: string;
    points: number;
    message: string;
    type: "core" | "special",
    duration: number, // in days
    activeFrom: "signUp" | "launch"
    platform: "tiktok" | "x" | "instagram" | "youtube" | "other"
}

const TaskSchema = new Schema<ITasks>({
    name: { type: String, required: true },
    points: { type: Number, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["core", "special"], required: true },
    duration: { type: Number, required: true },
    activeFrom: { type: String, enum: ["signUp", "launch"], required: true },
    platform: { type: String, enum: ["tiktok", "x", "instagram", "youtube", "other"], required: true }
});

const Task = model<ITasks>("Task", TaskSchema)

export default Task