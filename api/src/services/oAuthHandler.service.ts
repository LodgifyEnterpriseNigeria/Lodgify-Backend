import { getGoogleAuthURL } from "../configs/oAuth.config";



class OAuthHandler{
    public static async linkGoogle(){
        const googleAuthURL = getGoogleAuthURL()
        return {
            googleAuthURL
        }
    }
}

export default OAuthHandler