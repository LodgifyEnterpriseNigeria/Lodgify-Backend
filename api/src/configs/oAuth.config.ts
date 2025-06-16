import axios from "axios";
import qs from "qs";


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


// Instagram OAuth
class InstagramOAuth {
	private client_id: string;
	private client_secret: string;
	private redirect_uri: string;

	constructor() {
		this.client_id = Bun.env.INSTAGRAM_CLIENT_ID!;
		this.client_secret = Bun.env.INSTAGRAM_CLIENT_SECRET!;
		this.redirect_uri = "http://localhost:8000/oauth/instagram/callback"; // or your prod callback
	}

	getAuthURL() {
		const query = qs.stringify({
			client_id: this.client_id,
			redirect_uri: this.redirect_uri,
			scope: "user_profile,user_media",
			response_type: "code",
		});
		return `https://api.instagram.com/oauth/authorize?${query}`;
	}

	async exchangeCodeForShortToken(code: string) {
		const url = "https://api.instagram.com/oauth/access_token";
		const form = new URLSearchParams({
			client_id: this.client_id,
			client_secret: this.client_secret,
			grant_type: "authorization_code",
			redirect_uri: this.redirect_uri,
			code,
		});

		const res = await axios.post(url, form);
		return res.data; // { access_token, user_id }
	}

	async exchangeForLongLivedToken(shortToken: string) {
		const url = `https://graph.instagram.com/access_token?` + qs.stringify({
			grant_type: "ig_exchange_token",
			client_secret: this.client_secret,
			access_token: shortToken,
		});

		const res = await axios.get(url);
		return res.data; // { access_token, expires_in }
	}

	async getUserProfile(longLivedToken: string) {
		const url = `https://graph.instagram.com/me?fields=id,username,account_type&access_token=${longLivedToken}`;
		const res = await axios.get(url);
		return res.data; // { id, username, account_type }
	}

	async getRecentMedia(longLivedToken: string) {
		const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp&access_token=${longLivedToken}`;
		const res = await axios.get(url);
		return res.data.data; // array of media posts
	}
}

export const instagramOAuth = new InstagramOAuth();