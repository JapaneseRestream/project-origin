import { createCookie } from "@remix-run/cloudflare";

export const renewSessionCookie = createCookie("renew-session", {
	httpOnly: true,
	sameSite: "lax",
	path: "/",
	maxAge: 60 * 60, // 1 hour
});
