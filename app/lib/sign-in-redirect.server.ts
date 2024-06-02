import { createCookie } from "@remix-run/cloudflare";

export const signInRedirectCookie = createCookie("sign_in_redirect", {
	maxAge: 5 * 60,
});
