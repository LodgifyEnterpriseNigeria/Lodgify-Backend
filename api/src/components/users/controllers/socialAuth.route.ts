import Elysia from "elysia";
import ErrorHandler from "../../../services/errorHandler.service";
import SuccessHandler from "../../../services/successHandler.service";
import OAuthHandler from "../../../services/oAuthHandler.service";
import { googleOAuth } from "../../../configs/oAuth.config";
import { SessionClient } from "../../auth/_model";
import { User } from "../_model";
import Referral from "../../referral/_model";
import NotificationHandler from "../../../services/notificationHandler.service";
import { isSessionAuth } from "../../../middleware/authSession.middleware";
import AuthHandler from "../../../services/authHandler.service";
import { jwtSessionAccess, jwtSessionRefresh } from "../../../middleware/jwt.middleware";
import { UserValidator } from "../_setup";

const socialAuth = new Elysia()
    .use(jwtSessionAccess)
    .use(jwtSessionRefresh)
    .get("/oauth/:type", async ({ set, params: { type } }) => {
        try {
            const data = await OAuthHandler.getRedirect(type)

            return SuccessHandler(set, data.message, data.oAuth)

        } catch (error) {
            return ErrorHandler.ServerError(
                set,
                "Error during oAuth process",
                error
            )
        }
    }, UserValidator.oauth)
    .get("/oauth/instagram/callback", async ({ }) => {
        
    })
    .get("/oauth/google/callback", async ({
        cookie: { sessionAccess, sessionRefresh },
        request,
        sessionAccessJwt,
        sessionRefreshJwt,
        headers,
        set,
        query,
    }) => {
        try {
            const code = query.code as string;
            const { access_token } = await googleOAuth.getTokens(code);
            const googleUser = await googleOAuth.getUser(access_token);

            const { id: googleId, email, picture, name } = googleUser;

            // 1. Check for existing user with this Google ID
            const existingGoogleUser = await SessionClient.findOne({
                $or: [
                    { email },
                    { "oAuth.google.googleId": googleId }
                ]
            });

            if (existingGoogleUser) {
                const fullUser = await User.findOne({ sessionClientId: existingGoogleUser._id });
                if (!fullUser) {
                    return ErrorHandler.ServerError(set, "Linked user record not found");
                }

                // Log them in
                await AuthHandler.signSession(
                    set,
                    existingGoogleUser,
                    request,
                    headers,
                    sessionAccess,
                    sessionRefresh,
                    sessionAccessJwt,
                    sessionRefreshJwt
                );

                return SuccessHandler(set, "Signed in with Google", {
                    _id: fullUser._id.toString(),
                    sessionClientId: fullUser.sessionClientId.toString(),
                    username: fullUser.username,
                    email: existingGoogleUser.email,
                    phoneNumber: fullUser.phoneNumber,
                    gender: fullUser.gender,
                    picture: googleUser.picture,
                });
            }

            // 3. Create SessionClient + User
            const newClient = await SessionClient.create({
                email,
                fullName: name,
                googleId,
                profile: picture,
                isSocialAuth: true,
                isEmailVerified: googleUser.verified_email,
            });

            let user = await User.create({
                sessionClientId: newClient._id,
                username: name.toLowerCase().replace(/\s/g, "") + Math.floor(Math.random() * 10000),
                gender: "notSpecified",
            });

            await Referral.create({
                userId: user._id,
            });

            NotificationHandler.send(
                newClient._id,
                "notRead",
                `Hey ${name}, you're all set! Let's get you your next property.`,
                "Welcome to Lodgify! 🎉",
            );

            // Log in new user
            await AuthHandler.signSession(
                set,
                newClient,
                request,
                headers,
                sessionAccess,
                sessionRefresh,
                sessionAccessJwt,
                sessionRefreshJwt
            );

            return SuccessHandler(set, "Google sign-in success", {
                _id: user._id.toString(),
                sessionClientId: user.sessionClientId.toString(),
                username: user.username,
                email: newClient.email,
                picture: googleUser.picture,
                googleUser,
            });

        } catch (error) {
            return ErrorHandler.ServerError(
                set,
                "Error signing user",
                error
            )
        }
    }, UserValidator.oauth)
    .use(isSessionAuth("user"))
    .delete("/oauth/google/unlink", async ({ set, sessionClient }) => {
        try {
            const client = await SessionClient.findById(sessionClient.sessionClientId);
            if (!client) {
                return ErrorHandler.NotFoundError(set, "Client not found");
            }

            // Prevent unlinking if no password is set (i.e., user would be locked out)
            if (!client.password) {
                return ErrorHandler.ValidationError(set, "You must set a password before unlinking Google.");
            }

            // Check if Google is linked
            if (!client.oAuth?.google?.googleId) {
                return ErrorHandler.ValidationError(set, "No Google account linked.");
            }

            // Unlink Google account
            client.oAuth.google.googleId = "";
            await client.save();

            return SuccessHandler(set, "Google account unlinked successfully.");
        } catch (error) {
            return ErrorHandler.ServerError(set, "Error unlinking Google account", error);
        }
    }, UserValidator.oauth);

export default socialAuth