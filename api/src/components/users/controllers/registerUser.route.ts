import Elysia from "elysia";
import ErrorHandler from "../../../services/errorHandler.service";
import { SessionClient } from "../../auth/_model";
import { User } from "../_model";
import SuccessHandler from "../../../services/successHandler.service";
import { UserValidator } from "../_setup";
import Referral from "../../referral/_model";
import { NotifyUser } from "../../notification/_model";
import NotificationHandler from "../../../services/notificationHandler.service";
import { rewardReferralChain } from "../../../services/referalToken.service";

const registerUser = new Elysia()
    .post("/register", async ({ set, body, query }) => {

        const validRoles = ["user", "agent"]
        const { email, password, fullName, phoneNumber, dateOfBirth, username, gender, profile, referalToken } = body;
        const { role } = query
        try {
            if (!role || !validRoles.includes(role)) {
                return ErrorHandler.ValidationError(set, "Invalid role provided")
            }

            const checkEmail = await SessionClient.findOne({ email })
            if (checkEmail) {
                return ErrorHandler.ValidationError(set, "The email provided is already in use.")
            }

            const newClient = await SessionClient.create({
                email,
                password,
                fullName,
                role: role.includes("user") ? [role] : validRoles,
                profile
            })


            if (!newClient) {
                return ErrorHandler.ServerError(
                    set,
                    "Error while creating user session"
                );
            }

            const newUser = await User.create({
                sessionClientId: newClient._id,
                phoneNumber,
                dateOfBirth,
                username,
                gender
            })

            if (!newUser) {
                await SessionClient.findByIdAndDelete(newClient._id)
                return ErrorHandler.ServerError(
                    set,
                    "Error while creating user"
                );
            }

            const getReferie = await Referral.findOne(
                { token: referalToken }
            )

            if (!getReferie && referalToken !== "") {
                await SessionClient.findByIdAndDelete(newClient._id)
                await User.findByIdAndDelete(newUser._id)
                return ErrorHandler.ValidationError(set, "Invalid referral token provided");
            }

            const ref = await Referral.create({
                userId: newUser._id,
                referedBy: getReferie?.userId
            })

            // Optional: reward 2nd-level referrer
            if (getReferie?.userId) {
                await rewardReferralChain(getReferie.userId);
            }

            const refInfo = await ref.populate("referedBy")
            NotificationHandler.send(
                newClient._id,
                "notRead",
                `Hey ${newClient.fullName}, you're all set! Let's get you your next property.`,
                "Welcome to Lodgify! 🎉",
            );



            return SuccessHandler(
                set,
                "User Created",
                {
                    user: newUser,
                    referral: refInfo
                },
                true
            )
        } catch (error) {
            return ErrorHandler.ServerError(
                set,
                "Error registering user",
                error
            );
        }
    }, UserValidator.create)

export default registerUser;