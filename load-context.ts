import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import type { Authenticator } from "remix-auth";
import type { PlatformProxy } from "wrangler";
import { type User, createAuthenticator } from "./app/lib/auth.server";

export type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
	interface AppLoadContext {
		cloudflare: Cloudflare;
		prisma: PrismaClient;
		authenticator: Authenticator<User>;
	}
}

export const getLoadContext = ({
	context: { cloudflare },
}: {
	context: { cloudflare: Cloudflare };
}) => {
	return {
		cloudflare,
		prisma: new PrismaClient({ adapter: new PrismaD1(cloudflare.env.DB) }),
		authenticator: createAuthenticator(cloudflare),
	};
};
