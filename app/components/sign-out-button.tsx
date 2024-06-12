import { useFetcher } from "@remix-run/react";

export const SignOutButton = () => {
	const fetcher = useFetcher();

	return (
		<fetcher.Form method="post" action="/sign-out">
			<button type="submit">Sign out</button>
		</fetcher.Form>
	);
};
