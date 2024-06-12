import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({
	context,
	params: { eventName },
}: LoaderFunctionArgs) => {
	if (!eventName) {
		throw new Response(null, { status: 400 });
	}
	const event = await context.prisma.events.findUnique({
		where: { shortName: eventName },
		select: { id: true, name: true, shortName: true },
	});
	if (!event) {
		throw new Response(null, { status: 404 });
	}
	return json({ event });
};

export default () => {
	const { event } = useLoaderData<typeof loader>();

	return <h1>{event.name}</h1>;
};
