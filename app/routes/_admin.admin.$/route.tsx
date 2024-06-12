import "./styles.css";

import { dataProvider } from "ra-data-simple-prisma";
import { Admin } from "react-admin";

import { eventsResource } from "./resources/events";
import { runsResource } from "./resources/runs";
import { usersResource } from "./resources/users";

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
