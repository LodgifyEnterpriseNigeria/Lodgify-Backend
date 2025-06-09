import mongoose from "mongoose";
import { generateRefToken } from "../../services/referalToken.service";
import NotificationHandler from "../../services/notificationHandler.service";
import { IUser } from "../users/_model";

interface IReferral {
    userId: mongoose.Types.ObjectId;
    token: string;
    friends: mongoose.Types.ObjectId[];
    points: number;
    activityStatus: boolean;
    referedBy: mongoose.Types.ObjectId;
}

const ReferralSchema = new mongoose.Schema<IReferral>({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    token: { type: String, unique: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Referral' }],
    points: { type: Number, default: 0 },
    activityStatus: { type: Boolean, default: true },
    referedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// ✅ Pre-save hook to generate unique token
ReferralSchema.pre<IReferral>('save', async function (next) {
    if (!this.token) {
        let token: string = "";
        let exists = true;

        // Generate a unique referral token
        while (exists) {
            token = generateRefToken();
            exists = !!(await mongoose.models.Referral.exists({ token }));
        }

        this.token = token;
    }
    next();
});

// ✅ Post-save hook to populate referring user's friends list
ReferralSchema.post('save', async function (doc, next) {
    try {
        if (doc.referedBy) {
            // Find the referral doc of the person who referred this user
            const referringReferral = await mongoose.models.Referral.findOne({ userId: doc.referedBy }).populate("userId");

            if (referringReferral) {
                // Check if current user is already in the friends array
                const alreadyFriend: boolean = referringReferral.friends.some((friendId: mongoose.Types.ObjectId) =>
                    friendId.toString() === doc._id.toString()
                );


                const userContent = await doc.populate('userId');

                if (!alreadyFriend) {
                    NotificationHandler.send(
                        referringReferral.userId.sessionClientId,
                        "notRead",
                        `Your friend ${(userContent.userId as any).username} has joined using your referral!`,
                        "New Friend Joined",
                    )
                    referringReferral.friends.push(doc._id);
                    referringReferral.points = (referringReferral.points || 0) + 1000;
                    await referringReferral.save();
                }
            }
        }
        next();
    } catch (err) {
        console.error('Error updating referral friends:', err);
        next();
    }
});

const Referral = mongoose.model<IReferral>('Referral', ReferralSchema);

export default Referral;
