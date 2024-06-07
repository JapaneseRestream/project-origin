import type { ComponentProps } from "react";
import { BulkDeleteButton, Datagrid as RaDatagrid } from "react-admin";


export const Datagrid = (props: ComponentProps<typeof RaDatagrid>) => {
	return (
		<RaDatagrid
			bulkActionButtons={<BulkDeleteButton mutationMode="pessimistic" />}
			{...props}
		/>
	);
};
