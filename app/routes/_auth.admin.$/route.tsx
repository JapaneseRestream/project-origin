import "./styles.css";

import { dataProvider } from "ra-data-simple-prisma";
import { Admin, Resource } from "react-admin";
import { UsersList } from "./resources/users";

export default () => {
	return (
		<Admin
			disableTelemetry
			basename="/admin"
			dataProvider={dataProvider("/admin/api")}
		>
			<Resource name="users" list={UsersList} />
		</Admin>
	);
};
