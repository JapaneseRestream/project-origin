import ky from "ky";

import type RunsSample from "./sample/runs.json";

export const gdqTracker = async (trackerId: string) => {
	const runsApiUrl = `https://tracker.gamesdonequick.com/tracker/api/v2/events/${trackerId}/runs`;
	const runs = await ky.get(runsApiUrl).json<typeof RunsSample>();
	return runs.results.map((run) => ({
		id: run.id.toString(),
		name: run.name,
		category: run.category,
		playedWith: run.console,
		startsAt: new Date(run.starttime),
	}));
};
