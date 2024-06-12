import { Heading, Link, Table } from "@radix-ui/themes";
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
				vodUrl: true,
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
			<Heading size="9">{event.name}</Heading>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell>開始時刻</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>タイトル</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>カテゴリ</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>機種</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{runs.map((run) => {
						const name = run.translatedName ?? run.originalName;
						return (
							<Table.Row key={run.id}>
								<Table.RowHeaderCell>
									{new Date(run.startsAt).toLocaleString()}
								</Table.RowHeaderCell>
								<Table.Cell>
									{run.vodUrl ? (
										<Link href={run.vodUrl} target="_blank" rel="noreferrer">
											{name}
										</Link>
									) : (
										name
									)}
								</Table.Cell>
								<Table.Cell>{run.category}</Table.Cell>
								<Table.Cell>{run.playedWith}</Table.Cell>
							</Table.Row>
						);
					})}
				</Table.Body>
			</Table.Root>
		</>
	);
};
