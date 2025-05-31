import Elysia from "elysia";
import ErrorHandler from "../../../services/errorHandler.service";
import { SessionClient } from "../../auth/_model";
import { User } from "../_model";
import SuccessHandler from "../../../services/successHandler.service";
import { UserValidator } from "../_setup";

const registerUser = new Elysia()
    .post("/register", async ({ set, body, query }) => {

        const validRoles = ["user"]
        const { email, password, fullName, phoneNumber, dateOfBirth, username, gender, profile } = body;
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
                role: [role],
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
            

            return SuccessHandler(
                set,
                "User Created",
                {
                    user: newUser,
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