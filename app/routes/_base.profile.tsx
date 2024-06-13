import { parseWithZod } from "@conform-to/zod";
import { Button, Heading, TextField } from "@radix-ui/themes";
import {
	type ActionFunctionArgs,
	json,
	type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import {
	Form,
	useActionData,
	useLoaderData,
	useNavigation,
} from "@remix-run/react";
import { z } from "zod";

import { css } from "../../styled-system/css";
import { assertUser } from "../lib/session.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	const user = await assertUser(request, context);
	return json({ user });
};

export default () => {
	const { user } = useLoaderData<typeof loader>();
	const actionData = useActionData<typeof action>();
	const navigation = useNavigation();

	return (
		<div className={css({ display: "grid", placeItems: "center", gap: 2 })}>
			<Heading as="h2">プロフィール</Heading>
			{actionData?.ok ? (
				<div>更新しました</div>
			) : (
				<Form method="post" className={css({ display: "grid", gap: 1 })}>
					<label>
						表示名
						<TextField.Root
							name="displayName"
							required
							minLength={1}
							maxLength={32}
							defaultValue={user.displayName}
						/>
					</label>
					<Button
						type="submit"
						className={css({ justifySelf: "center" })}
						disabled={navigation.state === "submitting"}
					>
						送信
					</Button>
				</Form>
			)}
		</div>
	);
};

const actionSchema = z.object({ displayName: z.string().min(1).max(32) });

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const [user, formData] = await Promise.all([
		assertUser(request, context),
		request.formData(),
	]);
	const submission = parseWithZod(formData, { schema: actionSchema });
	if (submission.status !== "success") {
		throw new Response(null, { status: 400 });
	}
	await context.prisma.users.update({
		where: { id: user.id },
		data: { displayName: submission.value.displayName },
	});
	return json({ ok: true });
};
