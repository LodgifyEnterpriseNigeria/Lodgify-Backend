import Elysia from "elysia";
import { isSessionAuth } from "../../../middleware/authSession.middleware";
import ErrorHandler from "../../../services/errorHandler.service";
import SuccessHandler from "../../../services/successHandler.service";
import Referral from "../_model";
import { Types } from "mongoose";

interface IUserWithSession {
    _id: Types.ObjectId;
    sessionClientId: {
        fullName: string;
        email: string;
        profile: string;
    };
}

const adminHandleReferrals = new Elysia({
    prefix: "/admin"
})
    .use(isSessionAuth("admin"))
    .get("/getReferrals", async ({ set }) => {
        try {
            const referrals = await Referral.find({
                friends: { $exists: true, $not: { $size: 0 } },
            })
                .populate<{ userId: IUserWithSession }>({
                    path: "userId",
                    populate: {
                        path: "sessionClientId",
                        model: "SessionClient", 
                        select: "-password"// Replace with actual model name if different
                    },
                })
                .populate("friends");

            const totalReferralsMade = referrals.reduce(
                (sum, r) => sum + r.friends.length,
                0
            );

            const activeAgents = referrals.filter(r => r.friends.length > 0).length;

            const topReferrers = referrals
                .filter(r => r.friends.length > 0 && r.userId?.sessionClientId)
                .sort((a, b) => b.friends.length - a.friends.length)
                .slice(0, 5)
                .map((r) => {
                    const session = r.userId.sessionClientId;
                    return {
                        fullName: session.fullName,
                        email: session.email,
                        profile: session.profile,
                        referredCount: r.friends.length,
                    };
                });

            return SuccessHandler(set, "Referrals and analytics fetched", {
                totalReferralsMade,
                activeAgents,
                topReferrers,
                referrals, // Optional: full dump
            });
        } catch (error) {
            return ErrorHandler.ServerError(
                set,
                "Error fetching referrals and metrics",
                error
            );
        }
    });

export default adminHandleReferrals