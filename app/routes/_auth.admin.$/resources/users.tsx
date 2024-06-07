import { DateField, List, TextField } from "react-admin";
import { Datagrid } from "../components/datagrid";

export const UsersList = () => (
	<List>
		<Datagrid rowClick={false}>
			<TextField source="id" />
			<TextField source="discordId" />
			<TextField source="displayName" />
			<DateField source="createdAt" />
			<DateField source="updatedAt" />
		</Datagrid>
	</List>
);
