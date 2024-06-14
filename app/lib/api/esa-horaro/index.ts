import ky from "ky";

import type sampleSchedule from "./sample-schedule.json";

export const esaHoraro = async (eventSlug: string) => {
	const result = await ky
		.get(`https://horaro.org/-/api/v1/events/esa/schedules/${eventSlug}`)
		.json<typeof sampleSchedule>();

	const nameColumnIndex = result.data.columns.indexOf("Game");
	const categoryColumnIndex = result.data.columns.indexOf("Category");
	const platformColumnIndex = result.data.columns.indexOf("Platform");

	return result.data.items.map((item) => {
		const name = item.data[nameColumnIndex];
		const category = item.data[categoryColumnIndex];
		const platform = item.data[platformColumnIndex];
		return {
			id: name && category ? `${name} - ${category}` : crypto.randomUUID(),
			name: name ?? "Unknown",
			category,
			playedWith: platform,
			startsAt: new Date(item.scheduled),
		};
	});
};
