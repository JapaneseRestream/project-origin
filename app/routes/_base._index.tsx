import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, useLoaderData } from "@remix-run/react";

import { getUser } from "../lib/session.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const user = await getUser(request, context);
	return json({ user });
};

export default function Index() {
	const { user } = useLoaderData<typeof loader>();
	return user && <div>Hello, {user.displayName}</div>;
}
