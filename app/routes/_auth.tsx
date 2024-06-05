import {
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	json,
	redirect,
} from "@remix-run/cloudflare";
import { signInRedirectCookie } from "../lib/sign-in-redirect.server";

const handler = async ({
	request,
	context: { authenticator },
}: LoaderFunctionArgs | ActionFunctionArgs) => {
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
