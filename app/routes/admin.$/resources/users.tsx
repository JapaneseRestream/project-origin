import {
	BooleanField,
	BooleanInput,
	DateField,
	DateInput,
	List,
	Resource,
	SimpleForm,
	TextField,
	TextInput,
} from "react-admin";

import { Datagrid, Edit } from "../components/override";

const UsersList = () => (
	<List>
		<Datagrid>
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
