import { parseWithZod } from "@conform-to/zod";
import {
	type ActionFunctionArgs,
	json,
	type LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { match, P } from "ts-pattern";
import { z } from "zod";

import { gdqTracker } from "../lib/api/gdq-tracker";
import { assertAdminSession } from "../lib/session.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	await assertAdminSession(request, context);
	const events = await context.prisma.events.findMany({
		select: { id: true, name: true },
		orderBy: { startsAt: "desc" },
	});
	return json({ events });
};

export default () => {
	const { events } = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const sending = navigation.state === "submitting";

	return (
		<>
			<h1>Sync Event</h1>
			<div>
				{sending
					? "Syncing..."
					: events.map((event) => (
							<Form key={event.id} method="post">
								<input type="hidden" name="eventId" value={event.id} />
								<button type="submit">{event.name}</button>
							</Form>
						))}
			</div>
		</>
	);
};

const actionSchema = z.object({ eventId: z.string().uuid() });

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const [_, formData] = await Promise.all([
		assertAdminSession(request, context),
		request.formData(),
	]);
	const submission = parseWithZod(formData, { schema: actionSchema });
	if (submission.status !== "success") {
		throw new Response(null, { status: 400 });
	}
	const { eventId } = submission.value;
	const event = await context.prisma.events.findUnique({
		where: { id: eventId },
		select: { syncMethod: true, syncExternalId: true },
	});

	if (!event) {
		throw new Response(null, { status: 404 });
	}

	const runs = await match(event)
		.with(
			{ syncMethod: "gdq-tracker", syncExternalId: P.string },
			async (event) => gdqTracker(event.syncExternalId),
		)
		.otherwise(() => {
			throw new Response("unsupported sync method", { status: 400 });
		});
	const newRunIds = new Set(runs.map((run) => run.id));
	const existingRuns = await context.prisma.runs.findMany({
		where: { eventId },
		select: { id: true, syncExternalId: true },
	});
	const runsToDelete = existingRuns.filter(
		(run) => !run.syncExternalId || !newRunIds.has(run.syncExternalId),
	);

	await Promise.all([
		...runsToDelete.map((run) =>
			context.prisma.runs.delete({ where: { id: run.id } }),
		),
		...runs.map((run) =>
			context.prisma.runs.upsert({
				create: {
					eventId,
					syncExternalId: run.id,
					originalName: run.name,
					category: run.category,
					playedWith: run.playedWith,
					startsAt: run.startsAt,
				},
				where: { eventId_syncExternalId: { eventId, syncExternalId: run.id } },
				update: {
					originalName: run.name,
					category: run.category,
					playedWith: run.playedWith,
					startsAt: run.startsAt,
				},
			}),
		),
	]);

	return json(null);
};
