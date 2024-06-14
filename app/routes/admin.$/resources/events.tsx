import { useFetcher } from "@remix-run/react";
import {
	DateField,
	DateTimeInput,
	List,
	Resource,
	SelectInput,
	SimpleForm,
	TextField,
	TextInput,
	useGetRecordId,
} from "react-admin";

import { syncOptions } from "../../../lib/api/sync-options";
import { Create, Datagrid, Edit } from "../components/override";

const EventsList = () => {
	return (
		<List>
			<Datagrid sort={{ field: "startsAt", order: "DESC" }}>
				<TextField source="name" />
				<TextField source="shortName" />
				<DateField source="startsAt" showTime />
				<TextField source="syncMethod" />
				<TextField source="syncExternalId" />
			</Datagrid>
		</List>
	);
};

const syncMethodChoices = [
	{ id: syncOptions.gdqTracker, name: "GDQ Tracker" },
	{ id: syncOptions.rpglbTracker, name: "RPGLB Tracker" },
];

const EventsCreate = () => {
	return (
		<Create>
			<SimpleForm>
				<TextInput source="name" required />
				<TextInput source="shortName" required />
				<DateTimeInput source="startsAt" required />
				<SelectInput source="syncMethod" choices={syncMethodChoices} required />
				<TextInput source="syncExternalId" />
			</SimpleForm>
		</Create>
	);
};

const EventsEdit = () => {
	const fetcher = useFetcher();
	const id = useGetRecordId();
	const submitting = fetcher.state === "submitting";
	return (
		<Edit>
			<SimpleForm>
				<TextInput source="name" required />
				<TextInput source="shortName" required />
				<DateTimeInput source="startsAt" required />
				<SelectInput source="syncMethod" choices={syncMethodChoices} required />
				<TextInput source="syncExternalId" />
				{submitting ? (
					<div>Syncing...</div>
				) : (
					<button
						type="button"
						onClick={() => {
							fetcher.submit(
								{ eventId: id },
								{ method: "post", action: "/admin/sync" },
							);
						}}
					>
						Sync
					</button>
				)}
			</SimpleForm>
		</Edit>
	);
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
