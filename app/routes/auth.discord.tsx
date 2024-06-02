import { type ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { createAuthenticator } from "../lib/auth.server";

export const action = async ({
	request,
	context: { cloudflare },
}: ActionFunctionArgs) => {
	try {
		const authenticator = createAuthenticator(cloudflare);
		await authenticator.authenticate("discord", request);
		return json(null);
	} catch (error) {
		console.trace(error);
		return json(null);
	}
};
