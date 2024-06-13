import "./styles.css";

import { Button, Heading, TabNav, Theme } from "@radix-ui/themes";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
	Outlet,
	useLoaderData,
	useLocation,
} from "@remix-run/react";

import { css } from "../../../styled-system/css";
import { Link, RemixLink } from "../../components/link";
import { SignOutButton } from "../../components/sign-out-button";
import { getUser } from "../../lib/session.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const user = await getUser(request, context);
	return json({ user });
};

const SignInOut = () => {
	const { user } = useLoaderData<typeof loader>();
	if (user) {
		return <SignOutButton />;
	}
	return (
		<div
			className={css({
				display: "grid",
				gap: 1,
				gridTemplateColumns: "auto auto",
			})}
		>
			<Button asChild>
				<RemixLink to="/sign-in">ログイン</RemixLink>
			</Button>
			<Button asChild>
				<RemixLink to="/register">新規登録</RemixLink>
			</Button>
		</div>
	);
};

const Header = () => {
	const { pathname } = useLocation();
	return (
		<header
			className={css({
				position: "sticky",
				top: 0,
				backgroundColor: "white",
				padding: 2,
				display: "grid",
				gridTemplateColumns: "auto 1fr auto",
				gap: 2,
				alignItems: "center",
			})}
		>
			<Heading as="h1" size="5">
				<RemixLink to="/">Japanese Restream</RemixLink>
			</Heading>
			<div className={css({ justifySelf: "start" })}>
				<TabNav.Root>
					<TabNav.Link asChild active={pathname.startsWith("/events")}>
						<Link to="/events">イベント一覧</Link>
					</TabNav.Link>
				</TabNav.Root>
			</div>
			<SignInOut />
		</header>
	);
};

const App = () => {
	return (
		<>
			<Header />
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
