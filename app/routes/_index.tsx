import { type LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { createAuthenticator } from "../lib/auth.server";

export const loader = async ({
	request,
	context: { cloudflare },
}: LoaderFunctionArgs) => {
	const authenticator = createAuthenticator(cloudflare);
	const user = await authenticator.isAuthenticated(request);
	if (!user) {
		return json(null);
	}
	return json({ id: user.id });
};

export default function Index() {
	const loaderData = useLoaderData<typeof loader>();

	return (
		<div>
			<h1>Welcome to Remix (with Vite and Cloudflare)</h1>
			<div>{loaderData?.id}</div>
			{loaderData ? (
				<Form method="post" action="/sign-out">
					<button type="submit">Sign out</button>
				</Form>
			) : (
				<Link to="/sign-in">Sign in</Link>
			)}
		</div>
	);
}
