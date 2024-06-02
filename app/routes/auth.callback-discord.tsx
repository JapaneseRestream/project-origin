import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createAuthenticator } from "../lib/auth.server";
import { signInRedirectCookie } from "../lib/sign-in-redirect.server";

export const loader = async ({
	request,
	context: { cloudflare },
}: LoaderFunctionArgs) => {
	const signInRedirect = (await signInRedirectCookie.parse(
		request.headers.get("Cookie"),
	)) as string | null;
	const authenticator = createAuthenticator(cloudflare);
	return authenticator.authenticate("discord", request, {
		successRedirect: signInRedirect ?? "/",
		failureRedirect: "/sign-in",
	});
};
