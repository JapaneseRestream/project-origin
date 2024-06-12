import type {
	LinksFunction,
	LoaderFunctionArgs,
	MetaFunction,
} from "@remix-run/cloudflare";
import {
	isRouteErrorResponse,
	json,
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLoaderData,
	useRouteError,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";

import { SignOutButton } from "./components/sign-out-button";
import { renewSessionCookie } from "./lib/renew-session-cookie.server";
import { getUser } from "./lib/session.server";

export const meta: MetaFunction = () => [
	{ charSet: "utf-8" },
	{ name: "viewport", content: "width=device-width, initial-scale=1" },
];

export const links: LinksFunction = () => [{ rel: "icon", href: "data:," }];

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const user = await getUser(request, context);
	const cookieHeader = request.headers.get("Cookie");
	const renewSession = (await renewSessionCookie.parse(cookieHeader)) as
		| string
		| null;
	if (!renewSession) {
		const session = await context.sessionStorage.getSession(cookieHeader);
		await context.sessionStorage.commitSession(session);
		return json(
			{ user },
			{
				headers: {
					"Set-Cookie": await renewSessionCookie.serialize("1"),
				},
			},
		);
	}
	return json({ user });
};

export const Layout = ({ children }: PropsWithChildren) => {
	return (
		<html lang="ja">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
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

const normalizeErrorData = (errorData: unknown) => {
	if (typeof errorData === "string") {
		return errorData;
	}
	if (
		errorData &&
		typeof errorData === "object" &&
		"message" in errorData &&
		typeof errorData.message === "string"
	) {
		return errorData.message;
	}
	return JSON.stringify(errorData);
};

export const ErrorBoundary = () => {
	const error = useRouteError();
	if (!isRouteErrorResponse(error)) {
		return normalizeErrorData(error);
	}
	return (
		<>
			<h1>
				{error.status} {error.statusText}
			</h1>
			<p>{normalizeErrorData(error.data)}</p>
		</>
	);
};
