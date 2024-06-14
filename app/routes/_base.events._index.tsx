import { Heading } from "@radix-ui/themes";
import type { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json, useLoaderData } from "@remix-run/react";
import { Fragment } from "react";

import { Link } from "../components/link";

export const loader = async ({ context }: LoaderFunctionArgs) => {
	const events = await context.prisma.events.findMany({
		select: { id: true, name: true, shortName: true, startsAt: true },
		orderBy: { startsAt: "desc" },
	});
	return json({ events });
};

export default () => {
	const { events } = useLoaderData<typeof loader>();

	const eventsByYear = new Map<number, typeof events>();
	for (const event of events) {
		const year = event.startsAt ? new Date(event.startsAt).getFullYear() : -1;
		const existingEvents = eventsByYear.get(year);
		if (existingEvents) {
			existingEvents.push(event);
		} else {
			eventsByYear.set(year, [event]);
		}
	}

	return (
		<>
			<Heading as="h2" size="9">
				イベント一覧
			</Heading>
			{[...eventsByYear]
				.sort((a, b) => b[0] - a[0])
				.map(([year, events]) => (
					<Fragment key={year}>
						<Heading as="h3" size="8">
							{year === -1 ? "不明" : `${year.toFixed()}年`}
						</Heading>
						<ul>
							{events.map((event) => (
								<li key={event.id}>
									<Link to={`/events/${event.shortName}`}>{event.name}</Link>
								</li>
							))}
						</ul>
					</Fragment>
				))}
		</>
	);
};
