import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { SignOutButton } from "../components/sign-out-button";
import { getUser } from "../lib/session.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const user = await getUser(request, context);
	return json({ user });
};

export default () => {
	const { user } = useLoaderData<typeof loader>();

	return (
		<>
			<div>
				<Link to="/events">イベント一覧</Link>
				{user ? (
					<>
						<SignOutButton />
					</>
				) : (
					<>
						<Link to="/sign-in">ログイン</Link>
						<Link to="/register">新規登録</Link>
					</>
				)}
			</div>
			<Outlet />
		</>
	);
};
