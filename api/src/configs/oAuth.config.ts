import axios from "axios";
import qs from "qs";


// Google OAuth
const client_id = Bun.env.GOOGLE_CLIENT_ID!;
const client_secret = Bun.env.GOOGLE_CLIENT_SECRET!;
const redirect_uri = "http://localhost:8000/users/oauth/google/callback";

export const getGoogleAuthURL = () => {
  const query = qs.stringify({
    client_id,
    redirect_uri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${query}`;
};

export const getGoogleTokens = async (code: string) => {
  const url = "https://oauth2.googleapis.com/token";
  const values = {
    code,
    client_id,
    client_secret,
    redirect_uri,
    grant_type: "authorization_code",
  };

  const res = await axios.post(url, qs.stringify(values), {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return res.data;
};

export const getGoogleUser = async (access_token: string) => {
  const res = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  return res.data;
};
