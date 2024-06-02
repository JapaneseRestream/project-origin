import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/cloudflare";
import { createAuthenticator } from "../lib/auth.server";
import { signInRedirectCookie } from "../lib/sign-in-redirect.server";

const handler = async ({
	request,
	context: { cloudflare },
}: LoaderFunctionArgs | ActionFunctionArgs) => {
	const authenticator = createAuthenticator(cloudflare);
	const user = await authenticator.isAuthenticated(request);
	if (user) {
		return json(null);
	}
	throw redirect("/sign-in", {
		headers: {
			"Set-Cookie": await signInRedirectCookie.serialize(
				new URL(request.url).href,
			),
		},
	});
};

export const loader = handler;

export const action = handler;
