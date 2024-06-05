import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import type { PlatformProxy } from "wrangler";
import {
	createCookie,
	createWorkersKVSessionStorage,
} from "@remix-run/cloudflare";
import { Authenticator } from "remix-auth";
import { DiscordStrategy } from "remix-auth-discord";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library.js";

export type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
	interface AppLoadContext {
		cloudflare: Cloudflare;
		prisma: PrismaClient;
		authenticator: ReturnType<typeof createAuthenticator>;
	}
}

interface User {
	id: string;
}

export const createAuthenticator = (
	cloudflare: Cloudflare,
	prisma: PrismaClient,
) => {
	const sessionStorage = createWorkersKVSessionStorage({
		cookie: createCookie("session", {
			sameSite: "lax",
			secrets: [cloudflare.env.SESSION_COOKIE_SECRET],
			secure: cloudflare.env.CF_ENV !== "local",
		}),
		kv: cloudflare.env.KV_SESSION_STORAGE,
	});

	const authenticator = new Authenticator<User>(sessionStorage);

	authenticator.use(
		new DiscordStrategy(
			{
				clientID: cloudflare.env.DISCORD_CLIENT_ID,
				clientSecret: cloudflare.env.DISCORD_CLIENT_SECRET,
				callbackURL: "/auth/callback-discord",
				scope: ["identify"],
				prompt: "none",
			},
			async (params) => {
				const user = await prisma.users.findUnique({
					select: { id: true },
					where: { discordId: params.profile.id },
				});
				if (!user) {
					throw new Error("user not found");
				}
				return {
					id: user.id,
				};
			},
		),
		"discord-authentication",
	);

	authenticator.use(
		new DiscordStrategy(
			{
				clientID: cloudflare.env.DISCORD_CLIENT_ID,
				clientSecret: cloudflare.env.DISCORD_CLIENT_SECRET,
				callbackURL: "/auth/callback-discord",
				scope: ["identify"],
				prompt: "consent",
			},
			async (params) => {
				try {
					const user = await prisma.users.create({
						data: {
							discordId: params.profile.id,
							displayName: params.profile.displayName,
						},
						select: { id: true },
					});
					return { id: user.id };
				} catch (error) {
					if (error instanceof PrismaClientKnownRequestError) {
						if (error.code === "P2002") {
							throw new Error("user already exists");
						}
					}
					throw error;
				}
			},
		),
		"discord-registration",
	);

	return authenticator;
};

export const getLoadContext = ({
	context: { cloudflare },
}: {
	context: { cloudflare: Cloudflare };
}) => {
	const prisma = new PrismaClient({ adapter: new PrismaD1(cloudflare.env.DB) });
	const authenticator = createAuthenticator(cloudflare, prisma);
	return {
		cloudflare,
		prisma,
		authenticator,
	};
};
