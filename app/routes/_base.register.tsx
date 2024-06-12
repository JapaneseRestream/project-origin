import { Button } from "@radix-ui/themes";
import { Form } from "@remix-run/react";

export default () => {
	return (
		<Form method="post" action="/register/discord">
			<Button type="submit">Register with Discord</Button>
		</Form>
	);
};
