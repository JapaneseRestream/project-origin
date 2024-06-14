import "./styles.css";

import { Button, Heading, Theme } from "@radix-ui/themes";
import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
	Outlet,
	useFetcher,
	useLoaderData,
	useLocation,
} from "@remix-run/react";
import { ThemeProvider } from "next-themes";

import { css } from "../../../styled-system/css";
import { ButtonLink, Link, RemixLink } from "../../components/link";
import { getUser } from "../../lib/session.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const user = await getUser(request, context);
	return json({ user });
};

const SignOutButton = () => {
	const fetcher = useFetcher();

	return (
		<fetcher.Form
			method="post"
			action="/sign-out"
			onSubmit={(event) => {
				if (!confirm("本当にログアウトしますか?")) {
					event.preventDefault();
				}
			}}
		>
			<Button type="submit">ログアウト</Button>
		</fetcher.Form>
	);
};

const SignInOut = () => {
	const { user } = useLoaderData<typeof loader>();
	return (
		<div
			className={css({
				display: "grid",
				gap: 1,
				gridTemplateColumns: "auto auto",
			})}
		>
			{user ? (
				<>
					<ButtonLink to="/profile">プロフィール</ButtonLink>
					<SignOutButton />
				</>
			) : (
				<>
					<ButtonLink to="/sign-in">ログイン</ButtonLink>
					<ButtonLink to="/register">新規登録</ButtonLink>
				</>
			)}
		</div>
	);
};

const Header = () => {
	return (
		<header
			className={css({
				position: "sticky",
				top: 0,
				zIndex: 10,
				padding: 2,
				display: "flex",
				flexFlow: "row nowrap",
				gap: 2,
				alignItems: "center",
				backgroundColor: "var(--color-background)",
			})}
		>
			<Heading as="h1" size="4" className={css({hideBelow: 'sm'})}>
				<RemixLink to="/">Japanese Restream</RemixLink>
			</Heading>
			<div className={css({ flexGrow: "2" })}>
				<Link to="/events">イベント一覧</Link>
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
		<ThemeProvider attribute="class">
			<Theme>
				<App />
			</Theme>
		</ThemeProvider>
	);
};
