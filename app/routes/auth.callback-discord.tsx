import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { signInRedirectCookie } from "../lib/sign-in-redirect.server";

export const loader = async ({
	request,
	context: { authenticator },
}: LoaderFunctionArgs) => {
	const signInRedirect = (await signInRedirectCookie.parse(
		request.headers.get("Cookie"),
	)) as string | null;
	return authenticator.authenticate("discord", request, {
		successRedirect: signInRedirect ?? "/",
		failureRedirect: "/sign-in",
	});
};
