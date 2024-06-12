import "./styles.css";

import { Button, Theme } from "@radix-ui/themes";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link as RemixLink, Outlet, useLoaderData } from "@remix-run/react";

import { Link } from "../../components/link";
import { SignOutButton } from "../../components/sign-out-button";
import { getUser } from "../../lib/session.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const user = await getUser(request, context);
	return json({ user });
};

const App = () => {
	const { user } = useLoaderData<typeof loader>();
	return (
		<>
			<div>
				<Link to="/events">イベント一覧</Link>
				{user ? (
					<SignOutButton />
				) : (
					<>
						<Button asChild>
							<RemixLink to="/sign-in">ログイン</RemixLink>
						</Button>
						<Button asChild>
							<RemixLink to="/register">新規登録</RemixLink>
						</Button>
					</>
				)}
			</div>
			<Outlet />
		</>
	);
};

export default () => {
	return (
		<Theme>
			<App />
		</Theme>
	);
};
