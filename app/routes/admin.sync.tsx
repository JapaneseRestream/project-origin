import { parseWithZod } from "@conform-to/zod";
import { type ActionFunctionArgs, json } from "@remix-run/cloudflare";
import { match, P } from "ts-pattern";
import { z } from "zod";

import { gdqTracker } from "../lib/api/gdq-tracker";
import { rpglbTracker } from "../lib/api/rpglb-tracker";
import { syncOptions } from "../lib/api/sync-options";
import { assertAdmin } from "../lib/session.server";

const actionSchema = z.object({ eventId: z.string().uuid() });

export const action = async ({ request, context }: ActionFunctionArgs) => {
	const [_, formData] = await Promise.all([
		assertAdmin(request, context),
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
			{ syncMethod: syncOptions.gdqTracker, syncExternalId: P.string },
			async (event) => gdqTracker(event.syncExternalId),
		)
		.with(
			{ syncMethod: syncOptions.rpglbTracker, syncExternalId: P.string },
			async (event) => rpglbTracker(event.syncExternalId),
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
