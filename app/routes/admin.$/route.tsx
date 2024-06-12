import "./styles.css";

import { type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { dataProvider } from "ra-data-simple-prisma";
import { Admin } from "react-admin";

import { assertAdminSession } from "../../lib/session.server";
import { eventsResource } from "./resources/events";
import { runsResource } from "./resources/runs";
import { usersResource } from "./resources/users";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
	await assertAdminSession(request, context);
	return new Response();
};

export default () => {
	return (
		<Admin
			disableTelemetry
			basename="/admin"
			dataProvider={dataProvider("/admin/api")}
		>
			{usersResource}
			{eventsResource}
			{runsResource}
		</Admin>
	);
};
