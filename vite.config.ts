import * as remix from "@remix-run/dev";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { getLoadContext } from "./load-context";

export default defineConfig({
	ssr: {
		noExternal: ["react-admin", "ra-core", "ra-ui-materialui", "jsonexport"],
	},
	plugins: [
		nodePolyfills({
			include: [],
			globals: { global: true },
		}),
		remix.cloudflareDevProxyVitePlugin<Env, never>({
			getLoadContext,
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
