import {
	DateField,
	DateTimeInput,
	List,
	ReferenceField,
	ReferenceInput,
	Resource,
	SimpleForm,
	TextField,
	TextInput,
} from "react-admin";

import { Datagrid, Edit } from "../components/override";

const RunsList = () => (
	<List
		perPage={50}
		filters={[<ReferenceInput source="eventId" reference="events" />]}
	>
		<Datagrid sort={{ field: "startsAt", order: "ASC" }}>
			<ReferenceField source="eventId" reference="events" />
			<TextField source="originalName" />
			<TextField source="translatedName" />
			<TextField source="category" />
			<TextField source="playedWith" />
			<DateField source="startsAt" showTime />
		</Datagrid>
	</List>
);

const RunsEdit = () => (
	<Edit>
		<SimpleForm>
			<ReferenceInput source="eventId" reference="events" />
			<TextInput source="originalName" />
			<TextInput source="translatedName" />
			<TextInput source="category" />
			<TextInput source="playedWith" />
			<DateTimeInput source="startsAt" />
		</SimpleForm>
	</Edit>
);

export const runsResource = (
	<Resource name="runs" list={RunsList} edit={RunsEdit} />
);
