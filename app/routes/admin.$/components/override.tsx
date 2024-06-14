import type { ComponentProps } from "react";
import {
	BulkDeleteButton,
	Create as RaCreate,
	Datagrid as RaDatagrid,
	Edit as RaEdit,
} from "react-admin";

export const Datagrid = (props: ComponentProps<typeof RaDatagrid>) => {
	return (
		<RaDatagrid
			bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}
			rowClick="edit"
			{...props}
		/>
	);
};

export const Edit = (props: ComponentProps<typeof RaEdit>) => {
	return <RaEdit mutationMode="pessimistic" {...props} />;
};

export const Create = (props: ComponentProps<typeof RaCreate>) => {
	return <RaCreate redirect="list" {...props} />;
};
