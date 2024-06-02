import { Form } from "@remix-run/react";

export default () => {
	return (
		<Form method="post" action="/auth/discord">
			<button type="submit">Sign in with Discord</button>
		</Form>
	);
};
