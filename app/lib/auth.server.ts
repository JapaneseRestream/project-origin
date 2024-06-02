import {
	createCookie,
	createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import { type DiscordProfile, DiscordStrategy } from "remix-auth-discord";
import type { Cloudflare } from "../../load-context";

export interface User {
	id: DiscordProfile["id"];
	displayName: DiscordProfile["displayName"];
	accessToken: string;
	refreshToken?: string;
}

export const createAuthenticator = (cloudflare: Cloudflare) => {
	const sessionStorage = createWorkersKVSessionStorage({
		cookie: createCookie("session", {
			sameSite: "lax",
			secrets: [cloudflare.env.SESSION_COOKIE_SECRET],
			secure: cloudflare.env.CF_ENV !== "local",
		}),
		kv: cloudflare.env.session_storage,
	});

	const authenticator = new Authenticator<User>(sessionStorage);

	const discordStrategy = new DiscordStrategy(
		{
			clientID: cloudflare.env.DISCORD_CLIENT_ID,
			clientSecret: cloudflare.env.DISCORD_CLIENT_SECRET,
			callbackURL: "/auth/callback-discord",
			scope: ["identify"],
			prompt: "none",
		},
		// eslint-disable-next-line @typescript-eslint/require-await
		async (params): Promise<User> => {
			return {
				id: params.profile.id,
				displayName: params.profile.displayName,
				accessToken: params.accessToken,
				refreshToken: params.refreshToken,
			};
		},
	);

	authenticator.use(discordStrategy);

	return authenticator;
};
