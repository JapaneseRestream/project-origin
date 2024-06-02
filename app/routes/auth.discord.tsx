import type { ActionFunctionArgs } from "@remix-run/cloudflare";
import { createAuthenticator } from "../lib/auth.server";

export const action = ({
	request,
	context: { cloudflare },
}: ActionFunctionArgs) => {
	const authenticator = createAuthenticator(cloudflare);
	return authenticator.authenticate("discord", request);
};
