import "./styles.css";

import { dataProvider } from "ra-data-simple-prisma";
import { Admin, ListGuesser, Resource } from "react-admin";

export default () => {
	return (
		<Admin basename="/admin" dataProvider={dataProvider("/admin/api")}>
			<Resource name="users" list={ListGuesser} />
			<Resource name="events" list={ListGuesser} />
		</Admin>
	);
};
