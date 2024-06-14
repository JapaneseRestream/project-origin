import ky from "ky";

import type RunSample from "./sample/run.json";

export const rpglbTracker = async (trackerId: string) => {
	const runsApiUrl = `https://tracker.rpglimitbreak.com/search/?type=run&event=${trackerId}`;
	const runs = await ky.get(runsApiUrl).json<typeof RunSample>();
	return runs.map((run) => ({
		id: run.pk.toString(),
		name: run.fields.name,
		category: run.fields.category,
		playedWith: run.fields.console,
		startsAt: new Date(run.fields.starttime),
	}));
};
