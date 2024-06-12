import {
	Create,
	DateField,
	DateTimeInput,
	List,
	Resource,
	SelectInput,
	SimpleForm,
	TextField,
	TextInput,
} from "react-admin";

import { Datagrid, Edit } from "../components/override";

const EventsList = () => {
	return (
		<List>
			<Datagrid sort={{ field: "startsAt", order: "DESC" }}>
				<TextField source="name" />
				<TextField source="shortName" />
				<DateField source="startsAt" showTime />
			</Datagrid>
		</List>
	);
};

const form = (
	<SimpleForm>
		<TextInput source="name" required />
		<TextInput source="shortName" required />
		<DateTimeInput source="startsAt" required />
		<SelectInput
			source="syncMethod"
			choices={[
				{ id: "gdq-tracker", name: "GDQ Tracker" },
				{ id: "none", name: "None" },
			]}
			required
		/>
		<TextInput source="syncExternalId" />
	</SimpleForm>
);

const EventsCreate = () => {
	return <Create>{form}</Create>;
};

const EventsEdit = () => {
	return <Edit>{form}</Edit>;
};

export const eventsResource = (
	<Resource
		name="events"
		list={EventsList}
		create={EventsCreate}
		edit={EventsEdit}
		recordRepresentation="shortName"
	/>
);
