import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

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
		const year = new Date(event.startsAt).getFullYear();
		const existingEvents = eventsByYear.get(year);
		if (existingEvents) {
			existingEvents.push(event);
		} else {
			eventsByYear.set(year, [event]);
		}
	}

	return (
		<>
			<h1>Schedule and Archive</h1>
			{[...eventsByYear].map(([year, events]) => (
				<section key={year}>
					<h2>{year}年</h2>
					<ul>
						{events.map((event) => (
							<li key={event.id}>
								<Link to={`/events/${event.shortName}`}>{event.name}</Link>
							</li>
						))}
					</ul>
				</section>
			))}
		</>
	);
};
