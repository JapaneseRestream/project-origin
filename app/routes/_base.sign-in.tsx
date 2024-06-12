import { Button } from "@radix-ui/themes";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";

import { signInRedirectCookie } from "../lib/sign-in-redirect.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const referer = request.headers.get("Referer");
	if (!referer) {
		return new Response(null);
	}
	const requestOrigin = new URL(request.url).origin;
	const refererOrigin = new URL(referer).origin;
	return new Response(null, {
		headers: {
			"Set-Cookie": await signInRedirectCookie.serialize(
				requestOrigin === refererOrigin ? referer : "/",
			),
		},
	});
};

export default () => {
	return (
		<Form method="post" action="/sign-in/discord">
			<Button type="submit">Sign in with Discord</Button>
		</Form>
	);
};
