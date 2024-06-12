import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

import { SignOutButton } from "../components/sign-out-button";

export const loader = async ({
	request,
	context: { authenticator, prisma },
}: LoaderFunctionArgs) => {
	const session = await authenticator.isAuthenticated(request);
	if (session) {
		const user = await prisma.users.findUnique({
			where: { id: session.userId },
			select: { displayName: true },
		});
		if (user) {
			return json({ displayName: user.displayName });
		}
	}
	return json(null);
};

export default function Index() {
	const loaderData = useLoaderData<typeof loader>();

	return (
		<>
			<Link to="events">イベント一覧</Link>
			{loaderData ? (
				<>
					<div>Hello, {loaderData.displayName}</div>
					<SignOutButton />
				</>
			) : (
				<>
					<Link to="/sign-in">ログイン</Link>
					<Link to="/register">新規登録</Link>
				</>
			)}
		</>
	);
}
