import axios from "axios";
import qs from "qs";
import { TwitterOAuthSession } from "../components/auth/_model";
import crypto from "crypto";

class GoogleOAuth {
	private client_id: string;
	private client_secret: string;
	private redirect_uri: string;

	constructor() {
		this.client_id = Bun.env.GOOGLE_CLIENT_ID!;
		this.client_secret = Bun.env.GOOGLE_CLIENT_SECRET!;
		this.redirect_uri = Bun.env.GOOGLE_CALLBACK!;
	}

	getAuthURL() {
		const query = qs.stringify({
			client_id: this.client_id,
			redirect_uri: this.redirect_uri,
			response_type: "code",
			scope: "openid email profile",
			access_type: "offline",
			prompt: "consent",
		});
		return `https://accounts.google.com/o/oauth2/v2/auth?${query}`;
	}

	async getTokens(code: string) {
		const url = "https://oauth2.googleapis.com/token";
		const values = {
			code,
			client_id: this.client_id,
			client_secret: this.client_secret,
			redirect_uri: this.redirect_uri,
			grant_type: "authorization_code",
		};

		const res = await axios.post(url, qs.stringify(values), {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});
		return res.data;
	}

	async getUser(access_token: string) {
		const res = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		});
		return res.data;
	}
}

export const googleOAuth = new GoogleOAuth();
