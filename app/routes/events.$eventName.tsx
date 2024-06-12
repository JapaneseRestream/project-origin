import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, useLoaderData } from "@remix-run/react";

export const loader = async ({
	params: { eventName },
	context,
}: LoaderFunctionArgs) => {
	if (!eventName) {
		throw new Response(null, { status: 400 });
	}
	const [runs, event] = await Promise.all([
		context.prisma.runs.findMany({
			where: { event: { shortName: eventName } },
			select: {
				id: true,
				originalName: true,
				translatedName: true,
				category: true,
				playedWith: true,
				startsAt: true,
			},
			orderBy: { startsAt: "asc" },
		}),
		context.prisma.events.findUnique({
			where: { shortName: eventName },
			select: { name: true },
		}),
	]);
	if (!event) {
		throw new Response(null, { status: 404 });
	}
	return json({ runs, event });
};

export default () => {
	const { runs, event } = useLoaderData<typeof loader>();

	return (
		<>
			<h1>{event.name}</h1>
			<table>
				<thead>
					<tr>
						<th>開始時刻</th>
						<th>タイトル</th>
						<th>カテゴリ</th>
						<th>機種</th>
					</tr>
				</thead>
				<tbody>
					{runs.map((run) => (
						<tr key={run.id}>
							<td>{new Date(run.startsAt).toLocaleString()}</td>
							<td>{run.translatedName ?? run.originalName}</td>
							<td>{run.category}</td>
							<td>{run.playedWith}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};
