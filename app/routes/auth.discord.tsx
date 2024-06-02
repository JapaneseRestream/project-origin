import { type ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { createAuthenticator } from "../lib/auth.server";

export const action = async ({
	request,
	context: { cloudflare },
}: ActionFunctionArgs) => {
	const authenticator = createAuthenticator(cloudflare);
	await authenticator.authenticate("discord", request);
	return json(null);
};
