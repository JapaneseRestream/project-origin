import {
	DateField,
	DateTimeInput,
	ReferenceField,
	ReferenceInput,
	Resource,
	SimpleForm,
	TextField,
	TextInput,
	UrlField,
} from "react-admin";

import { Datagrid, Edit, List } from "../components/override";

const RunsList = () => (
	<List
		filters={[<ReferenceInput source="eventId" reference="events" />]}
	>
		<Datagrid sort={{ field: "startsAt", order: "ASC" }}>
			<ReferenceField source="eventId" reference="events" />
			<TextField source="originalName" />
			<TextField source="translatedName" />
			<TextField source="category" />
			<TextField source="playedWith" />
			<DateField source="startsAt" showTime />
			<UrlField source="vodUrl" />
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
			<TextInput source="vodUrl" />
		</SimpleForm>
	</Edit>
);

export const runsResource = (
	<Resource name="runs" list={RunsList} edit={RunsEdit} />
);
