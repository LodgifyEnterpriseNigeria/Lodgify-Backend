import { googleOAuth } from "../configs/oAuth.config";
import SuccessHandler from "./successHandler.service";



class OAuthHandler {
    public static async getRedirect(type: "google" | "instagram") {
        let oAuth, message;

        switch (type) {
            case "google":
                oAuth = await this.linkGoogle();
                message = "Redirect to Google";
                break;
            case "instagram":
                oAuth = await this.linkInstagram();
                message = "Redirect to Instagram";
                break;
            default:
                throw new Error("Unsupported OAuth type");
        }

        return {
            message,
            oAuth
        };
    }

    public static async linkGoogle() {
        const googleAuthURL = googleOAuth.getAuthURL()
        return {
            googleAuthURL
        }
    }

    public static async linkInstagram() {
        const instagramAuthURL = "getGoogleAuthURL()"
        return {
            instagramAuthURL
        }
    }
}

export default OAuthHandler