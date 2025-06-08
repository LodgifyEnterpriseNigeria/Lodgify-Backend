import Elysia from "elysia";
import ErrorHandler from "../../../services/errorHandler.service";
import SuccessHandler from "../../../services/successHandler.service";
import Referral from "../_model";
import ReferralValidator from "../_setup";

const getTokenInfo = new Elysia()
    .get("/token/getInfo/:token", async ({ set, params: { token } }) => {
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

export default getTokenInfo