import { model, Schema, Types } from "mongoose";

interface INotifyUser {
    sessionId: Types.ObjectId;
    type: string;
    title: string;
    message: string;
}

interface INotifyAdmin {
    type: string;
    message: string;
    title: string;
}


const NotifyUserSchema = new Schema<INotifyUser>({
    sessionId: {
        type: Schema.Types.ObjectId,
        ref: 'SessionClient',
    },
    type: {
        type: String,
    },
    title: {
        type: String,
    },
    message: {
        type: String,
    }
}, { timestamps: true })

const NotifyAdminSchema = new Schema<INotifyAdmin>({
    type: {
        type: String,
    },
    title: {
        type: String,
    },
    message: {
        type: String,
    }
}, { timestamps: true })

export const NotifyUser = model<INotifyUser>('NotificationUser', NotifyUserSchema)
export const NotifyAdmin = model<INotifyAdmin>('NotificationAdmin,', NotifyAdminSchema)