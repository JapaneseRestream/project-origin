import { Form } from "@remix-run/react";

export default () => {
	return (
		<Form method="post" action="/register/discord">
			<button type="submit">Register with Discord</button>
		</Form>
	);
};
