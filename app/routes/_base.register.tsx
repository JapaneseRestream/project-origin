import { Button } from "@radix-ui/themes";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";

import { css } from "../../styled-system/css";
import { assertNoUser } from "../lib/session.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	await assertNoUser(request, context);
	return new Response(null);
};

export default () => {
	return (
		<div className={css({ display: "grid", placeItems: "center" })}>
			<Form method="post" action="/register/discord">
				<Button type="submit">Discordで新規登録</Button>
			</Form>
		</div>
	);
};
