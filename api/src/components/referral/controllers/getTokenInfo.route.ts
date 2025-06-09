import Elysia from "elysia";
import ErrorHandler from "../../../services/errorHandler.service";
import SuccessHandler from "../../../services/successHandler.service";
import Referral from "../_model";
import ReferralValidator from "../_setup";
import { isSessionAuth } from "../../../middleware/authSession.middleware";

const getTokenInfo = new Elysia()
    .get("/token/:token/user", async ({ set, params: { token } }) => {
        try {
            const info = await Referral.findOne({ token }).populate("userId")

            if (!info) {
                return ErrorHandler.ValidationError(set, "Invalid ref token")
            }

            return SuccessHandler(
                set,
                "Token info found",
                {
                    user: info?.userId
                },
            )
        } catch (error) {
            return ErrorHandler.ServerError(
                set,
                "Error registering user",
                error
            );
        }
    }, ReferralValidator.getToken)
    .use(isSessionAuth("user"))
    .get("/token/:token/all", async ({ set, params: { token } }) => {
        try {
            const info = await Referral.findOne({ token })
                .populate("userId")
                .populate({
                    path: "friends",
                    select: "points"
                });

            if (!info) {
                return ErrorHandler.ValidationError(set, "Invalid ref token");
            }

            const friendListPoint = Array.isArray(info.friends)
                ? info.friends.reduce((acc: number, friend: any) => acc + (friend.points || 0), 0)
                : 0;

            return SuccessHandler(
                set,
                "Token info found",
                {
                    refInfo: info,
                    friendListPoint
                },
            );
        } catch (error) {
            return ErrorHandler.ServerError(
                set,
                "Error registering user",
                error
            );
        }
    }, ReferralValidator.getToken);


export default getTokenInfo