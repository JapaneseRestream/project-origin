import type { PlatformProxy } from "wrangler";

export type Cloudflare = Omit<PlatformProxy<Env>, "dispose">;

declare module "@remix-run/cloudflare" {
	interface AppLoadContext {
		cloudflare: Cloudflare;
	}
}

export const getLoadContext = ({
	context: { cloudflare },
}: {
	context: { cloudflare: Cloudflare };
}) => {
	return { cloudflare };
};
