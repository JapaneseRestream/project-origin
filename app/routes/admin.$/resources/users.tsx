import {
	BooleanField,
	BooleanInput,
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
		</Datagrid>
	</List>
);

const UsersEdit = () => (
	<Edit>
		<SimpleForm>
			<TextInput source="discordId" />
			<TextInput source="displayName" />
			<BooleanInput source="isAdmin" />
		</SimpleForm>
	</Edit>
);

export const usersResource = (
	<Resource name="users" list={UsersList} edit={UsersEdit} />
);
