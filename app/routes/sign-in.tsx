import { Form } from "@remix-run/react";

export default () => {
	return (
		<Form method="post" action="/sign-in/discord">
			<button type="submit">Sign in with Discord</button>
		</Form>
	);
};
