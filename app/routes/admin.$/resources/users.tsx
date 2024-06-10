import {
	DateField,
	List,
	Resource,
	TextField,
	DateInput,
	SimpleForm,
	TextInput,
	BooleanInput,
	BooleanField,
} from "react-admin";
import { Datagrid, Edit } from "../components/override";

const UsersList = () => (
	<List>
		<Datagrid rowClick="edit">
			<TextField source="id" />
			<TextField source="discordId" />
			<TextField source="displayName" />
			<BooleanField source="isAdmin" />
			<DateField source="createdAt" />
			<DateField source="updatedAt" />
		</Datagrid>
	</List>
);

const UsersEdit = () => (
	<Edit>
		<SimpleForm>
			<TextInput source="id" readOnly />
			<TextInput source="discordId" />
			<TextInput source="displayName" />
			<BooleanInput source="isAdmin" />
			<DateInput source="createdAt" readOnly />
			<DateInput source="updatedAt" readOnly />
		</SimpleForm>
	</Edit>
);

export const usersResource = (
	<Resource name="users" list={UsersList} edit={UsersEdit} />
);
