import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useRouteError,
} from "@remix-run/react";
import type { PropsWithChildren } from "react";

export const meta: MetaFunction = () => [
	{ charSet: "utf-8" },
	{ name: "viewport", content: "width=device-width, initial-scale=1" },
];

export const links: LinksFunction = () => [{ rel: "icon", href: "data:," }];

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
			<p>{normalizeErrorData(error.data)}</p>
		</>
	);
};
