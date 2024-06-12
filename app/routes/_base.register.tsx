import { Button } from "@radix-ui/themes";
import { Form } from "@remix-run/react";

export default () => {
	return (
		<Form method="post" action="/register/discord">
			<Button type="submit">Discordで新規登録</Button>
		</Form>
	);
};
