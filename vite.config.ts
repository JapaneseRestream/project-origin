import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import * as remix from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		remix.cloudflareDevProxyVitePlugin<Env, never>({
			getLoadContext: ({ context }) => {
				const { DB } = context.cloudflare.env;
				const prisma = new PrismaClient({ adapter: new PrismaD1(DB) });
				return { prisma, cloudflare: context.cloudflare };
			},
		}),
		remix.vitePlugin({
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
		}),
	],
});
