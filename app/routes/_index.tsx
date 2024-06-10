import { json,type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData } from "@remix-run/react";

export const loader = async ({
	request,
	context: { authenticator, prisma },
}: LoaderFunctionArgs) => {
	const session = await authenticator.isAuthenticated(request);
	if (!session) {
		return json(null);
	}
	const user = await prisma.users.findUnique({
		where: { id: session.userId },
		select: { displayName: true },
	});
	if (!user) {
		throw new Response('user not found', {status: 404})
	}
	return json({ displayName: user.displayName });
};

export default function Index() {
	const loaderData = useLoaderData<typeof loader>();

	return loaderData ? (
		<>
			<div>Hello, {loaderData.displayName}</div>
			<Form method="post" action="/sign-out">
				<button type="submit">Sign out</button>
			</Form>
		</>
	) : (
		<>
			<Link to="/sign-in">Sign in</Link>
			<Link to="/register">Register</Link>
		</>
	);
}
