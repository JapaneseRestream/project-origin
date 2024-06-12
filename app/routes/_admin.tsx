import type {
	ActionFunctionArgs,
	LoaderFunctionArgs,
} from "@remix-run/cloudflare";

import { assertAdmin } from "../lib/session.server";

const handler = async ({
	request,
	context,
}: LoaderFunctionArgs | ActionFunctionArgs) => {
	await assertAdmin(request, context);
	return new Response();
};

export const loader = handler;
export const action = handler;
