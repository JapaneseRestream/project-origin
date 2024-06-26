import type {
	LinksFunction,
	LoaderFunctionArgs,
	MetaFunction,
} from "@remix-run/cloudflare";
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRouteError,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";

import { renewSessionCookie } from "./lib/renew-session-cookie.server";

export const meta: MetaFunction = () => [
	{ charSet: "utf-8" },
	{ name: "viewport", content: "width=device-width, initial-scale=1" },
];

export const links: LinksFunction = () => [
	{ rel: "icon", href: "/favicon.ico" },
];

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const cookieHeader = request.headers.get("Cookie");
	const renewSession = (await renewSessionCookie.parse(cookieHeader)) as
		| string
		| null;
	if (!renewSession) {
		const session = await context.sessionStorage.getSession(cookieHeader);
		await context.sessionStorage.commitSession(session);
		return new Response(null, {
			headers: {
				"Set-Cookie": await renewSessionCookie.serialize("1"),
			},
		});
	}
	return null;
};

export const Layout = ({ children }: PropsWithChildren) => {
	return (
		<html lang="ja">
			<head>
				<title>Japanese Restream</title>
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
	return <Outlet />;
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
			<div>{normalizeErrorData(error.data)}</div>
		</>
	);
};
